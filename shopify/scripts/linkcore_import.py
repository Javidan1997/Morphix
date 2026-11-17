#!/usr/bin/env python3
"""Import Linkcore's supplier CSV into Shopify — idempotent upsert by SKU.

    python linkcore_import.py data/linkcore_supplier.csv --dry-run
    SHOPIFY_STORE=… SHOPIFY_ADMIN_TOKEN=… python linkcore_import.py data/linkcore_supplier.csv

How idempotency works
  1. Each CSV row is normalised into the exact product state we want
     (title, price, metafields, compatibility JSON …).
  2. A SHA-256 of that state is stored on the product as custom.import_hash.
  3. The variant is looked up by SKU. Not found → productSet creates it.
     Found and the hash matches → nothing is sent. Found and changed →
     productSet updates that product id (variants matched by SKU).
  Running the same file twice therefore makes zero product writes the second
  time, and a partially failed run can simply be re-run. Stock is synced with
  an absolute inventorySetQuantities, which is idempotent on its own.

Needs a custom app with write_products and write_inventory scopes.
"""

from __future__ import annotations

import argparse
import csv
import hashlib
import json
import sys
from dataclasses import dataclass, field
from pathlib import Path

from shopify_admin import AdminClient, ShopifyError

NAMESPACE = "custom"

FIND_BY_SKU = """
query FindBySku($q: String!) {
  productVariants(first: 1, query: $q) {
    nodes {
      id sku
      inventoryItem { id }
      product { id handle importHash: metafield(namespace: "custom", key: "import_hash") { value } }
    }
  }
}"""

PRODUCT_SET = """
mutation Upsert($input: ProductSetInput!, $identifier: ProductSetIdentifiers) {
  productSet(input: $input, identifier: $identifier, synchronous: true) {
    product { id handle variants(first: 5) { nodes { id sku inventoryItem { id } } } }
    userErrors { field message code }
  }
}"""

SET_QTY = """
mutation SetQty($input: InventorySetQuantitiesInput!) {
  inventorySetQuantities(input: $input) { userErrors { field message } }
}"""

FIRST_LOCATION = "query { locations(first: 1) { nodes { id name } } }"


@dataclass
class Result:
    created: list[str] = field(default_factory=list)
    updated: list[str] = field(default_factory=list)
    unchanged: list[str] = field(default_factory=list)
    failed: list[tuple[str, str]] = field(default_factory=list)


def parse_hosts(spec: str) -> dict:
    """'tb4=2@4K60;usbc_dp=2@4K30/4K60' → {'tb4': {'displays': 2, 'res': '4K60'}, ...}.

    'A/B' means A with several screens, B with a single screen (res1).
    """
    hosts = {}
    for part in filter(None, (p.strip() for p in (spec or "").split(";"))):
        port, rest = part.split("=", 1)
        displays, res = rest.split("@", 1)
        entry = {"displays": int(displays)}
        multi, _, single = res.partition("/")
        entry["res"] = multi
        if single:
            entry["res1"] = single
        hosts[port.strip()] = entry
    return hosts


def yes(value: str) -> bool:
    return (value or "").strip().lower() in {"yes", "y", "true", "1"}


def cents(value: str) -> str | None:
    value = (value or "").strip()
    return f"{float(value):.2f}" if value else None


def row_to_state(row: dict) -> dict:
    """Normalise one supplier row into the product state we want in Shopify."""
    sku = row["supplier_sku"].strip()
    mf: list[dict] = []

    def put(key: str, type_: str, value):
        if value in (None, "", []):
            return
        mf.append({"namespace": NAMESPACE, "key": key, "type": type_, "value": value if isinstance(value, str) else json.dumps(value)})

    put("tagline", "single_line_text_field", row.get("tagline", "").strip())
    put("highlights", "list.single_line_text_field", [h.strip() for h in row.get("highlights", "").split("|") if h.strip()])
    for key in ("host_interface", "max_displays", "max_resolution", "ethernet", "usb_c", "driver", "warranty"):
        put(key, "single_line_text_field", row.get(key, "").strip())
    for key in ("power_delivery_w", "usb_a"):
        if row.get(key, "").strip():
            put(key, "number_integer", str(int(row[key])))
    put("sd_card", "boolean", "true" if yes(row.get("sd_card")) else "false")
    hosts = parse_hosts(row.get("video_hosts", ""))
    if hosts:
        put("compatibility", "json", {
            "hosts": hosts,
            "mst": yes(row.get("mst")),
            "displaylink": yes(row.get("displaylink")),
            "pd_w": int(row.get("power_delivery_w") or 0),
            "ethernet": row.get("ethernet", "").strip() or None,
        })

    variant = {
        "optionValues": [{"optionName": "Title", "name": "Default Title"}],
        "price": cents(row["price"]),
        "compareAtPrice": cents(row.get("compare_at_price", "")),
        "barcode": row.get("barcode", "").strip() or None,
        "inventoryItem": {
            "sku": sku,
            "tracked": True,
            "cost": cents(row.get("cost", "")),
            "measurement": {"weight": {"value": float(row.get("weight_g") or 0), "unit": "GRAMS"}},
        },
    }
    state = {
        "title": row["title"].strip(),
        "vendor": row.get("brand", "").strip() or "Linkcore",
        "productType": row.get("product_type", "").strip(),
        "status": (row.get("status") or "active").strip().upper(),
        "tags": ["linkcore", "supplier-feed"],
        "productOptions": [{"name": "Title", "values": [{"name": "Default Title"}]}],
        "variants": [variant],
        "metafields": mf,
    }
    digest = hashlib.sha256(json.dumps(state, sort_keys=True, ensure_ascii=False).encode()).hexdigest()[:16]
    state["metafields"] = mf + [{"namespace": NAMESPACE, "key": "import_hash", "type": "single_line_text_field", "value": digest}]
    return {"sku": sku, "hash": digest, "input": state, "stock": int(row.get("stock") or 0)}


def find_by_sku(client: AdminClient, sku: str) -> dict | None:
    # Quote the SKU so hyphens aren't parsed as search operators.
    nodes = client.query(FIND_BY_SKU, {"q": f'sku:"{sku}"'})["productVariants"]["nodes"]
    return next((n for n in nodes if n["sku"] == sku), None)


def import_rows(client: AdminClient | None, rows: list[dict], *, dry_run: bool = False, location_id: str | None = None, out=sys.stdout) -> Result:
    result = Result()
    for row in rows:
        try:
            want = row_to_state(row)
        except (KeyError, ValueError) as error:
            result.failed.append((row.get("supplier_sku", "?"), f"bad row: {error}"))
            continue
        sku = want["sku"]
        if dry_run:
            print(f"  plan  {sku:<14} hash {want['hash']}  {want['input']['title']}", file=out)
            continue
        try:
            existing = find_by_sku(client, sku)
            if existing and (existing["product"].get("importHash") or {}).get("value") == want["hash"]:
                result.unchanged.append(sku)
                print(f"  same  {sku}", file=out)
                item = existing["inventoryItem"]["id"]
            else:
                identifier = {"id": existing["product"]["id"]} if existing else None
                data = client.mutate(PRODUCT_SET, {"input": want["input"], "identifier": identifier}, "productSet")
                product = data["product"]
                (result.updated if existing else result.created).append(sku)
                print(f"  {'upd ' if existing else 'new '}  {sku:<14} {product['handle']}", file=out)
                item = next(v["inventoryItem"]["id"] for v in product["variants"]["nodes"] if v["sku"] == sku)
            # Stock is an absolute set (not a delta), so syncing it every run is
            # itself idempotent; it stays out of the hash so stock-only changes
            # don't rewrite the product.
            if location_id:
                client.mutate(SET_QTY, {"input": {
                    "name": "available", "reason": "correction", "ignoreCompareQuantity": True,
                    "quantities": [{"inventoryItemId": item, "locationId": location_id, "quantity": want["stock"]}],
                }}, "inventorySetQuantities")
        except ShopifyError as error:
            result.failed.append((sku, str(error)))
            print(f"  FAIL  {sku}: {error}", file=out)
    return result


def main(argv: list[str] | None = None) -> int:
    ap = argparse.ArgumentParser(description=__doc__.split("\n\n")[0])
    ap.add_argument("csv", type=Path)
    ap.add_argument("--dry-run", action="store_true", help="parse and print the plan without calling Shopify")
    ap.add_argument("--location", help="location GID for stock levels (default: first location)")
    ap.add_argument("--no-stock", action="store_true", help="skip inventory quantities")
    args = ap.parse_args(argv)

    with args.csv.open(newline="", encoding="utf-8-sig") as fh:
        rows = list(csv.DictReader(fh))
    print(f"{len(rows)} rows in {args.csv.name}")
    if args.dry_run:
        import_rows(None, rows, dry_run=True)
        return 0

    client = AdminClient()
    location = None if args.no_stock else (args.location or client.query(FIRST_LOCATION)["locations"]["nodes"][0]["id"])
    r = import_rows(client, rows, location_id=location)
    print(f"created {len(r.created)} · updated {len(r.updated)} · unchanged {len(r.unchanged)} · failed {len(r.failed)}")
    return 1 if r.failed else 0


if __name__ == "__main__":
    raise SystemExit(main())

#!/usr/bin/env python3
"""Create the metaobject + metafield definitions the theme reads, and
(optionally) Vela's subscribe-and-save selling plan group. Idempotent: existing
definitions are left alone, so it is safe to re-run.

    python setup_definitions.py                       # definitions only
    python setup_definitions.py --vela-product gid://shopify/Product/123
    python setup_definitions.py --dry-run

Scopes: write_metaobject_definitions, write_products, write_purchase_options.
Selling plans only *offer* a subscription; to bill renewals install Shopify's
free Subscriptions app (or any subscription app) — no paid app is required.
"""

from __future__ import annotations

import argparse
import json
from pathlib import Path

from shopify_admin import AdminClient

ROOT = Path(__file__).resolve().parent.parent / "definitions"

GET_METAOBJECT = "query($t: String!) { metaobjectDefinitionByType(type: $t) { id type } }"
CREATE_METAOBJECT = """mutation($d: MetaobjectDefinitionCreateInput!) {
  metaobjectDefinitionCreate(definition: $d) { metaobjectDefinition { id type } userErrors { field message } } }"""
LIST_DEFS = """query($owner: MetafieldOwnerType!) {
  metafieldDefinitions(first: 250, ownerType: $owner, namespace: "custom") { nodes { key } } }"""
CREATE_DEF = """mutation($d: MetafieldDefinitionInput!) {
  metafieldDefinitionCreate(definition: $d) { createdDefinition { id key } userErrors { field message code } } }"""
CREATE_PLANS = """mutation($input: SellingPlanGroupInput!, $resources: SellingPlanGroupResourceInput) {
  sellingPlanGroupCreate(input: $input, resources: $resources) { sellingPlanGroup { id } userErrors { field message } } }"""


def selling_plan(days: int, percent: int) -> dict:
    return {
        "name": f"Delivered every {days} days, save {percent}%",
        "options": [f"Every {days} days"],
        "category": "SUBSCRIPTION",
        "billingPolicy": {"recurring": {"interval": "DAY", "intervalCount": days}},
        "deliveryPolicy": {"recurring": {"interval": "DAY", "intervalCount": days}},
        "pricingPolicies": [{"fixed": {"adjustmentType": "PERCENTAGE", "adjustmentValue": {"percentage": percent}}}],
    }


def main(argv=None) -> int:
    ap = argparse.ArgumentParser()
    ap.add_argument("--dry-run", action="store_true")
    ap.add_argument("--vela-product", help="product GID to attach the Subscribe & save group to")
    args = ap.parse_args(argv)

    metaobjects = json.loads((ROOT / "metaobjects.json").read_text())
    metafields = json.loads((ROOT / "metafields.json").read_text())
    if args.dry_run:
        for m in metaobjects:
            print(f"metaobject  {m['type']}  ({len(m['fieldDefinitions'])} fields)")
        for owner in ("PRODUCT", "PRODUCTVARIANT"):
            for d in metafields[owner]:
                print(f"metafield   {owner:<15} custom.{d['key']:<18} {d['type']}")
        if args.vela_product:
            print("selling plans: every 30 / 60 days, 15% off")
        return 0

    client = AdminClient()
    ids = {}
    for m in metaobjects:
        found = client.query(GET_METAOBJECT, {"t": m["type"]})["metaobjectDefinitionByType"]
        if not found:
            found = client.mutate(CREATE_METAOBJECT, {"d": {k: v for k, v in m.items() if k != "description" or v}}, "metaobjectDefinitionCreate")["metaobjectDefinition"]
            print(f"created metaobject {m['type']}")
        ids[m["type"]] = found["id"]

    for owner in ("PRODUCT", "PRODUCTVARIANT"):
        existing = {n["key"] for n in client.query(LIST_DEFS, {"owner": owner})["metafieldDefinitions"]["nodes"]}
        for d in metafields[owner]:
            if d["key"] in existing:
                continue
            definition = {"namespace": "custom", "key": d["key"], "name": d["name"], "type": d["type"], "ownerType": owner,
                          "description": d.get("description", ""), "validations": list(d.get("validations", []))}
            if d.get("metaobject"):
                definition["validations"].append({"name": "metaobject_definition_id", "value": ids[d["metaobject"]]})
            client.mutate(CREATE_DEF, {"d": definition}, "metafieldDefinitionCreate")
            print(f"created custom.{d['key']} on {owner}")

    if args.vela_product:
        group = client.mutate(CREATE_PLANS, {
            "input": {"name": "Subscribe & save", "merchantCode": "vela-subscribe", "options": ["Delivery every"],
                      "sellingPlansToCreate": [selling_plan(30, 15), selling_plan(60, 15)]},
            "resources": {"productIds": [args.vela_product]},
        }, "sellingPlanGroupCreate")
        print(f"created selling plan group {group['sellingPlanGroup']['id']}")
    print("done")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())

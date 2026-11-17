"""Offline tests for linkcore_import.py against a fake Admin API.

    cd shopify/scripts && python -m unittest -v
"""

import csv
import io
import json
import unittest
from pathlib import Path

from linkcore_import import import_rows, parse_hosts, row_to_state
from shopify_admin import AdminClient

CSV = Path(__file__).parent / "data" / "linkcore_supplier.csv"


class FakeShopify:
    """Stores products in memory and answers the three operations the importer uses."""

    def __init__(self):
        self.products = {}  # gid -> {"input": ..., "sku": ...}
        self.writes = 0
        self.throttle_next = False

    def __call__(self, query, variables):
        if self.throttle_next:
            self.throttle_next = False
            return {"errors": [{"message": "Throttled", "extensions": {"code": "THROTTLED"}}],
                    "extensions": {"cost": {"requestedQueryCost": 10, "throttleStatus": {"currentlyAvailable": 0, "restoreRate": 50}}}}
        if "productVariants" in query:
            sku = variables["q"].split('"')[1]
            for gid, p in self.products.items():
                if p["sku"] == sku:
                    h = next(m["value"] for m in p["input"]["metafields"] if m["key"] == "import_hash")
                    return {"data": {"productVariants": {"nodes": [{"id": gid + "/v", "sku": sku, "inventoryItem": {"id": gid + "/i"},
                                                                     "product": {"id": gid, "handle": gid, "importHash": {"value": h}}}]}}}
            return {"data": {"productVariants": {"nodes": []}}}
        if "productSet" in query:
            self.writes += 1
            sku = variables["input"]["variants"][0]["inventoryItem"]["sku"]
            gid = (variables.get("identifier") or {}).get("id") or f"gid://shopify/Product/{len(self.products) + 1}"
            self.products[gid] = {"input": variables["input"], "sku": sku}
            return {"data": {"productSet": {"product": {"id": gid, "handle": sku.lower(), "variants": {"nodes": [{"id": gid + "/v", "sku": sku, "inventoryItem": {"id": gid + "/i"}}]}}, "userErrors": []}}}
        if "inventorySetQuantities" in query:
            return {"data": {"inventorySetQuantities": {"userErrors": []}}}
        raise AssertionError(query)


def rows(text=None):
    return list(csv.DictReader(io.StringIO(text if text else CSV.read_text(encoding="utf-8"))))


class ImportTests(unittest.TestCase):
    def setUp(self):
        self.fake = FakeShopify()
        self.client = AdminClient(store="x", token="y", transport=self.fake, sleep=lambda s: None)

    def test_parse_hosts(self):
        self.assertEqual(parse_hosts("tb4=2@4K60;usbc_dp=2@4K30/4K60"),
                         {"tb4": {"displays": 2, "res": "4K60"}, "usbc_dp": {"displays": 2, "res": "4K30", "res1": "4K60"}})

    def test_compatibility_metafield(self):
        state = row_to_state(rows()[3])
        compat = json.loads(next(m["value"] for m in state["input"]["metafields"] if m["key"] == "compatibility"))
        self.assertTrue(compat["displaylink"])
        self.assertEqual(compat["hosts"]["usbc_nodp"]["displays"], 2)

    def test_second_run_writes_nothing(self):
        out = io.StringIO()
        first = import_rows(self.client, rows(), out=out, location_id="gid://shopify/Location/1")
        self.assertEqual(len(first.created), 5)
        writes = self.fake.writes
        second = import_rows(self.client, rows(), out=out, location_id="gid://shopify/Location/1")
        self.assertEqual(len(second.unchanged), 5)
        self.assertEqual(self.fake.writes, writes, "an unchanged CSV must not write")

    def test_changed_row_updates_same_product(self):
        import_rows(self.client, rows(), out=io.StringIO())
        data = rows()
        data[0]["price"] = "279.00"
        r = import_rows(self.client, data, out=io.StringIO())
        self.assertEqual(r.updated, ["LC-D12-TB4"])
        self.assertEqual(len(self.fake.products), 5, "update must not create a duplicate")

    def test_throttled_request_is_retried(self):
        self.fake.throttle_next = True
        r = import_rows(self.client, rows()[:1], out=io.StringIO())
        self.assertEqual(r.created, ["LC-D12-TB4"])

    def test_bad_row_is_reported_not_fatal(self):
        data = rows()
        data[1]["price"] = "not-a-price"
        r = import_rows(self.client, data, out=io.StringIO())
        self.assertEqual(len(r.failed), 1)
        self.assertEqual(len(r.created), 4)


if __name__ == "__main__":
    unittest.main()

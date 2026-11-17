"""Minimal Shopify Admin GraphQL client (standard library only).

Shared by setup_definitions.py and linkcore_import.py.

    SHOPIFY_STORE=your-dev-store.myshopify.com
    SHOPIFY_ADMIN_TOKEN=shpat_...          # custom app Admin API token
    SHOPIFY_API_VERSION=2026-10            # optional

Handles the GraphQL cost-based rate limit: if a call comes back THROTTLED it
waits for enough points to restore (from extensions.cost.throttleStatus) and
retries; network errors and 5xx responses retry with exponential backoff.
"""

from __future__ import annotations

import json
import os
import time
import urllib.error
import urllib.request
from typing import Any, Callable

DEFAULT_API_VERSION = "2026-10"


class ShopifyError(RuntimeError):
    """GraphQL top-level errors or mutation userErrors."""


Transport = Callable[[str, dict], dict]


class AdminClient:
    def __init__(self, store: str | None = None, token: str | None = None, api_version: str | None = None,
                 transport: Transport | None = None, max_retries: int = 5, sleep: Callable[[float], None] = time.sleep):
        self.store = store or os.environ.get("SHOPIFY_STORE", "")
        self.token = token or os.environ.get("SHOPIFY_ADMIN_TOKEN", "")
        self.api_version = api_version or os.environ.get("SHOPIFY_API_VERSION", DEFAULT_API_VERSION)
        self.max_retries = max_retries
        self.sleep = sleep
        # Injectable for tests: transport(query, variables) -> parsed JSON body.
        self._transport = transport or self._http
        if transport is None and (not self.store or not self.token):
            raise SystemExit("Set SHOPIFY_STORE and SHOPIFY_ADMIN_TOKEN (or pass --dry-run).")

    @property
    def endpoint(self) -> str:
        return f"https://{self.store}/admin/api/{self.api_version}/graphql.json"

    def _http(self, query: str, variables: dict) -> dict:
        body = json.dumps({"query": query, "variables": variables}).encode()
        req = urllib.request.Request(self.endpoint, data=body, method="POST", headers={
            "Content-Type": "application/json",
            "Accept": "application/json",
            "X-Shopify-Access-Token": self.token,
            "User-Agent": "configuro-concepts-scripts/1.0",
        })
        with urllib.request.urlopen(req, timeout=60) as res:
            return json.loads(res.read())

    def query(self, query: str, variables: dict | None = None) -> dict:
        variables = variables or {}
        for attempt in range(self.max_retries + 1):
            try:
                body = self._transport(query, variables)
            except urllib.error.HTTPError as error:
                if error.code in (429, 500, 502, 503, 504) and attempt < self.max_retries:
                    self.sleep(min(30, 2 ** attempt))
                    continue
                raise ShopifyError(f"HTTP {error.code}: {error.read()[:300]!r}") from error
            except urllib.error.URLError:
                if attempt < self.max_retries:
                    self.sleep(min(30, 2 ** attempt))
                    continue
                raise

            errors = body.get("errors") or []
            if any((e.get("extensions") or {}).get("code") == "THROTTLED" for e in errors):
                status = ((body.get("extensions") or {}).get("cost") or {}).get("throttleStatus") or {}
                need = ((body.get("extensions") or {}).get("cost") or {}).get("requestedQueryCost", 100)
                rate = status.get("restoreRate", 50) or 50
                available = status.get("currentlyAvailable", 0)
                self.sleep(max(1.0, (need - available) / rate))
                continue
            if errors:
                raise ShopifyError(json.dumps(errors)[:500])
            return body["data"]
        raise ShopifyError("Gave up after repeated throttling / network errors")

    def mutate(self, query: str, variables: dict, root: str) -> dict:
        """Run a mutation and raise on userErrors; returns data[root]."""
        data = self.query(query, variables)[root]
        user_errors = data.get("userErrors") or []
        if user_errors:
            raise ShopifyError(f"{root}: " + "; ".join(f"{'.'.join(e.get('field') or [])} {e['message']}" for e in user_errors))
        return data

// node --test shopify/functions/northgate-tier-discount/src/index.test.mjs
import test from "node:test";
import assert from "node:assert/strict";
import { cartLinesDiscountsGenerateRun } from "./cart_lines_discounts_generate_run.js";

const tiers = [{ min: 1, price: 2490 }, { min: 10, price: 2240 }, { min: 50, price: 1980 }];
const line = (id, quantity, amount = "28.50") => ({ id, quantity, cost: { amountPerQuantity: { amount } }, merchandise: { __typename: "ProductVariant", product: { tiers: { jsonValue: tiers } } } });
const input = (approved, lines) => ({ cart: { buyerIdentity: { customer: { hasAnyTag: approved } }, lines }, discount: { discountClasses: ["PRODUCT"] } });

test("guests get no discount", () => {
  assert.deepEqual(cartLinesDiscountsGenerateRun(input(false, [line("a", 12)])), { operations: [] });
});

test("12 cases → 10+ tier: $28.50 list − $22.40 = $6.10 off each", () => {
  const out = cartLinesDiscountsGenerateRun(input(true, [line("a", 12), line("b", 3)]));
  const [c12, c3] = out.operations[0].productDiscountsAdd.candidates;
  assert.equal(c12.value.fixedAmount.amount, "6.10");
  assert.equal(c12.message, "Trade price · 10+ cases");
  assert.equal(c3.value.fixedAmount.amount, "3.60");
});

test("lines without tiers are untouched", () => {
  const noTier = { ...line("c", 5), merchandise: { __typename: "ProductVariant", product: { tiers: null } } };
  assert.deepEqual(cartLinesDiscountsGenerateRun(input(true, [noTier])), { operations: [] });
});

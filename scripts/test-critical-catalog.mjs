/**
 * Lightweight checks for catalog pagination / freshness correctness.
 * Run: node scripts/test-critical-catalog.mjs
 */

import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import test from "node:test";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");

test("fetchAllProductsByKind keeps partial pages when a later page fails", () => {
  const source = readFileSync(join(root, "src/lib/api.ts"), "utf8");
  assert.match(
    source,
    /if \(!page\.ok\) break;/,
    "later page failure should break with items kept, not return page error",
  );
  assert.doesNotMatch(
    source,
    /if \(!page\.ok\) return page;/,
    "must not discard already-fetched pages on pagination error",
  );
});

test("parseCreatedAtMs treats naive warehouse timestamps as UTC", () => {
  const source = readFileSync(join(root, "src/lib/fresh-arrivals.ts"), "utf8");
  assert.match(source, /export function parseCreatedAtMs/);
  assert.match(source, /\$\{trimmed\}Z/);

  // Mirror the production helper for a runtime assertion (UTC vs local skew).
  function parseCreatedAtMs(createdAt) {
    const trimmed = createdAt.trim();
    if (!trimmed) return Number.NaN;
    const hasZone = /(?:[zZ]|[+-]\d{2}:?\d{2})$/.test(trimmed);
    return Date.parse(hasZone ? trimmed : `${trimmed}Z`);
  }

  const naive = "2026-08-08T14:42:02.432667";
  const expected = Date.parse("2026-08-08T14:42:02.432667Z");
  assert.equal(parseCreatedAtMs(naive), expected);
  assert.equal(parseCreatedAtMs(`${naive}Z`), expected);
});

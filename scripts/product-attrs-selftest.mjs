/**
 * Self-test for Watch model extraction (Series must not collapse to SE).
 * Keep the regex in sync with src/lib/product-attrs.ts extractModel.
 */

function cleanupModel(value) {
  return value
    .replace(/\s+/g, " ")
    .replace(/\s+$/g, "")
    .replace(/\biPhone\s+(\d+)/i, "iPhone $1")
    .trim();
}

function extractWatchModel(name) {
  const text = String(name);
  const match = text.match(
    /(?:Apple\s+)?Watch(?:\s+Series\s*\d+|\s+SE[\s-]?\d*|\s+Ultra(?:\s*\d+)?|\s+\d+)?(?:\s*,?\s*\d+\s*mm)?/i,
  );
  return cleanupModel(match?.[0] ?? "Apple Watch");
}

const cases = [
  ["Apple Watch Series 11 46mm Rose Gold", "Apple Watch Series 11 46mm"],
  ["Apple Watch Series 9 45mm Starlight Новые", "Apple Watch Series 9 45mm"],
  ["Apple Watch Series 11, 46mm Silver", "Apple Watch Series 11, 46mm"],
  ["Apple Watch 11 46mm Silver", "Apple Watch 11 46mm"],
  ["Apple Watch SE3 40mm Midnight", "Apple Watch SE3 40mm"],
  ["Apple Watch SE 3 40mm Midnight", "Apple Watch SE 3 40mm"],
  ["Apple Watch SE2 44mm Silver", "Apple Watch SE2 44mm"],
  ["Apple Watch Ultra 2, 49mm Titanium", "Apple Watch Ultra 2, 49mm"],
  ["Apple Watch Ultra, 49mm Titanium (626069)", "Apple Watch Ultra, 49mm"],
];

let failed = 0;
for (const [input, expected] of cases) {
  const actual = extractWatchModel(input);
  if (actual !== expected) {
    console.error(`FAIL: ${JSON.stringify(input)}`);
    console.error(`  expected ${JSON.stringify(expected)}`);
    console.error(`  actual   ${JSON.stringify(actual)}`);
    failed += 1;
  }
}

// Regression: no Series title may resolve to bare "SE".
for (const [input] of cases.filter(([name]) => /series/i.test(name))) {
  const actual = extractWatchModel(input);
  if (/^Apple Watch Se$/i.test(actual) || /^Apple Watch SE$/i.test(actual)) {
    console.error(`FAIL: Series collapsed to SE for ${JSON.stringify(input)} → ${actual}`);
    failed += 1;
  }
}

if (failed > 0) {
  console.error(`\n${failed} assertion(s) failed`);
  process.exit(1);
}

console.log(`ok: ${cases.length} watch model cases`);

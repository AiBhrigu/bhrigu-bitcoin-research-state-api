import assert from "node:assert/strict";
import crypto from "node:crypto";
import fs from "node:fs";

const expectedWindowSha256 = "fd92dc8a578a2f5f393b87d3f0e65bdf2f8b9ff828ddccf21eabce66d6d39998";
const windowBytes = fs.readFileSync(new URL("../lib/window.mjs", import.meta.url));
const actualWindowSha256 = crypto.createHash("sha256").update(windowBytes).digest("hex");
assert.equal(actualWindowSha256, expectedWindowSha256, "SEP_10_2026 source file changed");

const stateSource = fs.readFileSync(new URL("../lib/state.mjs", import.meta.url), "utf8");
const mcpSource = fs.readFileSync(new URL("../lib/mcp.mjs", import.meta.url), "utf8");
const forbidden = [/apiKey/i, /secretKey/i, /withdraw/i, /placeOrder/i, /privateKey/i];
for (const pattern of forbidden) {
  assert.equal(pattern.test(mcpSource), false, `MCP source contains forbidden authority token ${pattern}`);
}
assert.match(stateSource, /trading: false/);
assert.match(stateSource, /wallet: false/);
assert.match(stateSource, /payment: false/);

console.log(JSON.stringify({
  schema: "bhrigu_integrity_tests_v0_1",
  status: "PASS",
  sep10_window_sha256: actualWindowSha256,
  checks: 9
}));

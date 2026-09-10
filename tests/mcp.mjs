import assert from "node:assert/strict";
import { handleMcpRpc, MCP_TOOLS } from "../lib/mcp.mjs";

const fakeFetch = async (url) => {
  if (String(url).includes("data-api.binance.vision")) {
    return new Response(JSON.stringify({
      lastPrice: "79000.00",
      priceChangePercent: "1.25",
      highPrice: "80000.00",
      lowPrice: "77000.00",
      volume: "12345.67",
      closeTime: Date.parse("2026-09-16T12:00:00Z")
    }), { status: 200 });
  }
  if (String(url).includes("mempool.space")) return new Response("967000", { status: 200 });
  throw new Error("UNEXPECTED_URL");
};
const now = new Date("2026-09-16T12:00:30Z");

const init = await handleMcpRpc({ jsonrpc: "2.0", id: 1, method: "initialize", params: { protocolVersion: "2025-11-25" } }, { fetchImpl: fakeFetch, now });
assert.equal(init.status, 200);
assert.equal(init.body.result.protocolVersion, "2025-11-25");
assert.equal(init.body.result.serverInfo.version, "0.2.0");

const list = await handleMcpRpc({ jsonrpc: "2.0", id: 2, method: "tools/list" }, { fetchImpl: fakeFetch, now });
assert.equal(list.body.result.tools.length, 4);
assert.deepEqual(list.body.result.tools.map((t) => t.name), MCP_TOOLS.map((t) => t.name));
assert.equal(list.body.result.tools.every((t) => t.annotations.readOnlyHint === true), true);

const windowResult = await handleMcpRpc({
  jsonrpc: "2.0", id: 3, method: "tools/call",
  params: { name: "bhrigu_get_temporal_window", arguments: { window_id: "SEP_10_2026" } }
}, { fetchImpl: fakeFetch, now });
assert.equal(windowResult.body.result.isError, false);
assert.equal(windowResult.body.result.structuredContent.window.id, "SEP_10_2026");
assert.equal(windowResult.body.result.structuredContent.evidence.length, 1);

const compare = await handleMcpRpc({
  jsonrpc: "2.0", id: 4, method: "tools/call",
  params: { name: "bhrigu_compare_window_to_reality", arguments: { window_id: "SEP_17_2026" } }
}, { fetchImpl: fakeFetch, now });
assert.equal(compare.body.result.isError, false);
assert.equal(compare.body.result.structuredContent.current_btcusdt, 79000);
assert.equal(compare.body.result.structuredContent.baseline_btcusdt, 78348.09);
assert.equal(compare.body.result.structuredContent.trading_authority, false);

const bad = await handleMcpRpc({
  jsonrpc: "2.0", id: 5, method: "tools/call",
  params: { name: "bhrigu_get_temporal_window", arguments: { window_id: "NOPE" } }
}, { fetchImpl: fakeFetch, now });
assert.equal(bad.body.result.isError, true);
assert.equal(bad.body.result.structuredContent.error.code, "WINDOW_NOT_FOUND");

const invalid = await handleMcpRpc({ hello: "world" });
assert.equal(invalid.status, 400);
assert.equal(invalid.body.error.code, -32600);

console.log(JSON.stringify({ schema: "bhrigu_mcp_tests_v0_1", status: "PASS", checks: 14 }));

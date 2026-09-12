import assert from "node:assert/strict";
import { buildStrategyEvidence, normalizeStrategySymbol } from "../lib/strategy-evidence.mjs";
import { OlaXbtNexusError } from "../lib/olaxbt-nexus.mjs";

function toolFromRequest(options) {
  return JSON.parse(options.body).name;
}

const successPayloads = {
  get_strategy_signal: { result: { signal: "HOLD", confidence: 0.71, reasoning_log: "range-bound" } },
  get_strategy_metrics: { data: { sharpe_ratio: 1.2, total_return_pct: 14.5, win_rate: 58, profit_factor: 1.4, max_drawdown_pct: 8.2, trade_count: 24 } },
  get_strategy_trades: { result: { trades: [
    { pnl: 4, exit_reason: "take_profit" },
    { pnl: -1, exit_reason: "stop" },
    { pnl: 2, exit_reason: "rule" },
    { pnl: 1, exit_reason: "rule" }
  ] } },
  get_strategy_equity: { data: { equity_curve: [100, 103, 109, 114] } }
};

const successFetch = async (_url, options) => new Response(JSON.stringify(successPayloads[toolFromRequest(options)]), {
  status: 200,
  headers: { "content-type": "application/json" }
});

assert.equal(normalizeStrategySymbol("BTCUSDT"), "BTC/USDT");
assert.throws(() => normalizeStrategySymbol("ETH/USDT"), /Only BTC\/USDT/);

const evidence = await buildStrategyEvidence({
  symbol: "BTC/USDT",
  apiKey: "nxk_test_only",
  fetchImpl: successFetch,
  now: new Date("2026-09-12T07:30:00Z")
});
assert.equal(evidence.signal.direction, "HOLD");
assert.equal(evidence.signal.confidence, 0.71);
assert.equal(evidence.strategy_evidence.sharpe_ratio, 1.2);
assert.equal(evidence.recent_behavior.sample_size, 4);
assert.ok(Math.abs(evidence.equity_context.change_pct - 14) < 1e-9);
assert.equal(evidence.assessment, "SUPPORTED");
assert.equal(evidence.authority.new_trading_signal_created, false);
assert.equal(evidence.authority.trade_execution, false);
assert.deepEqual(Object.values(evidence.source_status).map((item) => item.ok), [true, true, true, true]);

await assert.rejects(
  () => buildStrategyEvidence({ symbol: "BTC/USDT", fetchImpl: successFetch, apiKey: "" }),
  (error) => error instanceof OlaXbtNexusError && error.code === "OLAXBT_NEXUS_API_KEY_MISSING"
);

const authFetch = async () => new Response(JSON.stringify({ error: "unauthorized" }), {
  status: 401,
  headers: { "content-type": "application/json" }
});
await assert.rejects(
  () => buildStrategyEvidence({ symbol: "BTC/USDT", apiKey: "nxk_bad", fetchImpl: authFetch }),
  (error) => error instanceof OlaXbtNexusError && error.code === "OLAXBT_UPSTREAM_AUTH_FAILED"
);

const partialFetch = async (_url, options) => {
  const tool = toolFromRequest(options);
  if (tool === "get_strategy_trades") return new Response(JSON.stringify({ error: "temporary" }), { status: 503 });
  return new Response(JSON.stringify(successPayloads[tool]), { status: 200 });
};
const partial = await buildStrategyEvidence({ symbol: "BTC/USDT", apiKey: "nxk_test_only", fetchImpl: partialFetch });
assert.equal(partial.source_status.trades.ok, false);
assert.ok(partial.limitations.some((item) => item.includes("trades source unavailable")));

const malformedFetch = async (_url, options) => {
  const tool = toolFromRequest(options);
  if (tool === "get_strategy_equity") return new Response("<html>bad gateway</html>", { status: 200 });
  return new Response(JSON.stringify(successPayloads[tool]), { status: 200 });
};
const malformed = await buildStrategyEvidence({ symbol: "BTC/USDT", apiKey: "nxk_test_only", fetchImpl: malformedFetch });
assert.equal(malformed.source_status.equity.code, "OLAXBT_UPSTREAM_MALFORMED_RESPONSE");

console.log(JSON.stringify({
  schema: "bhrigu_olaxbt_strategy_evidence_tests_v0_1",
  status: "PASS",
  checks: 18
}, null, 2));

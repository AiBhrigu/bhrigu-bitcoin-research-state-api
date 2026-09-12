import { sendJson } from "../lib/http.mjs";
import { buildStrategyEvidence } from "../lib/strategy-evidence.mjs";

export default async function handler(req, res) {
  if (req.method !== "GET") {
    sendJson(res, 405, { error: "METHOD_NOT_ALLOWED", allowed: ["GET"] });
    return;
  }
  try {
    const evidence = await buildStrategyEvidence({ symbol: "BTC/USDT" });
    sendJson(res, 200, {
      probe: "OLAXBT_PREVIEW_READ_ONLY",
      source_status: evidence.source_status,
      signal: evidence.signal,
      strategy_evidence: evidence.strategy_evidence,
      recent_behavior: evidence.recent_behavior,
      equity_context: evidence.equity_context,
      assessment: evidence.assessment,
      supports: evidence.supports,
      contradictions: evidence.contradictions,
      limitations: evidence.limitations,
      authority: evidence.authority
    });
  } catch (error) {
    sendJson(res, error?.code === "OLAXBT_NEXUS_API_KEY_MISSING" ? 503 : 502, {
      probe: "OLAXBT_PREVIEW_READ_ONLY",
      error: error?.code || "OLAXBT_PROBE_FAILED",
      detail: String(error?.message || error),
      trading_authority: false,
      trade_execution: false
    });
  }
}

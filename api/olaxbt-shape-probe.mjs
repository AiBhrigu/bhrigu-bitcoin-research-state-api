import { sendJson } from "../lib/http.mjs";
import { callOlaXbtTool } from "../lib/olaxbt-nexus.mjs";

function redact(value) {
  if (Array.isArray(value)) return value.map(redact);
  if (!value || typeof value !== "object") return value;
  const out = {};
  for (const [key, child] of Object.entries(value)) {
    if (/(secret|token|api.?key|authorization|credential)/i.test(key)) out[key] = "[REDACTED]";
    else out[key] = redact(child);
  }
  return out;
}

export default async function handler(req, res) {
  if (req.method !== "GET") return sendJson(res, 405, { error: "METHOD_NOT_ALLOWED", allowed: ["GET"] });
  try {
    const [signal, metrics] = await Promise.all([
      callOlaXbtTool("get_strategy_signal", { symbol: "BTC/USDT" }),
      callOlaXbtTool("get_strategy_metrics", {})
    ]);
    return sendJson(res, 200, {
      probe: "OLAXBT_SHAPE_READ_ONLY",
      signal: redact(signal.payload),
      metrics: redact(metrics.payload)
    });
  } catch (error) {
    return sendJson(res, 502, { probe: "OLAXBT_SHAPE_READ_ONLY", error: error?.code || "PROBE_FAILED", detail: String(error?.message || error) });
  }
}

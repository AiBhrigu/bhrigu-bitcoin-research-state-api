import { buildState } from "./state.mjs";
import { getWindow, listWindows } from "./windows.mjs";

export const MCP_PROTOCOL_VERSION = "2025-11-25";

export const MCP_TOOLS = Object.freeze([
  {
    name: "bhrigu_get_bitcoin_research_state",
    title: "Get live Bitcoin research state",
    description: "Read the current BTCUSDT market state, Bitcoin protocol-time coordinates, source freshness, and temporal-evidence summary. Read-only; never trades, signs, pays, transfers, or accesses private account data.",
    inputSchema: { type: "object", additionalProperties: false, properties: {} },
    annotations: { readOnlyHint: true, destructiveHint: false, idempotentHint: true, openWorldHint: true }
  },
  {
    name: "bhrigu_list_temporal_windows",
    title: "List BHRIGU temporal windows",
    description: "List public precommitted Bitcoin observation windows with phase, boundary, immutable-rewrite law, and durable evidence count.",
    inputSchema: { type: "object", additionalProperties: false, properties: {} },
    annotations: { readOnlyHint: true, destructiveHint: false, idempotentHint: true, openWorldHint: false }
  },
  {
    name: "bhrigu_get_temporal_window",
    title: "Get one temporal window and evidence",
    description: "Read one frozen precommit together with durable post-boundary evidence already committed for that window.",
    inputSchema: {
      type: "object", additionalProperties: false, required: ["window_id"],
      properties: { window_id: { type: "string", enum: ["SEP_10_2026", "SEP_17_2026"] } }
    },
    annotations: { readOnlyHint: true, destructiveHint: false, idempotentHint: true, openWorldHint: false }
  },
  {
    name: "bhrigu_compare_window_to_reality",
    title: "Compare a precommit with live reality",
    description: "Read live public Bitcoin evidence and compare BTCUSDT against the selected precommitted baseline. No observation is written and no trading authority exists.",
    inputSchema: {
      type: "object", additionalProperties: false, required: ["window_id"],
      properties: { window_id: { type: "string", enum: ["SEP_10_2026", "SEP_17_2026"] } }
    },
    annotations: { readOnlyHint: true, destructiveHint: false, idempotentHint: true, openWorldHint: true }
  }
]);

const rpcResult = (id, result) => ({ jsonrpc: "2.0", id, result });
const rpcError = (id, code, message, data) => ({
  jsonrpc: "2.0", id, error: { code, message, ...(data === undefined ? {} : { data }) }
});
const toolResult = (value) => ({
  content: [{ type: "text", text: JSON.stringify(value) }],
  structuredContent: value,
  isError: false
});
const toolError = (code, message) => ({
  content: [{ type: "text", text: JSON.stringify({ error: { code, message } }) }],
  structuredContent: { error: { code, message } },
  isError: true
});

function parseRpc(body) {
  if (!body || typeof body !== "object" || Array.isArray(body) || body.jsonrpc !== "2.0" || typeof body.method !== "string") return null;
  if (body.id !== undefined && body.id !== null && typeof body.id !== "string" && typeof body.id !== "number") return null;
  return body;
}

function parseWindowId(args) {
  const id = args?.window_id;
  return typeof id === "string" ? id : null;
}

async function compareWindow(windowId, options) {
  const record = getWindow(windowId, options.now);
  if (!record) return null;
  const state = await buildState(options);
  const baseline = record.window.baseline.btcusdt_last_price;
  const current = state.market.last_price_usdt;
  return {
    window_id: windowId,
    boundary_utc: record.window.boundary_utc,
    phase: record.phase,
    observed_at_utc: state.observed_at_utc,
    baseline_btcusdt: baseline,
    current_btcusdt: current,
    current_vs_baseline_pct: Number((((current - baseline) / baseline) * 100).toFixed(4)),
    market_source: state.market.source,
    market_freshness: state.market.freshness,
    trading_authority: false
  };
}

export async function handleMcpRpc(body, { fetchImpl = fetch, now = new Date() } = {}) {
  const rpc = parseRpc(body);
  if (!rpc) return { status: 400, body: rpcError(null, -32600, "Invalid Request") };
  const id = rpc.id ?? null;

  if (rpc.method.startsWith("notifications/")) return { status: 202, body: null };
  if (rpc.method === "ping") return { status: 200, body: rpcResult(id, {}) };
  if (rpc.method === "initialize") {
    const requested = rpc.params?.protocolVersion;
    const protocolVersion = requested === "2025-03-26" ? "2025-03-26" : MCP_PROTOCOL_VERSION;
    return {
      status: 200,
      body: rpcResult(id, {
        protocolVersion,
        capabilities: { tools: { listChanged: false } },
        serverInfo: { name: "bhrigu-bitcoin-research-state-api", title: "BHRIGU Bitcoin Temporal Evidence", version: "0.2.0" },
        instructions: "Use frozen windows to ask what was known then, compare with public reality now, and inspect durable evidence. Read-only research only; no trading or financial authority."
      })
    };
  }
  if (rpc.method === "tools/list") return { status: 200, body: rpcResult(id, { tools: MCP_TOOLS }) };
  if (rpc.method !== "tools/call") return { status: 404, body: rpcError(id, -32601, "Method not found") };

  const name = rpc.params?.name;
  const args = rpc.params?.arguments ?? {};
  if (typeof name !== "string" || !args || typeof args !== "object" || Array.isArray(args)) {
    return { status: 400, body: rpcError(id, -32602, "Invalid params") };
  }

  try {
    if (name === "bhrigu_get_bitcoin_research_state") {
      return { status: 200, body: rpcResult(id, toolResult(await buildState({ fetchImpl, now }))) };
    }
    if (name === "bhrigu_list_temporal_windows") {
      return { status: 200, body: rpcResult(id, toolResult({ windows: listWindows(now) })) };
    }
    if (name === "bhrigu_get_temporal_window") {
      const windowId = parseWindowId(args);
      const record = windowId ? getWindow(windowId, now) : null;
      if (!record) return { status: 200, body: rpcResult(id, toolError("WINDOW_NOT_FOUND", "Unknown or missing window_id.")) };
      return { status: 200, body: rpcResult(id, toolResult(record)) };
    }
    if (name === "bhrigu_compare_window_to_reality") {
      const windowId = parseWindowId(args);
      const comparison = windowId ? await compareWindow(windowId, { fetchImpl, now }) : null;
      if (!comparison) return { status: 200, body: rpcResult(id, toolError("WINDOW_NOT_FOUND", "Unknown or missing window_id.")) };
      return { status: 200, body: rpcResult(id, toolResult(comparison)) };
    }
    return { status: 200, body: rpcResult(id, toolError("TOOL_NOT_FOUND", `Unknown tool: ${name}`)) };
  } catch (error) {
    return { status: 200, body: rpcResult(id, toolError("PUBLIC_SOURCE_UNAVAILABLE", String(error.message || error))) };
  }
}

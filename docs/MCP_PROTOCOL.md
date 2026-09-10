# MCP protocol contract

BHRIGU serves the same read-only tool surface across both MCP lifecycle eras.

## Modern era — 2026-07-28

The modern path is stateless and handshake-free. Clients may call `server/discover`, then call tools directly. Every modern request must carry:

- `MCP-Protocol-Version: 2026-07-28`
- `Mcp-Method` matching the JSON-RPC method
- `Mcp-Name` for `tools/call`, matching the tool name
- `_meta.io.modelcontextprotocol/protocolVersion = 2026-07-28`
- `_meta.io.modelcontextprotocol/clientCapabilities`

The server rejects header/body mismatches, unsupported protocol versions, and missing required client capabilities. Modern complete results carry `resultType: "complete"`; cacheable discovery/list results carry explicit `ttlMs` and `cacheScope` hints.

## Legacy era — 2025-11-25 / 2025-03-26

Legacy clients can still use `initialize` and the same read-only tools. The server does not require a protocol session ID because no BHRIGU tool relies on hidden transport state.

## Safety boundary

MCP calls never create observations, rewrite precommits, trade, sign, pay, transfer, withdraw, read credentials, or access private account data. Temporal evidence is committed separately and exposed read-only.
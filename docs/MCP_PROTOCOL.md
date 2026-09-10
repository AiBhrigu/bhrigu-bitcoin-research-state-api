# MCP protocol contract

BHRIGU serves the same four read-only tools across the modern and legacy MCP lifecycle eras.

## Modern era — 2026-07-28

The modern path is stateless and handshake-free. `server/discover` is available for up-front discovery, but tools can be called directly when the client already knows the contract.

Every modern non-notification HTTP request carries:

- `MCP-Protocol-Version: 2026-07-28`
- `Mcp-Method` matching the JSON-RPC method
- `Mcp-Name` where the method mirrors a `params.name` value, including `tools/call`
- `_meta.io.modelcontextprotocol/protocolVersion = 2026-07-28`
- `_meta.io.modelcontextprotocol/clientCapabilities`

`_meta.io.modelcontextprotocol/clientInfo` is accepted and recommended but is not required. Notification POSTs are exempt from the standard-header presence check.

`server/discover` advertises the supported modern per-request revision. Modern results carry `resultType: "complete"`; server identity is stamped in `_meta.io.modelcontextprotocol/serverInfo`, and cacheable discovery/list results carry explicit `ttlMs` and `cacheScope` hints.

The server fails closed on header/body mismatches, missing required client capabilities, and unsupported versions. `-32022` errors return both the requested version and the supported-version set. Modern `initialize` and `ping` are not served because they belong to the handshake-era lifecycle.

## Legacy era — 2025-11-25 / 2025-03-26

Legacy clients can still use `initialize` and the same read-only tools. BHRIGU uses the stateless legacy HTTP form: it does not create a protocol session because these tools never require server-to-client requests or hidden transport state.

## Safety boundary

MCP calls never create observations, rewrite precommits, trade, sign, pay, transfer, withdraw, read credentials, or access private account data. Temporal evidence is committed separately and exposed read-only.

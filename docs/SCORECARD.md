# X-Agent scorecard evidence

## Real agent/user value

BHRIGU gives agents a compact answer to a problem ordinary live-price tools cannot solve: **what was known before a declared future boundary, what is true now, and what changed without rewriting the past?** The loop is reusable across multiple windows.

## Demonstrated capability quality

- live Binance BTCUSDT market evidence;
- Bitcoin protocol-time coordinates;
- source freshness;
- frozen precommit baselines;
- durable post-boundary evidence;
- explicit evidence limitations;
- fail-closed market-source behavior;
- no prediction or trading claim.

## Engineering and maintainability

- zero npm runtime dependencies;
- exact deployment commit binding;
- CI on push and pull request;
- acceptance, temporal, MCP, and immutable-baseline tests;
- pinned SHA-256 for the original SEP_10 source file;
- public OpenAPI contract;
- typed JSON-RPC errors and bounded tool schemas.

## MCP productization

The stateless `/mcp` endpoint implements JSON-RPC 2.0 initialize, ping, notifications, tools/list, and tools/call. Four tools expose live state, window discovery, durable evidence retrieval, and live comparison. Every tool is read-only and explicitly non-destructive.

## Operational and adoption potential

The capability requires no user credential, wallet, API key, or account state. Agents can integrate it as a public evidence service. A second precommit (`SEP_17_2026`) proves the method is repeatable rather than a one-off demonstration.

## Boundary

The public artifact exposes only the bounded evidence adapter. ORION, private prompts, planners, evaluators, private corpora, unpublished research methods, credentials, wallets, payments, transfers, withdrawals, and trading execution remain excluded.

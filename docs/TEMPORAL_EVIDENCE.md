# Temporal evidence contract

BHRIGU treats time as evidence, not as a prediction claim.

`FIELD → WINDOW → REALITY → MEMORY → NEXT WINDOW`

## SEP_10_2026

The original `lib/window.mjs` was committed before the boundary and remains byte-identical. CI pins its SHA-256:

`fd92dc8a578a2f5f393b87d3f0e65bdf2f8b9ff828ddccf21eabce66d6d39998`

Boundary: `2026-09-10T00:00:00Z`.

A post-boundary reality observation is now stored in `lib/evidence.mjs`. It records the live runtime observation, exact runtime commit, direct Binance cross-check, and the limitation that an independent protocol-height probe timed out.

## SEP_17_2026

`lib/window-sep17.mjs` is the second genuine future precommit. Its baseline was captured on 2026-09-10, seven days before the boundary. No post-boundary evidence exists yet. After the boundary, any evidence must be appended; the baseline must not be rewritten.

## Agent value

An agent can ask:

1. What was fixed before the boundary?
2. What is true now?
3. What changed relative to the precommit?
4. What durable evidence exists?
5. What future precommit is next?

The server remains read-only. It never writes observations during an MCP call and has zero trading, wallet, payment, transfer, or private-account authority.

# BHRIGU OlaXBT Strategy Evidence Agent — minimum vertical slice

This branch adds one bounded, read-only capability for the OlaXBT × X-Agent trading track.

## Purpose

`POST /v1/strategy-evidence` answers one question:

> How much historical strategy evidence supports the quality context around the current OlaXBT signal?

It does **not** create a second BUY/SELL/HOLD signal, forecast price, execute a trade, access a wallet, or move funds.

## Server-side secret

Set exactly one server environment variable:

```text
OLAXBT_NEXUS_API_KEY=nxk_...
```

The key is sent only to the official OlaXBT Nexus endpoint as `X-API-KEY` and must never be committed, logged, returned to clients, or placed in frontend code.

## Upstream tools

The slice consumes exactly four OlaXBT Nexus tools:

- `get_strategy_signal`
- `get_strategy_metrics`
- `get_strategy_trades`
- `get_strategy_equity`

`run_backtest` and trade execution are out of scope.

## Request

```http
POST /v1/strategy-evidence
content-type: application/json

{"symbol":"BTC/USDT"}
```

Only `BTC/USDT` is supported in v0.1.

## Output boundary

The response preserves the observed OlaXBT signal and returns normalized evidence context, recent-behavior context, equity context, source status, limitations, contradictions, and one of:

- `SUPPORTED`
- `MIXED`
- `WEAK`
- `INSUFFICIENT`

The assessment is explicitly historical evidence quality, not trading advice and not a new directional signal.

## Deterministic verification

```bash
npm test
```

The strategy-evidence tests cover success, unsupported symbol, missing server key, upstream authentication failure, partial upstream failure, and malformed upstream response.

## Real Nexus proof

With the server-side key configured on a preview deployment:

```bash
curl -sS -X POST "$BASE_URL/v1/strategy-evidence" \
  -H 'content-type: application/json' \
  --data '{"symbol":"BTC/USDT"}'
```

PASS requires all four `source_status.*.ok` values to be true, an unmodified observed OlaXBT signal, and `authority.trade_execution=false`.

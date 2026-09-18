export const SEP_10_POSTBOUNDARY_EVIDENCE = Object.freeze({
  schema: "bhrigu_temporal_evidence_v0_1",
  id: "SEP_10_2026__2026-09-10T04:49:49.136Z",
  window_id: "SEP_10_2026",
  kind: "post_boundary_reality_observation",
  observed_at_utc: "2026-09-10T04:49:49.136Z",
  boundary_utc: "2026-09-10T00:00:00Z",
  baseline: Object.freeze({
    captured_at_utc: "2026-09-08T11:25:23Z",
    btcusdt_last_price: 78474
  }),
  observation: Object.freeze({
    btcusdt_last_price: 78348.09,
    current_vs_baseline_pct: -0.1604,
    btcusdt_24h_change_pct: -0.983,
    btcusdt_24h_high: 79760,
    btcusdt_24h_low: 77770,
    volume_24h_btc: 13960.82618,
    bitcoin_tip_height: 966302
  }),
  provenance: Object.freeze({
    runtime_endpoint: "https://bhrigu-bitcoin-research-state-api.vercel.app/v1/state",
    runtime_commit: "05a455ba1407f7b07de226f6c78eefda15b24880",
    market_source: "https://data-api.binance.vision/api/v3/ticker/24hr?symbol=BTCUSDT",
    market_crosscheck_last_price_usdt: 78348.10,
    market_crosscheck_abs_diff_usdt: 0.01,
    protocol_source: "https://mempool.space/api/blocks/tip/height",
    protocol_crosscheck: "runtime_source_status_live; independent ORION probe timed out"
  }),
  verdict: "POST_BOUNDARY_REALITY_CAPTURED",
  invariants: Object.freeze({
    append_only: true,
    retroactive_rewrite: "forbidden",
    trading_signal: false
  })
});

export const SEP_17_POSTBOUNDARY_EVIDENCE = Object.freeze({
  schema: "bhrigu_temporal_evidence_v0_1",
  id: "SEP_17_2026__2026-09-18T13:28:03.748Z",
  window_id: "SEP_17_2026",
  kind: "post_boundary_reality_observation",
  observed_at_utc: "2026-09-18T13:28:03.748Z",
  boundary_utc: "2026-09-17T00:00:00Z",
  baseline: Object.freeze({
    captured_at_utc: "2026-09-10T04:49:49.136Z",
    btcusdt_last_price: 78348.09
  }),
  observation: Object.freeze({
    btcusdt_last_price: 78138.23,
    current_vs_baseline_pct: -0.2679,
    btcusdt_24h_change_pct: 2.056,
    btcusdt_24h_high: 78490.79,
    btcusdt_24h_low: 76000,
    volume_24h_btc: 14742.07843,
    bitcoin_tip_height: 967556
  }),
  provenance: Object.freeze({
    runtime_endpoint: "https://bhrigu-bitcoin-research-state-api.vercel.app/v1/state",
    runtime_commit: "905adc26632e4595d998c01da26b3ccd88bf8a6f",
    market_source: "https://data-api.binance.vision/api/v3/ticker/24hr?symbol=BTCUSDT",
    market_crosscheck_source: "Binance Spot public 24h ticker",
    market_crosscheck_last_price_usdt: 78154.01,
    market_crosscheck_abs_diff_usdt: 15.78,
    protocol_source: "https://mempool.space/api/blocks/tip/height",
    protocol_crosscheck: "direct mempool.space probe matched runtime at 967556"
  }),
  verdict: "POST_BOUNDARY_REALITY_CAPTURED",
  invariants: Object.freeze({
    append_only: true,
    retroactive_rewrite: "forbidden",
    trading_signal: false
  })
});

export const EVIDENCE_LEDGER = Object.freeze([
  SEP_10_POSTBOUNDARY_EVIDENCE,
  SEP_17_POSTBOUNDARY_EVIDENCE
]);

import assert from "node:assert/strict";
import { getWindow, listWindows, temporalSummary } from "../lib/windows.mjs";
import { SEP_10_POSTBOUNDARY_EVIDENCE, SEP_17_POSTBOUNDARY_EVIDENCE } from "../lib/evidence.mjs";

const before = new Date("2026-09-16T23:59:59Z");
const afterBoundary = new Date("2026-09-17T00:00:01Z");
const afterEvidence = new Date("2026-09-18T13:28:04Z");

const windowsBefore = listWindows(before);
assert.equal(windowsBefore.length, 2);
assert.equal(windowsBefore[0].id, "SEP_10_2026");
assert.equal(windowsBefore[0].phase, "POST_BOUNDARY");
assert.equal(windowsBefore[0].durable_evidence_count, 1);
assert.equal(windowsBefore[1].id, "SEP_17_2026");
assert.equal(windowsBefore[1].phase, "PRE_BOUNDARY");

const sep10 = getWindow("SEP_10_2026", before);
assert.equal(sep10.window.baseline.btcusdt_last_price, 78474);
assert.equal(sep10.evidence.length, 1);
assert.equal(sep10.evidence[0].id, SEP_10_POSTBOUNDARY_EVIDENCE.id);
assert.equal(sep10.evidence[0].observation.btcusdt_last_price, 78348.09);
assert.equal(sep10.evidence[0].invariants.append_only, true);

const sep17Before = getWindow("SEP_17_2026", before);
assert.equal(sep17Before.window.baseline.captured_at_utc, "2026-09-10T04:49:49.136Z");
assert.equal(sep17Before.window.baseline.btcusdt_last_price, 78348.09);
assert.equal(sep17Before.evidence.length, 0);

const sep17AfterBoundary = getWindow("SEP_17_2026", afterBoundary);
assert.equal(sep17AfterBoundary.phase, "POST_BOUNDARY");
assert.equal(sep17AfterBoundary.evidence.length, 0);

const sep17AfterEvidence = getWindow("SEP_17_2026", afterEvidence);
assert.equal(sep17AfterEvidence.evidence.length, 1);
assert.equal(sep17AfterEvidence.evidence[0].id, SEP_17_POSTBOUNDARY_EVIDENCE.id);
assert.equal(sep17AfterEvidence.evidence[0].observation.btcusdt_last_price, 78138.23);
assert.equal(sep17AfterEvidence.evidence[0].invariants.append_only, true);

const summaryBefore = temporalSummary(before);
assert.equal(summaryBefore.window_count, 2);
assert.equal(summaryBefore.durable_evidence_count, 1);
assert.equal(summaryBefore.next_window_id, "SEP_17_2026");
assert.equal(summaryBefore.append_only, true);

const summaryAfterEvidence = temporalSummary(afterEvidence);
assert.equal(summaryAfterEvidence.durable_evidence_count, 2);
assert.equal(summaryAfterEvidence.next_window_id, null);

console.log(JSON.stringify({ schema: "bhrigu_temporal_tests_v0_2", status: "PASS", checks: 26 }));

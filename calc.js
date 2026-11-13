/* 60° single-point thread calculator plus standard three-wire measurement.
   Unit conversion uses 1/25.4. Nut sharp-vee thread depth uses 0.8660. */
(function (root) {
  const IN = 1 / 25.4;
  const FLAT = 0.6496; // bolt P/8 flat factor
  const VEE = 0.7578;  // bolt sharp vee factor
  const NUT = 0.5412;  // nut-hole depth factor
  const NUT_VEE = 0.8660; // nut sharp vee thread depth factor

  function num(v) {
    if (typeof v === "number") return Number.isFinite(v) ? v : 0;
    const n = parseFloat(String(v).trim());
    return Number.isFinite(n) ? n : 0;
  }

  // Pitch in inches from TPI — treat <= 0 as 0
  function inchPitch(tpi) {
    tpi = num(tpi);
    if (tpi === 0) return 0;
    if (tpi > 0) return 1 / tpi;
    return 0;
  }

  // TPI from metric pitch (mm), using IN = 1/25.4 — treat <= 0 as 0
  function metricTPI(pitch) {
    pitch = num(pitch);
    if (pitch === 0) return 0;
    if (pitch > 0) return 1 / (pitch * IN);
    return 0;
  }

  function calcInch(od, tpi) {
    const B6 = num(od);
    const B8 = num(tpi);
    const C6 = inchPitch(B8);
    const C7 = C6 / IN;
    const C10 = C6 * FLAT;
    const C11 = C10 / IN;
    const C12 = C6 * VEE;
    const C13 = C12 / IN;
    const C15 = B6 - 2 * (NUT * C6);
    const C16 = C15 / IN;
    const C17 = C6 * NUT_VEE;
    const C18 = C17 / IN;
    return { B6, B8, C6, C7, C10, C11, C12, C13, C15, C16, C17, C18 };
  }

  function calcMetric(od, pitch) {
    const F6 = num(od);
    const F8 = num(pitch);
    const G6 = metricTPI(F8);
    const G7 = F8 * IN;
    const G10 = F8 * FLAT;
    const G11 = G10 * IN;
    const G12 = F8 * VEE;
    const G13 = G12 * IN;
    const G15 = F6 - 2 * (NUT * F8);
    const G16 = G15 * IN;
    const G17 = F8 * NUT_VEE;
    const G18 = G17 * IN;
    return { F6, F8, G6, G7, G10, G11, G12, G13, G15, G16, G17, G18 };
  }

  function format(value, kind) {
    if (!Number.isFinite(value)) return "";
    const digits = kind === "in5" ? 5 : kind === "in4" || kind === "in" ? 4 : kind === "tpi" || kind === "mm" ? 2 : kind === "mm3" ? 3 : 4;
    return value.toFixed(digits);
  }

  // Standard 60° three-wire measurement. Uses exact 25.4 and 1/sqrt(3).
  const MM = 25.4;
  const BEST_WIRE = 1 / Math.sqrt(3);         // 0.5773502691896257 ≈ 0.57735
  const WIRE_CONST = Math.sqrt(3) / 2;        // 0.8660254037844386 ≈ 0.86603
  const E_FACTOR = 0.6495190528;              // basic pitch diameter: E = OD − 0.6495190528 × P

  function isBlank(v) {
    return v == null || String(v).trim() === "";
  }

  function threeWirePitch(unit, tpi, pitch) {
    if (unit === "metric") {
      const p = num(pitch);
      return p > 0 ? p : 0;
    }
    const t = num(tpi);
    return t > 0 ? 1 / t : 0;
  }

  function bestWire(p) {
    p = num(p);
    return p > 0 ? BEST_WIRE * p : 0;
  }

  function wireUsed(p, wire) {
    const W_best = bestWire(p);
    if (isBlank(wire)) return { W: W_best, wireAuto: true };
    const w = num(wire);
    if (w > 0) return { W: w, wireAuto: false };
    return { W: 0, wireAuto: false };
  }

  function pitchDiameter(p, e, od) {
    const eNum = isBlank(e) ? 0 : num(e);
    if (eNum > 0) return { E: eNum, eFromOd: false };
    const odNum = num(od);
    if (odNum > 0 && p > 0) return { E: odNum - E_FACTOR * p, eFromOd: true };
    return { E: 0, eFromOd: false };
  }

  function measurementOverWires(E, W, P) {
    if (!(P > 0 && W > 0)) return 0;
    return E + 3 * W - WIRE_CONST * P;
  }

  function actualPitchDia(measuredM, W, P) {
    const M = num(measuredM);
    if (!(M > 0 && P > 0 && W > 0)) return 0;
    return M - 3 * W + WIRE_CONST * P;
  }

  function calcThreeWire(opts) {
    opts = opts || {};
    const unit = opts.unit === "metric" ? "metric" : "inch";
    const P = threeWirePitch(unit, opts.tpi, opts.pitch);
    const W_best = bestWire(P);
    const used = wireUsed(P, opts.wire);
    const W = used.W;
    const pd = pitchDiameter(P, opts.e, opts.od);
    const E = pd.E;
    const M = measurementOverWires(E, W, P);
    const actualE = actualPitchDia(opts.measuredM, W, P);
    const toIn = (v) => unit === "metric" ? v / MM : v;
    const toMm = (v) => unit === "metric" ? v : v * MM;
    return {
      unit, P, W_best, W, wireAuto: used.wireAuto, E, eFromOd: pd.eFromOd, M, actualE,
      P_in: toIn(P), W_best_in: toIn(W_best), W_in: toIn(W), E_in: toIn(E), M_in: toIn(M), actualE_in: toIn(actualE),
      P_mm: toMm(P), W_best_mm: toMm(W_best), W_mm: toMm(W), E_mm: toMm(E), M_mm: toMm(M), actualE_mm: toMm(actualE)
    };
  }

  const api = {
    IN, FLAT, VEE, NUT, NUT_VEE, num, inchPitch, metricTPI, calcInch, calcMetric, format,
    MM, BEST_WIRE, WIRE_CONST, E_FACTOR, isBlank, threeWirePitch, bestWire, wireUsed,
    pitchDiameter, measurementOverWires, actualPitchDia, calcThreeWire
  };
  root.ThreadCalc = api;
  if (typeof module !== "undefined") module.exports = api;
})(typeof window !== "undefined" ? window : globalThis);

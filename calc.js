/* Joe Martin's Sherline 60° single-point thread calculator (Jan 2007).
   Cell-for-cell port of Sheet1. Constants and the nut "Sharp Vee" 0.6496 quirk are kept as-is.
   The original IF() for pitch/TPI returns FALSE when the input is negative; this port returns 0. */
(function (root) {
  const IN = 0.03937;
  const FLAT = 0.6496; // P/8 flat factor (also used on the nut "Sharp Vee" rows)
  const VEE = 0.7578;  // sharp vee factor
  const NUT = 0.5412;  // nut-hole depth factor

  function num(v) {
    if (typeof v === "number") return Number.isFinite(v) ? v : 0;
    const n = parseFloat(String(v).trim());
    return Number.isFinite(n) ? n : 0;
  }

  // C6 = IF(B8=0,0,IF(B8>0,1/B8)) — treat <= 0 as 0, never FALSE
  function inchPitch(tpi) {
    tpi = num(tpi);
    if (tpi === 0) return 0;
    if (tpi > 0) return 1 / tpi;
    return 0;
  }

  // G6 = IF(F8=0,0,IF(F8>0,1/(F8*0.03937))) — treat <= 0 as 0, never FALSE
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
    const C17 = C6 * FLAT; // labeled Sharp Vee, uses 0.6496
    const C18 = C17 / IN;
    return { B6, B8, C6, C7, C10, C11, C12, C13, C15, C16, C17, C18 };
  }

  function calcMetric(od, pitch) {
    const F6 = num(od);
    const F8 = num(pitch);
    const G6 = metricTPI(F8);
    const G10 = F8 * FLAT;
    const G11 = G10 * IN;
    const G12 = F8 * VEE;
    const G13 = G12 * IN;
    const G15 = F6 - 2 * (NUT * F8);
    const G16 = G15 * IN;
    const G17 = F8 * FLAT; // labeled Sharp Vee, uses 0.6496
    const G18 = G17 * IN;
    return { F6, F8, G6, G10, G11, G12, G13, G15, G16, G17, G18 };
  }

  function format(value, kind) {
    if (!Number.isFinite(value)) return "";
    const digits = kind === "in5" ? 5 : kind === "in4" || kind === "in" ? 4 : kind === "tpi" || kind === "mm" ? 2 : 4;
    return value.toFixed(digits);
  }

  const api = { IN, FLAT, VEE, NUT, num, inchPitch, metricTPI, calcInch, calcMetric, format };
  root.ThreadCalc = api;
  if (typeof module !== "undefined") module.exports = api;
})(typeof window !== "undefined" ? window : globalThis);

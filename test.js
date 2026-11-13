#!/usr/bin/env node
/* Verify calc.js constants and three-wire formulas. */
const T = require("./calc.js");

const cases = [];
function near(name, got, exp, tol) {
  const ok = Number.isFinite(got) && Math.abs(got - exp) <= (tol || 1e-12) * Math.max(1, Math.abs(exp));
  cases.push({ name, got, exp, ok });
  if (!ok) console.log("FAIL", name, "got", got, "expected", exp);
}

// Zeros (initial state)
{
  const i = T.calcInch(0, 0);
  const m = T.calcMetric(0, 0);
  for (const [k, v] of Object.entries({ ...i, ...m })) near("zero " + k, v, 0);
}

// 1/2-13 UNC: OD 0.5 in, 13 TPI
{
  const od = 0.5, tpi = 13;
  const C6 = 1 / 13;
  const C7 = C6 / T.IN;
  const C10 = C6 * T.FLAT;
  const C11 = C10 / T.IN;
  const C12 = C6 * T.VEE;
  const C13 = C12 / T.IN;
  const C15 = od - 2 * (T.NUT * C6);
  const C16 = C15 / T.IN;
  const C17 = C6 * T.NUT_VEE;
  const C18 = C17 / T.IN;
  const r = T.calcInch(od, tpi);
  near("C6 1/2-13", r.C6, C6);
  near("C7 1/2-13", r.C7, C7);
  near("C10 P/8 flat in", r.C10, C10);
  near("C11 P/8 flat mm", r.C11, C11);
  near("C12 sharp vee in", r.C12, C12);
  near("C13 sharp vee mm", r.C13, C13);
  near("C15 nut hole in", r.C15, C15);
  near("C16 nut hole mm", r.C16, C16);
  near("C17 nut sharp vee in", r.C17, C17);
  near("C17 equals 0.8660 * P", r.C17, 0.8660 * C6);
  near("C18 nut depth mm", r.C18, C18);
  near("C17 != C10 (P/8 flat)", Math.abs(r.C17 - r.C10) > 1e-9 ? 1 : 0, 1);
  near("C17 != C12 (bolt sharp vee)", Math.abs(r.C17 - r.C12) > 1e-9 ? 1 : 0, 1);
  near("fmt C6 0.00000", Number(T.format(r.C6, "in5")), Number(C6.toFixed(5)));
  near("fmt C10 0.0000", Number(T.format(r.C10, "in4")), Number(C10.toFixed(4)));
  near("fmt C7 0.00", Number(T.format(r.C7, "mm")), Number(C7.toFixed(2)));
}

// M10 × 1.5: OD 10 mm, pitch 1.5 mm
{
  const od = 10, p = 1.5;
  const G6 = 1 / (p * T.IN);
  const G7 = p * T.IN;
  const G10 = p * T.FLAT;
  const G11 = G10 * T.IN;
  const G12 = p * T.VEE;
  const G13 = G12 * T.IN;
  const G15 = od - 2 * (T.NUT * p);
  const G16 = G15 * T.IN;
  const G17 = p * T.NUT_VEE;
  const G18 = G17 * T.IN;
  const r = T.calcMetric(od, p);
  near("G6 M10x1.5 TPI", r.G6, G6);
  near("G7 M10x1.5 pitch in", r.G7, G7);
  near("G7 equals p * IN", r.G7, p * T.IN);
  near("G10 P/8 flat mm", r.G10, G10);
  near("G11 P/8 flat in", r.G11, G11);
  near("G12 sharp vee mm", r.G12, G12);
  near("G13 sharp vee in", r.G13, G13);
  near("G15 nut hole mm", r.G15, G15);
  near("G16 nut hole in", r.G16, G16);
  near("G17 nut sharp vee mm", r.G17, G17);
  near("G17 equals 0.8660 * P", r.G17, 0.8660 * p);
  near("G18 nut depth in", r.G18, G18);
  near("G17 != G10 (P/8 flat)", Math.abs(r.G17 - r.G10) > 1e-9 ? 1 : 0, 1);
}

// 1/4-20: OD 0.25 in, 20 TPI (Inch panel spot-check)
{
  const od = 0.25, tpi = 20;
  const C6 = 1 / 20;
  const C7 = C6 / T.IN;
  const C10 = C6 * T.FLAT;
  const C11 = C10 / T.IN;
  const C12 = C6 * T.VEE;
  const C13 = C12 / T.IN;
  const C15 = od - 2 * (T.NUT * C6);
  const C16 = C15 / T.IN;
  const C17 = C6 * T.NUT_VEE;
  const C18 = C17 / T.IN;
  const r = T.calcInch(od, tpi);
  near("1/4-20 C6 pitch in", r.C6, C6);
  near("1/4-20 C7 uses 1/25.4", r.C7, C7);
  near("1/4-20 C7 is 1.27 mm", r.C7, 1.27);
  near("1/4-20 C10 P/8 flat", r.C10, C10);
  near("1/4-20 C12 bolt sharp vee", r.C12, C12);
  near("1/4-20 C15 nut hole", r.C15, C15);
  near("1/4-20 C17 nut sharp vee", r.C17, 0.8660 * C6);
  near("1/4-20 C17 != C10", Math.abs(r.C17 - r.C10) > 1e-9 ? 1 : 0, 1);
  near("1/4-20 C18 uses 1/25.4", r.C18, C18);
}

// M6 × 1.0: OD 6 mm, pitch 1.0 mm (Metric panel spot-check)
{
  const od = 6, p = 1.0;
  const G6 = 1 / (p * T.IN);
  const G7 = p * T.IN;
  const G10 = p * T.FLAT;
  const G11 = G10 * T.IN;
  const G12 = p * T.VEE;
  const G13 = G12 * T.IN;
  const G15 = od - 2 * (T.NUT * p);
  const G16 = G15 * T.IN;
  const G17 = p * T.NUT_VEE;
  const G18 = G17 * T.IN;
  const r = T.calcMetric(od, p);
  near("M6x1.0 G6 TPI uses 1/25.4", r.G6, 25.4);
  near("M6x1.0 G7 pitch in", r.G7, G7);
  near("M6x1.0 G7 equals p * IN", r.G7, p * T.IN);
  near("M6x1.0 G10 P/8 flat", r.G10, G10);
  near("M6x1.0 G11 uses 1/25.4", r.G11, G11);
  near("M6x1.0 G12 bolt sharp vee", r.G12, G12);
  near("M6x1.0 G15 nut hole", r.G15, G15);
  near("M6x1.0 G17 nut sharp vee", r.G17, 0.8660);
  near("M6x1.0 G17 != G10", Math.abs(r.G17 - r.G10) > 1e-9 ? 1 : 0, 1);
  near("M6x1.0 G18 uses 1/25.4", r.G18, G18);
}

// Safe handling of <= 0
near("inchPitch 0", T.inchPitch(0), 0);
near("inchPitch -13", T.inchPitch(-13), 0);
near("metricTPI 0", T.metricTPI(0), 0);
near("metricTPI -1.5", T.metricTPI(-1.5), 0);
near("blank input", T.inchPitch(""), 0);
near("calcInch negative TPI pitch is 0", T.calcInch(0.5, -13).C6, 0);
near("calcInch negative TPI nut hole = OD", T.calcInch(0.5, -13).C15, 0.5);
near("calcMetric negative pitch TPI is 0", T.calcMetric(10, -1.5).G6, 0);

// Constants
near("const IN is 1/25.4", T.IN, 1 / 25.4);
near("const NUT_VEE 0.8660", T.NUT_VEE, 0.8660);
near("const 0.6496", T.FLAT, 0.6496);
near("const 0.7578", T.VEE, 0.7578);
near("const 0.5412", T.NUT, 0.5412);

// --- Three-wire measurement (standard 60°, exact 25.4) ---
near("BEST_WIRE is 1/sqrt(3)", T.BEST_WIRE, 1 / Math.sqrt(3));
near("WIRE_CONST is sqrt(3)/2", T.WIRE_CONST, Math.sqrt(3) / 2);
near("0.57735 agrees to 5 decimals", Number(T.BEST_WIRE.toFixed(5)), 0.57735);
near("0.86603 agrees to 5 decimals", Number(T.WIRE_CONST.toFixed(5)), 0.86603);
near("MM is exact 25.4", T.MM, 25.4);
near("E_FACTOR 0.6495190528", T.E_FACTOR, 0.6495190528);
near("1/MM equals IN", 1 / T.MM, T.IN);

// 1/4-20: OD 0.25 in, 20 TPI, blank wire (best), E from OD
{
  const P = 1 / 20;
  const W_best = T.BEST_WIRE * P;
  const E = 0.25 - T.E_FACTOR * P;
  const M = E + 3 * W_best - T.WIRE_CONST * P;
  const Mbest = E + T.WIRE_CONST * P; // identity at best-size wire
  near("1/4-20 best-wire identity M = E + 0.866P", M, Mbest);
  const r = T.calcThreeWire({ unit: "inch", tpi: 20, od: 0.25, wire: "", e: "" });
  near("1/4-20 P", r.P, P);
  near("1/4-20 W_best", r.W_best, W_best);
  near("1/4-20 W auto equals best", r.W, W_best);
  near("1/4-20 wireAuto", r.wireAuto ? 1 : 0, 1);
  near("1/4-20 E from OD", r.E, E);
  near("1/4-20 eFromOd", r.eFromOd ? 1 : 0, 1);
  near("1/4-20 M", r.M, M);
  near("1/4-20 M_in", r.M_in, M);
  near("1/4-20 W_mm uses 25.4", r.W_best_mm, W_best * 25.4);
  near("1/4-20 fmt best wire 0.02887", Number(T.format(r.W_best, "in5")), 0.02887);
  near("fmt 0.57735/20 five decimals matches 1/sqrt(3)", Number((0.57735 / 20).toFixed(5)), Number(T.format(W_best, "in5")));
  // Reverse: measured M should recover E
  const back = T.calcThreeWire({ unit: "inch", tpi: 20, od: 0.25, wire: "", measuredM: r.M });
  near("1/4-20 reverse M->E", back.actualE, E);
}

// 1/2-13: OD 0.5 in, 13 TPI
{
  const P = 1 / 13;
  const W_best = T.BEST_WIRE * P;
  const E = 0.5 - T.E_FACTOR * P;
  const M = E + T.WIRE_CONST * P;
  const r = T.calcThreeWire({ unit: "inch", tpi: 13, od: 0.5 });
  near("1/2-13 P", r.P, P);
  near("1/2-13 W_best", r.W_best, W_best);
  near("1/2-13 E from OD", r.E, E);
  near("1/2-13 M at best wire", r.M, M);
  near("1/2-13 wireAuto when wire omitted", r.wireAuto ? 1 : 0, 1);
}

// M6×1.0: OD 6 mm, pitch 1.0 mm
{
  const P = 1.0;
  const W_best = T.BEST_WIRE * P;
  const E = 6 - T.E_FACTOR * P;
  const M = E + T.WIRE_CONST * P;
  const r = T.calcThreeWire({ unit: "metric", pitch: 1.0, od: 6, wire: "  ", e: "" });
  near("M6x1.0 P", r.P, P);
  near("M6x1.0 W_best", r.W_best, W_best);
  near("M6x1.0 W (whitespace = auto)", r.W, W_best);
  near("M6x1.0 wireAuto", r.wireAuto ? 1 : 0, 1);
  near("M6x1.0 E from OD", r.E, E);
  near("M6x1.0 M", r.M, M);
  near("M6x1.0 W_in uses 25.4", r.W_best_in, W_best / 25.4);
  near("M6x1.0 M_in", r.M_in, M / 25.4);
  near("M6x1.0 fmt best wire 0.577 mm", Number(T.format(r.W_best, "mm3")), 0.577);
  near("M6x1.0 fmt M 3 dec", Number(T.format(r.M, "mm3")), Number(M.toFixed(3)));
  const back = T.calcThreeWire({ unit: "metric", pitch: 1, od: 6, measuredM: r.M });
  near("M6x1.0 reverse M->E", back.actualE, E);
}

// Custom wire vs auto-blank best wire (1/4-20, custom W = 0.029)
{
  const auto = T.calcThreeWire({ unit: "inch", tpi: 20, od: 0.25, wire: "" });
  const custom = T.calcThreeWire({ unit: "inch", tpi: 20, od: 0.25, wire: 0.029 });
  const P = 1 / 20;
  const E = 0.25 - T.E_FACTOR * P;
  const Mcustom = E + 3 * 0.029 - T.WIRE_CONST * P;
  near("custom wire W", custom.W, 0.029);
  near("custom wire not auto", custom.wireAuto ? 1 : 0, 0);
  near("custom wire M", custom.M, Mcustom);
  near("custom M differs from best-wire M", Math.abs(custom.M - auto.M) > 1e-9 ? 1 : 0, 1);
  near("auto still uses best when custom is a different call", auto.W, auto.W_best);
  // string "0.029"
  const c2 = T.calcThreeWire({ unit: "inch", tpi: "20", od: "0.25", wire: "0.029" });
  near("custom wire from string", c2.W, 0.029);
}

// Direct E input takes precedence over OD
{
  const r = T.calcThreeWire({ unit: "inch", tpi: 20, od: 0.25, e: 0.2175, wire: "" });
  near("direct E used", r.E, 0.2175);
  near("direct E not from OD", r.eFromOd ? 1 : 0, 0);
  const M = 0.2175 + T.WIRE_CONST * (1 / 20);
  near("direct E M", r.M, M);
}

// Reverse check with an independent measured M (1/2-13, best wire)
{
  const W = T.BEST_WIRE / 13;
  const measured = 0.5200;
  const actualE = measured - 3 * W + T.WIRE_CONST / 13;
  const r = T.calcThreeWire({ unit: "inch", tpi: 13, od: 0.5, measuredM: measured });
  near("reverse independent M->E", r.actualE, actualE);
  near("reverse still reports forward E from OD", r.E, 0.5 - T.E_FACTOR / 13);
}

// Zero / blank inputs stay clean zeros, never NaN
{
  const z = T.calcThreeWire({ unit: "inch", tpi: 0, od: 0, wire: "", e: "", measuredM: "" });
  for (const k of ["P", "W_best", "W", "E", "M", "actualE", "P_in", "P_mm", "W_best_in", "W_best_mm", "M_in", "M_mm"]) {
    near("zero " + k, z[k], 0);
  }
  near("zero wireAuto (blank wire)", z.wireAuto ? 1 : 0, 1);
  near("blank tpi pitch 0", T.threeWirePitch("inch", "", ""), 0);
  near("zero tpi pitch 0", T.threeWirePitch("inch", 0, 0), 0);
  near("neg tpi pitch 0", T.threeWirePitch("inch", -20, 0), 0);
  near("blank metric pitch 0", T.threeWirePitch("metric", 0, ""), 0);
  near("neg metric pitch 0", T.threeWirePitch("metric", 0, -1), 0);
  near("bestWire 0", T.bestWire(0), 0);
  near("wireUsed 0 input is not auto", T.wireUsed(0.05, 0).wireAuto ? 1 : 0, 0);
  near("wireUsed 0 input W is 0", T.wireUsed(0.05, "0").W, 0);
  function eq(name, got, exp) {
    const ok = got === exp;
    cases.push({ name, got, exp, ok });
    if (!ok) console.log("FAIL", name, "got", got, "expected", exp);
  }
  eq("fmt zero in5", T.format(0, "in5"), "0.00000");
  eq("fmt zero in4", T.format(0, "in4"), "0.0000");
  eq("fmt zero mm3", T.format(0, "mm3"), "0.000");
  eq("fmt zero mm stays 2 dec", T.format(0, "mm"), "0.00");
  const empty = T.calcThreeWire({});
  near("empty opts unit inch", empty.unit === "inch" ? 1 : 0, 1);
  near("empty opts M", empty.M, 0);
}

const bad = cases.filter(c => !c.ok).length;
console.log(`${cases.length - bad}/${cases.length} checks passed`);
process.exit(bad ? 1 : 0);

#!/usr/bin/env node
/* Verify calc.js against the Sheet1 formulas in Joe Martin's Jan 2007 spreadsheet. */
const T = require("./calc.js");

const cases = [];
function near(name, got, exp, tol) {
  const ok = Number.isFinite(got) && Math.abs(got - exp) <= (tol || 1e-12) * Math.max(1, Math.abs(exp));
  cases.push({ name, got, exp, ok });
  if (!ok) console.log("FAIL", name, "got", got, "expected", exp);
}

// Zeros (the sheet's initial state)
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
  const C17 = C6 * T.FLAT;
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
  near("C17 nut depth in (0.6496 quirk)", r.C17, C17);
  near("C18 nut depth mm", r.C18, C18);
  near("quirk C17 equals C10 not C12", r.C17, r.C10);
  if (!(Math.abs(r.C17 - r.C12) > 1e-9)) {
    cases.push({ name: "quirk C17 != C12", ok: false });
    console.log("FAIL quirk C17 should not equal C12");
  } else {
    cases.push({ name: "quirk C17 != C12", ok: true });
  }
  // display formats from the sheet
  near("fmt C6 0.00000", Number(T.format(r.C6, "in5")), Number(C6.toFixed(5)));
  near("fmt C10 0.0000", Number(T.format(r.C10, "in4")), Number(C10.toFixed(4)));
  near("fmt C7 0.00", Number(T.format(r.C7, "mm")), Number(C7.toFixed(2)));
}

// M10 × 1.5: OD 10 mm, pitch 1.5 mm
{
  const od = 10, p = 1.5;
  const G6 = 1 / (p * T.IN);
  const G10 = p * T.FLAT;
  const G11 = G10 * T.IN;
  const G12 = p * T.VEE;
  const G13 = G12 * T.IN;
  const G15 = od - 2 * (T.NUT * p);
  const G16 = G15 * T.IN;
  const G17 = p * T.FLAT;
  const G18 = G17 * T.IN;
  const r = T.calcMetric(od, p);
  near("G6 M10x1.5 TPI", r.G6, G6);
  near("G10 P/8 flat mm", r.G10, G10);
  near("G11 P/8 flat in", r.G11, G11);
  near("G12 sharp vee mm", r.G12, G12);
  near("G13 sharp vee in", r.G13, G13);
  near("G15 nut hole mm", r.G15, G15);
  near("G16 nut hole in", r.G16, G16);
  near("G17 nut depth mm (0.6496 quirk)", r.G17, G17);
  near("G18 nut depth in", r.G18, G18);
  near("quirk G17 equals G10", r.G17, r.G10);
}

// Safe handling of <= 0 (spreadsheet would show FALSE for pitch/TPI)
near("inchPitch 0", T.inchPitch(0), 0);
near("inchPitch -13", T.inchPitch(-13), 0);
near("metricTPI 0", T.metricTPI(0), 0);
near("metricTPI -1.5", T.metricTPI(-1.5), 0);
near("blank input", T.inchPitch(""), 0);
near("calcInch negative TPI pitch is 0", T.calcInch(0.5, -13).C6, 0);
near("calcInch negative TPI nut hole = OD", T.calcInch(0.5, -13).C15, 0.5);
near("calcMetric negative pitch TPI is 0", T.calcMetric(10, -1.5).G6, 0);

// Constants from the sheet
near("const 0.6496", T.FLAT, 0.6496);
near("const 0.7578", T.VEE, 0.7578);
near("const 0.5412", T.NUT, 0.5412);
near("const 0.03937", T.IN, 0.03937);

const bad = cases.filter(c => !c.ok).length;
console.log(`${cases.length - bad}/${cases.length} checks passed`);
process.exit(bad ? 1 : 0);

(function () {
  const T = window.ThreadCalc;
  const inchOD = document.getElementById("inchOD");
  const inchTPI = document.getElementById("inchTPI");
  const metricOD = document.getElementById("metricOD");
  const metricPitch = document.getElementById("metricPitch");
  const wireTPI = document.getElementById("wireTPI");
  const wirePitch = document.getElementById("wirePitch");
  const wireW = document.getElementById("wireW");
  const wireOD = document.getElementById("wireOD");
  const wireE = document.getElementById("wireE");
  const wireM = document.getElementById("wireM");

  let wireUnit = "inch";

  function setPair(base, inchVal, mmVal, inchKind, mmKind) {
    const primIn = wireUnit === "inch";
    const prim = document.getElementById(base + "_prim");
    const primUnit = document.getElementById(base + "_primUnit");
    const alt = document.getElementById(base + "_alt");
    const altUnit = document.getElementById(base + "_altUnit");
    if (prim) prim.textContent = T.format(primIn ? inchVal : mmVal, primIn ? inchKind : mmKind);
    if (primUnit) primUnit.textContent = primIn ? '"' : "mm";
    if (alt) alt.textContent = T.format(primIn ? mmVal : inchVal, primIn ? mmKind : inchKind);
    if (altUnit) altUnit.textContent = primIn ? "mm" : '"';
  }

  function convertField(el, factor) {
    if (!el) return;
    const raw = String(el.value).trim();
    if (raw === "") return;
    const n = T.num(raw);
    if (!(n > 0)) return;
    el.value = String(Number((n * factor).toPrecision(10)));
  }

  function applyWireUnitChrome() {
    const inchBtn = document.getElementById("wireUnitInch");
    const metricBtn = document.getElementById("wireUnitMetric");
    const isInch = wireUnit === "inch";
    if (inchBtn) {
      inchBtn.classList.toggle("active", isInch);
      inchBtn.setAttribute("aria-pressed", isInch ? "true" : "false");
    }
    if (metricBtn) {
      metricBtn.classList.toggle("active", !isInch);
      metricBtn.setAttribute("aria-pressed", !isInch ? "true" : "false");
    }
    const tpiRow = document.getElementById("wireTpiRow");
    const pitchRow = document.getElementById("wirePitchRow");
    if (tpiRow) tpiRow.hidden = !isInch;
    if (pitchRow) pitchRow.hidden = isInch;
    const u = isInch ? '"' : "mm";
    ["wireWUnit", "wireODUnit", "wireEUnit", "wireMUnit"].forEach((id) => {
      const el = document.getElementById(id);
      if (el) el.textContent = u;
    });
  }

  function setWireUnit(unit, convert) {
    const next = unit === "metric" ? "metric" : "inch";
    if (convert && next !== wireUnit) {
      if (next === "metric") {
        const tpi = T.num(wireTPI.value);
        wirePitch.value = tpi > 0 ? String(Number((T.MM / tpi).toPrecision(10))) : "0";
        convertField(wireW, T.MM);
        convertField(wireOD, T.MM);
        convertField(wireE, T.MM);
        convertField(wireM, T.MM);
      } else {
        const pitch = T.num(wirePitch.value);
        wireTPI.value = pitch > 0 ? String(Number((T.MM / pitch).toPrecision(10))) : "0";
        convertField(wireW, 1 / T.MM);
        convertField(wireOD, 1 / T.MM);
        convertField(wireE, 1 / T.MM);
        convertField(wireM, 1 / T.MM);
      }
    }
    wireUnit = next;
    applyWireUnitChrome();
  }

  function renderWire() {
    const r = T.calcThreeWire({
      unit: wireUnit,
      tpi: wireTPI.value,
      pitch: wirePitch.value,
      wire: wireW.value,
      e: wireE.value,
      od: wireOD.value,
      measuredM: wireM.value
    });
    setPair("wireP", r.P_in, r.P_mm, "in5", "mm3");
    setPair("wireWBest", r.W_best_in, r.W_best_mm, "in5", "mm3");
    setPair("wireWUsed", r.W_in, r.W_mm, "in5", "mm3");
    setPair("wireEOut", r.E_in, r.E_mm, "in4", "mm3");
    setPair("wireMOut", r.M_in, r.M_mm, "in4", "mm3");
    setPair("wireActualE", r.actualE_in, r.actualE_mm, "in4", "mm3");
    const autoHint = document.getElementById("wireAutoHint");
    if (autoHint) autoHint.hidden = !r.wireAuto;
    const eHint = document.getElementById("wireEHint");
    if (eHint) eHint.hidden = !r.eFromOd;
  }

  const inchMap = {
    C6: "in5", C7: "mm", C10: "in4", C11: "mm", C12: "in4", C13: "mm",
    C15: "in4", C16: "mm", C17: "in4", C18: "mm"
  };
  const metricMap = {
    G6: "tpi", G10: "mm", G11: "in4", G12: "mm", G13: "in4",
    G15: "mm", G16: "in4", G17: "mm", G18: "in4"
  };

  function set(id, value, kind) {
    const el = document.getElementById(id);
    if (el) el.textContent = T.format(value, kind);
  }

  function render() {
    const i = T.calcInch(inchOD.value, inchTPI.value);
    const m = T.calcMetric(metricOD.value, metricPitch.value);
    for (const [id, kind] of Object.entries(inchMap)) set(id, i[id], kind);
    for (const [id, kind] of Object.entries(metricMap)) set(id, m[id], kind);
    renderWire();
  }

  function reset() {
    inchOD.value = "0";
    inchTPI.value = "0";
    metricOD.value = "0";
    metricPitch.value = "0";
    wireTPI.value = "0";
    wirePitch.value = "0";
    wireW.value = "";
    wireOD.value = "0";
    wireE.value = "";
    wireM.value = "";
    setWireUnit("inch", false);
    render();
    inchOD.focus();
  }

  ["inchOD", "inchTPI", "metricOD", "metricPitch", "wireTPI", "wirePitch", "wireW", "wireOD", "wireE", "wireM"].forEach((id) => {
    const el = document.getElementById(id);
    el.addEventListener("input", render);
    el.addEventListener("change", render);
  });
  document.getElementById("btnReset").addEventListener("click", reset);
  document.getElementById("wireUnitInch").addEventListener("click", () => { setWireUnit("inch", true); render(); });
  document.getElementById("wireUnitMetric").addEventListener("click", () => { setWireUnit("metric", true); render(); });
  document.getElementById("btnCopyInch").addEventListener("click", () => {
    setWireUnit("inch", false);
    wireTPI.value = inchTPI.value;
    wireOD.value = inchOD.value;
    wireE.value = "";
    render();
  });
  document.getElementById("btnCopyMetric").addEventListener("click", () => {
    setWireUnit("metric", false);
    wirePitch.value = metricPitch.value;
    wireOD.value = metricOD.value;
    wireE.value = "";
    render();
  });
  applyWireUnitChrome();

  // Original Sheet1 grid (static snapshot of the zeroed workbook)
  const rows = 20, cols = 9;
  const labels = {
    A1: "SHERLINE PRODUCTS INC.    VISTA CA USA",
    B2: "www.sherline.com",
    A3: "HANDY CALCULATOR FOR DIMENSIONS NEEDED TO SINGLE POINT STANDARD 60° THREADS",
    B4: "INCH 60°THREADS",
    F4: "METRIC 60° THREADS",
    B5: "OUTSIDE DIAMETER",
    C5: "    PITCH",
    F5: "OUTSIDE DIAMETER",
    G5: "TPI       ",
    B6: "0",
    C6: "0",
    D6: '"',
    F6: "0",
    G6: "0",
    B7: "THREADS PER INCH",
    C7: "0",
    D7: "mm",
    F7: "PITCH",
    B8: "0",
    F8: "0",
    B9: "BOLT - EXTERNAL THREAD",
    F9: "BOLT - EXTERNAL THREAD",
    B10: "THREAD DEPTH - WITH P/8 FLAT",
    C10: "0",
    D10: '"',
    F10: "THREAD DEPTH - WITH P/8 FLAT",
    G10: "0",
    H10: "mm",
    B11: "DEPTH IN METRIC",
    C11: "0",
    D11: "mm",
    F11: "DEPTH IN INCHES",
    G11: "0",
    H11: '"',
    B12: "THREAD DEPTH - SHARP VEE",
    C12: "0",
    D12: '"',
    F12: "THREAD DEPTH - SHARP VEE",
    G12: "0",
    H12: "mm",
    B13: "DEPTH IN METRIC",
    C13: "0",
    D13: "mm",
    F13: "DEPTH IN INCHES",
    G13: "0",
    H13: '"',
    B14: "NUT - INTERNAL THREAD",
    F14: "NUT - INTERNAL THREAD",
    B15: "NUT HOLE DIA.",
    C15: "0",
    D15: '"',
    F15: "NUT HOLE DIA.",
    G15: "0",
    H15: "mm",
    B16: "DIAMETER IN METRIC",
    C16: "0",
    D16: "mm",
    F16: "DIAMETER IN INCHES",
    G16: "0",
    H16: '"',
    B17: "THREAD DEPTH - SHARP VEE",
    C17: "0",
    D17: '"',
    F17: "THREAD DEPTH -SHARP VEE",
    G17: "0",
    H17: "mm",
    B18: "DEPTH IN METRIC",
    C18: "0",
    D18: "mm",
    F18: "DEPTH IN INCHES",
    G18: "0",
    H18: '"',
    B20: "THIS CALCULATOR REQUIRES ONLY TWO INPUTS: OD, TPI or PITCH. … JOE MARTIN - JANUARY 2007. (Full note is shown above.)"
  };
  const formulas = {
    C6: "IF(B8=0,0,IF(B8>0,1/B8))",
    C7: "C6/0.03937",
    G6: "IF(F8=0,0,IF(F8>0,1/(F8*0.03937)))",
    C10: "C6*0.6496",
    C11: "C10/0.03937",
    C12: "C6*0.7578",
    C13: "C12/0.03937",
    C15: "B6-(2*(0.5412*C6))",
    C16: "C15/0.03937",
    C17: "C6*0.6496",
    C18: "C17/0.03937",
    G10: "F8*0.6496",
    G11: "G10*0.03937",
    G12: "F8*0.7578",
    G13: "G12*0.03937",
    G15: "F6-(2*(0.5412*F8))",
    G16: "G15*0.03937",
    G17: "F8*0.6496",
    G18: "G17*0.03937"
  };
  const inputs = new Set(["B6", "B8", "F6", "F8"]);
  const colName = (c) => String.fromCharCode(65 + c);
  const table = document.createElement("table");
  table.className = "sheet";
  const thead = document.createElement("thead");
  const hr = document.createElement("tr");
  hr.appendChild(document.createElement("th"));
  for (let c = 0; c < cols; c++) {
    const th = document.createElement("th");
    th.textContent = colName(c);
    hr.appendChild(th);
  }
  thead.appendChild(hr);
  table.appendChild(thead);
  const tb = document.createElement("tbody");
  for (let r = 1; r <= rows; r++) {
    const tr = document.createElement("tr");
    const rn = document.createElement("td");
    rn.className = "rn";
    rn.textContent = String(r);
    tr.appendChild(rn);
    for (let c = 0; c < cols; c++) {
      const addr = colName(c) + r;
      const td = document.createElement("td");
      if (inputs.has(addr)) td.className = "input";
      else if (formulas[addr]) td.className = "formula";
      if (labels[addr] != null) td.appendChild(document.createTextNode(labels[addr]));
      if (formulas[addr]) {
        const fx = document.createElement("span");
        fx.className = "fx";
        fx.textContent = "=" + formulas[addr];
        td.appendChild(fx);
        td.title = addr + " =" + formulas[addr];
      }
      tr.appendChild(td);
    }
    tb.appendChild(tr);
  }
  table.appendChild(tb);
  const host = document.getElementById("sheetTable");
  if (host) host.appendChild(table);

  render();
})();

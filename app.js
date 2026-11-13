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
    G6: "tpi", G7: "in5", G10: "mm", G11: "in4", G12: "mm", G13: "in4",
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

  render();
})();

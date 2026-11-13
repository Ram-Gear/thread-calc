# 60° Thread Calc

Browser version of Joe Martin’s **Sherline Products 60-degree single-point thread calculator** (January 2007), plus a standard 60° three-wire measurement panel. Built for Ram-Gear Manufacturing Inc.

Live: https://ram-gear.github.io/thread-calc/

- `index.html` — the app (Inch and Metric calculators, Three-Wire Measurement, plus a read-only Sheet1 view)
- `help.html` — short guide
- `calc.js` — calculation engine (cell-for-cell port of Sheet1, plus three-wire functions)
- `app.js` — UI wiring
- `css/style.css` — Ram-Gear Shop Apps layout (slate header, teal palette, `#EAF7EA` page)
- `icon.svg` — App Hub tile icon (green-and-teal threaded shaft and calculator badge)
- `favicon.png` / `apple-touch-icon.png` — PNG icons
- `test.js` — `node test.js` checks the spreadsheet constants and three-wire formulas

The original Inch and Metric panels keep Joe Martin’s constants (`0.03937`, `0.6496`, `0.7578`, `0.5412`) and the nut “Sharp Vee” quirk. The three-wire panel uses exact `25.4`, best-size wire `W = 0.57735 × P`, and `M = E + 3W − 0.86603 × P`. Leave wire diameter blank to auto-use the best-size wire. Leave pitch diameter blank and enter outside diameter to compute basic `E = OD − 0.64951905 × P`.

Original calculator by Joe Martin, Sherline Products Inc. (www.sherline.com).

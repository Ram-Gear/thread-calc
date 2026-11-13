# 60° Thread Calc

Browser calculator for single-point 60° thread dimensions and standard 60° three-wire measurement. Built for Ram-Gear Manufacturing Inc.

Live: https://ram-gear.github.io/thread-calc/

- `index.html` — the app (Inch and Metric calculators, Three-Wire Measurement)
- `help.html` — short guide
- `calc.js` — calculation engine
- `app.js` — UI wiring
- `css/style.css` — Ram-Gear layout (slate header, teal palette, `#EAF7EA` page)
- `icon.svg` — App Hub tile icon (green-and-teal threaded shaft and calculator badge)
- `favicon.png` / `apple-touch-icon.png` — PNG icons
- `three-wire-diagram.svg` — cross-section of three-wire measurement
- `test.js` — `node test.js` checks the thread constants and three-wire formulas

Inch and Metric panels use `1 / 25.4` for unit conversion, `0.6496` for bolt P/8 flat depth, `0.7578` for bolt sharp-vee depth, `0.5412` for nut-hole diameter, and `0.8660` for nut sharp-vee depth. The three-wire panel uses exact `25.4`, best-size wire `W = 0.57735 × P`, and `M = E + 3W − 0.86603 × P`. Leave wire diameter blank to auto-use the best-size wire. Leave pitch diameter blank and enter outside diameter to compute basic `E = OD − 0.64951905 × P`.

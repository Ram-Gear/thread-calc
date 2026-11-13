# 60° Thread Calc

Browser version of Joe Martin’s **Sherline Products 60-degree single-point thread calculator** (January 2007). Built for Ram-Gear Manufacturing Inc.

Live: https://ram-gear.github.io/thread-calc/

- `index.html` — the app (side-by-side Inch and Metric calculators, plus a read-only Sheet1 view)
- `help.html` — short guide
- `calc.js` — calculation engine (cell-for-cell port of Sheet1)
- `app.js` — UI wiring
- `css/style.css` — Ram-Gear Shop Apps layout (slate header, teal palette, `#EAF7EA` page)
- `icon.svg` — placeholder tile icon in Shop Apps colors
- `test.js` — `node test.js` checks the formulas against the spreadsheet constants

Only four inputs are editable: inch outside diameter and threads per inch, metric outside diameter and pitch. Defaults are 0, matching the original sheet. The nut row labeled “Sharp Vee” uses the 0.6496 P/8 flat factor, as in the spreadsheet.

Original calculator by Joe Martin, Sherline Products Inc. (www.sherline.com).

# GapLab Demo

This document walks through the smoke path for GapLab.  The smoke path seeds a handful of example gap cases, runs the full classification workflow, generates a morning board and produces a markdown report.  It demonstrates deterministic behaviour without relying on live data feeds.

## 1 – Seed fixture data

The repository includes a JSON file under `fixtures/raw/gaps.json` containing several gap inputs with catalysts, gap percentages, relative volume and other attributes.  These fixtures are used by the data package during the smoke run.

```json
[
  {
    "ticker": "AAPL",
    "gapPercent": 5.2,
    "catalystQuality": "HIGH",
    "relativeVolume": 1.5,
    "liquidityScore": 0.9,
    "float": 1000,
    "priorSupportResistance": "Support at $170",
    "recentBaseStructure": "Ascending triangle",
    "openingDrive": "UP"
  },
  ...
]
```

## 2 – Run the smoke script

After building the monorepo (`npm run build`), run the smoke script:

```bash
npm run smoke
```

This script does the following:

1. Invokes the compiled worker (`packages/worker/dist/index.js`) to process the fixture inputs.  The worker runs all analyst agents, classifies each gap and prints a concise summary:

```
Gap board summary:
AAPL: CONTINUATION
TSLA: FILL_LIKELY
GME: TRAP_LIKELY
```

2. Generates a markdown report using the `generateMarkdownReport` function and writes it to `reports/smoke_report.md`.

## 3 – Inspect the report

The markdown report contains a table of key fields and a detailed rationale for each gap.  An excerpt might look like this:

```
# GapLab Morning Board

| Ticker | Gap % | Template    | Catalyst | Liquidity |
|-------|------:|------------|----------|-----------|
| AAPL  |   5.20 | CONTINUATION | HIGH     | 0.90      |
| TSLA  |  -3.10 | FILL_LIKELY | MEDIUM   | 0.85      |
| GME   |  12.50 | TRAP_LIKELY | LOW      | 0.40      |

## Details

### AAPL
* **Classification:** CONTINUATION
* **Reasons:** strong catalyst; high relative volume
* **Analyst Summary:** Catalyst looks robust and liquidity is ample; continuation likely unless early tape reverses.

...
```

You can open the report in any markdown viewer or convert it to HTML if desired.

## 4 – Start the server and view the dashboard

To interact with GapLab via the API and dashboard, start the server:

```bash
PORT=3099 npm start
```

Then navigate to <http://localhost:3099/>.  The dashboard will display the morning board in a simple table, showing the ticker, classification template, confidence level and rationale for each gap.  You can refresh the page to update the board (in a real deployment this would be backed by live data).

## Conclusion

This demo demonstrates that GapLab can turn a messy universe of gapping names into a small, legible decision board with honest confidence and clear provenance.  It remains a research tool and does not execute trades or predict outcomes.
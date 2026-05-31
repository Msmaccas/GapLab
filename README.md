# GapLab Monorepo

GapLab is a small TypeScript monorepo that implements a disciplined laboratory for **pre‑market gap analysis**.  It offers a deterministic pipeline that ingests gap inputs, runs a team of analytic agents, classifies each gap into a handful of templates and produces both an API and a simple web dashboard.  The goal is to provide traders with an evidence‑first morning board rather than a black‑box scanner.

## Features

* **Deterministic workflows** – Inspired by event‑driven backtesting engines like LEAN and Backtrader, GapLab uses pure functions and explicit state to classify gaps.  Missing or malformed data results in downgraded confidence rather than hidden errors.
* **Analyst agents** – A set of modular agents evaluates catalyst quality, chart context, liquidity, early tape and sceptic factors.  A synthesis agent aggregates the results into a rationale and confidence level.
* **Memory layer** – The worker stores prior case outcomes (initially seeded by fixtures) to enable simple “this resembles” messages in future versions.
* **Web dashboard & API** – The Next.js front‑end fetches the board from the server and displays it in a clean table.  The Express server exposes `/health`, `/api/board` and `/api/report` endpoints.
* **Smoke path** – Running `npm run smoke` seeds fixture gaps, generates a board and a markdown report, proving the pipeline without claiming tradability.

## Directory structure

```
apps/
  web/          # Next.js front‑end (static export)
fixtures/
  raw/          # JSON fixtures for gap inputs
packages/
  agents/       # Analyst agents and synthesis logic
  core/         # Domain types and classification heuristics
  data/         # Data ingestion from fixtures (can be extended)
  providers/    # Provider result types and state enums
  workflows/    # Orchestrates agents and classification for each input
  reports/      # Generates JSON boards and Markdown reports
  worker/       # CLI for running the full pipeline
  server/       # Express API server and static web serving
scripts/
  copy-web-to-server.js  # Copies exported Next.js site to server/public
  smoke.js               # Runs the worker and writes a report
  check-repo-hygiene.js  # Validates repository cleanliness
tests/                   # Unit tests (see tests folder)
research/                # Competitor analysis and benchmark documents
```

## Getting started

1. **Install dependencies and generate lockfile**

   ```bash
   npm install --package-lock-only  # Creates package-lock.json
   npm ci                           # Installs dependencies exactly as locked
   ```

2. **Build everything** – This cleans previous artefacts, compiles TypeScript in all packages and exports the Next.js site.

   ```bash
   npm run build
   ```

3. **Run tests**

   ```bash
   npm test
   ```

4. **Run the smoke path**

   ```bash
   npm run smoke
   # Outputs a board summary and writes reports/smoke_report.md
   ```

5. **Check hygiene** – Ensure no compiled artefacts or unrelated files are committed.

   ```bash
   npm run hygiene
   ```

6. **Start the server**

   ```bash
   PORT=3099 npm start
   # Then visit http://localhost:3099/ in your browser
   ```

## Clean‑clone gate

The repository includes a **clean‑clone gate** to ensure reproducibility.  In a fresh clone of the project with no `node_modules` or `dist` directories, the following commands must succeed without modification:

```bash
rm -rf node_modules dist .tsbuildinfo packages/*/dist packages/*/*.tsbuildinfo apps/*/.next apps/*/dist reports fixtures/golden data
npm ci
npm run build
npm test
npm run smoke
npm run hygiene
PORT=3099 npm start &
sleep 2
curl http://localhost:3099/health
curl http://localhost:3099/api/board
kill %1
```

If any step fails or the API returns unexpected data, the build is considered broken.

## Limitations

* GapLab v1 relies on static fixtures rather than live data feeds.  Real‑time ingestion and broker integration are out‑of‑scope.
* The classification heuristics are simple and designed for demonstration.  They should not be used to make trading decisions.
* The front‑end uses minimal styling and does not support sorting or filtering.  Contributions are welcome.
* The memory layer is seeded only by fixtures and does not yet persist user feedback.  This will evolve in future versions.

## Contributing

Contributions to GapLab are welcome.  Please open issues to discuss new features or bug fixes.  All code must pass the clean‑clone gate and include tests.
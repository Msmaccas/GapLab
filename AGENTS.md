# GapLab Agents Guide

GapLab organises its logic into small, deterministic agents.  Each agent performs a specific analysis on a gap input and returns a structured artefact with a result, confidence, rationale and explicit state.  Agents never take external side effects and avoid non‑deterministic behaviour.

## Agents and roles

| Agent             | Responsibility                                              |
|-------------------|-------------------------------------------------------------|
| **Catalyst analyst**    | Rates the quality of the news or earnings catalyst (HIGH, MEDIUM, LOW, NONE). |
| **Chart‑context analyst** | Examines recent price structure, support/resistance and base formations. |
| **Liquidity analyst**    | Evaluates float size, relative volume and liquidity hazards. |
| **Early‑tape analyst**   | Looks at the initial opening drive (UP, DOWN, SIDEWAYS) to detect trap signatures. |
| **Sceptic**              | Flags potential trap vectors or conflicting signals. |
| **Synthesis lead**       | Aggregates artefacts, summarises rationales and moderates confidence. |

Each agent implements a function that accepts a `GapInput` and returns an `AgentArtifact<T>`, where `T` is the specific result schema.  All artefacts contain:

* `id`: the agent id.
* `entityId`: the ticker.
* `result`: typed data (e.g. `{catalystScore: 'HIGH'}`).
* `confidence`: a string describing confidence (`HIGH`, `MEDIUM`, `LOW`).
* `rationale`: a short explanation of the decision.
* `state`: one of `UNKNOWN`, `NOT_AVAILABLE`, `LOW_CONFIDENCE`, `MANUAL_REVIEW`, `OK`.

Agents are pure functions – they must not call network APIs, read files or generate random numbers.  All inputs are validated and unknown or missing data produces downgraded states rather than crashes.

## Installation

Clone the repository and ensure Node.js 16 + and npm are installed.  All scripts run locally without global tools.

```bash
git clone <repo-url>
cd gaplab
npm install --package-lock-only  # Generate lockfile
npm ci                           # Install dependencies
```

## Build and test

Run the full build, test and smoke path from a clean tree:

```bash
npm run build   # Clean previous artefacts, compile all packages and copy web assets
npm test        # Execute unit tests
npm run smoke   # Run the worker and generate a markdown report under reports/
npm run hygiene # Check repository hygiene (no committed artefacts)
```

To start the server and view the dashboard:

```bash
PORT=3099 npm start
curl http://localhost:3099/health      # → {"status":"ok"}
curl http://localhost:3099/api/board   # Returns JSON board
```

## Done criteria

* The clean‑clone gate (see README) passes without modifications.
* `npm run build` produces compiled artefacts in `dist/` directories only and copies the static web site to the server’s public folder.
* `npm run test` passes all unit tests, including edge cases for missing or malformed inputs.
* `npm run smoke` prints a concise board summary and writes a markdown report into `reports/smoke_report.md`.
* `npm run hygiene` reports “Repository hygiene check passed”.
* Starting the server and curling `/health` and `/api/board` return the expected results.

## Do‑not‑overclaim rules

GapLab is a research and decision‑support tool, not an execution system.  Agents must never claim:

* That a gap is tradable or will provide positive returns.
* That the classification guarantees any outcome.
* That the product can execute or automate trades.
* That the memory layer is statistically predictive without sufficient evidence.

Any statements about confidence or outcomes must be tied to explicit evidence and remain interpretable.  Unknown, missing or hostile data must be surfaced to the user rather than hidden.
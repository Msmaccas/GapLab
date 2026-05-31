# GapLab Product Definition

## Broad field

GapLab sits at the intersection of algorithmic trading tooling and intraday market analytics.  It draws inspiration from event‑driven backtesting engines such as QuantConnect’s LEAN (open‑source strategy research and live trading engine)【850898716727281†L116-L156】, Backtrader’s event‑only simulation mode【128527540200510†L291-L323】 and VectorBT’s dual vectorised/event‑driven simulation capabilities【160109905961433†L510-L518】.  Many engines offer high research‑to‑live fidelity and deterministic replay semantics, but specialised gap‑trading products remain underexplained and visually crude.  GapLab aims to provide a transparent, disciplined gap‑reaction lab rather than a one‑click execution bot.

## Subfield

Within short‑term trading research, GapLab focuses on **gap trading** — analysing pre‑market price gaps between a stock’s previous close and its expected open.  It builds upon lessons from existing gap scanners (e.g. Trade Ideas’ Gap filter【70688009657525†L186-L324】) while avoiding black‑box momentum signals.

## Niche

GapLab targets intraday and swing traders who care about the first 15–30 minutes of trading.  It classifies pre‑market gaps by event quality, structure, liquidity and likely intraday path.  Instead of promising scalps, GapLab serves as a **morning reaction laboratory** that produces a ranked board and a lab notebook explaining why each gap merits observation.

## Job‑to‑be‑done

Traders often wade through hundreds of gapping tickers.  Existing scanners overwhelm them with noise or oversimplified “gap and go” labels.  GapLab’s job is to:

1. Ingest pre‑market gap lists or fixture universes along with catalyst context, float, liquidity, relative volume and prior chart structure.
2. Classify each gap into a handful of high‑value templates such as continuation, fill‑likely, trap‑likely, noisy low‑quality and monitor‑only.
3. Provide a morning board with catalyst confidence, expected trap vectors and “what would change the classification” in the first 15–30 minutes.
4. Preserve a memory of past gap cases to help the system say “this resembles low‑quality sympathy gaps that usually fail” or “this looks like a hard catalyst reprice that either continues immediately or should be discarded quickly.”
5. Encourage journalling and manual tagging of outcomes so the system evolves through evidence rather than unverified claims.

## Core promise

GapLab promises to turn a messy universe of gapping names into a small, legible decision board with honest confidence and clear provenance.  It does **not** promise automated execution or guaranteed fill probabilities.  Instead, it provides a disciplined framework for **research‑first decision making**, leaving execution to the trader.

## Target user

Active intraday and swing traders, independent researchers and small prop firms who:

* Want to separate high‑quality catalysts from noise.
* Care about the opening session but dislike low‑trust scanners.
* Prefer evidence‑first explanations over black‑box rankings.

## Maturity target

Version 1 aims for an internal laboratory tool with:

* Deterministic gap classification and analyst agents.
* A memory layer for prior cases (initially seeded by fixtures).
* A web dashboard and API for board consumption.
* Session replay fixtures to demo the product without live feeds.

Future versions may integrate live feeds, dynamic pattern matching and broker APIs, but those are explicitly out‑of‑scope for v1.

## Why this should exist

The gap‑trading ecosystem is dominated by marketing‑heavy scanners that rarely explain their logic.  Traders are left to guess why a gap might continue or fade.  GapLab fills this void by offering a transparent, evidence‑driven laboratory.  It embraces deterministic event semantics similar to Temporal’s replay model【133263387402436†L118-L170】, emphasising reproducible workflows and explicit state handling.  This fosters trust and encourages traders to learn from both successes and failures.

## First demo proof

The first demo ships with deterministic fixtures of gap cases and a simple morning board.  Running the smoke path seeds catalyst‑tagged gaps, classifies them via the internal agents and displays a board summarising template, confidence and rationale.  A markdown report is generated to document the session.  These fixtures prove the pipeline without claiming real‑time tradability.

## Out‑of‑scope

* Automated order placement or broker integration.
* Intraday scalping algorithms.
* Real‑time data feeds and order book ingestion.
* Predictions of fill probabilities or profit targets.
* Complex UI styling beyond a minimal dashboard.

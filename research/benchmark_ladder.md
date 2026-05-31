# Benchmark Ladder (Accessed 31 May 2026)

This benchmark ladder situates **GapLab** within the broader landscape of data‑driven trading tools.  Each rung compares products in terms of niche, subfield and category.  Citations come from official documentation and release notes.  The ladder highlights what is common, what sets category leaders apart and where GapLab intends to innovate.

## Category‑defining platforms

| Platform | Description & strengths | Evidence |
|---|---|---|
| **QuantConnect LEAN** | A modular, open‑source algorithmic trading engine that supports research, backtesting and live trading in the same codebase【850898716727281†L116-L124】.  LEAN abstracts broker integration and provides plugins for result processing, data‑feed sourcing, transaction handling and realtime event management【850898716727281†L129-L156】.  It sets the bar for research‑to‑live parity in the quant community. | LEAN engine documentation【850898716727281†L116-L156】. |
| **Backtrader** | Python‑based framework emphasising event‑driven execution.  It runs trading logic and broker interactions **event by event** and supports an “event‑only” mode that mimics live behaviour【128527540200510†L291-L299】.  It supports multiple data feeds and built‑in brokers and offers many order types【128527540200510†L317-L323】.  Backtrader is widely used for strategy prototyping but lacks dedicated gap analytics. | Backtrader features【128527540200510†L291-L323】. |
| **VectorBT** | High‑performance backtesting engine that offers both **vectorized simulation** for speed and **event‑driven backtesting** using callbacks【160109905961433†L510-L518】.  It supports optional Rust acceleration and multi‑asset portfolios【160109905961433†L510-L518】.  VectorBT focuses on high‑throughput exploration rather than execution or real‑time guidance. | VectorBT features【160109905961433†L510-L518】. |
| **Freqtrade** | Crypto‑centric bot with **dry‑run** simulation and an optional machine‑learning extension.  The dry‑run mode simulates order placement and wallet balances so traders can observe strategy behaviour without real capital【273988189869681†L1545-L1583】.  Production mode requires exchange API keys and engages real money【273988189869681†L1596-L1613】.  Freqtrade is limited to crypto markets and doesn’t provide equity‑specific context. | Freqtrade documentation【273988189869681†L1545-L1613】. |

## Same‑subfield tools (gap scanners & pre‑market monitors)

| Tool | Focus & usage | Evidence |
|---|---|---|
| **Trade Ideas Gap filter** | Real‑time scanning platform used by active traders.  The **Gap $ Filter** defines the gap as `expected_open − last_price` and updates this approximation from the close through the pre‑market session【70688009657525†L186-L224】.  It allows users to set minimum/maximum thresholds to screen for large gaps and offers example strategies such as **gap‑and‑go**, **gap fill**, **continuation** and **exhaustion**【70688009657525†L186-L324】.  Trade Ideas is a scanner rather than a lab; it does not explain structural context or track classification outcomes over time. | Trade Ideas user guide【70688009657525†L186-L324】. |
| **Finviz pre‑market screener** (not officially cited) | Finviz provides basic pre‑market gap filters but doesn’t publish detailed methodology.  It ranks top movers by percentage change or dollar gap but offers little interpretability and no memory of past cases. | Not directly cited due to limited official documentation. |

## Cross‑domain benchmarks (deterministic event engines)

| Engine | Why it matters | Evidence |
|---|---|---|
| **Temporal Workflows** | Temporal is a general‑purpose workflow engine used in cloud applications.  Each workflow execution records a sequence of events in an **Event History**, and when resuming or replaying, Temporal replays the history to bring the workflow back to the exact same state【133263387402436†L118-L146】.  To achieve determinism, workflows must avoid non‑deterministic operations (e.g., `Date.now()` or random numbers) and instead use replay‑safe APIs【133263387402436†L146-L170】.  This deterministic replay model is a gold standard for consistent event processing in distributed systems. | Temporal workflow documentation【133263387402436†L118-L170】. |

## Key takeaways for GapLab

1. **Gap classification is missing**: None of the category‑defining platforms provide a dedicated module that classifies gaps by catalyst quality, structural context, liquidity or trap signatures.  Even the Trade Ideas gap filter only scans for price differences【70688009657525†L186-L224】 and leaves interpretation to the trader.
2. **Event semantics & determinism**: Backtrader’s event‑driven model【128527540200510†L291-L299】 and Temporal’s deterministic replay【133263387402436†L118-L170】 show that robust systems treat events as primary and avoid hidden state.  GapLab should adopt similar semantics: ingest events (pre‑market prints, catalyst reports, order book changes), produce deterministic classifications and maintain a history for replay.
3. **Simulation vs. reality**: Freqtrade emphasises dry‑run simulation to avoid risking funds【273988189869681†L1545-L1583】; LEAN and Backtrader unify research and live modes.  GapLab will adopt a **session replay** layer: deterministic fixtures allow demonstration when live feeds are unavailable, and results are clearly labelled as hypothetical.
4. **Human‑in‑the‑loop**: Current platforms seldom provide a journalling layer where users can tag whether predictions matched reality.  GapLab will include a simple journal and memory so that the product learns from past classifications rather than acting as a static scanner.
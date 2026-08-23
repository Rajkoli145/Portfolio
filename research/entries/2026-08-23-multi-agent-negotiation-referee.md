---
title: "Multi-Agent Negotiation Referee — Baseline-Calibrated LLM Bargaining Evaluation"
createdAt: "2026-08-23T16:12:49.784Z"
updatedAt: "2026-08-23T16:12:50.196Z"
project: "multi-agent-negotiation-eval"
tags:
  - "ai-agents"
  - "multi-agent-systems"
  - "negotiation-theory"
  - "llm-evaluation"
  - "python"
status: "published"
summary: "Built a deterministic evaluation harness pitting LLM negotiators against scripted game-theoretic baselines (Boulware, Conceder, tit-for-tat), measuring agreement rate, social welfare, and distance-to-Pareto/Nash across N negotiation runs to quantify where LLM agents under/over-perform classical bargaining strategies and fail under budget pressure or manipulation."
---

# Multi-Agent Negotiation Referee — Baseline-Calibrated LLM Bargaining Evaluation

**Date:** [2026-08-23]

## Problem

Most LLM negotiation demos report agent-vs-agent win rates with no ground-truth
reference point — so it's impossible to say whether an LLM negotiator is
actually *good*, or just verbose and confident. Recent research (Microsoft's
Magentic Marketplace, NegotiationArena, and others) has documented specific,
measurable failure modes in LLM bargaining — first-proposal bias, anchoring at
the wrong end of the deal zone, and accepting outcomes that leave value on the
table — but these are rarely quantified against a rigorous baseline.

This project asks a concrete question: **does an LLM negotiator outperform a
simple, decades-old scripted bargaining strategy, and if not, where exactly
does it fail?**

## Approach

I built a deterministic evaluation harness ("the Referee") that runs an LLM
negotiator against a battery of classical, non-LLM baseline strategies in a
controlled bilateral bargaining game (private valuations, a fixed deadline,
incomplete information about the opponent's true limit). Every negotiation
is logged as a structured sequence of offers, then scored against multiple
game-theoretic metrics rather than a single win/loss outcome.

Baselines implemented:
- **Boulware** — concedes minimally until near the deadline, then concedes sharply
- **Conceder** — concedes quickly early, then holds
- **Linear** — concedes at a constant rate every round
- **Tit-for-tat** — mirrors the opponent's last concession
- **Communication-free control** — no dialogue, isolates whether negotiation "talk" adds any value over a blind split

## Architecture

```
┌─────────────────┐     ┌──────────────────┐     ┌─────────────────┐
│  Game Engine     │────▶│  Agent Interface  │────▶│  LLM Negotiator │
│  (private         │     │  propose()/       │     │  (structured     │
│   valuations,      │     │  respond()         │     │   outputs via     │
│   deadline,         │     │                    │     │   function        │
│   disagreement      │     │                    │     │   calling)         │
│   point)            │     └──────────────────┘     └─────────────────┘
│                  │              │
│                  │              ▼
│                  │     ┌──────────────────┐
│                  │────▶│  Scripted         │
│                  │     │  Baselines         │
│                  │     │  (Boulware/         │
│                  │     │   Conceder/TFT)      │
│                  │     └──────────────────┘
└─────────────────┘
         │
         ▼
┌─────────────────┐
│  Referee          │
│  (post-hoc         │
│   metric            │
│   computation:       │
│   Pareto/Nash         │
│   distance,            │
│   welfare, fairness)    │
└─────────────────┘
```

**Design decision:** the game engine and referee are entirely deterministic
Python — only the negotiators themselves are LLM-driven. This keeps utilities
ground-truth and metric computation unambiguous, and means the evaluation
harness itself has zero non-determinism to debug.

Offers are exchanged as structured JSON (via [OpenAI structured outputs /
function calling]) rather than free text, so a "binding offer" (price,
quantity, accept/reject) is cleanly separable from any surrounding
natural-language reasoning the LLM produces. This avoids the failure mode of
having to LLM-parse an LLM's own offer.

**Model used:** [e.g., GPT-4.1-nano / GPT-4.1-mini]
**Runs per matchup:** [N]
**Negotiation scenario(s):** [e.g., single-issue price bargaining / multi-issue buyer-seller]

## Evaluation

Every completed (or failed) negotiation is scored on:

| Metric | What it measures |
|---|---|
| Agreement rate | % of negotiations that reach a deal before the deadline |
| Individual utility | Each side's payoff, normalized 0–1 against its private valuation range |
| Social welfare | Sum of both sides' utilities — did the deal create value, not just split it |
| Distance to Pareto frontier | How far the outcome is from the best deals theoretically available — high distance means value was left on the table |
| Distance to Nash Bargaining Solution | Among efficient deals, how far from the "fair" balanced point |
| Fairness (payoff gap) | \|utility_A − utility_B\| — was the deal lopsided |

## Results

[Fill in once runs are complete. Suggested format:]

- Agreement rate: LLM vs. Boulware = **[X]%**, LLM vs. Conceder = **[X]%**, LLM vs. TFT = **[X]%**
- Average social welfare: LLM negotiator = **[X]**, vs. Boulware-vs-Boulware control = **[X]**
- Average distance-to-Pareto: **[X]%** — [interpretation, e.g., "the LLM left an average of X% of available surplus on the table compared to the efficient frontier"]
- Where the LLM beat the baseline: [describe specific matchup/condition]
- Where the LLM lost to the baseline: [describe specific matchup/condition]

[Include a plot or table here once you have real data — bar chart of welfare
by matchup, or a scatter of achieved outcomes against the Pareto frontier, is
the strongest visual for this kind of write-up.]

## Failure Modes

Observed and quantified failure patterns:

- **Anchoring at the wrong end** — [did the LLM anchor near its own opening
  offer regardless of leverage, or did it concede toward the opponent's floor
  too readily? Cite specific transcript example.]
- **Dominated-offer acceptance** — [did the LLM accept an offer when a
  strictly better one, for both sides, was still reachable?]
- **Non-termination / stalling** — [did any negotiations run out the clock
  without agreement due to excessive politeness or repeated re-proposals?]
- **Structured-output failures** — [did the LLM ever emit a malformed or
  self-contradictory offer, e.g., proposing a price outside its own stated range?]

## Latency & Cost

- Average tokens per negotiation: **[X]** (input) / **[X]** (output)
- Average cost per negotiation run: **$[X]**
- Total cost for full evaluation sweep (N runs × M matchups): **$[X]**
- Average wall-clock time per negotiation: **[X]s**

## Trade-offs

- **Why distance-to-Pareto over simple win rate?** Win rate is zero-sum and
  rewards extracting value from the opponent, not creating it; Pareto distance
  captures whether both sides could have done better simultaneously.
- **Why these specific baselines?** Boulware, Conceder, and tit-for-tat are
  canonical time-dependent and behavior-dependent strategies from the
  automated-negotiation literature — they isolate whether an LLM's
  flexibility and reasoning actually buy anything over simple, well-understood
  concession curves.
- **Why structured outputs instead of free-text parsing?** Removes ambiguity
  in what counts as a "binding" offer, at the cost of constraining how
  naturally the LLM can express reasoning alongside its offer.
- **Why a fixed deadline / private valuations?** Makes utilities and Pareto
  frontiers computable in closed form; a more open-ended scenario would be
  more realistic but harder to score rigorously.

## What I'd Explore Next

[e.g., "Add a mediator layer to test whether first-proposal bias
(documented in Magentic Marketplace) can be measurably reduced" — or
whichever of the other four project ideas you plan to build as a follow-up.]

---

*Code: [GitHub link]*
*Related work: NegotiationArena (Bianchi et al., ICML 2024), Magentic
Marketplace (Microsoft Research, 2025)*
---
title: "Multi-Agent Negotiation Referee — Baseline-Calibrated LLM Bargaining Evaluation"
createdAt: "2026-08-23T17:33:12.078Z"
updatedAt: "2026-08-23T17:33:12.231Z"
project: "multi-agent-negotiation-eval"
tags:
  - "ai-agents"
  - "multi-agent-systems"
  - "negotiation-theory"
  - "llm-evaluation"
  - "python"
notes:
  - "|-"
status: "published"
summary: ""
---

## What is this project even about, in one sentence?
    
    We're building two AI "agents" — think of them as two chatbots — and giving one the role of **buyer** and the other **seller**. They go back and forth making offers ("I'll pay $700", "No, $900", "$750?") until they either agree on a price or give up. This project studies *how* they negotiate, and builds a way to *measure* whether the deal they reached was actually a good one.
    
    That's it. Everything below is just unpacking that one sentence.
    
    ## Why is this even hard? Why can't they just... agree instantly?
    
    Because each side has a **secret number** the other can't see.
    
    - The buyer secretly thinks: *"I really don't want to pay more than $1000."*
    - The seller secretly thinks: *"I really can't accept less than $700."*
    
    Neither one says this number out loud — that would ruin the whole game, they'd just split the difference and be done in one message. Instead, each side has to guess, test the water, and decide what to offer *without* knowing the other's true limit. That not-knowing is what makes it an actual negotiation instead of simple math.
    
    ## Part 1: "Concession Strategy" — just means "how do I decide what to offer next?"
    
    Every single round, each side has to answer one question: *"Do I hold firm and barely move, or do I jump toward the middle?"*
    
    That habit — how someone gives ground during back-and-forth — is called a **concession strategy**. Don't let the fancy name scare you; you already know these personalities from real life. You've met all four of these people before:
    
    **🐢 The stubborn one ("Boulware")**
    Barely moves for most of the conversation. Holds their ground, holds their ground... and then suddenly caves right at the very last second, like someone who "wins" an argument by outlasting the other person's patience.
    
    **🐇 The eager one ("Conceder")**
    Gives up most of their position almost immediately. This is the friend who says "sure, wherever you want to eat!" within the first two messages.
    
    **📏 The steady one ("Linear")**
    Moves a little bit closer to the middle every single time, at the exact same pace. No games, no drama — just a straight, predictable path from their opening position to their limit.
    
    **🪞 The mirror ("Tit-for-tat")**
    Doesn't have their own plan at all — they just copy you. If you give a little ground, they give the same amount back. If you don't budge, neither do they.
    
    That's genuinely it. Researchers gave these behaviors formal-sounding names (Boulware, Conceder, etc.) decades ago, but they're describing exactly the personalities above. **When you build the project, each of these becomes a tiny bit of code** that decides "what number do I say next" — nothing more mysterious than that.
    
    *(If you want to see the actual math formula behind these later, it's one simple equation where a single number — call it the "stubbornness dial" — controls whether you get Boulware, Linear, or Conceder. But you genuinely don't need the formula to understand or even build this — the personality description above is 90% of what matters.)*
    
    ---
    
    ## Part 2: Once they agree on a price... how do you know if it was a *good* deal?
    
    This is the part most people skip, and it's actually the most important part of your whole project. Here's why it matters:
    
    Imagine the buyer and seller land on $850. Cool, they agreed! But... **was $850 actually a smart number for both of them?** Or could they have found a different number where *both* people would've been happier?
    
    That question — "did they find the smartest possible deal, or did they leave value on the table?" — is what **Pareto** is about. And a second question — "was the deal actually fair, or did one side basically win?" — is what **Nash** is about.
    
    Let's go slow on both.
    
    ### Pareto — "Could they have done better, for BOTH sides, with a different number?"
    
    Here's the test, in plain English: **Is there some other deal out there where one person does better, and nobody does worse?** If yes — the deal they picked wasn't smart, they left free value sitting on the table. If no such better deal exists — the deal was "efficient" (this is what "Pareto optimal" means — nothing more than "no leftover value being wasted").
    
    **When it's just ONE thing being negotiated (like only price):** this almost never happens. If it's only about price, every dollar the buyer saves is a dollar the seller loses — it's a strict tug of war. There's no "smarter" version of that trade; someone always loses what the other gains. So in a single-price negotiation, basically any agreed price is already about as efficient as any other.
    
    **Where it actually gets interesting is when there's MORE than one thing being negotiated.** Say the deal includes both *price* AND *delivery speed*. Now imagine:
    
    - The buyer doesn't care that much about price, but *really* needs it delivered fast.
    - The seller doesn't care that much about delivery speed, but *really* needs a solid price.
    
    If they land on "okay price, okay speed" (a middle-of-the-road compromise on both) — that's actually a **bad** deal for both of them! Here's why: there's a smarter deal sitting right there — *"seller keeps their good price (what they actually cared about), buyer gets the fast shipping (what they actually cared about)"* — and suddenly both people end up happier, without either one giving up something they truly wanted.
    
    **That's the real "aha" here:** bad, inefficient deals usually happen because people split everything down the middle instead of noticing *"wait, you care about X and I care about Y — let's each just get what we actually want."*
    
    **So "distance to Pareto" simply means:** how far the real deal is from the smartest possible deal that was available. Small distance = they found the clever trade-off. Big distance = they compromised lazily and both sides lost value for no reason.
    
    ### Nash — "Okay it was smart, but was it FAIR?"
    
    Pareto only tells you if a deal was *efficient* — it says nothing about who "won" more. There are usually a bunch of different efficient deals possible, and some of them massively favor one side (e.g., a deal where the buyer gets 95% of the value and the seller only gets 5% can still technically be "efficient" if no better trade-off exists).
    
    The **Nash Bargaining Solution** is basically: *out of all those possible smart deals, which one is the most balanced?*
    
    How do you find it mathematically? You take how much each side gained, and instead of adding those numbers, you **multiply** them:
    
    ```
    (how much the buyer gained) × (how much the seller gained)
    ```
    
    **Why multiply instead of add?** Because multiplying punishes unfair splits way harder than adding does. Quick example:
    
    - A lopsided deal (buyer gets 90% of the value, seller gets only 10%): 0.9 × 0.1 = **0.09**
    - A balanced deal (both get 50%): 0.5 × 0.5 = **0.25**
    
    Even though both add up to 1.0 total value either way, the *balanced* one scores way higher when you multiply. That math trick is exactly why the Nash solution is considered "the fair point" — fairness is baked directly into the formula, not just a nice idea layered on top.
    
    **So "distance to Nash" simply means:** how far the real deal landed from that balanced, fair point. Small distance = pretty fair. Big distance = somebody basically steamrolled the other.
    
    ---
    
    ## Bringing it all together — what this actually lets you say
    
    Without these ideas, the only thing you could ever report is: *"the two AIs agreed on $850."* Cool story, but so what?
    
    With Pareto and Nash distance, you can say something like this instead:
    
    > *"The AI agent's deals were only 8% away from the smartest possible outcome — so it's genuinely good at finding clever trade-offs. But they were 35% away from the fair, balanced point — meaning the seller basically won the negotiation almost every time."*
    
    That one sentence tells a complete, useful story: the AI negotiates *smart*, but not *fair* — and now you know exactly what to go fix next (probably something about how it opens the negotiation or how easily it gets talked down).
    
    ---
    
    ## TL;DR — if you remember nothing else
    
    - **Concession strategy** = the personality someone uses to decide what to offer next (Stubborn/Boulware, Eager/Conceder, Steady/Linear, or Mirror/Tit-for-tat)
    - **Pareto distance** = "did they find the smartest deal, or leave value on the table?"
    - **Nash distance** = "out of the smart deals, did they land on the fair one, or did someone dominate?"
    - Put together, these two numbers let you judge a negotiation's *quality*, not just whether it happened.
status: "draft"
summary: ""
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
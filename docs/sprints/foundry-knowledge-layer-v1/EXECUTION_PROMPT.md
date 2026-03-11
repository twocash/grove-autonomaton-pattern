# Execution Prompt — Knowledge Layer

Read `docs/sprints/foundry-knowledge-layer-v1/SPEC.md` for full context. Two files change. No architectural shifts.

## Pre-Execution

```bash
cd C:\GitHub\grove-autonomaton-pattern
npm run build   # Must pass before starting
npm run lint
```

Read these files first:
1. `src/config/signal-watch-recipe.ts` — You're adding 3 entries to the files array
2. `src/utils/recipe-generator.ts` — You're adding a knowledge section grouping

## Step 1: Add knowledge files to signal-watch-recipe.ts

Open `src/config/signal-watch-recipe.ts`. Find the `files` array in `SIGNAL_WATCH_RECIPE`. Add these 3 entries AFTER the existing recipe files (after `index.ts`), BEFORE the array closing bracket:

### Entry 1: competitive-landscape.md


```typescript
{
  filename: 'knowledge/competitive-landscape.md',
  description: 'Current AI competitive landscape — update quarterly',
  content: `<!-- KNOWLEDGE FILE: competitive-landscape.md
     Pipeline role: Loaded as context during Recognition and Compilation stages.
     Shapes: Briefing relevance scoring, signal classification, entity context.
     
     This is a static markdown file. In production, replace with:
     - A RAG query against your document store
     - A Notion database export
     - A scheduled scrape of industry reports
     - Any source that returns markdown text
     
     The pipeline doesn't care where the text comes from.
     It just reads markdown and injects it as context. -->

# AI Competitive Landscape — Q1 2026

## Market Structure

Five companies control the frontier model layer: OpenAI, Anthropic, Google DeepMind, Meta AI, and xAI. The market is consolidating around two dynamics: raw model capability (measured by benchmarks) and distribution (measured by API adoption and enterprise deals).

## Active Dynamics

**The Pricing War.** Anthropic and Google are aggressively undercutting OpenAI on API pricing. Claude Sonnet 4 at $3/MTok forced OpenAI to respond with GPT-4o-mini. The floor hasn't been found yet.

**Open vs. Closed.** Meta's Llama strategy is working — open-weight models are capturing the self-hosted enterprise segment. This compresses margins for closed providers.

**The Agentic Shift.** All major providers are pivoting from "chat" to "agent" framing. Claude Code, OpenAI Codex, Google Jules. The battleground is moving from model quality to tool integration.

**Regulatory Pressure.** EU AI Act enforcement begins August 2026. Colorado AI Act effective June 2026. Companies without auditability infrastructure face compliance risk.

## Scoring Context

When evaluating competitive position shifts:
- A pricing move > 30% is structurally significant (Yellow/Red zone)
- A new model release shifts scores only if benchmarks show category change
- Partnership announcements rarely shift scores unless they involve exclusive distribution
- Talent moves matter at VP+ level or when involving >20 researchers`
},
```

### Entry 2: scoring-methodology.md

```typescript
{
  filename: 'knowledge/scoring-methodology.md',
  description: 'Scoring framework — five factors, delta interpretation, signal vs. noise',
  content: `<!-- KNOWLEDGE FILE: scoring-methodology.md
     Pipeline role: Loaded during Compilation when generating score adjustments.
     Shapes: Delta magnitude, confidence levels, zone classification rationale.
     
     Replace with your domain's evaluation framework.
     Examples: investment thesis criteria, clinical trial endpoints, 
     supply chain risk factors, legal precedent weighting. -->

# Competitive Position Scoring — Methodology

## The Five Factors

Score each entity on these dimensions (weights sum to 1.0):

| Factor | Weight | What It Measures |
|--------|--------|-----------------|
| Market Position | 0.30 | Current share, revenue, customer base |
| Technical Capability | 0.25 | Model quality, tooling, infrastructure |
| Distribution Strength | 0.20 | API adoption, partnerships, platform lock-in |
| Talent Density | 0.15 | Research team depth, leadership, hiring momentum |
| Capital Access | 0.10 | Funding, revenue trajectory, runway |

## Delta Interpretation

| Delta Range | Meaning | Zone | Action |
|-------------|---------|------|--------|
| < 0.02 | Noise | Green | Auto-archive |
| 0.02 - 0.05 | Noteworthy | Green | Log, include in routine briefing |
| 0.05 - 0.10 | Significant | Yellow | Draft briefing, propose adjustment |
| 0.10 - 0.15 | Major | Yellow | Priority briefing, immediate review |
| > 0.15 | Structural | Red | Full strategic briefing, human decides |

## What Shifts Scores (and What Doesn't)

**Score-shifting events:**
- Funding round > $500M (capital access)
- Benchmark category change on 3+ evaluations (technical capability)
- Enterprise deal with Fortune 100 company (distribution)
- VP+ leadership change at competitor (talent density)
- Pricing change > 30% (market position)

**NOT score-shifting (common false signals):**
- Blog post announcements without shipping product
- Benchmark improvements within same category
- Hiring individual contributors (unless > 20 in a quarter)
- Conference demos without GA timeline
- Social media hype cycles`
},
```

### Entry 3: contrarian-lens.md

```typescript
{
  filename: 'knowledge/contrarian-lens.md',
  description: 'Adversarial analysis framework — forces the bear case before any strategic briefing',
  content: `<!-- KNOWLEDGE FILE: contrarian-lens.md
     Pipeline role: Loaded during Tier 3 strategic analysis.
     Shapes: Red Zone briefings, structural event analysis.
     
     This lens is optional but powerful. It forces the system to 
     argue against its own conclusions before presenting them.
     
     Replace with your domain's adversarial framework:
     - Devil's advocate criteria for investment decisions
     - Failure mode analysis for engineering assessments  
     - Opposing counsel arguments for legal analysis -->

# Contrarian Analysis Framework

## The Three Questions

Before any strategic briefing is finalized, address:

1. **What would make the consensus wrong?**
   If everyone agrees Company X is winning, what evidence would flip that?
   Look for: hidden dependencies, single points of failure, regulatory exposure.

2. **Who benefits from this narrative?**
   Every market story has a narrator. Who planted this signal?
   Look for: PR timing relative to funding rounds, strategic leaks, competitive misdirection.

3. **What's the second-order effect?**
   If this event plays out as expected, what happens next that nobody's pricing in?
   Look for: supply chain effects, talent migration, platform dependencies.

## Contrarian Indicators

Flag these patterns — they often precede consensus-breaking events:

- **Unanimous bullishness** on a player → look for the bear case
- **Pricing moves framed as "generous"** → usually defensive, not offensive
- **"Partnership" announcements** with no technical integration → often vaporware
- **Talent departures explained as "personal reasons"** → dig deeper
- **Benchmark improvements on self-selected evaluations** → check independent evals

## Application

When generating a strategic (Red Zone) briefing:
1. State the consensus interpretation
2. Apply the three questions
3. Present the contrarian case with equal weight
4. Let the human decide which frame is correct`
},
```

---

## Step 2: Update recipe-generator.ts with knowledge section grouping

Open `src/utils/recipe-generator.ts`. Find where it iterates over `recipe.files` to generate markdown sections.

Add logic to detect knowledge files (path starts with `knowledge/`) and group them under a distinct header. Before rendering the first knowledge file, inject:

```markdown
---

## Knowledge Layer

> These markdown files are loaded as context during analysis.
> They shape HOW the system thinks, not WHAT it monitors.
> Replace them with your domain expertise, a RAG endpoint,
> a Notion export, or any markdown source. The pipeline reads it the same way.
```

For knowledge files (`.md` extension), use a `markdown` language tag on the code fence instead of `typescript`.

## Step 3: Build and verify

```bash
npm run build
npm run lint
npm run dev
```

Manual verification:
1. Navigate to Foundry
2. Click "Load Example"
3. Compile
4. Click "Download Recipe Bundle (.md)"
5. Open the bundle — verify "Knowledge Layer" section exists with 3 files
6. Verify each file has the `<!-- KNOWLEDGE FILE -->` header
7. Verify content is substantive (real companies, real factors, real framework)
8. Verify existing config/state files are unchanged

## Step 4: Commit

```bash
git add -A
git commit -m "feat: knowledge layer — competitive landscape, scoring methodology, contrarian lens"
```

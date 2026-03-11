# Autonomaton Foundry — Requirements Template v1.0

> **Purpose:** Paste this into the Foundry at the-grove.ai/autonomaton to generate a Sovereign Manifesto and full application. This template was reverse-engineered from Signal Watch (the first recipe to pass 9/9 architectural claims end-to-end).
>
> **How to use:** Replace the content in each section with your domain. Sections marked `[REQUIRED]` must be filled. Sections marked `[ENRICHMENT]` improve output quality but have sensible defaults. Delete the `[EXAMPLE]` blocks before pasting — they're reference only.

---

## Section 1: Domain Problem Statement [REQUIRED]

**What domain is this autonomaton monitoring, managing, or processing?**

Describe the domain in 2-4 sentences. Name the core activity. Name who uses it. Name what decisions it supports.

```
[EXAMPLE — Signal Watch]
Competitive intelligence monitoring for the AI industry. Tracks companies,
technologies, and market shifts. Used by strategists and executives to
detect score-shifting events before they hit mainstream analysis. Supports
investment timing, partnership evaluation, and strategic positioning decisions.
```

**Your domain:**

```
[PASTE YOUR DOMAIN DESCRIPTION HERE]
```

---

## Section 2: Entity Model [REQUIRED]

**What are you watching, tracking, or processing?**

An entity is the core unit your autonomaton observes. Signal Watch tracks "subjects" (companies like OpenAI, Anthropic). A legal autonomaton might track "cases." A research autonomaton might track "papers" or "hypotheses."

### 2.1 — Entity Definition

| Field | Description | Your Domain |
|-------|-------------|-------------|
| **Entity name** | What do you call the things you track? | _e.g., "Subject", "Case", "Asset"_ |
| **Entity types** | What categories exist? | _e.g., competitor, partner, technology_ |
| **Entity tiers** | How do you prioritize? | _e.g., primary, secondary, emerging_ |
| **Key attributes** | What data does each entity carry? | _e.g., name, score, keywords, aliases_ |

```
[EXAMPLE — Signal Watch]
Entity: WatchlistSubject
Types: competitor | partner | market | technology | regulatory
Tiers: primary | secondary | emerging
Attributes:
  - id: unique slug (e.g., "openai")
  - name: display name (e.g., "OpenAI")
  - type: one of the types above
  - tier: priority classification
  - baselineScore: 0.0-1.0 competitive position
  - keywords: array of matching terms (e.g., ["openai", "gpt", "chatgpt", "sam altman"])
  - aliases: alternative names
  - sources: configured data feeds
  - history: timestamped score changes with provenance
```

### 2.2 — Observation Definition

An observation is raw input about an entity. Signal Watch calls these "signals." A legal autonomaton might call them "filings." A research autonomaton might call them "citations."

| Field | Description | Your Domain |
|-------|-------------|-------------|
| **Observation name** | What do you call raw inputs? | _e.g., "Signal", "Filing", "Reading"_ |
| **Source types** | Where do observations come from? | _e.g., rss, api, webhook, manual_ |
| **Classification levels** | How do you triage? | _e.g., routine, significant, critical_ |

```
[EXAMPLE — Signal Watch]
Observation: ClassifiedSignal
Source types: rss | api | webhook | manual
Classification: routine | significant | critical
Key fields:
  - relevance: 0.0-1.0 (how relevant to watchlist)
  - novelty: 0.0-1.0 (how new is this information)
  - threatLevel: routine | significant | critical
  - subjects: array of matched entities with proposed score deltas
  - confidence: model's self-assessed accuracy
```

### 2.3 — Analysis Definition

An analysis is what the system produces from observations. Signal Watch calls these "briefings." A legal autonomaton might produce "memoranda." A research tool might produce "synthesis reports."

| Field | Description | Your Domain |
|-------|-------------|-------------|
| **Analysis name** | What do you call system output? | _e.g., "Briefing", "Memo", "Report"_ |
| **Analysis types** | What levels of urgency? | _e.g., routine, significant, strategic_ |
| **Key components** | What does each analysis contain? | _e.g., summary, highlights, recommendations_ |

```
[EXAMPLE — Signal Watch]
Analysis: Briefing
Types: routine | significant | strategic
Components:
  - title: headline describing the finding
  - summary: 2-3 sentence overview
  - highlights: key facts with zone indicators
  - recommendations: prioritized action items (high/medium/low)
  - pendingAdjustments: proposed entity score changes (Yellow Zone — require approval)
  - research: web-sourced evidence section with cited URLs
  - zone: governance classification of the briefing itself
```

### 2.4 — Dimension Definition

A dimension is the measurable axis your entities are scored on. Signal Watch uses a single 0.0-1.0 "competitive position" score. Your domain might have multiple dimensions.

| Field | Description | Your Domain |
|-------|-------------|-------------|
| **Dimension name** | What are you measuring? | _e.g., "Competitive Score", "Risk Level"_ |
| **Scale** | What's the range? | _e.g., 0.0-1.0, 1-10, letter grades_ |
| **Delta thresholds** | What change magnitudes matter? | _e.g., <0.05 routine, 0.05-0.15 significant_ |

```
[EXAMPLE — Signal Watch]
Dimension: Competitive Position Score
Scale: 0.0-1.0
Delta thresholds:
  - GREEN:  delta < 0.05 (routine, auto-process)
  - YELLOW: 0.05 ≤ delta < 0.15 (significant, human approves)
  - RED:    delta ≥ 0.15 (structural event, human decides everything)
```

---

## Section 3: Zone Governance [REQUIRED]

**What should the system do autonomously vs. with permission vs. never?**

Zone governance maps directly to the Autonomaton's Green/Yellow/Red model. This section defines what actions live in each zone FOR YOUR DOMAIN.

### 3.1 — Green Zone (Autonomous)

Actions the system executes without asking. These earn autonomy through repeated safe execution.

```
[EXAMPLE — Signal Watch]
Green Zone allows:
  - Log briefings to archive
  - Update telemetry / write audit entries
  - Archive low-relevance signals
  - Fetch RSS/API feeds on schedule
  - Apply learned keyword filters
  - Execute cached skills (Tier 0)
  - Classify signals by keyword match (Tier 1)
  - Compile routine briefings with no score adjustments (Tier 1)
  - Quick relevance scoring on new signals (Tier 1)

Green Zone forbids:
  - Updating baseline entity scores
  - Sending alerts
  - Recommending strategic actions
```

**Your Green Zone:**

```
[PASTE YOUR GREEN ZONE ACTIONS HERE]
```

### 3.2 — Yellow Zone (Supervised)

Actions the system proposes but a human approves. Where trust is building.

```
[EXAMPLE — Signal Watch]
Yellow Zone allows (with proposal):
  - Draft briefings with proposed score adjustments
  - Classify novel/unrecognized signals (Tier 2)
  - Multi-entity correlation analysis (Tier 2)
  - Ad-hoc user-requested scans with web research (Tier 2)
  - Analyze score-shifting events (Tier 3)
  - Historical pattern analysis (Tier 3)

Yellow Zone requires explicit approval for:
  - Updating baseline entity scores
  - Promoting a pattern to a cached skill
  - Modifying source reliability ratings
  - Adding new entities to the watchlist
  - Changing domain configuration
```

**Your Yellow Zone:**

```
[PASTE YOUR YELLOW ZONE ACTIONS HERE]
```

### 3.3 — Red Zone (Human Only)

The system surfaces information. Humans decide. Some things stay manual by design.

```
[EXAMPLE — Signal Watch]
Red Zone (human decision required for ALL actions):
  - Compile strategic briefings with tier-crossing implications
  - Surface strategic implications for human decision

Red Zone forbidden (NEVER auto-execute):
  - Suggest investment decisions
  - Recommend strategic pivots
  - Auto-execute anything when delta ≥ 0.15

Governance lock: Red Zone operations NEVER become skills.
The Skill Flywheel does not turn in Red.
```

**Your Red Zone:**

```
[PASTE YOUR RED ZONE ACTIONS HERE]
```

---

## Section 4: Cognitive Routing [REQUIRED]

**What intents does your system handle, and at what tier?**

Map every action to a tier (0-3) and zone. This becomes the `routing.config` — the Cognitive Router's brain.

### Tier Reference

| Tier | Cost | Sovereignty | Use for |
|------|------|-------------|---------|
| 0 | Free | Local | Cached skills, deterministic rules, keyword matches |
| 1 | Low | Cloud (cheap) | Simple classification, routine compilation |
| 2 | Medium | Cloud (standard) | Complex analysis, novel classification, research |
| 3 | High | Cloud (apex) | Strategic analysis, historical pattern recognition |

### Intent Map

List your intents. For each: name, tier, zone, description, trigger keywords.

```
[EXAMPLE — Signal Watch, abbreviated]
Tier 0 / Green:
  - fetch_rss: Pull from configured feeds
  - apply_keyword_filters: Match signals to entities
  - execute_skills: Fire cached patterns
  - log_telemetry: Write audit entry
  - archive_low_relevance: Auto-archive noise

Tier 1 / Green:
  - classify_keyword_signals: Tag signals by keyword
  - compile_routine_briefing: Daily digest, no adjustments
  - quick_relevance: Fast triage scoring

Tier 2 / Yellow:
  - classify_novel_signals: Signals without keyword match
  - multi_subject_correlation: Cross-entity pattern detection
  - ad_hoc_scan: User-requested research (web search enabled)
  - brief_me_on: Subject-specific research briefing
  - update_baseline_scores: Change entity scores (requires approval)
  - promote_skill: Move pattern to Tier 0 (requires approval)

Tier 3 / Yellow:
  - analyze_score_shifting_events: Major event impact analysis
  - historical_patterns: Trend prediction from history

Tier 3 / Red:
  - strategic_briefing: Structural event with tier implications
  - surface_implications: Present strategic options
  - suggest_investment_decisions: FORBIDDEN
  - recommend_strategic_pivots: FORBIDDEN

Fallback:
  - ad_hoc_query: Tier 2 / Yellow (unmapped user input)
```

**Your Intent Map:**

```
[PASTE YOUR INTENT MAP HERE]
```

---

## Section 5: Views & Interaction [ENRICHMENT]

**What does the user see and do?**

Define the views your application needs. Each view maps to a pipeline stage or governance function. If omitted, the Foundry generates default views from your entity model.

### 5.1 — View Registry

```
[EXAMPLE — Signal Watch]

Dashboard (pipeline: telemetry, zone: green, priority: 1)
  Primary orientation surface.
  Shows: entity summary cards with scores and deltas, recent pipeline activity,
  system health (ratchet position, cost trend, skill count), tier distribution chart.

Briefing Inbox (pipeline: recognition + compilation, zone: green/yellow, priority: 2)
  Two-pane layout: list on left, detail on right.
  Shows: chronological briefing feed with zone indicators (green/yellow/red badges),
  drill-down to full briefing with highlights, research sources, recommendations.
  Yellow briefings show approval controls for pending score adjustments.
  Red briefings show "Red Zone Takeover" — full-screen with context for human decision.

Watchlist (pipeline: telemetry, zone: green, priority: 3)
  Entity management surface.
  Shows: all tracked entities with current scores, type badges, tier indicators.
  Drill-down shows: entity profile, observation timeline, score history chart,
  related briefings.

Config Editor (pipeline: compilation, zone: yellow, priority: 4)
  Governance surface — edit zones, routing, voice presets.
  Shows: YAML-style editable routing config (intent → tier/zone mapping),
  zones schema display, voice preset selector with live preview.
  Changes are Yellow Zone — require explicit save action.

Flywheel (pipeline: execution, zone: yellow, priority: 5)
  Self-improvement surface.
  Shows: skill proposals (patterns detected, approval status),
  ratchet chart (tier distribution over time),
  cost evaporation trend (savings from skill promotion).

Telemetry Stream (pipeline: telemetry, zone: green, priority: 6)
  Audit surface — every pipeline decision visible and exportable.
  Shows: real-time trace feed with zone/tier/intent indicators,
  filter controls (by zone, tier, entity, time range),
  drill-down to individual trace entries with full provenance.
```

### 5.2 — Layout

```
[EXAMPLE — Signal Watch]

Overall layout:
┌──────────────────────────────────────────────────────────────┐
│ Header: Logo, version, API key config, mode indicator        │
├──────────────────────────────────────────────────────────────┤
│ Navigation: Tab bar (Dashboard | Briefings | Config | Flywheel) │
├──────────────────────────────────────────────────────────────┤
│ Pipeline Visualization: 5-stage horizontal flow with state   │
├──────────┬───────────────────────────────────┬───────────────┤
│ Signal   │ Main Content Area (2/3 width)     │ Watchlist     │
│ Feed     │ (view-dependent)                  │ Sidebar       │
│ (toggle) │                                   │ (1/3 width)   │
├──────────┴───────────────────────────────────┴───────────────┤
│ Command Bar: Ad-hoc query input with voice preset indicator  │
├──────────────────────────────────────────────────────────────┤
│ Telemetry Stream: Collapsible audit log                      │
└──────────────────────────────────────────────────────────────┘

Navigation: Tab bar
Primary views: Dashboard, Briefings
Secondary views: Config, Flywheel
Persistent elements: Pipeline viz, Command bar, Telemetry stream
```

### 5.3 — Interaction Patterns

```
[EXAMPLE — Signal Watch]

Command Bar:
  - Primary input surface for ad-hoc queries
  - Supports natural language: "brief me on Anthropic" triggers Tier 2 research
  - Training mode: first use asks domain questions, then accepts entity names
  - Operational mode: processes scans against configured watchlist

Approval Flow:
  - Score adjustments appear as Yellow badges on briefings
  - Approve/Reject buttons with one-click action
  - Approval records human identity and timestamp in telemetry
  - Rejection feeds back to recognition (system learns what doesn't pass)

Entity Management:
  - Add entity: Yellow Zone — system researches via LLM, proposes profile, human approves
  - Remove entity: Red Zone — archived (never deleted), historical data preserved

Training Mode:
  - Phase 1: Domain configuration (industry + tracking preferences → LLM generates config)
  - Phase 2: Entity seeding (user names entities → LLM researches → human approves each)
  - Phase 3: Operational (training complete, full functionality unlocked)

Red Zone Takeover:
  - Critical briefings get full-screen treatment
  - All context visible: what happened, why it matters, what the options are
  - No auto-actions available — human decides everything
```

---

## Section 6: Voice & Personality [ENRICHMENT]

**How does the system communicate?**

Voice presets control output style without changing what the system knows. If omitted, defaults to a neutral analytical voice.

```
[EXAMPLE — Signal Watch]

Three presets, switchable at any time:

Strategic Analyst (default):
  - Lead with insight — "so what?" first
  - No hedging (avoid "potentially", "possibly")
  - Active voice always
  - Strategic framing — tie to business impact
  Preview: "Anthropic's 50% price cut repositions Claude as the cost-performance
  leader. This is a market share play aimed directly at OpenAI's enterprise base."

Executive Brief:
  - Bottom Line Up Front (BLUF)
  - Three bullets maximum
  - Decision-ready — end with clear recommendation
  - Numbers first — lead with metrics
  Preview: "ACTION REQUIRED: Anthropic pricing now 50% below OpenAI.
  • Enterprise cost: -$2.4M/year at current volume
  • Migration risk: Low (API compatible)
  • Recommendation: Pilot Claude on Tier 2 workloads"

Operator Log:
  - Terse facts only, no interpretation
  - Timestamp everything
  - Numbered list format for findings
  - Zero narrative sentences
  Preview: "[2024-03-09T14:32Z] PRICE_CHANGE
  anthropic/claude-3.5-sonnet: -50% to $3/MTok
  source: official_blog | confidence: HIGH"
```

**Your voice presets (or "default" for neutral):**

```
[PASTE YOUR VOICE PRESETS OR "default"]
```

---

## Section 7: Seed Data [ENRICHMENT]

**What should the app look like on first load?**

Seed data makes the app alive immediately. Without it, new users see empty states. If omitted, the Foundry generates minimal placeholder data from your entity model.

```
[EXAMPLE — Signal Watch]

Default watchlist: 5 AI competitors
  - OpenAI (primary, score: 0.85, keywords: openai/gpt/chatgpt/sam altman/o1/o3)
  - Anthropic (primary, score: 0.80, keywords: anthropic/claude/dario amodei)
  - Google DeepMind (primary, score: 0.82, keywords: google/deepmind/gemini)
  - Meta AI (secondary, score: 0.72, keywords: meta ai/llama/yann lecun)
  - xAI (emerging, score: 0.65, keywords: xai/grok/elon musk ai)

Demo briefings: Pre-loaded for Demo Mode (no API key required)
  - 3 routine briefings (Green Zone)
  - 2 significant briefings with pending adjustments (Yellow Zone)
  - 1 structural event briefing (Red Zone)

Demo signals: Pre-classified signal feed showing the pipeline in action
```

---

## Section 8: Knowledge Layer [ENRICHMENT]

**What domain expertise should inform the system's analysis?**

Markdown files loaded as context during compilation. These shape HOW the system analyzes, not WHAT it monitors.

```
[EXAMPLE — Signal Watch]

worldviews/contrarian-lens.md
  "What's the bear case? What would make the consensus wrong?"

worldviews/regulatory-lens.md
  "What are the compliance implications? Who regulates this?"

frameworks/scoring-criteria.md
  "How to evaluate competitive position: market share, technical capability,
  distribution strength, talent density, capital access."

context/competitive-landscape.md
  "Current state of the AI industry as of [date]. Key dynamics, recent shifts,
  structural trends."
```

**Your knowledge files (or "none" to skip):**

```
[DESCRIBE YOUR KNOWLEDGE FILES OR "none"]
```

---

## Section 9: Theme [ENRICHMENT]

**What should it look like?**

| Setting | Options | Default |
|---------|---------|---------|
| **Mood** | industrial-dark, clean-light, editorial, warm | industrial-dark |
| **Accent color** | Any hex color | #D4621A (Grove amber) |
| **Typography** | all-sans, monospace-headers-sans-body, serif-headers-sans-body | monospace-headers-sans-body |
| **Data density** | minimal, balanced, analytical, dense | analytical |

```
[EXAMPLE — Signal Watch]
Mood: industrial-dark
Accent: #D4621A
Typography: monospace-headers-sans-body (Fragment Mono + DM Sans)
Density: analytical
```

**Your theme (or "default"):**

```
[PASTE YOUR THEME PREFERENCES OR "default"]
```

---

## Section 10: Build Plan [AUTO-GENERATED]

> **You don't fill this in.** The Foundry generates the phased build plan from your requirements. It derives from the 9 Autonomaton claims. Included here for reference.

**Phase 1 — Structural Skeleton**
Validates: Pipeline invariant (Claim 1), Declarative config (3), Zone governance (4), Transparency (7)
Deliverables: Pipeline orchestrator, zone schema from config, routing config from config, telemetry stream, navigation shell.

**Phase 2 — Intelligence Layer**
Validates: Cognitive Router (Claim 2), Model independence (8), Digital Jidoka (9)
Deliverables: Router dispatching to tiers per config, cognitive adapter abstracting providers, Jidoka error handling.

**Phase 3 — Self-Improvement Loop**
Validates: Skill Flywheel (Claim 5), The Ratchet (6)
Deliverables: Skill detection from telemetry, skill proposals in approval queue, ratchet visualization, demonstrated tier migration.

**Phase 4 — Recipe Polish**
Validates: Cumulative 9/9 pass.
Deliverables: All views populated, theme applied, seed data loaded, knowledge integrated, voice presets active.

**Checkpoint protocol:** After each phase, self-audit against that phase's claims. Format: "Claim N PASS/FAIL — [specific interaction that demonstrates]." All claims in a phase must pass before the next phase starts.

---

## Foundry Processing Notes

**What happens when you paste this into the Foundry:**

1. The Foundry reads Sections 1-4 (required) and generates the Sovereign Manifesto — the architectural contract containing business case, 7 principles, agentic coding directives, zone schema, routing config, audit ledger schema, anti-patterns, UI blueprint, and phased build plan.

2. If Sections 5-9 (enrichment) are provided, the Manifesto includes a recipe scaffold specification — view registry, interaction patterns, voice presets, seed data structure, knowledge manifest, and theme tokens.

3. The build plan (Section 10) is generated automatically, with claim-gated phases derived from your zone governance and routing config.

4. The output is a single HTML file (`sovereign-manifesto-{your-domain}.html`) that Claude Code or any coding agent reads as its architectural contract.

**Quality gate:** "Design is philosophy expressed through constraint." If a section doesn't express a philosophical position through structural constraint, the Foundry will ask you to clarify.

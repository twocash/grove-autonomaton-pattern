# Signal Watch — Competitive Intelligence Monitor

> *Governed AI for market intelligence. Built on the Grove Autonomaton Pattern.*

Signal Watch is a competitive intelligence monitoring system that classifies market signals, tracks competitive scores, and surfaces strategic briefings — all governed by declarative zone policies that ensure appropriate human oversight.

**Live demo**: Run `npm run dev` and open http://localhost:5173

---

## What Signal Watch Does

**Monitors competitive signals** from RSS feeds, APIs, and manual submissions. Each signal is classified for relevance, novelty, and threat level.

**Maintains competitive scores** for watchlist subjects (competitors, partners, markets, technologies). Score adjustments are proposed based on signal analysis.

**Enforces zone governance** based on the magnitude of changes:
- **GREEN zone** (Δ < 0.05): Routine monitoring. System executes autonomously.
- **YELLOW zone** (0.05 ≤ Δ < 0.15): Significant shift. System proposes, human approves.
- **RED zone** (Δ ≥ 0.15): Structural event. Human decision required for all actions.

**Learns from patterns** via the Skill Flywheel. After 5 approvals, a repeated pattern becomes a cached skill — executing instantly at Tier 0 with no cloud inference required.

---

## Architecture

Signal Watch is built on the **Grove Autonomaton Pattern** — a five-stage pipeline with declarative governance:

```
Signal → TELEMETRY → RECOGNITION → COMPILATION → APPROVAL → EXECUTION → Briefing
```

Every signal flows through all five stages. Every stage is auditable. Every decision traces to declarative config.

### Cognitive Tiers

| Tier | Description | Cost | Use Case |
|------|-------------|------|----------|
| **0** | Cached skills | $0.00 | Learned patterns, keyword filters |
| **1** | Cheap inference | ~$0.001 | Keyword classification, routine briefings |
| **2** | Premium inference | ~$0.01 | Novel signal analysis, correlations |
| **3** | Apex inference | ~$0.10 | Strategic analysis, historical patterns |

### Zone Governance

| Zone | Threshold | Behavior |
|------|-----------|----------|
| **GREEN** | Delta < 0.05, routine signals | Auto-execute, log, archive |
| **YELLOW** | Delta 0.05-0.15, significant signals | Propose adjustments, require approval |
| **RED** | Delta ≥ 0.15, critical signals, tier crossing | Surface information only, human decides |

---

## Quick Start

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build
```

Open http://localhost:5173. No API key required in demo mode.

---

## Key Files

| File | Purpose |
|------|---------|
| `src/config/routing.ts` | Intent → Tier → Zone mapping |
| `src/config/zones.ts` | Zone governance thresholds |
| `src/state/types.ts` | Domain types (signals, watchlist, scoring) |
| `src/services/pipeline-orchestrator.ts` | Five-stage pipeline engine |
| `src/services/cognitive-router.ts` | Tier selection logic |

---

## Configuration

All behavior is declarative. Edit `routing.ts` or use the in-app config editor — changes take effect immediately without redeployment.

### Sample Intent Config

```yaml
intents:
  classify_novel_signals:
    tier: 2
    zone: yellow
    description: "Classify signals without keyword match"

  strategic_briefing:
    tier: 3
    zone: red
    description: "Compile strategic briefing with tier implications"
```

### Sample Zone Config

```yaml
zones:
  green:
    meaning: "Routine Monitoring"
    flywheel_eligible: true
    allows:
      - log_briefing
      - archive_low_relevance
      - compile_routine_briefing
    forbids:
      - update_baseline_scores
      - send_alerts
```

---

## Audit Ledger

Every operation is logged with full provenance:

```
timestamp | intent | tier | zone | model | cost | #hash
```

The hash is `SHA256(watchlist_version + signals + model_response + config_state)` — enabling deterministic replay of any decision.

---

## Regulatory Compliance

The architecture provides structural compliance with emerging AI regulations:

- **EU AI Act** (Aug 2026): Traceability, human oversight
- **Colorado AI Act** (Jun 2026): Governance documentation
- **SEC AI Guidelines**: Decision audit trails

Zone governance and audit logging aren't compliance features — they're architectural consequences of the pattern.

---

## License

CC BY 4.0 — Share freely with attribution.

Built on the [Grove Autonomaton Pattern](https://github.com/twocash/grove-autonomaton-pattern).

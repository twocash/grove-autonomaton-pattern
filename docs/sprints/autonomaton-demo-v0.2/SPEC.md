# Grove Autonomaton v0.2 — "3-Minute CTO Test"

## Live Status

| Field | Value |
|-------|-------|
| **Current Phase** | Complete |
| **Status** | ✅ All tasks implemented |
| **Blocking Issues** | None |
| **Last Updated** | 2026-03-04T15:00:00Z |
| **Next Action** | Manual verification, then commit |
| **Attention Anchor** | Make UI aggressively self-obvious — architecture explains itself |

---

## Attention Anchor

**Re-read this block before every major decision.**

- **We are building:** UI improvements that make the architecture self-obvious within 3 minutes
- **Success looks like:** User clicks preset button, watches pipeline, understands zones without reading docs
- **We are NOT:** Adding new architectural features, changing core pipeline, or adding persistence
- **Current phase:** Verification
- **Next action:** Test all 5 improvements, then commit

---

## Pattern Check (Abbreviated)

### Existing Patterns to Extend

| Requirement | Existing Pattern | Extension Approach |
|-------------|------------------|-------------------|
| Preset buttons | `InteractionPane.tsx` empty state | Add clickable buttons that invoke `processInteraction()` |
| Metric cards | `Dashboard.tsx` inline metrics | Extract to `MetricCard` component with trend logic |
| Config tabs | `ConfigEditor.tsx` 2-tab system | Add `'models' | 'skills'` to existing Tab type |
| Models config | `ModelConfigPanel.tsx` web form | **REPLACE** with YAML tab in ConfigEditor |
| Skills display | `SkillProposal.tsx` toast UI | Add read-only skills tab in ConfigEditor |
| Terminal styling | `TelemetryStream.tsx` existing styles | CSS-only enhancement |

### Warning Sign Check

- ❌ Creating new Context/Provider? **NO** — using existing AppState
- ❌ Creating new JSON config system? **NO** — extending existing YAML serialization
- ❌ Creating new use* hook? **NO** — using existing dispatch pattern
- ❌ Hardcoding domain behavior? **NO** — still config-driven
- ❌ Building parallel infrastructure? **NO** — extending ConfigEditor

### Canonical Source Audit

| Capability | Canonical Home | Action |
|------------|----------------|--------|
| Model config storage | `state/types.ts: ModelConfig` | EXTEND (add to ConfigEditor) |
| Config serialization | `config/routing.ts` | EXTEND (add models serializer) |
| Skills display | `state/types.ts: Skill[]` | PORT (display in ConfigEditor tab) |
| Interaction firing | `services/pipeline-orchestrator.ts` | INVOKE (from preset buttons) |

---

## Goal

Make the demo UI aggressively self-obvious so a CTO understands the architecture within 3 minutes without reading documentation.

**The Problem:** Current empty state is passive. Metrics are flat. Model config is a web form that "feels wrong." Skills are hidden until approved.

**The Solution:** Five targeted UI improvements that weaponize the empty state, elevate the scoreboard, surface configuration as config files, and create visual contrast.

---

## Non-Goals

- ❌ New architectural features
- ❌ New state management patterns
- ❌ Backend or persistence
- ❌ New LLM providers
- ❌ Changing core pipeline logic

---

## The 5 Improvements

### 1. Weaponize Empty State
**File:** `src/components/Interaction/InteractionPane.tsx`

Replace passive text with color-coded clickable preset buttons:
- Green button: "Capture a quick thought" → auto-executes
- Yellow button: "Deep dive on API design" → requires approval
- Red button: "Delete all user data" → info only

**Proves:** Zone governance is visible before first interaction.

### 2. Elevate Scoreboard
**File:** `src/components/Dashboard/Dashboard.tsx`

Transform flat metrics into elevated cards with:
- Trend arrows (↑/↓) based on history
- Mini sparkline for Avg Tier
- Card styling with `bg-slate-800`

**Proves:** The ratchet is visually obvious.

### 3. Models.config + Skills.library Tabs
**File:** `src/components/Config/ConfigEditor.tsx`

Add two new tabs (4 total):
- `routing.config` (existing)
- `zones.schema` (existing)
- `models.config` (NEW — replaces web form)
- `skills.library` (NEW — read-only display)

**DELETE:** `src/components/Header/ModelConfigPanel.tsx`

**Proves:** Model independence (Claim 8) — swap provider by editing config.

### 4. Visual Contrast (Terminal Telemetry)
**Files:** `src/index.css`, `src/components/Telemetry/TelemetryStream.tsx`

Make telemetry feel like a terminal:
- Green-tinted text
- Higher contrast timestamps
- Distinct from chat UI

### 5. Highlight Live Config Editing
**File:** `src/components/Config/ConfigEditor.tsx`

Make the editor beg to be tweaked:
- Pulsing border on initial render
- Subtle celebration on first edit

---

## Acceptance Criteria

- [x] Fresh load shows 3 color-coded preset buttons
- [x] Clicking green button → pipeline fires, metrics update
- [x] Clicking yellow button → approval card appears
- [x] Clicking red button → info-only response
- [x] Metrics show trend arrows (↑/↓)
- [x] 4 tabs in ConfigEditor: routing, zones, models, skills
- [x] models.config tab shows YAML with tier mappings
- [x] skills.library tab shows approved skills
- [x] ModelConfigPanel.tsx deleted
- [x] Telemetry stream has terminal aesthetic
- [x] Config editor has visual invitation to edit

---

## Files to Modify

| File | Changes |
|------|---------|
| `src/components/Interaction/InteractionPane.tsx` | Preset buttons |
| `src/components/Dashboard/Dashboard.tsx` | MetricCard, trends |
| `src/components/Config/ConfigEditor.tsx` | 4 tabs, edit highlight |
| `src/config/models.ts` | NEW: serialize/parse |
| `src/config/skills.ts` | NEW: serialize function |
| `src/state/types.ts` | Tab type expansion |
| `src/components/Header/ModelConfigPanel.tsx` | DELETE |
| `src/App.tsx` | Remove ModelConfigPanel import |
| `src/index.css` | Terminal styling |

---

## Implementation Order

1. Preset Buttons (high impact, low effort)
2. Metric Cards (medium impact, medium effort)
3. Models + Skills Tabs (high impact, medium effort)
4. Visual Contrast (medium impact, low effort)
5. Live Config Highlight (low impact, low effort)

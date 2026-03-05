# Feature: Sandbox Breach UX & Early Andon Cord (v0.9.9)

## Live Status

| Field | Value |
|-------|-------|
| **Current Phase** | Complete |
| **Status** | ✅ Implemented |
| **Blocking Issues** | None |
| **Last Updated** | 2026-03-05T19:15:00Z |
| **Next Action** | Manual verification and commit |

---

## Attention Anchor

**Re-read this block before every major decision.**

- **We are building:** UX polish for demo→live mode transition + architectural fix for early credential validation
- **Success looks like:** Telemetry reacts to sandbox breach, warning visible in live mode, missing API keys halt at compilation (not execution)
- **We are NOT:** Adding new state management patterns, creating new telemetry components, changing the 5-stage pipeline
- **Current phase:** Planning
- **Next action:** Await user approval

---

## Pattern Check (Abbreviated)

### Requirements Mapped to Existing Patterns

| Requirement | Existing Pattern | Extension Approach |
|-------------|------------------|-------------------|
| Telemetry wake-up call | `ADD_TELEMETRY` action in `state/types.ts` | Dispatch existing action from InteractionPane |
| Live Mode warning | Conditional rendering in React components | Add JSX block in InteractionPane (presentation only) |
| Early Andon Cord | `HALT_PIPELINE` + `checkJidoka()` in `pipeline-orchestrator.ts` | Add API key check in Stage 03, reuse existing halt pattern |

### Warning Sign Check

- ❌ Creating a new React Context or Provider → **NO**
- ❌ Creating a new JSON config file system → **NO**
- ❌ Creating a new `use*` hook → **NO**
- ❌ Writing `if (type === 'foo')` domain conditionals → **NO** (checking mode is operational, not domain logic)
- ❌ Building infrastructure parallel to existing → **NO**

**Result:** All requirements extend existing patterns. No new patterns proposed.

---

## Canonical Source Audit

| Capability Needed | Canonical Home | Recommendation |
|-------------------|----------------|----------------|
| Telemetry dispatch | `state/reducer.ts` → `ADD_TELEMETRY` | **EXTEND** — dispatch from new location |
| Pipeline halt | `pipeline-orchestrator.ts` → `HALT_PIPELINE` | **EXTEND** — add check in Stage 03 |
| Mode state | `state/types.ts` → `AppState.mode` | **USE** — read existing state |
| Model config | `state/types.ts` → `AppState.modelConfig` | **USE** — read existing state |

**Result:** No new canonical sources needed. All capabilities exist.

---

## Goal

When a user clicks the input box to wake the system from Demo mode, the transition should be visible in the telemetry stream. Additionally, the pipeline must validate API credentials during Stage 03 (Compilation) and halt immediately if keys are missing — not wait until Stage 05 (Execution) after showing a misleading Yellow Zone approval card.

This is a **UX polish + architectural integrity** sprint for a tough audience.

---

## Non-Goals

- **NOT** changing the 5-stage pipeline architecture
- **NOT** adding new state management patterns
- **NOT** creating new telemetry components (extend existing)
- **NOT** modifying the TelemetryStream display logic
- **NOT** changing how Demo mode simulations work

---

## Acceptance Criteria

### Directive 1: Telemetry Wake-Up Call
- [ ] Clicking input area in Demo mode dispatches `ADD_TELEMETRY` with `intent: 'system_alert'`
- [ ] Telemetry stream visibly reacts to sandbox breach event
- [ ] Entry appears with `tier: 0`, `zone: 'green'`, `cost: 0`

### Directive 2: Live Mode Warning
- [ ] Amber warning appears above input when `mode === 'interactive'`
- [ ] Warning text: "LIVE MODE: API keys required for T2/T3"
- [ ] Warning includes animated pulse indicator
- [ ] Warning disappears when mode is 'demo'

### Directive 3: Early Andon Cord (Architectural Fix)
- [ ] API key validation occurs in Stage 03 (Compilation), NOT Stage 05 (Execution)
- [ ] Missing API key halts pipeline BEFORE Yellow Zone approval card is shown
- [ ] Halt reason clearly states which tier/provider is missing credentials
- [ ] Proposed fix guides user to models.config or Demo mode

---

## Implementation Notes

### Files to Modify

1. **`src/state/types.ts`**
   - Add `message?: string` to `TelemetryEntry` interface

2. **`src/components/Telemetry/TelemetryStream.tsx`**
   - Render `message` field with amber styling when present
   - Must be prominent and visually distinct from normal entries

3. **`src/components/Interaction/InteractionPane.tsx`**
   - Add `onFocus` handler to textarea (NOT onClick on container — more precise)
   - Dispatch `ADD_TELEMETRY` with message when `state.mode === 'demo'` transitions
   - Add conditional amber warning JSX above input

4. **`src/services/pipeline-orchestrator.ts`**
   - Add API key validation after intent classification in Stage 03
   - Reuse existing `HALT_PIPELINE` dispatch pattern
   - Check `state.modelConfig[tierKey].apiKey` where `tierKey = \`tier${decision.tier}\``
   - Must trigger Red Diagnostic Card UI (not just console error)

### Key Decisions

1. **onFocus vs onClick:** Use `onFocus` on the input element for precision. The container onClick was firing on any click, which felt less intentional.

2. **Telemetry entry structure:** Must conform to `TelemetryEntry` interface with all required fields, even for system alerts.

3. **Stage 03 check placement:** Add AFTER `classifyIntent()` determines the required tier, so we know which tier's API key to validate.

---

## Verification Plan

```bash
# 1. Build compiles
npm run build

# 2. Manual verification
# - Load app in Demo mode
# - Click input box
# - Verify telemetry entry appears
# - Verify amber warning appears
# - Try T2/T3 task without API key
# - Verify halt at compilation (not execution)
```

---

## Resolved Questions

1. **Telemetry entry intent name:** `system_alert`
   - ✅ Approved: Generic and reusable

2. **Warning positioning:** Above input, outside the flex container
   - ✅ Approved

3. **Telemetry entry message field:**
   - ✅ **DECISION: MUST add `message?: string` to TelemetryEntry type**
   - TelemetryStream MUST render message field prominently with amber styling when present
   - This enables human-readable context for system alerts

---

## Implementation Corrections (User Feedback)

### Correction 1: Message Field Required
- Add `message?: string` to `TelemetryEntry` interface in `src/state/types.ts`
- Update `TelemetryStream.tsx` to render message with amber/warning styling

### Correction 2: State Shape for API Key Validation
- Correct path: `state.modelConfig[tierKey]` where `tierKey = \`tier${decision.tier}\``
- Example: `state.modelConfig.tier2.apiKey` for Tier 2
- This matches existing pattern in `pipeline-orchestrator.ts:211`

### Correction 3: Early Andon Cord Must Trigger Diagnostic Card
- Must dispatch `HALT_PIPELINE` with proper `HaltReason` structure
- This triggers the Red Diagnostic Card UI (see `DiagnosticCard.tsx`)
- Halt should appear BEFORE Yellow Zone approval card is shown

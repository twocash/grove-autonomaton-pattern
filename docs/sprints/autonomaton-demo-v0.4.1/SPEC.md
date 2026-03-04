# Feature: v0.4.1 — "Inline Digital Jidoka"

## Live Status

| Field | Value |
|-------|-------|
| **Current Phase** | Complete |
| **Status** | ✅ All tasks implemented |
| **Blocking Issues** | None |
| **Last Updated** | 2026-03-04T18:30:00Z |
| **Next Action** | Commit and tag v0.4.1 |

---

## Attention Anchor

**Re-read this block before every major decision.**

- **We are building:** Inline Jidoka experience — error cards appear in chat flow, Andon trigger in prompt tray
- **Success looks like:** Diagnostic card renders inside interaction card when halted, Andon dropdown in prompt tray
- **We are NOT:** Changing pipeline logic or halt reason structure
- **Current phase:** Planning
- **Next action:** Extract DiagnosticCard component with Grove styling

---

## Pattern Check (Abbreviated)

**Existing pattern to extend:** InteractionCard inline rendering (same pattern as Yellow Zone approval card)
**Canonical home for this feature:**
- DiagnosticCard → `src/components/Diagnostic/DiagnosticCard.tsx` (new)
- Andon trigger → Inline in `InteractionPane.tsx` PromptTray

---

## Goal

Relocate the Digital Jidoka (Andon) demonstration so it feels native to the conversational flow. Move the Andon trigger from the global Header into the PromptTray, and render the diagnostic card inline within the interaction that caused the halt — identical to how Yellow Zone approvals are handled.

---

## Non-Goals

- Changing the pipeline halt logic or HaltReason structure
- Adding new failure types
- Modifying the telemetry or metrics systems

---

## Acceptance Criteria

- [x] Header contains only: Logo, Deck Link, Mode Toggle (Andon dropdown removed)
- [x] Andon dropdown appears in PromptTray (far-right, subtle styling)
- [x] When pipeline halts, the triggering interaction's status becomes 'halted'
- [x] DiagnosticCard renders inline inside the halted InteractionCard
- [x] DiagnosticCard uses Grove manifesto styling (sharp corners, #1a0a0a bg, border-t-2)
- [x] "Clear & Reset" button dispatches RESET_PIPELINE and clears halt state
- [x] Build passes with no errors

---

## Implementation Notes

### Current State

| Component | Location | Notes |
|-----------|----------|-------|
| Andon dropdown | `Header.tsx:45-63` | State via `simulateFailure` |
| Halt display | `PipelineVisualization.tsx:51-76` | Uses `pipeline.halted` + `pipeline.haltReason` |
| InteractionCard | Inline function in `InteractionPane.tsx:265-340` | Already handles status badges |

### Key Decisions

1. **DiagnosticCard as separate component** — Extract to `src/components/Diagnostic/DiagnosticCard.tsx` for reusability
2. **Interaction status sync** — When `HALT_PIPELINE` fires, must also update the active interaction's status to 'halted'
3. **haltReason access** — DiagnosticCard needs `haltReason` from pipeline state, passed as prop

### Files to Modify

| File | Action |
|------|--------|
| `src/components/Header/Header.tsx` | Remove Andon dropdown |
| `src/components/Interaction/InteractionPane.tsx` | Add Andon to PromptTray, render DiagnosticCard in InteractionCard |
| `src/components/Pipeline/PipelineVisualization.tsx` | Remove inline halt display |
| `src/components/Diagnostic/DiagnosticCard.tsx` | **CREATE** — Grove-styled halt card |
| `src/state/reducer.ts` | Update HALT_PIPELINE to set active interaction status |

### Styling Reference (DiagnosticCard)

```
Container: border-t-2 border-x border-b border-grove-red bg-[#1a0a0a] p-5 mt-4
Header: font-mono text-grove-red text-sm uppercase tracking-wider mb-3 flex items-center gap-2
Error Body: font-sans text-grove-text text-sm mb-4
Diagnostic Data: bg-grove-bg border border-grove-border p-3 font-mono text-xs text-grove-text-mid space-y-2
Action Button: border border-grove-border hover:border-grove-red hover:text-grove-red text-grove-text px-4 py-2 font-mono text-xs uppercase transition-colors
```

# Sprint Specification — foundry-template-v1

## Live Status

| Field | Value |
|-------|-------|
| **Current Phase** | Phase 7: Execution Prompt |
| **Status** | ✅ Planning Complete — Ready for Execution |
| **Blocking Issues** | None |
| **Last Updated** | 2026-03-10T23:00:00Z |
| **Next Action** | Hand EXECUTION_PROMPT.md to Claude Code |
| **Attention Anchor** | Structured input template replaces hero prompts as the Foundry's only example |

---

## Attention Anchor

**Re-read this block before every major decision.**

- **We are building:** A structured requirements template that users paste into the Foundry to generate better Sovereign Manifestos — plus two "Load Template" buttons that inject pre-filled and blank versions. This REPLACES the existing hero prompts as the Foundry's sole example path.
- **Success looks like:** Visitor clicks "Load Example," watches the Foundry compile a full Manifesto from structured requirements in real-time. One demo, one conversion path, no confusion.
- **We are NOT:** Changing the pipeline orchestrator, CognitiveAdapter, blueprint generator, zone/routing/tier config, state management, or any load-bearing architecture.
- **Current phase:** Execution
- **Next action:** Execute via Claude Code using EXECUTION_PROMPT.md

---

## Pattern Check

**Existing patterns to extend:**

| Requirement | Existing Pattern | Extension Approach |
|-------------|------------------|-------------------|
| Template text storage | `hero-prompts.ts` — exportable config array | **REPLACE** with `foundry-template.ts` following same pattern |
| Template injection into Foundry | `injectRandomHeroPrompt()` in FoundryPane | **REPLACE** with template injection functions |
| Template-aware compilation | `prompts.schema.ts` pipeline blocks | Add `template_recognition` block to pipeline |
| UI buttons for loading | Hero prompt button in teaser row | **REPLACE** with two template buttons |

## New Patterns Proposed

None required. The template config replaces hero-prompts with the same structural pattern (exportable config array read by UI).

---

## Domain Contract

**Applicable contract:** None
**Contract version:** N/A
**Additional requirements:** None — standalone demo repository

---

## Canonical Source Audit

| Capability | Canonical Home | Current Approach | Recommendation |
|------------|----------------|------------------|----------------|
| Config text storage | `src/config/hero-prompts.ts` | 3 hero prompts | **REPLACE** — delete file, new `foundry-template.ts` |
| Foundry input injection | `FoundryPane.tsx` `injectRandomHeroPrompt` | Random hero prompt | **REPLACE** — template injection handlers |
| Prompt pipeline | `prompts.schema.ts` `FoundryPromptSchema` | 3 blocks | **EXTEND** — add 4th block |
| State dispatch | `state/reducer.ts` `SET_FOUNDRY_INPUT` | Already handles arbitrary text | **KEEP** — no changes needed |

### No Duplication Certification

This sprint does not create parallel implementations. The template config replaces (not duplicates) the hero-prompts pattern. Template injection uses the existing `SET_FOUNDRY_INPUT` dispatch. No new state, no new reducers, no new services.

---

## Goal

Replace the Foundry's hero prompt examples with a structured requirements template that solves the cold-start problem. Three deliverables:

1. **Template payload** — A 10-section requirements document (4 required, 6 enrichment) reverse-engineered from Signal Watch, stored as exportable TypeScript config. Replaces `hero-prompts.ts`.
2. **Auto-paste buttons** — "Load Example" (pre-filled Signal Watch) and "Blank Template" (skeleton) buttons in the FoundryPane UI. Replace the "Load Architectural Prompt" button.
3. **Template recognition** — A prompt pipeline block that detects structured section markers and maps them to Manifesto output sections.

**GTM payoff:** One demo, one conversion path. Click → template loads → Manifesto compiles → visitor converts. No random prompt roulette diluting the moment.

---

## Non-Goals

- No changes to pipeline orchestrator or streaming
- No changes to CognitiveAdapter or model routing
- No changes to blueprint generator (HTML export)
- No changes to zone/routing/tier config schemas
- No new state management or reducers
- No backend or persistence
- No template validation UI (nice-to-have for v1.3.0)

---

## Acceptance Criteria

1. **Auto-paste works:** User clicks "Load Example" → full pre-filled Signal Watch template appears in Foundry textarea → user clicks Compile → Sovereign Manifesto generates with all 5 sections correctly reflecting the Signal Watch domain.

2. **Blank template works:** User clicks "Blank Template" → skeleton with section headers and placeholders appears → user fills in their domain → Compile produces a domain-appropriate Manifesto.

3. **Freeform still works:** Typing directly into the textarea and clicking Compile produces valid Manifesto output. Template recognition only activates when section markers are present.

4. **Template is exportable:** The pre-filled template text can be copied from the textarea and shared (Slack, email, docs) as a standalone document. No UI dependency.

5. **Large input handles gracefully:** The full template (~400 lines, ~3,000 tokens of user input) doesn't break the textarea, the compiler, or the streaming output.

6. **Hero prompts removed cleanly:** `hero-prompts.ts` deleted, no orphaned imports, no dead code. The "Load Architectural Prompt" button is gone.

---

## DEX Compliance

| Principle | How This Sprint Complies |
|-----------|--------------------------|
| **Declarative Sovereignty** | Template text lives in config (`foundry-template.ts`), not hardcoded in component |
| **Capability Agnosticism** | Template recognition works regardless of which Tier 3 model compiles it |
| **Provenance** | Template version embedded in config; pipeline signature tracks changes |
| **Organic Scalability** | Additional templates (other domains) can be added to the config array without code changes |

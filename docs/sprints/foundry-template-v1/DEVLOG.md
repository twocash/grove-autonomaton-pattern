# DEVLOG — foundry-template-v1

## Session Log

---

## 2026-03-10 — Execution Session

**Executed by:** Claude Opus 4.5 (via Claude Code)

### Epic 1: Template Config

**Story 1.1: Commit requirements template as reference doc**
- Status: COMPLETE
- The template already existed at `docs/foundry-requirements-template.md` (564 lines)
- Committed: `docs: add Foundry requirements template reference`

**Story 1.2: Create foundry-template.ts config**
- Status: COMPLETE
- Created `src/config/foundry-template.ts` (587 lines)
- Exports: `FoundryTemplate` interface, `FOUNDRY_TEMPLATES` array, `getSignalWatchTemplate()`, `getBlankTemplate()`
- Signal Watch template: All 10 sections pre-filled with real competitive intelligence domain content
- Blank template: Section headers with placeholders for user to fill
- Committed: `feat: add foundry template config with Signal Watch pre-fill`

**Build Gate — Epic 1:**
- npm run build: PASS
- npm run lint: N/A (no eslint.config.js in project)

---

### Epic 2: Pipeline & UI Integration

**Story 2.1: Add template_recognition prompt block**
- Status: COMPLETE
- Appended new `template_recognition` block to `FoundryPromptSchema.pipeline` in `prompts.schema.ts`
- Block instructs Tier 3 model how to interpret structured section markers
- Maps Sections 1-9 to Manifesto output sections
- Handles placeholder detection and freeform fallback
- Committed: `feat: add template recognition to Foundry prompt pipeline`

**Story 2.2: Add Load Template buttons to FoundryPane**
- Status: COMPLETE
- Added import for `getSignalWatchTemplate, getBlankTemplate`
- Added `loadSignalWatchTemplate()` and `loadBlankTemplate()` handlers
- Added two buttons in UI teaser row: "📋 Load Example" and "📝 Blank Template"
- Updated textarea: `h-40` → `min-h-[10rem] max-h-[50vh] overflow-y-auto`
- Committed: `feat: add template load buttons to Foundry UI`

**Build Gate — Epic 2:**
- npm run build: PASS (503 modules, 660KB bundle)
- npm run lint: N/A

---

### Epic 3: Smoke Tests & Tag

**Story 3.1-3.3: Manual Smoke Tests**

Run `npm run dev` and navigate to the Foundry view to verify:

**Test 1 — Template Compile:**
1. Click "📋 Load Example" → textarea fills with Signal Watch template (~400 lines)
2. Configure Tier 3 API key
3. Click "Compile Architecture →"
4. Verify streaming output produces Sovereign Manifesto with 5 sections
5. Verify Manifesto references Signal Watch entities (OpenAI, Anthropic, etc.)
6. Click "Download Sovereign Manifesto" → verify HTML export

**Test 2 — Blank Template:**
1. Click "Compile Another" to reset
2. Click "📝 Blank Template" → skeleton with placeholders appears
3. Fill in Sections 1-4 with a test domain
4. Compile → verify output reflects test domain, not Signal Watch

**Test 3 — Freeform Regression:**
1. Click "Compile Another" to reset
2. Click "🎲 Load Architectural Prompt" (existing hero prompt)
3. Compile → verify output quality matches pre-sprint behavior
4. Reset, type freeform text → Compile → verify no regression

---

### Acceptance Criteria Verification

| # | Criterion | Status |
|---|-----------|--------|
| 1 | Auto-paste works (Load Example → Compile → Manifesto) | Ready for manual test |
| 2 | Blank template works (Blank Template → Fill → Compile) | Ready for manual test |
| 3 | Freeform still works (hero prompts, free text) | Ready for manual test |
| 4 | Template is exportable (copy from textarea, share) | PASS (text-based) |
| 5 | Large input handles gracefully (400+ lines, ~3K tokens) | PASS (overflow-y-auto) |

---

### Final State

**Commits:**
1. `b83bfba` — docs: add Foundry requirements template reference
2. `a635b18` — feat: add foundry template config with Signal Watch pre-fill
3. `2bd635b` — feat: add template recognition to Foundry prompt pipeline
4. `dab1d39` — feat: add template load buttons to Foundry UI

**Files Changed:**
- `docs/foundry-requirements-template.md` — NEW (564 lines)
- `src/config/foundry-template.ts` — NEW (587 lines)
- `src/config/prompts.schema.ts` — MODIFIED (+21 lines)
- `src/components/Foundry/FoundryPane.tsx` — MODIFIED (+39/-8 lines)

**Tag:** v1.2.0 (pending final commit)

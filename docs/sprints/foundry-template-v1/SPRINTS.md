# Sprints — foundry-template-v1

## Epic 1: Template Config (Steps 1-2)

### Story 1.1: Commit requirements template as reference doc
**Task:** Copy `autonomaton-foundry-requirements-template.md` to `docs/foundry-requirements-template.md`
**Verification:** File exists, renders correctly in GitHub markdown preview
**Commit:** `docs: add Foundry requirements template reference`

### Story 1.2: Create foundry-template.ts config
**Task:** Create `src/config/foundry-template.ts` with:
- `FoundryTemplate` interface (id, title, description, templateText, isPreFilled)
- `FOUNDRY_TEMPLATES` array with two entries
- `getSignalWatchTemplate()` — returns pre-filled Signal Watch template
- `getBlankTemplate()` — returns skeleton with placeholders

**The Signal Watch pre-fill must:**
- Include all 10 sections with Signal Watch content filled in
- Strip `[EXAMPLE]` labels (the content IS the example)
- Strip `[PASTE HERE]` placeholders (they're replaced with real content)
- Retain section headers with `[REQUIRED]` / `[ENRICHMENT]` markers

**The blank template must:**
- Include all 10 section headers
- Strip all Signal Watch content
- Retain `[PASTE YOUR ... HERE]` placeholders
- Retain the tables/field definitions as structural guide

**Verification:** Import compiles, exports are typed correctly
**Commit:** `feat: add foundry template config with Signal Watch pre-fill`

### Build Gate — Epic 1
```bash
npm run build    # Compiles with new config
npm run lint     # No lint errors
```

---

## Epic 2: Pipeline & UI Integration (Steps 3-4)

### Story 2.1: Add template_recognition prompt block
**Task:** Append new `PromptBlock` to `FoundryPromptSchema.pipeline` in `src/config/prompts.schema.ts`
- Block id: `"template_recognition"`
- Content: Instructions for detecting section markers and mapping to Manifesto sections
- Must handle: filled sections, placeholder markers, missing optional sections
- Must NOT change existing blocks (system_persona, architectural_context, output_requirements)

**Verification:** Pipeline compiles. `getPipelineSignature()` returns new hash. Existing prompt blocks unchanged.
**Commit:** `feat: add template recognition to Foundry prompt pipeline`

### Story 2.2: Add Load Template buttons to FoundryPane
**Task:** Modify `src/components/Foundry/FoundryPane.tsx`:
1. Import `getSignalWatchTemplate, getBlankTemplate` from `../../config/foundry-template`
2. Add `loadSignalWatchTemplate()` handler — dispatches `SET_FOUNDRY_INPUT` with pre-filled text
3. Add `loadBlankTemplate()` handler — dispatches `SET_FOUNDRY_INPUT` with blank skeleton
4. Add two buttons in the UI teaser row, alongside existing hero prompt button:
   - "📋 Load Example" (amber border, same style as hero prompt button)
   - "📝 Blank Template" (dimmer, secondary style)
5. Change textarea from `h-40` to `min-h-40 max-h-[50vh] overflow-y-auto` for large template content

**UI layout (the button row):**
```
[◉] Scaffold New Project    [○] Refactor Codebase v2.0
                    [📋 Load Example] [📝 Blank Template] [🎲 Load Architectural Prompt]
```

**Verification:** Both buttons render, inject correct text, textarea handles 400+ lines without breaking
**Commit:** `feat: add template load buttons to Foundry UI`

### Build Gate — Epic 2
```bash
npm run build    # Compiles
npm run lint     # No lint errors
npm run dev      # Dev server starts, navigate to Foundry, verify buttons render
```

---

## Epic 3: Smoke Tests & Tag

### Story 3.1: Smoke test — template compile
**Task:** Manual verification:
1. Click "Load Example" → verify Signal Watch template populates textarea
2. Enter a valid Tier 3 API key
3. Click "Compile Architecture →" → verify streaming output produces all 5 Manifesto sections
4. Verify Manifesto sections reflect Signal Watch domain (entities, zones, routing)
5. Click "Download Sovereign Manifesto" → verify HTML export works

### Story 3.2: Smoke test — blank template
**Task:** Manual verification:
1. Click "Blank Template" → verify skeleton with placeholders appears
2. Fill in at least Sections 1-4 with any test domain
3. Compile → verify output reflects the test domain, not Signal Watch

### Story 3.3: Smoke test — freeform regression
**Task:** Manual verification:
1. Click "Load Architectural Prompt" (existing hero prompt button)
2. Compile → verify output quality matches pre-sprint behavior
3. Type freeform text → Compile → verify no regression

### Story 3.4: Tag and commit
**Commit:** `chore: v1.2.0 — Foundry requirements template`
**Tag:** `v1.2.0`

### Build Gate — Epic 3
```bash
npm run build    # Final build
npm run lint     # Clean
```

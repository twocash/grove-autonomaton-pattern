# Migration Map — foundry-template-v1

## Files Changed

| # | File | Action | Lines Changed | Risk |
|---|------|--------|---------------|------|
| 1 | `src/config/foundry-template.ts` | **CREATE** | ~250 (template text) | None — new file |
| 2 | `src/components/Foundry/FoundryPane.tsx` | **MODIFY** | ~25 | Low — UI addition |
| 3 | `src/config/prompts.schema.ts` | **MODIFY** | ~20 | Low — append block |
| 4 | `src/config/hero-prompts.ts` | **MODIFY** | ~10 | Low — optional 4th prompt |
| 5 | `docs/foundry-requirements-template.md` | **CREATE** | ~560 | None — docs only |

## Execution Order

### Step 1: Create `docs/foundry-requirements-template.md`
Copy the full requirements template markdown into the repo as reference documentation.
Source: uploaded `autonomaton-foundry-requirements-template.md`
No code dependency — pure docs commit.

### Step 2: Create `src/config/foundry-template.ts`
New config file exporting `FOUNDRY_TEMPLATES` array with:
- `getSignalWatchTemplate()` — pre-filled with Signal Watch domain
- `getBlankTemplate()` — skeleton with section headers and placeholders

The Signal Watch pre-fill is derived from the requirements template with all `[EXAMPLE]` blocks retained as content and all `[PASTE HERE]` markers replaced with Signal Watch specifics.

The blank template strips all examples and retains only section headers and placeholder markers.

### Step 3: Modify `src/config/prompts.schema.ts`
Append `template_recognition` block to `FoundryPromptSchema.pipeline` array.
This block instructs the Tier 3 model how to interpret structured section markers.
No changes to existing blocks. Pipeline signature will update automatically.

### Step 4: Modify `src/components/Foundry/FoundryPane.tsx`
- Import `getSignalWatchTemplate, getBlankTemplate` from config
- Add `loadSignalWatchTemplate()` and `loadBlankTemplate()` handlers
- Add two buttons in the UI teaser row (alongside existing hero prompt button)
- Increase textarea from `h-40` to `min-h-40 max-h-[50vh] overflow-y-auto`

### Step 5 (Optional): Modify `src/config/hero-prompts.ts`
Add a 4th hero prompt that uses a condensed version of the Signal Watch template.
Non-blocking — the template buttons are the primary injection path.

## Rollback Plan

Each step is independently committable. If any step breaks:
- Steps 1-2: Delete new files, no regression
- Step 3: Revert the single block addition to prompts.schema.ts
- Step 4: Revert FoundryPane changes — existing hero prompt button unchanged

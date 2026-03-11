# Claude Code Kickoff — Foundry Template Sprint

Read the sprint execution prompt and implement it. All planning is complete.

## Instructions

1. Read `C:\GitHub\grove-autonomaton-pattern\docs\sprints\foundry-template-v1\EXECUTION_PROMPT.md` — this is your complete implementation guide.

2. Read the sprint artifacts in order:
   - `docs/sprints/foundry-template-v1/SPEC.md` (goals, acceptance criteria)
   - `docs/sprints/foundry-template-v1/ARCHITECTURE.md` (interface contracts, design decisions)
   - `docs/sprints/foundry-template-v1/MIGRATION_MAP.md` (files to create/modify)
   - `docs/sprints/foundry-template-v1/SPRINTS.md` (epic/story breakdown)

3. Read `CLAUDE.md` at the project root — it contains hard architectural rules. Do NOT duplicate canonical components.

4. Read the source files you'll modify:
   - `src/config/hero-prompts.ts` (the pattern to follow)
   - `src/components/Foundry/FoundryPane.tsx` (the component to extend)
   - `src/config/prompts.schema.ts` (the pipeline to extend)

5. The requirements template source content is at `docs/foundry-requirements-template.md`. If it doesn't exist yet, the full template text is in the uploaded file at the project root — create the docs version first (Story 1.1).

6. Execute Epics 1-3 in order. Run build gates after each epic. Log progress in `docs/sprints/foundry-template-v1/DEVLOG.md`.

7. After all epics: verify the 5 acceptance criteria in SPEC.md, then tag v1.2.0.

## Key Constraints

- Template text lives in `src/config/foundry-template.ts` (config, not component)
- Use the existing `SET_FOUNDRY_INPUT` dispatch action — no new state management
- Append to `prompts.schema.ts` pipeline — do NOT modify existing blocks
- Two buttons: "Load Example" (pre-filled) and "Blank Template" (skeleton)
- Textarea needs `min-h-[10rem] max-h-[50vh] overflow-y-auto` for large content
- The Signal Watch pre-fill must include all 10 sections with real content
- The blank template must include section headers and placeholders only

## Build Gate Commands

```bash
npm run build    # Must pass after each epic
npm run lint     # Must pass after each epic
npm run dev      # Manual verification after Epic 2
```

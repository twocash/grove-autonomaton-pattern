# Follow-On: Remove Hero Prompts — Signal Watch Is the Only Example

The Foundry now has two template buttons ("Load Example" and "Blank Template") from the foundry-template-v1 sprint. The old hero prompts (Self-Healing Triager, Kaizen Automator, IDE Interceptor) are redundant. Remove them.

## What to do

### 1. Delete `src/config/hero-prompts.ts`

This file is no longer needed. The template buttons in `foundry-template.ts` replace it entirely.

```bash
git rm src/config/hero-prompts.ts
```

### 2. Update `src/components/Foundry/FoundryPane.tsx`

Remove all traces of hero prompts:

- **Remove import:** `import { getRandomHeroPrompt } from '../../config/hero-prompts'`
- **Remove function:** The entire `injectRandomHeroPrompt` function
- **Remove button:** The "🎲 Load Architectural Prompt" button from the UI teaser row

The two template buttons ("📋 Load Example" and "📝 Blank Template") should be the ONLY loading options in that row. Keep the mode selector (Scaffold / Refactor v2.0 teaser) on the left.

### 3. Verify no other files import hero-prompts

Search the codebase for any remaining references:

```bash
grep -r "hero-prompts" src/ --include="*.ts" --include="*.tsx"
grep -r "hero.prompt" src/ --include="*.ts" --include="*.tsx"  
grep -r "getRandomHeroPrompt" src/ --include="*.ts" --include="*.tsx"
grep -r "HeroPrompt" src/ --include="*.ts" --include="*.tsx"
grep -r "HERO_PROMPTS" src/ --include="*.ts" --include="*.tsx"
```

If any references remain, remove them. The config index file (`src/config/index.ts`) may re-export hero-prompts — clean that up too.

### 4. Build and verify

```bash
npm run build    # Must pass with no dead imports
npm run lint     # Must be clean
npm run dev      # Verify: Foundry shows only "Load Example" and "Blank Template" buttons
```

### 5. Commit

```bash
git add -A
git commit -m "refactor: remove hero prompts — Signal Watch template is the sole Foundry example"
```

## What NOT to change

- `foundry-template.ts` — untouched
- `prompts.schema.ts` — untouched  
- Pipeline, state, services — untouched
- The two template buttons — keep them exactly as they are

This is a deletion-only change. No new code.

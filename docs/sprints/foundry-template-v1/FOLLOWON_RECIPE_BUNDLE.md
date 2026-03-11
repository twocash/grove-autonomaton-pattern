# Post-v1.2.0: The Real Fix — Two Documents, One Build

## PM Context (Read This First)

We over-complicated the Foundry output. The goal was never "generate config from a prompt." The goal is:

**Dev clicks one button → gets everything they need → drops two files into Claude Code → types one sentence → working app.**

Signal Watch already works at `C:\GitHub\signal-watch`. The recipe files already exist at `recipes/signal-watch/`. We're not asking a Tier 3 model to re-derive what we already have. We're PACKAGING IT.

The Foundry produces two downloads:
1. **Sovereign Manifesto** — The architectural contract (already works)
2. **Recipe Bundle** — The actual config files from Signal Watch, formatted for drop-in use

The Manifesto says "apply the recipe." The recipe says "read the manifesto for context." Claude Code reads both, builds the app.

---

## Change 1: Delete hero-prompts.ts and remove all references

**Delete:** `src/config/hero-prompts.ts`

**Modify FoundryPane.tsx:**
- Remove `import { getRandomHeroPrompt } from '../../config/hero-prompts'`
- Remove the `injectRandomHeroPrompt` function
- Remove the "🎲 Load Architectural Prompt" button

Only "📋 Load Example" and "📝 Blank Template" remain.

**Clean up:** Check `src/config/index.ts` and any other file for orphaned hero-prompts imports.

```bash
grep -r "hero-prompts\|getRandomHeroPrompt\|HeroPrompt\|HERO_PROMPTS" src/ --include="*.ts" --include="*.tsx"
```

Remove every match.

---

## Change 2: Fix "Untitled App" — Extract name from template input

**Modify FoundryPane.tsx — the `extractAppName()` helper:**

Replace with a smarter version. Strategy order:

1. If input contains `## Section 1:`, grab the first real content line after the header (skip blanks, blockquotes, bold markers, table rows, code fences). Extract the first 3-6 meaningful words, title-case them.
2. Existing "build a..." / "create a..." regex patterns (keep as fallback).
3. Take first 3-4 meaningful words from input (skip: the, a, an, I, want, to, build, create, make, my, for, that, which, is, it), title-case them.
4. Last resort: "New Autonomaton" instead of "Untitled App."

---

## Change 3: Generate Recipe Bundle as second download

This is the big one. The Foundry currently produces one HTML file. Now it produces two.

### 3a: Create `src/config/signal-watch-recipe.ts`

New config file that exports the Signal Watch recipe as structured text blocks. Each block has a filename and content string.


The content for each recipe file comes directly from `C:\GitHub\signal-watch\recipes\signal-watch\`. These are the ACTUAL working config files from the reference implementation. Do NOT paraphrase, regenerate, or simplify them. Copy the real code.

Structure:

```typescript
export interface RecipeFile {
  filename: string      // e.g., "config/defaults.ts"
  description: string   // e.g., "Default AI watchlist — 5 competitors with scores and keywords"
  content: string       // The actual TypeScript source
}

export interface RecipeBundle {
  name: string          // "Signal Watch"
  version: string       // "1.0.0"  
  description: string   // One-liner
  files: RecipeFile[]
}

export const SIGNAL_WATCH_RECIPE: RecipeBundle = { ... }
```

The files to include (copy content verbatim from `C:\GitHub\signal-watch\recipes\signal-watch\`):

| Source File | Recipe Path | What It Is |
|-------------|-------------|------------|
| `config/defaults.ts` | `config/defaults.ts` | 5 AI competitors with scores, keywords, aliases |
| `config/zones.ts` | `config/zones.ts` | Green/Yellow/Red governance with thresholds |
| `config/routing.ts` | `config/routing.ts` | 30 intents mapped to tiers and zones |
| `config/index.ts` | `config/index.ts` | Config barrel export |
| `state/types.ts` | `state/types.ts` | Domain types (WatchlistSubject, ClassifiedSignal, Briefing) |
| `state/reducer.ts` | `state/reducer.ts` | Domain state machine |
| `state/context.tsx` | `state/context.tsx` | React provider |
| `index.ts` | `index.ts` | Recipe entry point |

**IMPORTANT:** The type imports in these files reference `../../../src/core/state/types`. These import paths are correct for the recipe directory structure. Do NOT modify them.

### 3b: Create recipe bundle generator in `src/utils/recipe-generator.ts`

New file that generates a downloadable markdown document from a `RecipeBundle`. The output is a single `.md` file structured like this:

```markdown
# Signal Watch — Recipe Bundle

> **Companion to:** Sovereign Manifesto: Signal Watch
> **Version:** 1.0.0
> **Generated:** [timestamp]

## What This Is

This file contains the complete configuration for Signal Watch — a competitive 
intelligence monitor built on the Grove Autonomaton Pattern. Each code block below 
is a file. Together with the Sovereign Manifesto, they define a buildable application.

## How To Use

1. Open an agentic IDE (Claude Code, Cursor, Windsurf)
2. Create a new project directory
3. Drop this file AND the Sovereign Manifesto HTML into the directory
4. Prompt: "Read both files. The Manifesto is the architectural contract. 
   The Recipe Bundle contains the config files. Scaffold Phase 1, then apply 
   the recipe configs. Build it."
5. Review. Approve. Repeat for Phases 2-4.

---

## config/defaults.ts
> Default AI watchlist — 5 competitors with scores and keywords

\`\`\`typescript
[ACTUAL FILE CONTENT FROM signal-watch-recipe.ts]
\`\`\`

## config/zones.ts
> Green/Yellow/Red governance with score delta thresholds

\`\`\`typescript
[ACTUAL FILE CONTENT]
\`\`\`

[...etc for each file...]
```

Export two functions:

```typescript
export function generateRecipeMarkdown(recipe: RecipeBundle): string
export function downloadRecipe(name: string, markdown: string): void
```

The `downloadRecipe` function creates a `.md` blob and triggers download, same pattern as `downloadBlueprint` in `blueprint-generator.ts`.

### 3c: Add "Download Recipe Bundle" button to FoundryPane

After a successful compile, the export CTA section currently shows one button: "Download Sovereign Manifesto (.html)". Add a second button below it:

```tsx
<button
  onClick={handleDownloadRecipe}
  className="mt-3 border-2 border-grove-amber text-grove-amber hover:bg-grove-amber/10 font-mono text-sm uppercase tracking-widest px-8 py-4 transition-colors w-full"
>
  Download Recipe Bundle (.md)
</button>
```

The `handleDownloadRecipe` function:
```typescript
import { SIGNAL_WATCH_RECIPE } from '../../config/signal-watch-recipe'
import { generateRecipeMarkdown, downloadRecipe } from '../../utils/recipe-generator'

const handleDownloadRecipe = () => {
  const markdown = generateRecipeMarkdown(SIGNAL_WATCH_RECIPE)
  downloadRecipe(appName, markdown)
}
```

**Button styling:** The Manifesto button is solid amber (primary CTA). The Recipe button is amber outline (secondary CTA). They sit together as a pair.


### 3d: Update the Manifesto to reference the Recipe Bundle

**Modify `src/utils/blueprint-generator.ts`:**

Add a new section to the Manifesto HTML, inserted AFTER the PRD section (`</pre>`) and BEFORE the footer. This replaces the prompt-engineering approach to enrichment sections. The Manifesto doesn't need to contain generated config — it points to the Recipe Bundle.

```html
<section class="section" style="text-align: center; padding: 2rem 0;">
  <div style="border: 2px solid var(--grove-amber); padding: 2rem; background: rgba(212, 98, 26, 0.06);">
    <h2 style="margin-bottom: 12px;">Build This Autonomaton</h2>
    <p style="font-family: 'Fragment Mono', monospace; font-size: 13px; color: var(--grove-text-mid); max-width: 520px; margin: 0 auto 20px; line-height: 1.7;">
      This Manifesto is the architectural contract.<br/>
      The <strong style="color: var(--grove-amber);">Recipe Bundle</strong> contains the config files.<br/>
      Together, they're everything an agentic IDE needs.
    </p>
    <ol style="text-align: left; max-width: 480px; margin: 0 auto 20px; font-family: 'Fragment Mono', monospace; font-size: 13px; color: var(--grove-text-mid); line-height: 2;">
      <li>Open Claude Code (or Cursor, or Windsurf)</li>
      <li>Drop both files into a new project directory</li>
      <li>Type: <em style="color: var(--grove-text);">"Read both files. Build Phase 1."</em></li>
      <li>Review what it builds. Approve or redirect.</li>
      <li>Repeat for Phases 2–4. Ship it.</li>
    </ol>
    <p style="font-family: 'Fragment Mono', monospace; font-size: 11px; color: var(--grove-text-dim);">
      Phase 1: Skeleton · Phase 2: Intelligence · Phase 3: Flywheel · Phase 4: Polish
    </p>
  </div>
</section>
```

---

## Change 4: Remove enrichment section prompt engineering from prompts.schema.ts

If the v1.2.0 follow-on fix already ran and added enrichment sections (6-10) to the `output_requirements` block in `prompts.schema.ts`, **REVERT that addition**. The Manifesto does NOT need to contain LLM-generated config. The Recipe Bundle IS the config.

Keep `output_requirements` producing only the original 5 sections: Pipeline, Zones, Routing, Audit Ledger, Anti-Patterns. These are the architectural spec. The recipe files are the implementation.

The `template_recognition` block in `prompts.schema.ts` should remain — it helps the model produce better architectural specs from structured template input. But it no longer needs to generate enrichment sections.

---

## Files Changed Summary

| File | Change | Risk |
|------|--------|------|
| `src/config/hero-prompts.ts` | **DELETE** | None |
| `src/config/signal-watch-recipe.ts` | **CREATE** | None — static config |
| `src/utils/recipe-generator.ts` | **CREATE** | Low — follows blueprint-generator pattern |
| `src/components/Foundry/FoundryPane.tsx` | **MODIFY** | Low — remove hero, fix name, add recipe button |
| `src/utils/blueprint-generator.ts` | **MODIFY** | Low — add "Build It" section |
| `src/config/prompts.schema.ts` | **MODIFY** | Low — revert enrichment if present |
| `src/config/index.ts` | **MODIFY** | Low — clean up exports |

## Build & Commit Sequence

```bash
# Step 1: Hero prompt removal
git rm src/config/hero-prompts.ts
# Clean up all references in FoundryPane, index.ts, etc.
npm run build && npm run lint
git commit -m "refactor: remove hero prompts — template is the sole example"

# Step 2: App name fix
# Update extractAppName() in FoundryPane.tsx
npm run build && npm run lint
git commit -m "fix: infer app name from template content"

# Step 3: Recipe bundle
# Create signal-watch-recipe.ts (copy content from C:\GitHub\signal-watch\recipes\signal-watch\)
# Create recipe-generator.ts
# Add download button to FoundryPane
# Add "Build It" section to blueprint-generator
# Revert enrichment sections in prompts.schema.ts if present
npm run build && npm run lint
npm run dev  # Manual: compile template, verify both downloads work
git commit -m "feat: recipe bundle download — two documents, one build"
```

## Acceptance Criteria

1. **Two downloads after compile:** "Download Sovereign Manifesto (.html)" and "Download Recipe Bundle (.md)" both appear and work.
2. **Recipe contains real code:** Every file in the recipe markdown matches the actual source from `C:\GitHub\signal-watch\recipes\signal-watch\`. Not generated, not paraphrased — the real thing.
3. **Cross-reference works:** Manifesto "Build It" section mentions the Recipe Bundle. Recipe header mentions the Manifesto.
4. **App name inferred:** Title is NOT "Untitled App." It reflects the domain.
5. **Hero prompts gone:** No 🎲 button. No `hero-prompts.ts`. No orphaned imports.
6. **Five-step CTA is dead simple:** Open IDE, drop files, type one sentence, review, ship.

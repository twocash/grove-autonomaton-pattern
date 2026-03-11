# Sprint: Knowledge Layer for Signal Watch Recipe

**Tier:** Feature (2-3 hours)
**Risk:** Low — additive only, touches 2 existing files
**Depends on:** v1.2.0 recipe bundle (shipped)

---

## PM Context

The recipe bundle has the skeleton (types, zones, routing) and the state machine (reducer, context). What it's missing is the *brain* — the domain knowledge that shapes HOW the system analyzes, not WHAT it monitors.

The knowledge layer is markdown files. That's it. Markdown loaded as context alongside prompts. The pipeline reads them the same way it reads any other config. The dev can swap them for a RAG endpoint, a Notion export, a vector store — the interface is the same: text in, context out.

This is the "oh, I can just change these markdown files and the whole system thinks differently" moment.

---

## What We're Building

3 knowledge files in a `knowledge/` directory within the recipe. Each is 20-40 lines of opinionated markdown with a standardized header comment explaining what it is, how it enters the pipeline, and what you'd replace it with in production.

### File 1: `knowledge/competitive-landscape.md` — Current state of the world

What the AI competitive landscape looks like right now. Who the players are, what dynamics are in play, what shifts matter. Updated quarterly. Answers: "What does the world look like today?"

Loaded as context during Recognition and Compilation. Without it, the LLM relies on training data (stale). With it, analysis is grounded in current reality.

**Header comment pattern** (all 3 files use this):
```markdown
<!-- KNOWLEDGE FILE: competitive-landscape.md
     Pipeline role: Loaded as context during Recognition and Compilation stages.
     Shapes: Briefing relevance scoring, signal classification, entity context.
     
     This is a static markdown file. In production, replace with:
     - A RAG query against your document store
     - A Notion database export  
     - A scheduled scrape of industry reports
     - Any source that returns markdown text
     
     The pipeline doesn't care where the text comes from.
     It just reads markdown and injects it as context. -->
```

**Content covers:** Market structure (5 frontier companies), active dynamics (pricing war, open vs. closed, agentic shift, regulatory pressure), scoring context (what constitutes a real signal vs. noise for this specific landscape).

### File 2: `knowledge/scoring-methodology.md` — How to evaluate

The analytical framework for competitive position scoring. Five weighted factors (Market Position 0.30, Technical Capability 0.25, Distribution Strength 0.20, Talent Density 0.15, Capital Access 0.10). Delta interpretation table mapping ranges to zones. Explicit lists of what shifts scores and what doesn't.

Loaded during Compilation when generating score adjustments. This is the file that makes analysis *yours* rather than generic LLM output.

### File 3: `knowledge/contrarian-lens.md` — The bear case

Forces the system to argue against its own conclusions before presenting them. Three questions framework: "What would make the consensus wrong?", "Who benefits from this narrative?", "What's the second-order effect?" Plus contrarian indicators (unanimous bullishness, defensive pricing framed as generous, etc.).

Loaded during Tier 3 strategic analysis only. This is the file that keeps the system from becoming an echo chamber. Applied to Red Zone briefings.


---

## Changes to Existing Files

### 1. Modify `src/config/signal-watch-recipe.ts`

Add 3 new entries to the `files` array in `SIGNAL_WATCH_RECIPE`. Each entry follows the existing `RecipeFile` interface: filename, description, content string.

The content for each file is the full markdown including the `<!-- KNOWLEDGE FILE -->` header comment. Write the actual analytical content — this is not placeholder text. A dev reading these should understand how the system thinks about competitive intelligence.

### 2. Modify `src/utils/recipe-generator.ts`

Add a "Knowledge Layer" section grouping in the generated markdown. The generator should detect files with paths starting with `knowledge/` and render them under a distinct header:

```markdown
---

## Knowledge Layer

> These markdown files are loaded as context during analysis. 
> They shape HOW the system thinks, not WHAT it monitors.
> Replace them with your domain expertise, a RAG endpoint, 
> a Notion export, or any markdown source.

## knowledge/competitive-landscape.md
> Current AI competitive landscape — update quarterly

```

Use a `markdown` language tag for the code fence (since the content is markdown, not TypeScript).

---

## Files Changed

| File | Change | Risk |
|------|--------|------|
| `src/config/signal-watch-recipe.ts` | **MODIFY** — Add 3 knowledge file entries to files array | Low |
| `src/utils/recipe-generator.ts` | **MODIFY** — Add knowledge layer section grouping | Low |

---

## Acceptance Criteria

1. **Recipe bundle includes knowledge files:** Download recipe bundle after compile → 3 knowledge files appear under a "Knowledge Layer" header, visually separated from config/state files.
2. **Each file has the pipeline comment:** The `<!-- KNOWLEDGE FILE -->` header explains what it is, what pipeline stage uses it, and what to replace it with.
3. **Content is substantive:** Real analytical framework. Competitive landscape with named companies and dynamics. Scoring methodology with weighted factors and delta tables. Contrarian lens with the three questions. Not placeholder text.
4. **Existing recipe files untouched:** Config, state, and index files in the bundle are byte-identical to pre-sprint.
5. **Code fence rendering:** Knowledge file content renders correctly inside the markdown bundle (markdown inside a code fence — no escaping issues).

## Build & Commit

```bash
npm run build
npm run lint
npm run dev   # Compile template, download recipe bundle, verify knowledge section
git add -A
git commit -m "feat: knowledge layer — competitive landscape, scoring methodology, contrarian lens"
```

# Sprint: Publish Signal Watch as Reference Implementation

**Tier:** Sprint (half-day)
**Risk:** Medium — involves new GitHub repo, Vercel deployment, and cross-referencing from Foundry output
**Depends on:** Knowledge layer sprint (in progress), Foundry v1.2.0 (shipped)

---

## PM Context

Signal Watch is the reference implementation that proves the Autonomaton Pattern builds real apps. It currently lives at `C:\GitHub\signal-watch` with its git remote still pointing at `grove-autonomaton-pattern.git`. It has never been published independently.

Publication creates the third leg of the GTM stool:

1. **the-grove.ai/autonomaton/** — The pattern playground (live, shipped)
2. **the-grove.ai/signal-watch-autonomaton/** — The reference app (this sprint)
3. **github.com/twocash/signal-watch** — The clonable repo (this sprint)

The Foundry's Manifesto and Recipe Bundle then close the loop: "Here's what it looks like live. Here's the code. Here are your files. Build yours."

---

## What We're Doing

### Workstream A: Prepare the repo for public consumption

**In `C:\GitHub\signal-watch`:**

1. **Clean tmpclaude files.** There are 100+ `tmpclaude-*-cwd` files littering the root and `src/core/`. Delete all of them.

```bash
cd C:\GitHub\signal-watch
del tmpclaude-*
del src\core\tmpclaude-*
```

2. **Change vite base path.** Currently `base: '/autonomaton/'` — change to `base: '/signal-watch-autonomaton/'` in `vite.config.ts`.

3. **Update README.** The README is already good. Three additions:
   - Add a "Live Demo" link: `https://the-grove.ai/signal-watch-autonomaton/`
   - Add a "Built With" section linking to `the-grove.ai/autonomaton/` (the pattern playground) and `github.com/twocash/grove-autonomaton-pattern` (the pattern repo)
   - Add a "Build Your Own" section: "Visit the [Foundry](https://the-grove.ai/autonomaton/) to generate a Sovereign Manifesto and Recipe Bundle for your domain. Drop both files into Claude Code and build your own autonomaton in an afternoon."

4. **Update package.json.** Change the name from `grove-autonomaton-playground` to `signal-watch-autonomaton`. Bump version to `1.0.0`.

5. **Verify .env.example exists.** Devs cloning need to know what env vars to set (API keys). Should already exist — verify it lists the expected variables.

6. **Verify build passes clean.**
```bash
npm run build
npm run lint
```

7. **Create new GitHub repo.** `github.com/twocash/signal-watch` — public, CC BY 4.0.

8. **Update git remote and push.**
```bash
git remote set-url origin https://github.com/twocash/signal-watch.git
git add -A
git commit -m "chore: prepare for public release as Signal Watch reference implementation"
git push -u origin main
```


### Workstream B: Deploy to the-grove.ai/signal-watch-autonomaton/

Two options here — depends on how Jim wants to manage Vercel:

**Option A: Same Vercel project, new route.**
The existing `launch-the-grove-ai` Vercel project serves `the-grove.ai/autonomaton/`. Add Signal Watch as a second route. This requires either:
- A monorepo build that outputs both apps to different base paths
- OR a separate Vercel project on the same domain with path-based routing

**Option B: Separate Vercel project.**
New project `signal-watch-autonomaton` on team `team_odJBQTq9WJT64ceCXCYei9gl`. Domain: `the-grove.ai` with path rewrite `/signal-watch-autonomaton/*` → Signal Watch build. This is cleaner — each app deploys independently.

**Recommendation: Option B.** Separate Vercel project. Each app has its own build, its own deploy, its own logs. The domain routing is a Vercel config — path rewrites in `vercel.json` on the root project, or a separate project with the subdirectory path.

**Vercel setup:**
```bash
cd C:\GitHub\signal-watch
npx vercel link   # Link to new project "signal-watch-autonomaton"
npx vercel --prod # Deploy
```

Or create via Vercel dashboard: import `twocash/signal-watch` repo, set framework to Vite, set output directory to `dist`, set build command to `npm run build`.

**Domain routing:** The existing `the-grove.ai` domain needs to route `/signal-watch-autonomaton/*` to this new project. This is done via Vercel rewrites in the root project's `vercel.json`:

```json
{
  "rewrites": [
    { "source": "/signal-watch-autonomaton/:path*", "destination": "https://signal-watch-autonomaton.vercel.app/:path*" }
  ]
}
```

OR assign `the-grove.ai` directly to the new project and use path-based routing at the DNS/Vercel level. Jim's call on the routing approach — this is an infra decision.

---

### Workstream C: Cross-reference from Foundry output

**In `C:\GitHub\grove-autonomaton-pattern`:**

1. **Update `src/utils/blueprint-generator.ts`** — The Manifesto's "Build This Autonomaton" CTA section adds a reference implementation link:

Add after the 5-step instructions, before the phase list:

```html
<p style="font-family: 'Fragment Mono', monospace; font-size: 12px; color: var(--grove-text-mid); margin-top: 16px;">
  <strong style="color: var(--grove-amber);">Reference implementation:</strong> 
  <a href="https://github.com/twocash/signal-watch" target="_blank" style="color: var(--grove-amber);">github.com/twocash/signal-watch</a> 
  — The working app these files were extracted from. Clone it for polished components, or build fresh from the recipe.
  <br/>
  <strong style="color: var(--grove-amber);">See it live:</strong> 
  <a href="https://the-grove.ai/signal-watch-autonomaton/" target="_blank" style="color: var(--grove-amber);">the-grove.ai/signal-watch-autonomaton</a>
</p>
```

2. **Update `src/utils/recipe-generator.ts`** — The Recipe Bundle's "How To Use" section adds:

After step 5 ("Review. Approve. Repeat for Phases 2-4."), add:

```markdown
**Want the polished version?** Clone the [Signal Watch reference implementation](https://github.com/twocash/signal-watch) for production-grade components (BriefingInbox, CommandBar, Dashboard, RedZoneTakeover, voice presets, prompt templates). The recipe configs drop right in.

**See it live:** [the-grove.ai/signal-watch-autonomaton](https://the-grove.ai/signal-watch-autonomaton/)
```

3. **Build and commit.**
```bash
npm run build && npm run lint
git commit -m "feat: cross-reference Signal Watch from Manifesto and Recipe Bundle"
```

---

## Sequencing

| Step | What | Where | Blocker |
|------|------|-------|---------|
| 1 | Clean repo + update config | signal-watch | None |
| 2 | Create GitHub repo | github.com | Jim (manual — repo creation) |
| 3 | Push to new remote | signal-watch | Step 2 |
| 4 | Deploy to Vercel | Vercel dashboard | Jim (manual — project creation + domain routing) |
| 5 | Verify live at the-grove.ai/signal-watch-autonomaton/ | Browser | Step 4 |
| 6 | Add cross-references to Foundry output | grove-autonomaton-pattern | Step 3 (needs the URL to be real) |
| 7 | Build + deploy updated Foundry | grove-autonomaton-pattern | Step 6 |

**Steps 2 and 4 require Jim's hands** — GitHub repo creation and Vercel project/domain config. Everything else can be Claude Code.

---

## Acceptance Criteria

1. **GitHub repo is public:** `github.com/twocash/signal-watch` exists, CC BY 4.0, clean commit history (no tmpclaude files), working README with live demo link.
2. **Live demo works:** `the-grove.ai/signal-watch-autonomaton/` loads the Signal Watch app. Dashboard, Briefing Inbox, CommandBar, voice presets all functional in demo mode.
3. **Manifesto references repo:** Download a Manifesto from the Foundry → "Build This Autonomaton" section includes GitHub link and live demo link.
4. **Recipe Bundle references repo:** Download a Recipe Bundle → "How To Use" section includes GitHub link and live demo link.
5. **Clone-and-run works:** `git clone`, `npm install`, `npm run dev` → working app on localhost.
6. **No secrets exposed:** No API keys, no .env files, no sensitive data in the public repo.

---

## What This Unlocks

The Foundry visitor now has three paths:

| Path | Effort | Gets You |
|------|--------|----------|
| **Build from scratch** | ~4 hours | Drop Manifesto + Recipe into Claude Code. "Build Phase 1." Architecture-correct, generated UI. |
| **Clone the reference** | ~30 min | `git clone`, swap recipe for your domain. Polished components, voice presets, prompt templates. |
| **See it live first** | 0 min | Visit the-grove.ai/signal-watch-autonomaton/. Experience the app before committing to build. |

Three paths, one pattern, zero pitch.

---

## Workstream D: Signal Watch Walkthrough Deck

The Autonomaton playground has `[ Anatomy of an Autonomaton ]` in the upper right — a 13-slide deck explaining the generic pattern. Signal Watch needs its own version: `[ How Signal Watch Works ]` — a walkthrough deck tuned to the competitive intelligence domain.

### UX Pattern (replicate exactly from playground)

- **Upper-right nav link:** `[ How Signal Watch Works ]` — same styling as `[ Anatomy of an Autonomaton ]`
- **First load:** Deck auto-opens to orient the visitor. "Here's what this app does."
- **Subsequent visits:** Deck stays closed. Link persists in upper right for re-access.
- **Overlay behavior:** Same as existing `DeckOverlay.tsx` — full-screen overlay, keyboard nav (← → Esc), dot navigation, left sidebar with slide titles.

### Infrastructure (already exists — reuse)

All of this is already in `src/components/Deck/`:
- `DeckOverlay.tsx` — The overlay container with keyboard nav, sidebar, dots
- `Slide.tsx` — Slide component with variants (title, scroll, last, default)
- `primitives/` — `ZoneCard`, `TierRow`, `FlywheelStep`, `CodeBlock`, `StatBox`, `Highlight`, `DeckPipeline`, `PrincipleRow`, `DeckCard`
- `deck.css` — Styling

**The ONLY file that changes is `slides/slideData.tsx`.** Replace the generic Autonomaton content with Signal Watch-specific content.

### Slide Content (8-10 slides, Signal Watch-specific)

**Slide 0: Title**
- Eyebrow: "Reference Implementation — Signal Watch v1.0"
- Display: "Competitive Intelligence on the Autonomaton Pattern"
- Subtitle: "Track competitors. Classify signals. Surface briefings. All governed by zones you control."
- Lodestar: same

**Slide 1: What Signal Watch Does**
- Three cards: Monitor (RSS/API feeds → classified signals), Analyze (score adjustments, briefings), Govern (Green/Yellow/Red based on score deltas)
- The "30-second pitch" slide

**Slide 2: The Entity Model**
- What you're watching: WatchlistSubjects (OpenAI, Anthropic, Google DeepMind, Meta AI, xAI)
- Show entity card with score, type, tier, keywords
- "This is config. Change the watchlist, change the domain."

**Slide 3: Signal Classification**
- Raw signal → ClassifiedSignal → relevance, novelty, threatLevel
- Show the pipeline mapping: Signal enters → Recognition classifies → Compilation assembles briefing
- Use DeckPipeline primitive with Signal Watch labels

**Slide 4: Zone Governance for Competitive Intelligence**
- ZoneCard x3 but with Signal Watch specifics:
  - GREEN: Score delta < 0.05, routine signals, auto-archive
  - YELLOW: Delta 0.05-0.15, draft briefing with proposed adjustments, human approves
  - RED: Delta ≥ 0.15 or tier crossing, full strategic briefing, human decides everything
- Show the zones.schema excerpt with Signal Watch thresholds

**Slide 5: Cognitive Routing — The 30 Intents**
- TierRow x4 but with Signal Watch examples:
  - Tier 0: fetch_rss, apply_keyword_filters, execute_skills
  - Tier 1: classify_keyword_signals, compile_routine_briefing
  - Tier 2: ad_hoc_scan, brief_me_on, multi_subject_correlation
  - Tier 3: strategic_briefing, historical_patterns

**Slide 6: Briefing System**
- Three briefing types: Routine (Green), Significant (Yellow), Strategic (Red)
- Show Red Zone Takeover concept: full-screen, all context, human decides
- "The system surfaces information. You make the call."

**Slide 7: Voice Presets**
- Three presets with previews: Strategic Analyst, Executive Brief, Operator Log
- Show the same event described three ways
- "Voice presets change HOW. Not WHAT."

**Slide 8: The Knowledge Layer**
- Three knowledge files: competitive-landscape.md, scoring-methodology.md, contrarian-lens.md
- "These are markdown files. Swap them for RAG, Notion, or your own expertise."
- "The system thinks differently based on what you put here."

**Slide 9: Build Your Own**
- The CTA slide
- "This is a reference implementation. Fork it for your domain."
- Three paths: Build from scratch (Foundry), Clone and customize (GitHub), See the pattern (the-grove.ai/autonomaton)
- Link to Foundry, GitHub, and pattern playground

### Metadata update

Update `slideMetadata` to match the new slides:

```typescript
export const slideMetadata = [
  { id: 'title', title: 'Signal Watch' },
  { id: 'what', title: 'What It Does' },
  { id: 'entities', title: 'Entity Model' },
  { id: 'signals', title: 'Signal Classification' },
  { id: 'zones', title: 'Zone Governance' },
  { id: 'routing', title: 'Cognitive Routing' },
  { id: 'briefings', title: 'Briefing System' },
  { id: 'voice', title: 'Voice Presets' },
  { id: 'knowledge', title: 'Knowledge Layer' },
  { id: 'build', title: 'Build Your Own' },
]
```

### Header update

Update `src/components/Header/Header.tsx` — change the deck link text from `[ Anatomy of an Autonomaton ]` to `[ How Signal Watch Works ]`.

### First-load behavior

Check how the playground handles first-load auto-open. If it's in state (e.g., `isDeckOpen: true` in initial state), replicate that. If it uses localStorage, replicate the key. The goal: first visit opens the deck, subsequent visits don't.

---

## Files Changed (Workstream D)

| File | Change | Risk |
|------|--------|------|
| `src/components/Deck/slides/slideData.tsx` | **REWRITE** — All slide content replaced with Signal Watch-specific | Medium — lots of content |
| `src/components/Header/Header.tsx` | **MODIFY** — Update deck link text | Low |

---

## Updated Sequencing

| Step | What | Where | Blocker |
|------|------|-------|---------|
| 1 | Clean repo + update config | signal-watch | None |
| 2 | Rewrite deck slides for Signal Watch | signal-watch | None (parallel with Step 1) |
| 3 | Update Header deck link text | signal-watch | None |
| 4 | Create GitHub repo | github.com | Jim (manual) |
| 5 | Push to new remote | signal-watch | Step 4 |
| 6 | Deploy to Vercel | Vercel dashboard | Jim (manual) |
| 7 | Verify live at the-grove.ai/signal-watch-autonomaton/ | Browser | Step 6 |
| 8 | Add cross-references to Foundry output | grove-autonomaton-pattern | Step 5 (needs real URL) |
| 9 | Build + deploy updated Foundry | grove-autonomaton-pattern | Step 8 |

Steps 4 and 6 need Jim's hands. Steps 1-3 can be a single Claude Code session on the signal-watch repo. Steps 8-9 are a separate session on grove-autonomaton-pattern.

---

## Updated Acceptance Criteria

1. **GitHub repo is public:** `github.com/twocash/signal-watch` — clean, CC BY 4.0, no tmpclaude files, working README.
2. **Live demo works:** `the-grove.ai/signal-watch-autonomaton/` loads. Dashboard, Briefing Inbox, CommandBar functional in demo mode.
3. **Walkthrough deck works:** First load auto-opens the deck. `[ How Signal Watch Works ]` link in upper right. 10 slides walk through entities, signals, zones, routing, briefings, voice presets, knowledge layer. Last slide CTAs to Foundry and GitHub.
4. **Manifesto cross-references:** Foundry Manifesto includes GitHub link and live demo link in "Build It" section.
5. **Recipe Bundle cross-references:** Recipe Bundle includes GitHub link and live demo link in "How To Use" section.
6. **Clone-and-run works:** `git clone`, `npm install`, `npm run dev` → working app on localhost.
7. **No secrets exposed:** No API keys, no .env values, no sensitive data.

---

## What This Unlocks

Three paths for every Foundry visitor:

| Path | Effort | Gets You |
|------|--------|----------|
| **Build from scratch** | ~4 hours | Manifesto + Recipe → Claude Code → architecture-correct app |
| **Clone the reference** | ~30 min | `git clone` → swap recipe → polished components free |
| **See it live first** | 0 min | the-grove.ai/signal-watch-autonomaton/ → "I want that" |

The walkthrough deck is the bridge between "see it live" and "build my own." Visitor sees Signal Watch, clicks through the deck, understands how entities, zones, routing, and knowledge files map to the working app they're looking at. Then they go to the Foundry and build theirs.

Three paths, one pattern, zero pitch.


---

## Workstream E: Branding — "Autonomaton" Not "Monitor"

The subtitle currently reads "Competitive Intelligence Monitor." Change to **"Competitive Intelligence Autonomaton"** everywhere it appears.

This is a find-and-replace across the repo. Every instance of "Competitive Intelligence Monitor" becomes "Competitive Intelligence Autonomaton." The word "monitor" is a generic category. "Autonomaton" is the thesis — every time someone reads it, they're learning the vocabulary.

**Files likely affected:**
- `README.md` (title and description)
- `src/components/Header/Header.tsx` (app subtitle)
- `package.json` (description field)
- `index.html` (page title)
- `recipes/signal-watch/README.md`
- Any slide content in `src/components/Deck/slides/slideData.tsx`
- `src/config/defaults.ts` or anywhere the app name is referenced

**Search pattern:**
```bash
grep -ri "competitive intelligence monitor" src/ recipes/ *.md *.json *.html --include="*.ts" --include="*.tsx" --include="*.md" --include="*.json" --include="*.html"
```

Replace all matches. Also check for standalone "Monitor" in contexts where it clearly refers to the app name.

This is a 5-minute find-and-replace. Do it as part of Workstream A (repo prep).


---

## Workstream E: Branding — "Autonomaton" Not "Monitor"

The subtitle currently reads "Competitive Intelligence Monitor." Change to **"Competitive Intelligence Autonomaton"** everywhere it appears.

Find-and-replace across the repo. Every instance of "Competitive Intelligence Monitor" becomes "Competitive Intelligence Autonomaton." The word "monitor" is a generic category. "Autonomaton" is the thesis.

**Search pattern:**
```bash
grep -ri "competitive intelligence monitor" src/ recipes/ *.md *.json *.html
```

Replace all matches. Do this as part of Workstream A (repo prep) — it's a 5-minute change.

Also update the Foundry's recipe config in `grove-autonomaton-pattern` — `src/config/signal-watch-recipe.ts` may reference the old subtitle. Catch it there too.

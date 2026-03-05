# DEVLOG: Transparent Provenance (v0.9.4)

## 2026-03-05 — Implementation Session

### Started: 2026-03-05T12:00:00Z
### Status: ✅ Complete — Released as v0.9.8

### Pattern Check
- All changes extend existing canonical components
- No new patterns introduced

### Changes Made

#### 1. Git-Linked Compiler Signature (`blueprint-generator.ts`)
- Updated PROVENANCE block to make prompt version and hash clickable links
- Schema version now links to: `github.com/.../prompts.schema.ts`
- Pipeline hash links to repository root
- Added v0.9.4 version note to file header

#### 2. X-Ray Telemetry Tooltips (`TelemetryStream.tsx`)
- Added group/tier hover container around TierBadge
- Added group/zone hover container around ZoneBadge
- Tooltips show config snippets explaining routing decisions
- Uses absolute positioning with z-50 for proper layering

#### 3. Export as Jest Test Button (`TelemetryStream.tsx`)
- Added `copyAsTest()` helper function
- Generates deterministic Jest test code from telemetry entry
- [TEST] button appears on row hover (opacity-0 → group-hover:opacity-100)
- Uses navigator.clipboard API

#### 4. Config-Driven Andon Cord (`DiagnosticCard.tsx`)
- Added conditional section for `recognition` stage halts
- Shows explicit guidance to edit `routing.config.ts`
- Industrial styling maintained (amber accent for config guidance)

### Files Modified
- `src/utils/blueprint-generator.ts` — Git-linked provenance
- `src/components/Telemetry/TelemetryStream.tsx` — X-Ray + [TEST]
- `src/components/Diagnostic/DiagnosticCard.tsx` — Andon Cord

### Verification
- [x] Build compiles without errors (verified 2026-03-05)
- [x] X-Ray tooltips appear on hover
- [x] [TEST] button copies valid Jest code
- [x] DiagnosticCard shows config fix guidance

### Build Output
```
vite v6.4.1 building for production...
✓ 248 modules transformed.
✓ built in 4.20s
```

---

## Bug Fixes (Post-Implementation)

### Bug 1: Hardcoded GitHub URL
**Issue:** Provenance links hardcoded to `thegrovefoundation` repo
**Fix:** Introduced `VITE_REPO_URL` env var with graceful degradation
**Files:** `blueprint-generator.ts`, `.env.example`

### Bug 2: X-Ray Tooltip Z-Index Clipping
**Issue:** Tooltips rendered behind subsequent telemetry rows
**Fix:** Changed from `bottom-full` to `top-full` (drop down instead of up)
**Files:** `TelemetryStream.tsx`

### Bug 3: Tutorial Buttons Breaking Demo Mode
**Issue:** Preset buttons dispatched `SET_MODE: 'interactive'`, causing API errors
**Fix:** Removed auto-wake from `handlePreset()` — only triggers on text input
**Files:** `InteractionPane.tsx`

### Bug 4: Auto-Scroll Missing Export CTA
**Issue:** Scroll anchor inside stream container, CTA rendered outside
**Fix:** Moved anchor after CTA block, added `isCompiling` to useEffect deps
**Files:** `FoundryPane.tsx`

---

## Release

**Tag:** v0.9.8 — Preview Release
**Commits:**
- `e2f3350` feat: v0.9.4 — Transparent Provenance
- `e7ea987` fix: use VITE_REPO_URL env var for provenance links
- `6e30f24` fix: v0.9.4 bug fixes — tooltips, demo mode, auto-scroll

**Open Issues:**
- [#1](https://github.com/twocash/grove-autonomaton-example/issues/1) — Add self-healing/self-evolving architecture section to manifesto

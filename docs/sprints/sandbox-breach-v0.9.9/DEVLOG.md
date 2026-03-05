# DEVLOG: Sandbox Breach UX & Early Andon Cord (v0.9.9)

## 2026-03-05 — Implementation Session

### Started: 2026-03-05T19:00:00Z
### Status: ✅ Complete — Build verified

### Pattern Check
- All changes extend existing canonical components
- No new patterns introduced
- TelemetryEntry type extended (not replaced)
- HALT_PIPELINE pattern reused

### Changes Made

#### 1. TelemetryEntry Type Extension (`state/types.ts`)
- Added `message?: string` for human-readable system alerts
- Follows existing optional field pattern (modelUsed, tokensIn, tokensOut)

#### 2. TelemetryStream Message Rendering (`TelemetryStream.tsx`)
- Added conditional render for `entry.message`
- Amber styling with animate-pulse for visibility
- Positioned after skillMatch badge for consistency

#### 3. Sandbox Breach Telemetry Wake-Up (`InteractionPane.tsx`)
- Added telemetry dispatch to onClick and onKeyDown handlers
- Dispatches `ADD_TELEMETRY` with `intent: 'system_alert'` and message
- Entry appears in TelemetryStream with amber message: "Sandbox breach: Live Mode activated"

#### 4. Live Mode Warning (`InteractionPane.tsx`)
- Added persistent amber warning above input when `mode === 'interactive'`
- Text: "LIVE MODE: API keys required for T2/T3"
- Includes animated pulse indicator

#### 5. Early Andon Cord (`pipeline-orchestrator.ts`)
- Added API key validation in Stage 03 (Compilation)
- Checks after intent classification determines required tier
- Halts BEFORE interaction is created (before Yellow Zone approval card)
- Error message includes tier, model, and provider info
- Proposed fix guides user to Config panel or Demo mode

### Files Modified
- `src/state/types.ts` — TelemetryEntry.message
- `src/components/Telemetry/TelemetryStream.tsx` — Message rendering
- `src/components/Interaction/InteractionPane.tsx` — Wake-up + warning
- `src/services/pipeline-orchestrator.ts` — Early Andon Cord
- `src/App.tsx` — Version bump to 0.9.9

### Verification
- [x] Build compiles without errors (verified 2026-03-05)
- [ ] Manual: Telemetry shows sandbox breach alert
- [ ] Manual: Amber warning appears in Live Mode
- [ ] Manual: Missing API key halts at compilation (not execution)

### Build Output
```
vite v6.4.1 building for production...
✓ 248 modules transformed.
✓ built in 5.13s
```

---

## Process Note

This sprint was initially attempted without Foundation Loop methodology, resulting in a "hack job" that broke UX. After rollback to v0.9.8, proper Foundation Loop was followed:

1. Feature-tier artifacts created (SPEC + DEVLOG)
2. Pattern Check completed — all requirements extend existing patterns
3. Canonical Source Audit completed — no duplication
4. User corrections incorporated before execution
5. Build verified before completion

This demonstrates the value of the Foundation Loop for even "simple" polish sprints.

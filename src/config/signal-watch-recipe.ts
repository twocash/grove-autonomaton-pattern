/**
 * Signal Watch Recipe — Embedded Source Files
 *
 * Contains the VERBATIM source code from C:\GitHub\signal-watch\recipes\signal-watch\
 * These are the ACTUAL working config files from the reference implementation.
 * Do NOT paraphrase, regenerate, or simplify — these are production files.
 *
 * VERSION: 1.0.0
 */

export interface RecipeFile {
  filename: string
  description: string
  content: string
}

export interface RecipeBundle {
  name: string
  version: string
  description: string
  files: RecipeFile[]
}

// =============================================================================
// SIGNAL WATCH RECIPE BUNDLE
// =============================================================================

export const SIGNAL_WATCH_RECIPE: RecipeBundle = {
  name: 'Signal Watch',
  version: '1.0.0',
  description: 'Competitive intelligence monitor built on the Grove Autonomaton Pattern',
  files: [
    // =========================================================================
    // CONFIG FILES
    // =========================================================================
    {
      filename: 'config/defaults.ts',
      description: 'Default AI watchlist — 5 competitors with scores and keywords',
      content: `/**
 * Signal Watch Recipe — Default Watchlist
 *
 * Pre-configured AI competitive landscape for frictionless onboarding.
 *
 * VERSION: 1.0.0
 * Following Sovereign Manifesto Directive #3: Config before code
 */

import type { Watchlist, WatchlistSubject } from '../state/types'

// =============================================================================
// DEFAULT AI COMPETITORS
// =============================================================================

export const DEFAULT_AI_SUBJECTS: WatchlistSubject[] = [
  {
    id: 'openai',
    name: 'OpenAI',
    type: 'competitor',
    tier: 'primary',
    baselineScore: 0.85,
    keywords: ['openai', 'gpt', 'chatgpt', 'sam altman', 'o1', 'o3', 'gpt-4', 'gpt-5', 'dall-e', 'sora'],
    aliases: ['OAI'],
    sources: [],
    lastUpdated: new Date().toISOString(),
    history: [],
  },
  {
    id: 'anthropic',
    name: 'Anthropic',
    type: 'competitor',
    tier: 'primary',
    baselineScore: 0.80,
    keywords: ['anthropic', 'claude', 'dario amodei', 'constitutional ai', 'claude code', 'opus', 'sonnet', 'haiku'],
    aliases: [],
    sources: [],
    lastUpdated: new Date().toISOString(),
    history: [],
  },
  {
    id: 'google-deepmind',
    name: 'Google DeepMind',
    type: 'competitor',
    tier: 'primary',
    baselineScore: 0.82,
    keywords: ['google', 'deepmind', 'gemini', 'bard', 'demis hassabis', 'google ai', 'gemma', 'alphafold'],
    aliases: ['Google AI', 'DeepMind'],
    sources: [],
    lastUpdated: new Date().toISOString(),
    history: [],
  },
  {
    id: 'meta-ai',
    name: 'Meta AI',
    type: 'competitor',
    tier: 'secondary',
    baselineScore: 0.72,
    keywords: ['meta ai', 'llama', 'facebook ai', 'yann lecun', 'meta llama'],
    aliases: ['FAIR', 'Facebook AI Research'],
    sources: [],
    lastUpdated: new Date().toISOString(),
    history: [],
  },
  {
    id: 'xai',
    name: 'xAI',
    type: 'competitor',
    tier: 'emerging',
    baselineScore: 0.65,
    keywords: ['xai', 'grok', 'elon musk ai', 'x ai'],
    aliases: [],
    sources: [],
    lastUpdated: new Date().toISOString(),
    history: [],
  },
]

// =============================================================================
// DEFAULT WATCHLIST
// =============================================================================

export const DEFAULT_AI_WATCHLIST: Watchlist = {
  id: 'ai-landscape',
  name: 'AI Competitive Landscape',
  version: '1.0.0',
  subjects: DEFAULT_AI_SUBJECTS,
  lastModified: new Date().toISOString(),
}
`,
    },
    {
      filename: 'config/zones.ts',
      description: 'Green/Yellow/Red governance with score delta thresholds',
      content: `/**
 * Signal Watch Recipe — Zone Schema
 *
 * Competitive intelligence governance based on:
 * - Score delta magnitude (how much competitive scores change)
 * - Signal threat level (routine, significant, critical)
 * - Special conditions (tier crossings, structural events)
 *
 * VERSION: 1.0.0
 * Following Sovereign Manifesto Directive #3: Config before code
 */

import type { ZonesSchema, Zone } from '../state/types'

// Re-export SignalLevel for convenience
export type { SignalLevel } from '../state/types'

/**
 * Score delta thresholds for zone determination
 */
export const ZONE_THRESHOLDS = {
  greenMax: 0.05,    // Below this → GREEN zone
  yellowMax: 0.15,   // Below this (but >= greenMax) → YELLOW zone
  // >= yellowMax → RED zone
} as const

/**
 * Determine zone based on score delta and signal level
 */
export function determineZone(
  delta: number,
  signalLevel: 'routine' | 'significant' | 'critical',
  tierCrossing: boolean = false
): Zone {
  // RED zone triggers (any one of these)
  if (Math.abs(delta) >= ZONE_THRESHOLDS.yellowMax) return 'red'
  if (signalLevel === 'critical') return 'red'
  if (tierCrossing) return 'red'

  // YELLOW zone triggers
  if (Math.abs(delta) >= ZONE_THRESHOLDS.greenMax) return 'yellow'
  if (signalLevel === 'significant') return 'yellow'

  // Default to GREEN
  return 'green'
}

export const defaultZonesSchema: ZonesSchema = {
  zones: {
    green: {
      meaning: 'Routine Monitoring',
      flywheel_eligible: true,
      thresholds: {
        maxScoreDelta: ZONE_THRESHOLDS.greenMax,
        signalLevel: 'routine',
      },
      allows: [
        'log_briefing',
        'update_telemetry',
        'archive_low_relevance',
        'fetch_rss',
        'apply_keyword_filters',
        'execute_skills',
        'classify_keyword_signals',
        'compile_routine_briefing',
        'quick_relevance',
      ],
      forbids: [
        'update_baseline_scores',
        'send_alerts',
        'recommend_strategic_actions',
      ],
      description: 'Routine monitoring with all score deltas < 0.05 and no significant signals. System executes autonomously.',
    },

    yellow: {
      meaning: 'Significant Shift',
      flywheel_eligible: true,
      thresholds: {
        minScoreDelta: ZONE_THRESHOLDS.greenMax,
        maxScoreDelta: ZONE_THRESHOLDS.yellowMax,
        signalLevel: 'significant',
      },
      allows: [
        'draft_briefing',
        'highlight_adjustments',
        'request_analysis',
        'classify_novel_signals',
        'multi_subject_correlation',
        'ad_hoc_scan',
        'analyze_score_shifting_events',
        'historical_patterns',
        'notify_operator',
      ],
      requiresApproval: [
        'update_baseline_scores',
        'promote_skill',
        'modify_source_reliability',
      ],
      description: 'Significant shift detected (delta 0.05-0.15 or "significant" signal). System proposes, human approves.',
    },

    red: {
      meaning: 'Structural Event',
      flywheel_eligible: false,  // CRITICAL: Strategic ops cannot become skills
      thresholds: {
        minScoreDelta: ZONE_THRESHOLDS.yellowMax,
        signalLevel: 'critical',
        tierCrossing: true,
      },
      allows: [
        'compile_strategic_briefing',
        'surface_implications',
        'present_historical_context',
        'urgent_notification',
      ],
      requiresHumanDecision: true,  // ALL actions require human decision
      forbids: [
        'suggest_investment_decisions',
        'recommend_strategic_pivots',
        'auto_execute_anything',
      ],
      description: 'Structural event (delta >= 0.15, "critical" signal, or tier crossing). Human decision required for ALL actions.',
    },
  },
}

/**
 * Serialize zones schema to YAML-like string for display
 */
export function serializeZonesSchema(schema: ZonesSchema): string {
  let yaml = \`# SIGNAL WATCH ZONES SCHEMA — Competitive Intelligence Governance
#
# Zone Thresholds:
#   GREEN  → Score delta < 0.05, routine signals only
#   YELLOW → Score delta 0.05-0.15, or significant signals
#   RED    → Score delta >= 0.15, critical signals, or tier crossing
#
# Key Governance Rules:
#   - GREEN zone operations can become skills (flywheel eligible)
#   - YELLOW zone operations require human approval
#   - RED zone operations NEVER become skills (governance lock)
#
# The zone determines autonomy level, not capability level.
# A Tier 3 model can still only execute what the zone allows.

zones:
\`

  for (const [name, zone] of Object.entries(schema.zones)) {
    yaml += \`  \${name}:\\n\`
    yaml += \`    meaning: "\${zone.meaning}"\\n\`
    yaml += \`    flywheel_eligible: \${zone.flywheel_eligible}\\n\`
    yaml += \`    description: "\${zone.description}"\\n\`
    yaml += \`    allows:\\n\`
    for (const action of zone.allows) {
      yaml += \`      - \${action}\\n\`
    }
    if (zone.forbids) {
      yaml += \`    forbids:\\n\`
      for (const action of zone.forbids) {
        yaml += \`      - \${action}\\n\`
      }
    }
    if (zone.requiresApproval) {
      yaml += \`    requires_approval:\\n\`
      for (const action of zone.requiresApproval) {
        yaml += \`      - \${action}\\n\`
      }
    }
  }

  return yaml
}

/**
 * Get zone color class for consistent styling
 */
export function getZoneColorClass(zone: Zone): string {
  return \`zone-\${zone}\`
}

/**
 * Get zone description for UI display
 */
export function getZoneLabel(zone: Zone): string {
  const labels = {
    green: 'Routine',
    yellow: 'Significant',
    red: 'Structural',
  }
  return labels[zone]
}

/**
 * Get zone threshold description for UI
 */
export function getZoneThresholdLabel(zone: Zone): string {
  const labels = {
    green: 'Δ < 0.05',
    yellow: '0.05 ≤ Δ < 0.15',
    red: 'Δ ≥ 0.15',
  }
  return labels[zone]
}
`,
    },
    {
      filename: 'config/routing.ts',
      description: '30 intents mapped to tiers and zones',
      content: `/**
 * Signal Watch Recipe — Routing Configuration
 *
 * Declarative source of truth for competitive intelligence intent routing.
 * Edit this to change how the system behaves — no code changes required.
 *
 * VERSION: 1.0.0
 * Following Sovereign Manifesto Directive #3: Config before code
 */

import type { RoutingConfig } from '../state/types'

export const defaultRoutingConfig: RoutingConfig = {
  // Skill flywheel configuration (per Sovereign Manifesto)
  skillPromotion: {
    afterNApprovals: 5,            // Manifesto: after_n_approvals: 5
    promotableTiers: [1, 2],       // Tiers eligible for promotion to Tier 0
    scoreAdjustmentPatterns: true, // Enable flywheel for score adjustments
  },

  intents: {
    // =========================================================================
    // TIER 0 — Cached Skills (Local, Instant, Free)
    // Deterministic operations that don't require LLM inference
    // =========================================================================
    fetch_rss: {
      tier: 0,
      zone: 'green',
      description: 'Pull from configured RSS/API feeds',
      keywords: ['fetch', 'rss', 'pull', 'refresh', 'feed', 'update feeds'],
    },

    apply_keyword_filters: {
      tier: 0,
      zone: 'green',
      description: 'Apply learned keyword filters to signals',
      keywords: ['filter', 'keyword', 'match', 'apply filter'],
    },

    execute_skills: {
      tier: 0,
      zone: 'green',
      description: 'Execute cached skill patterns',
      keywords: [],  // Programmatic only — skills fire automatically
    },

    log_telemetry: {
      tier: 0,
      zone: 'green',
      description: 'Write telemetry entry to audit ledger',
      keywords: [],  // Programmatic only
    },

    log_briefing: {
      tier: 0,
      zone: 'green',
      description: 'Log briefing to archive',
      keywords: ['log', 'archive briefing'],
    },

    archive_low_relevance: {
      tier: 0,
      zone: 'green',
      description: 'Archive low-relevance signals automatically',
      keywords: ['archive', 'low relevance', 'dismiss'],
    },

    // =========================================================================
    // TIER 1 — Cheap Classification (Fast, Low-Cost)
    // Simple classification and routine operations
    // =========================================================================
    classify_keyword_signals: {
      tier: 1,
      zone: 'green',
      description: 'Classify signals by keyword match',
      keywords: ['classify', 'keyword', 'tag', 'categorize'],
    },

    compile_routine_briefing: {
      tier: 1,
      zone: 'green',
      description: 'Compile routine daily briefing (no adjustments)',
      keywords: ['briefing', 'routine', 'daily', 'summary', 'digest'],
    },

    quick_relevance: {
      tier: 1,
      zone: 'green',
      description: 'Quick relevance scoring for new signals',
      keywords: ['relevance', 'quick', 'score', 'triage'],
    },

    // =========================================================================
    // TIER 2 — Premium Classification (Standard Cloud Inference)
    // Complex analysis requiring more capable models
    // =========================================================================
    classify_novel_signals: {
      tier: 2,
      zone: 'yellow',
      description: 'Classify signals without keyword match',
      keywords: ['novel', 'new signal', 'unrecognized', 'unknown'],
    },

    multi_subject_correlation: {
      tier: 2,
      zone: 'yellow',
      description: 'Correlate signals across multiple watchlist subjects',
      keywords: ['correlate', 'multi', 'cross-subject', 'connect', 'pattern'],
    },

    ad_hoc_scan: {
      tier: 2,
      zone: 'yellow',
      description: 'User-requested ad-hoc intelligence scan',
      keywords: ['scan', 'ad-hoc', 'manual', 'investigate', 'research'],
    },

    brief_me_on: {
      tier: 2,
      zone: 'yellow',
      description: 'Research briefing on a specific subject',
      keywords: ['brief me on', 'brief me about', 'what about', 'update on', 'news on', 'tell me about'],
    },

    draft_briefing: {
      tier: 2,
      zone: 'yellow',
      description: 'Draft briefing with proposed adjustments for review',
      keywords: ['draft', 'briefing', 'prepare'],
    },

    highlight_adjustments: {
      tier: 2,
      zone: 'yellow',
      description: 'Highlight proposed score adjustments for review',
      keywords: ['highlight', 'adjustment', 'delta', 'change'],
    },

    request_analysis: {
      tier: 2,
      zone: 'yellow',
      description: 'Request deeper analysis of signals',
      keywords: ['analyze', 'deeper', 'request analysis', 'investigate'],
    },

    // =========================================================================
    // TIER 2 — YELLOW (Requires Approval)
    // Operations that change system state
    // =========================================================================
    update_baseline_scores: {
      tier: 2,
      zone: 'yellow',
      description: 'Update baseline competitive scores (requires approval)',
      keywords: ['update', 'baseline', 'score', 'adjust score'],
    },

    promote_skill: {
      tier: 2,
      zone: 'yellow',
      description: 'Promote signal pattern to cached skill',
      keywords: ['promote', 'skill', 'learn', 'automate'],
    },

    modify_source_reliability: {
      tier: 2,
      zone: 'yellow',
      description: 'Modify source reliability rating',
      keywords: ['reliability', 'source rating', 'trust', 'weight'],
    },

    // =========================================================================
    // TIER 3 — Apex Analysis (Maximum Capability)
    // Strategic analysis requiring highest-capability models
    // =========================================================================
    analyze_score_shifting_events: {
      tier: 3,
      zone: 'yellow',
      description: 'Analyze events that may shift competitive scores',
      keywords: ['analyze', 'shift', 'major', 'event', 'impact'],
    },

    historical_patterns: {
      tier: 3,
      zone: 'yellow',
      description: 'Analyze historical patterns for prediction',
      keywords: ['historical', 'pattern', 'trend', 'predict', 'history'],
    },

    // =========================================================================
    // TIER 3 — RED ZONE (Human Decision Required)
    // Strategic operations where system surfaces info only
    // =========================================================================
    strategic_briefing: {
      tier: 3,
      zone: 'red',
      description: 'Compile strategic briefing with tier implications',
      keywords: ['strategic', 'implications', 'critical', 'urgent'],
    },

    surface_implications: {
      tier: 3,
      zone: 'red',
      description: 'Surface strategic implications for human decision',
      keywords: ['implications', 'surface', 'present', 'show'],
    },

    // =========================================================================
    // FORBIDDEN INTENTS — Red Zone, Never Auto-Execute
    // =========================================================================
    suggest_investment_decisions: {
      tier: 3,
      zone: 'red',
      description: 'FORBIDDEN: Never suggest investment decisions',
      keywords: ['invest', 'buy', 'sell', 'trade', 'stock'],
    },

    recommend_strategic_pivots: {
      tier: 3,
      zone: 'red',
      description: 'FORBIDDEN: Never recommend strategic pivots autonomously',
      keywords: ['pivot', 'strategic change', 'direction'],
    },

    // =========================================================================
    // FALLBACK — Unmapped queries
    // =========================================================================
    ad_hoc_query: {
      tier: 2,
      zone: 'yellow',
      description: 'Unmapped custom user prompt',
      keywords: [],  // No keywords — this is the fallback
    },
  },
}

/**
 * Serialize config to YAML-like string for display in editor
 */
export function serializeRoutingConfig(config: RoutingConfig): string {
  let yaml = '# SIGNAL WATCH ROUTING CONFIGURATION\\n'
  yaml += '# Zone Thresholds: GREEN (<0.05 delta), YELLOW (0.05-0.15), RED (>=0.15)\\n\\n'
  yaml += 'intents:\\n'

  for (const [name, intent] of Object.entries(config.intents)) {
    yaml += \`  \${name}:\\n\`
    yaml += \`    tier: \${intent.tier}\\n\`
    yaml += \`    zone: \${intent.zone}\\n\`
    yaml += \`    description: "\${intent.description}"\\n\`
  }

  return yaml
}

/**
 * Parse YAML-like string back to config object
 * Simple parser for demo — not a full YAML implementation
 */
export function parseRoutingConfig(yaml: string): RoutingConfig | { error: string } {
  try {
    const config: RoutingConfig = { intents: {} }
    const lines = yaml.split('\\n')
    let currentIntent: string | null = null

    for (const line of lines) {
      const trimmed = line.trim()
      if (!trimmed || trimmed === 'intents:' || trimmed.startsWith('#')) continue

      // Intent name: exactly 2-space indent, word characters only, ends with colon
      const intentMatch = line.match(/^  (\\w+):$/)
      if (intentMatch) {
        currentIntent = intentMatch[1]
        config.intents[currentIntent] = {
          tier: 1,
          zone: 'green',
          description: '',
          keywords: defaultRoutingConfig.intents[currentIntent]?.keywords || [],
        }
        continue
      }

      // Property: exactly 4-space indent, "key: value" format
      if (currentIntent) {
        const propMatch = line.match(/^    (\\w+): (.+)$/)
        if (propMatch) {
          const [, key, value] = propMatch
          const intent = config.intents[currentIntent]

          if (key === 'tier') {
            const tier = parseInt(value)
            if (tier >= 0 && tier <= 3) intent.tier = tier as 0 | 1 | 2 | 3
          } else if (key === 'zone') {
            if (['green', 'yellow', 'red'].includes(value)) {
              intent.zone = value as 'green' | 'yellow' | 'red'
            }
          } else if (key === 'description') {
            intent.description = value.replace(/^"|"$/g, '')
          }
        }
      }
    }

    return config
  } catch (e) {
    return { error: \`Parse error: \${e}\` }
  }
}
`,
    },
    {
      filename: 'config/index.ts',
      description: 'Config barrel export',
      content: `/**
 * Signal Watch Recipe — Config Exports
 */

export * from './defaults'
export * from './routing'
export * from './zones'
`,
    },

    // =========================================================================
    // STATE FILES
    // =========================================================================
    {
      filename: 'state/types.ts',
      description: 'Domain types (WatchlistSubject, ClassifiedSignal, Briefing)',
      content: `/**
 * Signal Watch Recipe — Type Definitions
 *
 * Extends BaseAppState and BaseAppAction with competitive intelligence types.
 */

import type {
  BaseAppState,
  BaseAppAction,
  Tier,
  Zone,
  Interaction,
  Metrics,
} from '../../../src/core/state/types'

// Re-export core types for convenience
export * from '../../../src/core/state/types'

// =============================================================================
// SIGNAL LEVELS — Competitive intelligence threat classification
// =============================================================================

export type SignalLevel = 'routine' | 'significant' | 'critical'

// =============================================================================
// SIGNALS — Competitive intelligence signal types
// =============================================================================

export type SourceType = 'rss' | 'api' | 'webhook' | 'manual'

export interface RawSignal {
  id: string
  sourceId: string
  sourceName: string
  sourceType: SourceType
  sourceReliability: number
  timestamp: string
  title: string
  content: string
  url: string
  metadata: Record<string, unknown>
}

export interface WatchlistSubjectMatch {
  subjectId: string
  subjectName: string
  relevanceScore: number
  proposedScoreDelta: number
  deltaReason: string
}

export interface ClassifiedSignal extends RawSignal {
  classificationId: string
  relevance: number
  novelty: number
  threatLevel: SignalLevel
  impactLevel: 'low' | 'medium' | 'high'
  subjects: WatchlistSubjectMatch[]
  keywords: string[]
  tier: Tier
  zone: Zone
  confidence: number
}

// =============================================================================
// WATCHLIST — Competitive subjects to monitor
// =============================================================================

export type SubjectTier = 'primary' | 'secondary' | 'emerging'
export type SubjectType = 'competitor' | 'partner' | 'market' | 'technology' | 'regulatory'

export interface SourceConfig {
  id: string
  name: string
  type: SourceType
  url: string
  reliability: number
  refreshIntervalMs: number
  enabled: boolean
}

export interface ScoreHistoryEntry {
  timestamp: string
  score: number
  delta: number
  reason: string
  signalId: string | null
  approvedBy: 'system' | 'human'
}

export interface WatchlistSubject {
  id: string
  name: string
  type: SubjectType
  tier: SubjectTier
  baselineScore: number
  keywords: string[]
  aliases: string[]
  sources: SourceConfig[]
  lastUpdated: string
  history: ScoreHistoryEntry[]
}

export interface Watchlist {
  id: string
  name: string
  version: string
  subjects: WatchlistSubject[]
  lastModified: string
}

// =============================================================================
// SCORING — Competitive score adjustments
// =============================================================================

export interface ScoreAdjustment {
  id: string
  subjectId: string
  subjectName: string
  currentScore: number
  proposedScore: number
  delta: number
  reason: string
  signalIds: string[]
  triggeredBy: string
  confidence: number
  zone: Zone
  status: 'pending' | 'approved' | 'rejected'
  createdAt: string
  decidedAt: string | null
  decidedBy: 'system' | 'human' | null
}

// =============================================================================
// BRIEFINGS — Intelligence summaries
// =============================================================================

export type BriefingType = 'routine' | 'significant' | 'strategic'

export interface BriefingHighlight {
  text: string
  zone?: Zone
  subjectId?: string
  type?: 'new_entrant' | 'product_launch' | 'funding' | 'partnership' | 'regulatory' | 'talent'
}

export interface BriefingRecommendation {
  priority: 'high' | 'medium' | 'low'
  action: string
  rationale: string
  subject?: string
}

export interface ProposedSubject {
  id: string
  name: string
  type: SubjectType
  tier: SubjectTier
  keywords: string[]
  aliases: string[]
  initialScore: number
  rationale: string
}

export interface ResearchSource {
  url: string
  title: string
  citedText?: string
  pageAge?: string
}

export interface ResearchSection {
  analysis: string
  keyFindings: string[]
  sources: ResearchSource[]
  searchCount: number
  templateHash: string
}

export interface DomainConfig {
  version: string
  hash: string
  domain: {
    name: string
    description: string
  }
  signalTypes: Array<{
    label: string
    keywords: string[]
    icon?: string
  }>
  subjectTypes: Array<{
    label: string
    description: string
  }>
  scoringRubric: {
    factors: Array<{
      name: string
      weight: number
      description: string
    }>
  }
  domainKeywords: string[]
}

export interface Briefing {
  id: string
  title: string
  type: BriefingType
  timestamp: string
  tier: Tier
  signalCount: number
  period?: { start: string; end: string }
  signalIds?: string[]
  pendingAdjustments?: ScoreAdjustment[]
  pendingSubject?: ProposedSubject
  pendingDomainConfig?: DomainConfig
  research?: ResearchSection
  summary: string
  highlights: BriefingHighlight[]
  recommendations?: BriefingRecommendation[]
  zone: Zone
  status: 'draft' | 'delivered' | 'archived'
}

// =============================================================================
// EXTENDED INTERACTION — Signal Watch additions
// =============================================================================

export interface SignalWatchInteraction extends Interaction {
  signalIds?: string[]
  scoreDelta?: number
}

// =============================================================================
// EXTENDED METRICS — Signal Watch additions
// =============================================================================

export interface SignalWatchMetrics extends Metrics {
  signalsProcessed?: number
  signalsByThreatLevel?: Record<SignalLevel, number>
  pendingAdjustments?: number
  briefingsDelivered?: number
}

// =============================================================================
// VOICE PRESETS — Signal Watch specific
// =============================================================================

export type VoicePreset = 'strategic' | 'executive' | 'operator'

// =============================================================================
// SIGNAL WATCH STATE — Extends BaseAppState
// =============================================================================

export interface SignalWatchState extends BaseAppState {
  // Voice preset for briefing style
  voicePreset: VoicePreset

  // Competitive intelligence
  watchlist: Watchlist | null
  signals: ClassifiedSignal[]
  pendingAdjustments: ScoreAdjustment[]

  // Override view with Signal Watch views
  currentView: 'dashboard' | 'briefings' | 'config' | 'flywheel'
}

// =============================================================================
// SIGNAL WATCH ACTIONS — Extends BaseAppAction
// =============================================================================

export type SignalWatchAction =
  | BaseAppAction
  | { type: 'UPDATE_VOICE_PRESET'; preset: VoicePreset }
  | { type: 'SET_WATCHLIST'; watchlist: Watchlist }
  | { type: 'ADD_SIGNAL'; signal: ClassifiedSignal }
  | { type: 'ADD_SIGNALS'; signals: ClassifiedSignal[] }
  | { type: 'ADD_SCORE_ADJUSTMENT'; adjustment: ScoreAdjustment }
  | { type: 'APPROVE_SCORE_ADJUSTMENT'; id: string }
  | { type: 'REJECT_SCORE_ADJUSTMENT'; id: string }
`,
    },
    {
      filename: 'state/reducer.ts',
      description: 'Domain state machine',
      content: `/**
 * Signal Watch Recipe — Reducer
 *
 * Extends coreReducer with competitive intelligence actions.
 */

import { coreReducer } from '../../../src/core/state/reducer'
import type { SignalWatchState, SignalWatchAction, ScoreHistoryEntry } from './types'
import { defaultRoutingConfig } from '../config/routing'
import { defaultZonesSchema } from '../config/zones'
import { DEFAULT_AI_WATCHLIST } from '../config/defaults'

// =============================================================================
// INITIAL STATE — Signal Watch specific
// =============================================================================

export const signalWatchInitialState: SignalWatchState = {
  mode: 'demo',

  modelConfig: {
    tier0: { provider: 'local_memory', apiKey: null, model: 'cached_skill' },
    tier1: { provider: 'anthropic', apiKey: null, model: 'claude-3-haiku-20240307' },
    tier2: { provider: 'anthropic', apiKey: null, model: 'claude-sonnet-4-20250514' },
    tier3: { provider: 'anthropic', apiKey: null, model: 'claude-opus-4-20250514' },
  },

  routingConfig: defaultRoutingConfig,
  zonesSchema: defaultZonesSchema,
  voicePreset: 'strategic',

  // Pre-configured AI competitors for frictionless onboarding
  watchlist: DEFAULT_AI_WATCHLIST,
  signals: [],
  pendingAdjustments: [],

  pipeline: {
    currentStage: null,
    stages: {
      telemetry: 'idle',
      recognition: 'idle',
      compilation: 'idle',
      approval: 'idle',
      execution: 'idle',
    },
    halted: false,
    haltReason: null,
  },

  interactions: [],
  pendingApproval: null,

  skills: [],
  patternCounts: {},
  skillProposal: { active: false, intent: null, pattern: null, count: 0 },

  metrics: {
    totalCost: 0,
    interactionCount: 0,
    tierHistory: [],
    localCount: 0,
    skillsFired: 0,
    costHistory: [],
  },

  telemetry: [],
  selectedTelemetryId: null,
  selectedInteractionId: null,

  tutorial: {
    active: true,
    currentStep: 0,
    completed: false,
  },

  simulateFailure: 'none',
  configRipple: false,
  currentView: 'briefings',

  isDeckOpen: typeof window !== 'undefined' && !localStorage.getItem('grove_hasSeenDeck'),
  activeSlideIndex: 0,

  foundry: {
    input: '',
    isCompiling: false,
    generatedPRD: '',
    compilerLogs: [],
    error: null,
  },
}

// =============================================================================
// REDUCER
// =============================================================================

export function signalWatchReducer(
  state: SignalWatchState,
  action: SignalWatchAction
): SignalWatchState {
  switch (action.type) {
    // =========================================================================
    // SIGNAL WATCH SPECIFIC ACTIONS
    // =========================================================================
    case 'UPDATE_VOICE_PRESET':
      return { ...state, voicePreset: action.preset }

    case 'SET_WATCHLIST':
      return { ...state, watchlist: action.watchlist }

    case 'ADD_SIGNAL':
      return {
        ...state,
        signals: [...state.signals, action.signal],
      }

    case 'ADD_SIGNALS':
      return {
        ...state,
        signals: [...state.signals, ...action.signals],
      }

    case 'ADD_SCORE_ADJUSTMENT':
      return {
        ...state,
        pendingAdjustments: [...state.pendingAdjustments, action.adjustment],
      }

    case 'APPROVE_SCORE_ADJUSTMENT': {
      const adjustment = state.pendingAdjustments.find(a => a.id === action.id)
      if (!adjustment || !state.watchlist) return state

      return {
        ...state,
        watchlist: {
          ...state.watchlist,
          subjects: state.watchlist.subjects.map(subject =>
            subject.id === adjustment.subjectId
              ? {
                  ...subject,
                  baselineScore: adjustment.proposedScore,
                  lastUpdated: new Date().toISOString(),
                  history: [
                    ...subject.history,
                    {
                      timestamp: new Date().toISOString(),
                      score: adjustment.proposedScore,
                      delta: adjustment.delta,
                      reason: adjustment.reason,
                      signalId: adjustment.signalIds?.[0] || null,
                      approvedBy: 'human' as const,
                    } satisfies ScoreHistoryEntry,
                  ],
                }
              : subject
          ),
        },
        pendingAdjustments: state.pendingAdjustments.map(a =>
          a.id === action.id ? { ...a, status: 'approved' as const } : a
        ),
      }
    }

    case 'REJECT_SCORE_ADJUSTMENT':
      return {
        ...state,
        pendingAdjustments: state.pendingAdjustments.map(a =>
          a.id === action.id ? { ...a, status: 'rejected' as const } : a
        ),
      }

    // =========================================================================
    // DELEGATE TO CORE REDUCER
    // =========================================================================
    default:
      // Pass to core reducer for base actions
      return coreReducer(state, action) as SignalWatchState
  }
}
`,
    },
    {
      filename: 'state/context.tsx',
      description: 'React provider',
      content: `/**
 * Signal Watch Recipe — Provider
 *
 * Wraps core provider with Signal Watch state and reducer.
 * This is the entry point for recipe activation.
 */

import { type ReactNode } from 'react'
import { createRecipeProvider } from '../../../src/core/state/context'
import { signalWatchReducer, signalWatchInitialState } from './reducer'
import type { SignalWatchState, SignalWatchAction } from './types'

// Create the Signal Watch provider using core factory
const { Provider, useAppState, useAppDispatch } = createRecipeProvider<
  SignalWatchState,
  SignalWatchAction
>(signalWatchReducer, signalWatchInitialState)

// Re-export with recipe-specific names
export { useAppState, useAppDispatch }

// Convenience aliases
export const useSignalWatchState = useAppState
export const useSignalWatchDispatch = useAppDispatch

/**
 * SignalWatchProvider — Root provider for Signal Watch recipe
 */
export function SignalWatchProvider({ children }: { children: ReactNode }) {
  return <Provider>{children}</Provider>
}
`,
    },
    {
      filename: 'state/index.ts',
      description: 'State barrel export',
      content: `/**
 * Signal Watch Recipe — State Exports
 */

export * from './types'
export * from './reducer'
export * from './context'
`,
    },

    // =========================================================================
    // ENTRY POINT
    // =========================================================================
    {
      filename: 'index.ts',
      description: 'Recipe entry point',
      content: `/**
 * Signal Watch Recipe — Main Export
 *
 * This is the entry point for the Signal Watch recipe.
 * Import everything from here to activate the recipe.
 *
 * Usage:
 *   import { SignalWatchProvider, SignalWatchApp } from './recipes/signal-watch'
 *
 * The recipe extends the core autonomaton with:
 * - Competitive intelligence domain vocabulary (subjects, signals, briefings)
 * - AI landscape watchlist with 5 default competitors
 * - Zone-based governance for score adjustments
 * - Strategic briefing compilation
 */

// State
export * from './state'

// Config
export * from './config'

// Re-export useful core types
export type {
  BaseAppState,
  BaseAppAction,
  Tier,
  Zone,
  Interaction,
  TelemetryEntry,
} from '../../src/core/state/types'
`,
    },
  ],
}

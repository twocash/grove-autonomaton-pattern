/**
 * Signal Watch — Type Definitions
 *
 * Competitive Intelligence Monitor based on Grove Autonomaton Pattern.
 * These types define the entire application state.
 */

import type { DomainConfig } from '../config/prompts/domain.template'

// Re-export for convenience
export type { DomainConfig }

// =============================================================================
// PIPELINE — The five-stage invariant
// =============================================================================

/** The five stages every interaction traverses */
export type PipelineStage =
  | 'telemetry'    // Signal ingest, create trace
  | 'recognition'  // Classify signal, select tier
  | 'compilation'  // Check skill cache, finalize routing
  | 'approval'     // Zone governance check
  | 'execution'    // Generate response / deliver briefing

/** State of an individual pipeline stage */
export type StageState = 'idle' | 'active' | 'complete' | 'error'

/** Pipeline state for the current interaction */
export interface PipelineState {
  currentStage: PipelineStage | null
  stages: Record<PipelineStage, StageState>
  halted: boolean
  haltReason: HaltReason | null
}

/** Diagnostic info when pipeline halts (Digital Jidoka) */
export interface HaltReason {
  stage: PipelineStage
  error: string
  expected: string
  proposedFix: string
}

// =============================================================================
// SIGNAL LEVELS — Competitive intelligence threat classification
// =============================================================================

/** Signal threat/importance levels */
export type SignalLevel = 'routine' | 'significant' | 'critical'

// =============================================================================
// ZONES — Sovereignty guardrails with competitive intel thresholds
// =============================================================================

/** The three governance zones */
export type Zone = 'green' | 'yellow' | 'red'

/** Zone threshold configuration for Signal Watch */
export interface ZoneThresholds {
  minScoreDelta?: number      // Minimum delta to trigger this zone
  maxScoreDelta?: number      // Maximum delta for this zone
  signalLevel?: SignalLevel   // Signal level that triggers this zone
  tierCrossing?: boolean      // Whether tier crossing triggers this zone
}

export interface ZoneDefinition {
  meaning: string              // e.g., "Routine Monitoring"
  flywheel_eligible: boolean   // Can intents in this zone become skills?
  allows: string[]             // What actions this zone permits
  forbids?: string[]           // What actions this zone explicitly forbids
  requiresApproval?: string[]  // Actions that require human approval
  requiresHumanDecision?: boolean  // All actions require human (RED zone)
  thresholds?: ZoneThresholds  // Score delta thresholds for zone
  description: string          // Human-readable explanation
}

export interface ZonesSchema {
  zones: Record<Zone, ZoneDefinition>
}

// =============================================================================
// TIERS — Cognitive routing
// =============================================================================

/** The four tiers of cognition */
export type Tier = 0 | 1 | 2 | 3

export interface TierConfig {
  latencyMs: number
  cost: number
  sovereignty: 'local' | 'cloud'
  label: string
}

// =============================================================================
// ROUTING — Declarative intent configuration
// =============================================================================

export interface IntentConfig {
  tier: Tier           // 0=cached, 1=cheap, 2=premium, 3=apex
  zone: Zone
  description: string
  keywords: string[]   // For demo mode intent matching
}

/**
 * Skill promotion configuration (per Sovereign Manifesto)
 * Controls when patterns become auto-approve skills
 */
export interface SkillPromotionConfig {
  afterNApprovals: number        // Default: 5 per manifesto
  promotableTiers: number[]      // Which tiers can become Tier 0
  scoreAdjustmentPatterns: boolean  // Enable flywheel for score adjustments
}

export interface RoutingConfig {
  intents: Record<string, IntentConfig>
  skillPromotion?: SkillPromotionConfig  // Flywheel configuration
}

// =============================================================================
// SIGNALS — Competitive intelligence signal types
// =============================================================================

/** Source types for signals */
export type SourceType = 'rss' | 'api' | 'webhook' | 'manual'

/** Raw signal from a feed source */
export interface RawSignal {
  id: string
  sourceId: string
  sourceName: string
  sourceType: SourceType
  sourceReliability: number  // 0.0-1.0
  timestamp: string
  title: string
  content: string
  url: string
  metadata: Record<string, unknown>
}

/** A subject match for a classified signal */
export interface WatchlistSubjectMatch {
  subjectId: string
  subjectName: string
  relevanceScore: number
  proposedScoreDelta: number
  deltaReason: string
}

/** Classified signal with analysis results */
export interface ClassifiedSignal extends RawSignal {
  classificationId: string
  relevance: number           // 0.0-1.0
  novelty: number             // 0.0-1.0
  threatLevel: SignalLevel
  impactLevel: 'low' | 'medium' | 'high'
  subjects: WatchlistSubjectMatch[]
  keywords: string[]
  tier: Tier                  // Which tier classified it
  zone: Zone                  // Resulting zone
  confidence: number
}

// =============================================================================
// WATCHLIST — Competitive subjects to monitor
// =============================================================================

/** Subject tier in competitive landscape */
export type SubjectTier = 'primary' | 'secondary' | 'emerging'

/** Type of watchlist subject */
export type SubjectType = 'competitor' | 'partner' | 'market' | 'technology' | 'regulatory'

/** Configuration for a signal source */
export interface SourceConfig {
  id: string
  name: string
  type: SourceType
  url: string
  reliability: number        // 0.0-1.0
  refreshIntervalMs: number
  enabled: boolean
}

/** Score history entry for a subject */
export interface ScoreHistoryEntry {
  timestamp: string
  score: number
  delta: number
  reason: string
  signalId: string | null
  approvedBy: 'system' | 'human'
}

/** A subject being monitored */
export interface WatchlistSubject {
  id: string
  name: string
  type: SubjectType
  tier: SubjectTier
  baselineScore: number      // 0.0-1.0, competitive position
  keywords: string[]
  aliases: string[]
  sources: SourceConfig[]
  lastUpdated: string
  history: ScoreHistoryEntry[]
}

/** The complete watchlist */
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

/** A proposed score adjustment */
export interface ScoreAdjustment {
  id: string
  subjectId: string
  subjectName: string
  currentScore: number
  proposedScore: number
  delta: number
  reason: string
  signalIds: string[]
  triggeredBy: string        // Signal or event that triggered this
  confidence: number
  zone: Zone                 // Determined by delta magnitude
  status: 'pending' | 'approved' | 'rejected'
  createdAt: string
  decidedAt: string | null
  decidedBy: 'system' | 'human' | null
}

// =============================================================================
// BRIEFINGS — Intelligence summaries
// =============================================================================

/** Briefing type based on zone */
export type BriefingType = 'routine' | 'significant' | 'strategic'

/** A highlight in a briefing */
export interface BriefingHighlight {
  text: string
  zone?: Zone
  subjectId?: string
  type?: 'new_entrant' | 'product_launch' | 'funding' | 'partnership' | 'regulatory' | 'talent'
}

/** A recommendation from the briefing */
export interface BriefingRecommendation {
  priority: 'high' | 'medium' | 'low'
  action: string
  rationale: string
  subject?: string
}

/** A proposed subject for watchlist addition */
export interface ProposedSubject {
  id: string
  name: string
  type: SubjectType
  tier: SubjectTier
  keywords: string[]
  aliases: string[]
  initialScore: number  // 0-1 normalized
  rationale: string
}

// =============================================================================
// RESEARCH — Web search sourced intelligence
// =============================================================================

/** A source from web search (real URLs, not fabricated) */
export interface ResearchSource {
  url: string
  title: string
  citedText?: string   // The actual cited snippet from the source
  pageAge?: string     // When the page was last updated
}

/** Research section in a briefing (populated from Claude web search) */
export interface ResearchSection {
  analysis: string           // 200-300 word analysis from Claude
  keyFindings: string[]      // 3-5 bullet points
  sources: ResearchSource[]  // Real sources from web search
  searchCount: number        // How many web searches were executed
  templateHash: string       // For provenance tracking
}

/** A compiled intelligence briefing */
export interface Briefing {
  id: string
  title: string
  type: BriefingType
  timestamp: string
  tier: Tier
  signalCount: number
  period?: {
    start: string
    end: string
  }
  signalIds?: string[]
  pendingAdjustments?: ScoreAdjustment[]
  pendingSubject?: ProposedSubject  // For add_subject intent
  pendingDomainConfig?: DomainConfig  // For configure_domain intent
  research?: ResearchSection  // Web search sourced research
  summary: string
  highlights: BriefingHighlight[]
  recommendations?: BriefingRecommendation[]
  zone: Zone
  status: 'draft' | 'delivered' | 'archived'
}

// =============================================================================
// INTERACTIONS — The unit of work
// =============================================================================

export type InteractionStatus =
  | 'pending'    // In pipeline
  | 'approved'   // Human approved (yellow zone)
  | 'rejected'   // Human rejected (yellow zone)
  | 'executing'  // Live API call in flight
  | 'completed'  // Successfully executed
  | 'halted'     // Pipeline halted (Jidoka)

export interface Interaction {
  id: string
  timestamp: string
  input: string
  intent: string
  tier: Tier
  zone: Zone
  cost: number
  sovereignty: 'local' | 'cloud'
  confidence: number
  response: string | null
  status: InteractionStatus
  skillMatch: string | null
  mode: Mode
  patternCountAtCreation?: number
  flywheelEligible: boolean
  // Signal Watch extensions
  signalIds?: string[]        // Associated signals
  scoreDelta?: number         // If this triggered a score adjustment
}

// =============================================================================
// SKILLS — The flywheel output
// =============================================================================

export interface Skill {
  id: string
  pattern: string
  intentMatch: string
  approvedAt: string
  timesFired: number
  cumulativeSavings: number
  originalTier: Tier
}

export interface SkillProposal {
  active: boolean
  intent: string | null
  pattern: string | null
  count: number
}

// =============================================================================
// TELEMETRY — Signal Watch audit ledger
// =============================================================================

export interface TelemetryEntry {
  id: string
  timestamp: string
  intent: string
  tier: Tier
  zone: Zone
  confidence: number
  cost: number
  mode: Mode
  latencyMs: number
  humanFeedback: 'approved' | 'rejected' | null
  skillMatch: string | null
  modelUsed?: string
  tokensIn?: number
  tokensOut?: number
  message?: string
  // Signal Watch extensions
  watchlistVersion?: string
  signalIds?: string[]
  hash?: string              // SHA256 provenance hash
}

// =============================================================================
// OPERATING MODES
// =============================================================================

export type Mode = 'demo' | 'interactive'

export type CurrentView = 'sandbox' | 'foundry' | 'watchlist'

export interface ModelConfig {
  provider: string
  apiKey: string | null
  model: string
}

// =============================================================================
// TUTORIAL
// =============================================================================

export type TutorialStep = 0 | 1 | 2 | 3

export interface TutorialState {
  active: boolean
  currentStep: TutorialStep
  completed: boolean
}

// =============================================================================
// FOUNDRY — Architectural compiler
// =============================================================================

export interface FoundryState {
  input: string
  isCompiling: boolean
  generatedPRD: string
  compilerLogs: string[]
  error: string | null
}

// =============================================================================
// FAILURE SIMULATION (Andon Cord)
// =============================================================================

export type FailureType =
  | 'none'
  | 'api_timeout'
  | 'low_confidence'
  | 'hallucination_detected'

// =============================================================================
// DASHBOARD METRICS — Signal Watch specific
// =============================================================================

export interface Metrics {
  totalCost: number
  interactionCount: number
  tierHistory: number[]
  localCount: number
  skillsFired: number
  costHistory: number[]
  // Signal Watch extensions
  signalsProcessed?: number
  signalsByThreatLevel?: Record<SignalLevel, number>
  pendingAdjustments?: number
  briefingsDelivered?: number
}

// =============================================================================
// APPLICATION STATE — The whole picture
// =============================================================================

export interface AppState {
  // Operating mode
  mode: Mode

  // Model configuration (Interactive mode)
  modelConfig: {
    tier0: ModelConfig
    tier1: ModelConfig
    tier2: ModelConfig
    tier3: ModelConfig
  }

  // Declarative configuration (editable)
  routingConfig: RoutingConfig
  zonesSchema: ZonesSchema

  // Pipeline state
  pipeline: PipelineState

  // Interactions
  interactions: Interaction[]
  pendingApproval: Interaction | null

  // Skills (the flywheel output)
  skills: Skill[]
  patternCounts: Record<string, number>
  skillProposal: SkillProposal

  // Dashboard metrics
  metrics: Metrics

  // Telemetry (audit trail)
  telemetry: TelemetryEntry[]
  selectedTelemetryId: string | null
  selectedInteractionId: string | null

  // Tutorial
  tutorial: TutorialState

  // Failure simulation (Andon cord)
  simulateFailure: FailureType

  // UI state
  configRipple: boolean
  currentView: CurrentView

  // Deck overlay
  isDeckOpen: boolean
  activeSlideIndex: number

  // Foundry
  foundry: FoundryState

  // Signal Watch extensions
  watchlist?: Watchlist
  signals?: ClassifiedSignal[]
  pendingAdjustments?: ScoreAdjustment[]
  currentBriefing?: Briefing | null
}

// =============================================================================
// ACTIONS — State transitions
// =============================================================================

export type AppAction =
  // Mode
  | { type: 'SET_MODE'; mode: Mode }
  | { type: 'SET_MODEL_CONFIG'; tier: 0 | 1 | 2 | 3; config: Partial<ModelConfig> }
  | { type: 'SET_ALL_MODEL_CONFIGS'; config: Partial<ModelConfig> }

  // Config
  | { type: 'UPDATE_ROUTING_CONFIG'; config: RoutingConfig }
  | { type: 'UPDATE_ZONES_SCHEMA'; schema: ZonesSchema }
  | { type: 'TRIGGER_CONFIG_RIPPLE' }
  | { type: 'CLEAR_CONFIG_RIPPLE' }

  // Pipeline
  | { type: 'SET_PIPELINE_STAGE'; stage: PipelineStage; state: StageState }
  | { type: 'ADVANCE_PIPELINE' }
  | { type: 'RESET_PIPELINE' }
  | { type: 'HALT_PIPELINE'; reason: HaltReason }

  // Interactions
  | { type: 'SUBMIT_INPUT'; input: string }
  | { type: 'SET_PENDING_APPROVAL'; interaction: Interaction }
  | { type: 'APPROVE_INTERACTION' }
  | { type: 'REJECT_INTERACTION' }
  | { type: 'COMPLETE_INTERACTION'; response: string; telemetry: Partial<TelemetryEntry> }
  | { type: 'ADD_INTERACTION'; interaction: Interaction }
  | { type: 'UPDATE_INTERACTION_STATUS'; id: string; status: InteractionStatus }

  // Skills
  | { type: 'INCREMENT_PATTERN'; intent: string }
  | { type: 'PROPOSE_SKILL'; intent: string; pattern: string; count: number }
  | { type: 'APPROVE_SKILL' }
  | { type: 'REJECT_SKILL' }
  | { type: 'FIRE_SKILL'; skillId: string; savings: number }

  // Telemetry
  | { type: 'ADD_TELEMETRY'; entry: TelemetryEntry }
  | { type: 'SELECT_TELEMETRY'; id: string | null }
  | { type: 'SELECT_INTERACTION'; id: string | null }

  // Tutorial
  | { type: 'START_TUTORIAL' }
  | { type: 'ADVANCE_TUTORIAL' }
  | { type: 'SKIP_TUTORIAL' }
  | { type: 'COMPLETE_TUTORIAL' }

  // Failure simulation
  | { type: 'SET_FAILURE_SIMULATION'; failureType: FailureType }

  // Metrics
  | { type: 'UPDATE_METRICS'; delta: Partial<Metrics> }

  // Deck overlay
  | { type: 'OPEN_DECK' }
  | { type: 'CLOSE_DECK' }
  | { type: 'SET_ACTIVE_SLIDE'; index: number }

  // View routing
  | { type: 'SET_VIEW'; view: CurrentView }

  // Foundry
  | { type: 'SET_FOUNDRY_INPUT'; input: string }
  | { type: 'START_FOUNDRY_COMPILATION' }
  | { type: 'APPEND_FOUNDRY_LOG'; log: string }
  | { type: 'APPEND_FOUNDRY_CHUNK'; chunk: string }
  | { type: 'COMPLETE_FOUNDRY_COMPILATION' }
  | { type: 'FAIL_FOUNDRY_COMPILATION'; error: string }
  | { type: 'CLEAR_FOUNDRY' }

  // Signal Watch specific
  | { type: 'SET_WATCHLIST'; watchlist: Watchlist }
  | { type: 'ADD_SIGNAL'; signal: ClassifiedSignal }
  | { type: 'ADD_SIGNALS'; signals: ClassifiedSignal[] }
  | { type: 'ADD_SCORE_ADJUSTMENT'; adjustment: ScoreAdjustment }
  | { type: 'APPROVE_SCORE_ADJUSTMENT'; id: string }
  | { type: 'REJECT_SCORE_ADJUSTMENT'; id: string }
  | { type: 'SET_CURRENT_BRIEFING'; briefing: Briefing | null }
  | { type: 'UPDATE_SUBJECT_SCORE'; subjectId: string; newScore: number; reason: string }

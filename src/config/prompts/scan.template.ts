/**
 * scan.template — Ad-hoc Scan Prompt Configuration
 *
 * This is the declarative source of truth for ad-hoc scan prompts.
 * Edit this to change cognitive behavior — no code changes required.
 *
 * VERSION: 1.0.0
 * INTENT: ad_hoc_scan
 * TIER: 2
 *
 * Following Sovereign Manifesto pattern:
 * - Versioned configuration object
 * - serialize/parse functions for YAML-like display
 * - Hashable for provenance chain
 */

import type { WatchlistSubject } from '../../state/types'

// =============================================================================
// TYPES
// =============================================================================

export interface ScanTemplateConfig {
  version: string
  intent: string
  tier: 2
  zoneThresholds: {
    green: string
    yellow: string
    red: string
  }
  responseSchema: {
    summary: string
    zone: string
    research: {
      analysis: string
      keyFindings: string
      sources: string
    }
    highlights: string
    adjustments: string
  }
  instructions: string[]
}

export interface ScanRequest {
  query: string
  timestamp: string
  subjects: WatchlistSubject[]
}

export interface ScanResponse {
  summary: string
  zone: 'green' | 'yellow' | 'red'
  research?: {
    analysis: string
    keyFindings: string[]
  }
  highlights: Array<{ text: string; zone: 'green' | 'yellow' | 'red' }>
  adjustments?: Array<{
    subjectId: string
    subjectName: string
    currentScore: number
    proposedScore: number
    delta: number
    reason: string
    confidence: number
  }>
}

// =============================================================================
// DEFAULT CONFIGURATION
// =============================================================================

export const defaultScanTemplate: ScanTemplateConfig = {
  version: '2.1.0',  // Minor bump: strategic voice styling
  intent: 'ad_hoc_scan',
  tier: 2,
  zoneThresholds: {
    green: 'delta < 5',
    yellow: '5 <= delta < 15',
    red: 'delta >= 15',
  },
  responseSchema: {
    summary: 'string (2-3 sentence executive summary)',
    zone: 'green | yellow | red (determined by max |delta|)',
    research: {
      analysis: 'string (200-300 words: market analysis, implications, outlook)',
      keyFindings: '[string] (3-5 key intelligence bullets)',
      sources: 'NOTE: Sources come from web search citations — do NOT fabricate URLs',
    },
    highlights: '[{ text: string, zone: green|yellow|red }]',
    adjustments: '[{ subjectId, subjectName, currentScore (0-100), proposedScore (0-100), delta (signed, e.g. +7 or -3), reason, confidence (0-100) }]',
  },
  instructions: [
    // Research methodology
    'You have web search enabled. USE IT to find current information about the query.',
    'Search for recent news, announcements, and developments related to the query.',
    'Focus searches on the watchlist subjects when they are relevant to the query.',
    'DO NOT fabricate sources — only cite what you actually found via web search.',

    // Voice & Style (jim-voice-writing-style)
    'LEAD WITH INSIGHT: Start with the "so what?" — strategic implication first, then supporting logic.',
    'NO HEDGING: Avoid "potentially", "possibly", "might", "could", "seems like". State findings directly.',
    'ACTIVE VOICE: "Anthropic filed lawsuits" not "Lawsuits were filed by Anthropic".',
    'STRATEGIC FRAMING: Tie every finding to business impact — competitive position, market dynamics, revenue implications.',
    'SENTENCE ARCHITECTURE: Short sentences for impact. Longer ones for explanation. Never ramble.',

    // Output format
    'Write a 200-300 word analysis synthesizing your research findings.',
    'Extract 3-5 key findings as concise, action-oriented bullet points.',
    'Determine zone by maximum |delta| magnitude: <5% green, 5-15% yellow, >=15% red.',
    'All scores use 0-100 scale (e.g., currentScore: 85, proposedScore: 92, delta: 7).',
    'Only propose score adjustments if your research justifies a competitive position change.',
  ],
}

// =============================================================================
// SERIALIZE — Config to YAML-like prompt
// =============================================================================

export function serializeScanPrompt(
  config: ScanTemplateConfig,
  request: ScanRequest
): string {
  const subjectYaml = request.subjects.map(s =>
    `    - id: "${s.id}"
      name: "${s.name}"
      type: ${s.type}
      tier: ${s.tier}
      score: ${(s.baselineScore * 100).toFixed(0)}`
  ).join('\n')

  return `# SIGNAL_WATCH_SCAN v${config.version}
# intent: ${config.intent}
# tier: ${config.tier}

query: "${request.query}"
timestamp: "${request.timestamp}"

# WATCHLIST
subjects:
${subjectYaml}

# ZONE_THRESHOLDS
thresholds:
  green: ${config.zoneThresholds.green}
  yellow: ${config.zoneThresholds.yellow}
  red: ${config.zoneThresholds.red}

# RESPONSE_FORMAT
schema:
  summary: ${config.responseSchema.summary}
  zone: ${config.responseSchema.zone}
  research:
    analysis: ${config.responseSchema.research.analysis}
    keyFindings: ${config.responseSchema.research.keyFindings}
    sources: ${config.responseSchema.research.sources}
  highlights: ${config.responseSchema.highlights}
  adjustments: ${config.responseSchema.adjustments}

# INSTRUCTIONS
${config.instructions.map((i, idx) => `${idx + 1}. ${i}`).join('\n')}

# OUTPUT
Return valid JSON matching the schema above. Use web search to gather real information.`
}

// =============================================================================
// PARSE — Response text to typed object
// =============================================================================

/**
 * Normalize a score to 0-1 range.
 * Handles both 0-100 scale (from LLM) and 0-1 scale (legacy).
 */
function normalizeScore(value: number): number {
  // If > 1, assume 0-100 scale
  if (value > 1) {
    return Math.max(0, Math.min(1, value / 100))
  }
  // Already 0-1 scale, just clamp
  return Math.max(0, Math.min(1, value))
}

/**
 * Normalize delta to 0-1 range.
 * Handles both percentage (e.g., 7 for 7%) and decimal (e.g., 0.07).
 */
function normalizeDelta(value: number): number {
  // If absolute value > 1, assume percentage scale
  if (Math.abs(value) > 1) {
    return Math.max(-1, Math.min(1, value / 100))
  }
  return Math.max(-1, Math.min(1, value))
}

export function parseScanResponse(text: string): ScanResponse {
  // Extract JSON from response (may be wrapped in markdown code blocks)
  const jsonMatch = text.match(/\{[\s\S]*\}/)
  if (!jsonMatch) {
    return {
      summary: text.slice(0, 500),
      zone: 'green',
      highlights: [{ text: 'Raw analysis returned - see summary', zone: 'green' }],
    }
  }

  try {
    const raw = JSON.parse(jsonMatch[0])

    // Normalize adjustments to 0-1 scale
    const adjustments = raw.adjustments?.map((adj: {
      subjectId: string
      subjectName: string
      currentScore: number
      proposedScore: number
      delta: number
      reason: string
      confidence: number
    }) => ({
      ...adj,
      currentScore: normalizeScore(adj.currentScore),
      proposedScore: normalizeScore(adj.proposedScore),
      delta: normalizeDelta(adj.delta),
      confidence: normalizeScore(adj.confidence),
    }))

    // Parse research section if present
    const research = raw.research ? {
      analysis: raw.research.analysis || '',
      keyFindings: Array.isArray(raw.research.keyFindings)
        ? raw.research.keyFindings.map(String)
        : [],
    } : undefined

    return {
      summary: raw.summary || '',
      zone: raw.zone || 'green',
      research,
      highlights: raw.highlights || [],
      adjustments,
    }
  } catch {
    return {
      summary: text.slice(0, 500),
      zone: 'green',
      highlights: [{ text: 'Parse error - raw response shown', zone: 'yellow' }],
    }
  }
}

// =============================================================================
// HASH — For provenance chain
// =============================================================================

export function hashScanConfig(config: ScanTemplateConfig): string {
  // Simple hash for demo — real implementation would use SHA-256
  const str = JSON.stringify(config)
  let hash = 0
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i)
    hash = ((hash << 5) - hash) + char
    hash = hash & hash // Convert to 32bit integer
  }
  return Math.abs(hash).toString(16).padStart(8, '0')
}

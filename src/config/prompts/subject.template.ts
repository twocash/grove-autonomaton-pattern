/**
 * subject.template — Subject Research Prompt Configuration
 *
 * This is the declarative source of truth for subject research prompts.
 * Used when training the watchlist with new competitors.
 *
 * VERSION: 1.0.0
 * INTENT: add_subject
 * TIER: 2
 * ZONE: yellow (requires approval)
 *
 * Following Sovereign Manifesto pattern:
 * - Versioned configuration object
 * - serialize/parse functions for YAML-like display
 * - Hashable for provenance chain
 */

// =============================================================================
// TYPES
// =============================================================================

export interface SubjectTemplateConfig {
  version: string
  intent: string
  tier: 2
  zone: 'yellow'
  responseSchema: {
    name: string
    type: string
    tier: string
    keywords: string
    aliases: string
    initialScore: string
    rationale: string
  }
  instructions: string[]
}

export interface SubjectRequest {
  name: string
  timestamp: string
}

export interface SubjectResponse {
  name: string
  type: 'competitor' | 'partner' | 'market' | 'technology' | 'regulatory'
  tier: 'primary' | 'secondary' | 'emerging'
  keywords: string[]
  aliases: string[]
  initialScore: number  // 0-100
  rationale: string
}

// =============================================================================
// DEFAULT CONFIGURATION
// =============================================================================

export const defaultSubjectTemplate: SubjectTemplateConfig = {
  version: '1.0.0',
  intent: 'add_subject',
  tier: 2,
  zone: 'yellow',
  responseSchema: {
    name: 'string (official name)',
    type: 'competitor | partner | market | technology | regulatory',
    tier: 'primary | secondary | emerging',
    keywords: '[strings for signal matching]',
    aliases: '[alternative names]',
    initialScore: '0-100 (competitive threat level)',
    rationale: 'string (why this assessment)',
  },
  instructions: [
    'Research the named entity as a competitive intelligence subject',
    'Determine type based on relationship (competitor, partner, market force, etc.)',
    'Assess tier by market position (primary = major player, emerging = new entrant)',
    'Generate keywords for signal matching (products, leaders, brands)',
    'Provide initial competitive score 0-100 (higher = more significant threat/opportunity)',
    'Explain rationale briefly',
  ],
}

// =============================================================================
// SERIALIZE — Config to YAML-like prompt
// =============================================================================

export function serializeSubjectPrompt(
  config: SubjectTemplateConfig,
  request: SubjectRequest
): string {
  return `# SIGNAL_WATCH_SUBJECT_RESEARCH v${config.version}
# intent: ${config.intent}
# tier: ${config.tier}
# zone: ${config.zone}

research_target: "${request.name}"
timestamp: "${request.timestamp}"

# RESPONSE_FORMAT
schema:
  name: ${config.responseSchema.name}
  type: ${config.responseSchema.type}
  tier: ${config.responseSchema.tier}
  keywords: ${config.responseSchema.keywords}
  aliases: ${config.responseSchema.aliases}
  initialScore: ${config.responseSchema.initialScore}
  rationale: ${config.responseSchema.rationale}

# INSTRUCTIONS
${config.instructions.map((i, idx) => `${idx + 1}. ${i}`).join('\n')}

# OUTPUT
Return valid JSON matching the schema above.`
}

// =============================================================================
// PARSE — Response text to typed object
// =============================================================================

/**
 * Normalize a score to 0-1 range.
 */
function normalizeScore(value: number): number {
  if (value > 1) {
    return Math.max(0, Math.min(1, value / 100))
  }
  return Math.max(0, Math.min(1, value))
}

export function parseSubjectResponse(text: string): SubjectResponse | null {
  // Extract JSON from response (may be wrapped in markdown code blocks)
  const jsonMatch = text.match(/\{[\s\S]*\}/)
  if (!jsonMatch) {
    return null
  }

  try {
    const raw = JSON.parse(jsonMatch[0])

    return {
      name: raw.name || '',
      type: raw.type || 'competitor',
      tier: raw.tier || 'secondary',
      keywords: Array.isArray(raw.keywords) ? raw.keywords : [],
      aliases: Array.isArray(raw.aliases) ? raw.aliases : [],
      initialScore: normalizeScore(raw.initialScore || 50),
      rationale: raw.rationale || '',
    }
  } catch {
    return null
  }
}

// =============================================================================
// HASH — For provenance chain
// =============================================================================

export function hashSubjectConfig(config: SubjectTemplateConfig): string {
  const str = JSON.stringify(config)
  let hash = 0
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i)
    hash = ((hash << 5) - hash) + char
    hash = hash & hash
  }
  return Math.abs(hash).toString(16).padStart(8, '0')
}

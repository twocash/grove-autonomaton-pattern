/**
 * domain.template — Domain Configuration Prompt Template
 *
 * This is the declarative source of truth for domain setup prompts.
 * Used when configuring the competitive intelligence focus area.
 *
 * VERSION: 1.0.0
 * INTENT: configure_domain
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

export interface DomainTemplateConfig {
  version: string
  intent: string
  tier: 2
  zone: 'yellow'
  responseSchema: {
    name: string
    signalTypes: string
    scoringFactors: string
    subjectTypes: string
    domainKeywords: string
  }
  instructions: string[]
}

export interface DomainRequest {
  industry: string
  trackingPrefs: string
  timestamp: string
}

export interface SignalTypeConfig {
  id: string
  label: string
  keywords: string[]
  weight: number
}

export interface ScoringFactor {
  name: string
  description: string
  weight: number
}

export interface SubjectTypeConfig {
  id: string
  label: string
  description: string
}

export interface DomainConfig {
  version: string
  hash: string
  createdAt: string
  domain: {
    name: string
    description: string
  }
  signalTypes: SignalTypeConfig[]
  scoringRubric: {
    factors: ScoringFactor[]
    zoneThresholds: {
      green: number
      yellow: number
      red: number
    }
  }
  subjectTypes: SubjectTypeConfig[]
  domainKeywords: string[]
}

// =============================================================================
// DEFAULT CONFIGURATION
// =============================================================================

export const defaultDomainTemplate: DomainTemplateConfig = {
  version: '1.0.0',
  intent: 'configure_domain',
  tier: 2,
  zone: 'yellow',
  responseSchema: {
    name: 'string (domain/industry name)',
    signalTypes: '[{id, label, keywords[], weight}] - what signals to track',
    scoringFactors: '[{name, description, weight}] - how to score subjects',
    subjectTypes: '[{id, label, description}] - categories of subjects',
    domainKeywords: '[strings] - domain relevance indicators',
  },
  instructions: [
    'Synthesize a competitive intelligence configuration for this domain',
    'Generate 4-6 signal types based on what the user wants to track',
    'Each signal type needs: id (snake_case), label (human readable), keywords (for matching), weight (0-1)',
    'Create a scoring rubric with 3-5 weighted factors for evaluating subjects',
    'Define 3-4 subject types appropriate for this domain (e.g., direct_competitor, emerging_player)',
    'Extract 10-15 domain keywords for relevance matching',
    'Weights should sum to approximately 1.0',
  ],
}

// =============================================================================
// SERIALIZE — Config to YAML-like prompt
// =============================================================================

export function serializeDomainPrompt(
  config: DomainTemplateConfig,
  request: DomainRequest
): string {
  return `# SIGNAL_WATCH_DOMAIN_CONFIG v${config.version}
# intent: ${config.intent}
# tier: ${config.tier}
# zone: ${config.zone}

industry: "${request.industry}"
tracking_preferences: "${request.trackingPrefs}"
timestamp: "${request.timestamp}"

# RESPONSE_FORMAT
Return a JSON object with this structure:

{
  "name": "${config.responseSchema.name}",
  "signalTypes": ${config.responseSchema.signalTypes},
  "scoringFactors": ${config.responseSchema.scoringFactors},
  "subjectTypes": ${config.responseSchema.subjectTypes},
  "domainKeywords": ${config.responseSchema.domainKeywords}
}

# INSTRUCTIONS
${config.instructions.map((i, idx) => `${idx + 1}. ${i}`).join('\n')}

# EXAMPLE OUTPUT
{
  "name": "AI/ML Companies",
  "signalTypes": [
    {"id": "funding_round", "label": "Funding Round", "keywords": ["series", "raised", "funding", "valuation", "investment"], "weight": 0.2},
    {"id": "product_launch", "label": "Product Launch", "keywords": ["launch", "release", "announce", "unveil", "introduce"], "weight": 0.25},
    {"id": "pricing_change", "label": "Pricing Change", "keywords": ["price", "cost", "tier", "plan", "subscription"], "weight": 0.15},
    {"id": "partnership", "label": "Partnership", "keywords": ["partner", "collaborate", "integrate", "alliance"], "weight": 0.15},
    {"id": "talent_move", "label": "Talent Movement", "keywords": ["hire", "join", "depart", "executive", "leadership"], "weight": 0.1},
    {"id": "regulatory", "label": "Regulatory Event", "keywords": ["regulation", "compliance", "policy", "government", "law"], "weight": 0.15}
  ],
  "scoringFactors": [
    {"name": "market_position", "description": "Current market share and competitive standing", "weight": 0.3},
    {"name": "product_capability", "description": "Technical capabilities and product maturity", "weight": 0.25},
    {"name": "growth_trajectory", "description": "Recent growth and momentum indicators", "weight": 0.2},
    {"name": "financial_strength", "description": "Funding, revenue, and financial stability", "weight": 0.15},
    {"name": "strategic_threat", "description": "Direct competitive threat to your position", "weight": 0.1}
  ],
  "subjectTypes": [
    {"id": "direct_competitor", "label": "Direct Competitor", "description": "Companies with overlapping products/services"},
    {"id": "emerging_player", "label": "Emerging Player", "description": "New entrants with growth potential"},
    {"id": "adjacent_player", "label": "Adjacent Player", "description": "Companies in related markets that could expand"},
    {"id": "technology_provider", "label": "Technology Provider", "description": "Key technology or infrastructure providers"}
  ],
  "domainKeywords": ["AI", "ML", "machine learning", "LLM", "model", "API", "neural", "deep learning", "inference", "training"]
}

# OUTPUT
Return valid JSON matching the structure above, customized for the specified industry and tracking preferences.`
}

// =============================================================================
// PARSE — Response text to typed object
// =============================================================================

export function parseDomainResponse(
  text: string,
  request: DomainRequest
): DomainConfig | null {
  // Extract JSON from response (may be wrapped in markdown code blocks)
  const jsonMatch = text.match(/\{[\s\S]*\}/)
  if (!jsonMatch) {
    return null
  }

  try {
    const raw = JSON.parse(jsonMatch[0])

    // Build the domain config
    const config: Omit<DomainConfig, 'hash'> = {
      version: '1.0.0',
      createdAt: new Date().toISOString(),
      domain: {
        name: raw.name || request.industry,
        description: request.trackingPrefs,
      },
      signalTypes: Array.isArray(raw.signalTypes)
        ? raw.signalTypes.map((st: Record<string, unknown>) => ({
            id: String(st.id || ''),
            label: String(st.label || ''),
            keywords: Array.isArray(st.keywords) ? st.keywords.map(String) : [],
            weight: normalizeWeight(st.weight),
          }))
        : [],
      scoringRubric: {
        factors: Array.isArray(raw.scoringFactors)
          ? raw.scoringFactors.map((sf: Record<string, unknown>) => ({
              name: String(sf.name || ''),
              description: String(sf.description || ''),
              weight: normalizeWeight(sf.weight),
            }))
          : [],
        zoneThresholds: {
          green: 5,
          yellow: 15,
          red: 15,
        },
      },
      subjectTypes: Array.isArray(raw.subjectTypes)
        ? raw.subjectTypes.map((st: Record<string, unknown>) => ({
            id: String(st.id || ''),
            label: String(st.label || ''),
            description: String(st.description || ''),
          }))
        : [],
      domainKeywords: Array.isArray(raw.domainKeywords)
        ? raw.domainKeywords.map(String)
        : [],
    }

    // Calculate hash and add it
    const fullConfig: DomainConfig = {
      ...config,
      hash: hashDomainConfig(config as DomainConfig),
    }

    return fullConfig
  } catch {
    return null
  }
}

/**
 * Normalize a weight value to 0-1 range
 */
function normalizeWeight(value: unknown): number {
  const num = Number(value)
  if (isNaN(num)) return 0.1
  return Math.max(0, Math.min(1, num))
}

// =============================================================================
// HASH — For provenance chain
// =============================================================================

export function hashDomainConfig(config: DomainConfig | Omit<DomainConfig, 'hash'>): string {
  // Create a deterministic string representation (excluding the hash field itself)
  const { hash: _, ...configWithoutHash } = config as DomainConfig
  const str = JSON.stringify(configWithoutHash, Object.keys(configWithoutHash).sort())
  let hashValue = 0
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i)
    hashValue = ((hashValue << 5) - hashValue) + char
    hashValue = hashValue & hashValue
  }
  return Math.abs(hashValue).toString(16).padStart(8, '0')
}

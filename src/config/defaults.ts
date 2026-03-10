/**
 * defaults.ts — Pre-configured watchlist for frictionless onboarding
 *
 * New users start with a useful AI competitive landscape watchlist immediately.
 * This reduces friction and promotes learning.
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

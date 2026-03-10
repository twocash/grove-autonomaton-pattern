/**
 * Demo Watchlist — Sample competitive subjects for demo mode
 */

import type { Watchlist, WatchlistSubject } from '../../state/types'

export const demoSubjects: WatchlistSubject[] = [
  {
    id: 'openai',
    name: 'OpenAI',
    type: 'competitor',
    tier: 'primary',
    baselineScore: 0.85,
    keywords: ['openai', 'gpt', 'chatgpt', 'sam altman', 'dall-e', 'sora'],
    aliases: ['OpenAI Inc', 'Open AI'],
    sources: [
      {
        id: 'openai-blog',
        name: 'OpenAI Blog',
        type: 'rss',
        url: 'https://openai.com/blog/rss',
        reliability: 0.95,
        refreshIntervalMs: 3600000,
        enabled: true,
      },
    ],
    lastUpdated: new Date().toISOString(),
    history: [
      { timestamp: '2024-01-01', score: 0.80, delta: 0.05, reason: 'GPT-4 Turbo launch', signalId: null, approvedBy: 'human' },
      { timestamp: '2024-02-01', score: 0.82, delta: 0.02, reason: 'Enterprise adoption growth', signalId: null, approvedBy: 'system' },
      { timestamp: '2024-03-01', score: 0.85, delta: 0.03, reason: 'Sora announcement', signalId: null, approvedBy: 'human' },
    ],
  },
  {
    id: 'anthropic',
    name: 'Anthropic',
    type: 'competitor',
    tier: 'primary',
    baselineScore: 0.78,
    keywords: ['anthropic', 'claude', 'constitutional ai', 'dario amodei'],
    aliases: ['Anthropic PBC'],
    sources: [
      {
        id: 'anthropic-news',
        name: 'Anthropic News',
        type: 'rss',
        url: 'https://www.anthropic.com/news/rss',
        reliability: 0.95,
        refreshIntervalMs: 3600000,
        enabled: true,
      },
    ],
    lastUpdated: new Date().toISOString(),
    history: [
      { timestamp: '2024-01-15', score: 0.72, delta: 0.06, reason: 'Claude 3 launch', signalId: null, approvedBy: 'human' },
      { timestamp: '2024-02-20', score: 0.75, delta: 0.03, reason: 'Enterprise partnerships', signalId: null, approvedBy: 'system' },
      { timestamp: '2024-03-05', score: 0.78, delta: 0.03, reason: 'Claude 3 Opus benchmark results', signalId: null, approvedBy: 'human' },
    ],
  },
  {
    id: 'google',
    name: 'Google DeepMind',
    type: 'competitor',
    tier: 'primary',
    baselineScore: 0.82,
    keywords: ['google', 'deepmind', 'gemini', 'bard', 'sundar pichai', 'demis hassabis'],
    aliases: ['Alphabet', 'Google AI'],
    sources: [
      {
        id: 'google-ai-blog',
        name: 'Google AI Blog',
        type: 'rss',
        url: 'https://blog.google/technology/ai/rss',
        reliability: 0.90,
        refreshIntervalMs: 3600000,
        enabled: true,
      },
    ],
    lastUpdated: new Date().toISOString(),
    history: [
      { timestamp: '2024-01-01', score: 0.78, delta: 0.04, reason: 'Gemini launch', signalId: null, approvedBy: 'human' },
      { timestamp: '2024-02-01', score: 0.80, delta: 0.02, reason: 'Gemini Pro integration', signalId: null, approvedBy: 'system' },
      { timestamp: '2024-03-01', score: 0.82, delta: 0.02, reason: 'Gemini 1.5 context window', signalId: null, approvedBy: 'system' },
    ],
  },
  {
    id: 'meta',
    name: 'Meta AI',
    type: 'competitor',
    tier: 'secondary',
    baselineScore: 0.65,
    keywords: ['meta', 'llama', 'facebook ai', 'yann lecun', 'mark zuckerberg'],
    aliases: ['Facebook AI', 'FAIR'],
    sources: [],
    lastUpdated: new Date().toISOString(),
    history: [
      { timestamp: '2024-01-01', score: 0.60, delta: 0.05, reason: 'Llama 2 adoption', signalId: null, approvedBy: 'human' },
      { timestamp: '2024-02-01', score: 0.63, delta: 0.03, reason: 'Open source momentum', signalId: null, approvedBy: 'system' },
      { timestamp: '2024-03-01', score: 0.65, delta: 0.02, reason: 'Llama 3 preview', signalId: null, approvedBy: 'system' },
    ],
  },
  {
    id: 'mistral',
    name: 'Mistral AI',
    type: 'competitor',
    tier: 'emerging',
    baselineScore: 0.45,
    keywords: ['mistral', 'mixtral', 'arthur mensch'],
    aliases: [],
    sources: [],
    lastUpdated: new Date().toISOString(),
    history: [
      { timestamp: '2024-01-01', score: 0.35, delta: 0.10, reason: 'Mixtral 8x7B release', signalId: null, approvedBy: 'human' },
      { timestamp: '2024-02-01', score: 0.40, delta: 0.05, reason: 'Series A funding', signalId: null, approvedBy: 'human' },
      { timestamp: '2024-03-01', score: 0.45, delta: 0.05, reason: 'La Plateforme launch', signalId: null, approvedBy: 'human' },
    ],
  },
]

export const demoWatchlist: Watchlist = {
  id: 'ai-competitors',
  name: 'AI Foundation Model Competitors',
  version: '1.0.0',
  subjects: demoSubjects,
  lastModified: new Date().toISOString(),
}

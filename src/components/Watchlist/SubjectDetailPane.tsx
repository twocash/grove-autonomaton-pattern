/**
 * SubjectDetailPane — Compact view of subject signals and history
 *
 * Shows when clicking a competitor card in the watchlist.
 * Simpler than the full SignalFeed - just the essentials.
 */

import type { WatchlistSubject, ClassifiedSignal } from '../../state/types'
import { demoSignals } from '../../config/demo/signals'

interface SubjectDetailPaneProps {
  subject: WatchlistSubject
  signals?: ClassifiedSignal[]
}

export function SubjectDetailPane({
  subject,
  signals = demoSignals,
}: SubjectDetailPaneProps) {
  // Filter signals that mention this subject
  const subjectSignals = signals.filter(s =>
    s.subjects?.some(m => m.subjectId === subject.id) ||
    s.title.toLowerCase().includes(subject.name.toLowerCase()) ||
    subject.aliases.some(a => s.title.toLowerCase().includes(a.toLowerCase()))
  )

  // Recent score history
  const recentHistory = subject.history.slice(-5).reverse()

  return (
    <div className="flex flex-col h-full bg-grove-bg">
      {/* Subject Header */}
      <div className="p-4 border-b border-grove-border bg-grove-bg2">
        <h3 className="font-serif text-lg text-grove-text">{subject.name}</h3>
        <div className="flex items-center gap-3 mt-2">
          <span className="font-mono text-2xl text-grove-amber font-bold">
            {(subject.baselineScore * 100).toFixed(0)}
          </span>
          <span className="text-xs text-grove-text-dim uppercase">
            {subject.tier} • {subject.type}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        {/* Recent Signals */}
        <section>
          <h4 className="text-xs font-mono text-grove-text-dim uppercase tracking-wider mb-3">
            Recent Signals ({subjectSignals.length})
          </h4>
          {subjectSignals.length === 0 ? (
            <p className="text-sm text-grove-text-dim italic">
              No recent signals for this subject
            </p>
          ) : (
            <div className="space-y-2">
              {subjectSignals.slice(0, 5).map(signal => (
                <div
                  key={signal.id}
                  className={`p-3 border-l-2 bg-grove-bg2 ${
                    signal.zone === 'red'
                      ? 'border-l-zone-red'
                      : signal.zone === 'yellow'
                        ? 'border-l-zone-yellow'
                        : 'border-l-zone-green'
                  }`}
                >
                  <p className="text-sm text-grove-text">{signal.title}</p>
                  <div className="flex items-center gap-2 mt-1 text-xs text-grove-text-dim">
                    <span className="font-mono">{signal.sourceName}</span>
                    <span>•</span>
                    <span>{formatTimeAgo(signal.timestamp)}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Score History */}
        <section>
          <h4 className="text-xs font-mono text-grove-text-dim uppercase tracking-wider mb-3">
            Score History
          </h4>
          <div className="space-y-2">
            {recentHistory.map((entry, i) => (
              <div key={i} className="flex items-center justify-between p-2 bg-grove-bg2 border border-grove-border">
                <div>
                  <span className="font-mono text-grove-text">
                    {(entry.score * 100).toFixed(0)}
                  </span>
                  {entry.delta !== 0 && (
                    <span className={`ml-2 text-xs font-mono ${
                      entry.delta > 0 ? 'text-zone-red' : 'text-zone-green'
                    }`}>
                      {entry.delta > 0 ? '+' : ''}{(entry.delta * 100).toFixed(1)}%
                    </span>
                  )}
                </div>
                <span className="text-xs text-grove-text-dim">
                  {formatDate(entry.timestamp)}
                </span>
              </div>
            ))}
          </div>
        </section>

        {/* Keywords */}
        <section>
          <h4 className="text-xs font-mono text-grove-text-dim uppercase tracking-wider mb-3">
            Tracking Keywords
          </h4>
          <div className="flex flex-wrap gap-1">
            {subject.keywords.map((kw, i) => (
              <span
                key={i}
                className="px-2 py-1 text-xs font-mono text-grove-text-dim bg-grove-bg2 border border-grove-border"
              >
                {kw}
              </span>
            ))}
          </div>
        </section>
      </div>
    </div>
  )
}

function formatTimeAgo(timestamp: string): string {
  const date = new Date(timestamp)
  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  const diffMins = Math.floor(diffMs / 60000)

  if (diffMins < 1) return 'just now'
  if (diffMins < 60) return `${diffMins}m ago`
  if (diffMins < 1440) return `${Math.floor(diffMins / 60)}h ago`
  return `${Math.floor(diffMins / 1440)}d ago`
}

function formatDate(timestamp: string): string {
  return new Date(timestamp).toLocaleDateString()
}

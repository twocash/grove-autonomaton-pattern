/**
 * SubjectCard — Watchlist subject with score and trend
 *
 * Shows:
 * - Subject name and type
 * - Current competitive score
 * - Recent delta trend
 * - Mini sparkline of score history
 */

import type { WatchlistSubject } from '../../state/types'

interface SubjectCardProps {
  subject: WatchlistSubject
  recentDelta?: number  // Latest proposed delta (if any)
  onClick?: () => void
}

export function SubjectCard({ subject, recentDelta, onClick }: SubjectCardProps) {
  const tierColors = {
    primary: 'border-l-grove-amber',
    secondary: 'border-l-tier-2',
    emerging: 'border-l-tier-1',
  }

  const typeLabels = {
    competitor: 'COMPETITOR',
    partner: 'PARTNER',
    market: 'MARKET',
    technology: 'TECH',
    regulatory: 'REG',
  }

  // Get last 5 history entries for sparkline
  // Clamp scores to 0-1 range in case of corrupted data
  const historyPoints = subject.history.slice(-5).map(h => ({
    ...h,
    score: Math.max(0, Math.min(1, h.score > 1 ? h.score / 100 : h.score))
  }))
  const maxScore = Math.max(...historyPoints.map(h => h.score), 0.1)
  const minScore = Math.min(...historyPoints.map(h => h.score), 0)
  const range = maxScore - minScore || 0.1

  // Calculate trend from history
  const trend = historyPoints.length >= 2
    ? historyPoints[historyPoints.length - 1].score - historyPoints[0].score
    : 0

  return (
    <div
      onClick={onClick}
      className={`
        border-l-4 border border-grove-border p-4 bg-grove-bg2
        cursor-pointer hover:bg-grove-bg3 transition-colors
        ${tierColors[subject.tier]}
      `}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div>
          <h3 className="font-serif text-lg text-grove-text">{subject.name}</h3>
          <div className="flex items-center gap-2 mt-1">
            <span className="text-xs font-mono text-grove-text-dim uppercase">
              {typeLabels[subject.type]}
            </span>
            <span className="text-xs text-grove-text-dim">•</span>
            <span className="text-xs font-mono text-grove-text-dim capitalize">
              {subject.tier}
            </span>
          </div>
        </div>

        {/* Score */}
        <div className="text-right">
          <div className="font-mono text-2xl text-grove-text font-bold">
            {/* Clamp score to 0-100 display range */}
            {Math.round(Math.max(0, Math.min(100, subject.baselineScore > 1 ? subject.baselineScore : subject.baselineScore * 100)))}
          </div>
          <div className="text-xs text-grove-text-dim">score</div>
        </div>
      </div>

      {/* Sparkline */}
      <div className="h-8 flex items-end gap-1 mb-3">
        {historyPoints.map((entry, i) => {
          const height = ((entry.score - minScore) / range) * 100
          const isLatest = i === historyPoints.length - 1
          return (
            <div
              key={i}
              className={`flex-1 transition-all ${isLatest ? 'bg-grove-amber' : 'bg-grove-border'}`}
              style={{ height: `${Math.max(height, 5)}%` }}
              title={`${(entry.score * 100).toFixed(0)} - ${entry.reason}`}
            />
          )
        })}
      </div>

      {/* Trend & Delta */}
      <div className="flex items-center justify-between text-sm">
        <div className="flex items-center gap-2">
          <TrendBadge delta={trend} label="30d trend" />
        </div>
        {recentDelta !== undefined && recentDelta !== 0 && (
          <div className="flex items-center gap-2">
            <span className="text-grove-text-dim">Pending:</span>
            <DeltaBadge delta={recentDelta} />
          </div>
        )}
      </div>

      {/* Keywords */}
      <div className="mt-3 pt-3 border-t border-grove-border">
        <div className="flex flex-wrap gap-1">
          {subject.keywords.slice(0, 4).map((kw, i) => (
            <span key={i} className="text-xs font-mono text-grove-text-dim bg-grove-bg px-1.5 py-0.5">
              {kw}
            </span>
          ))}
          {subject.keywords.length > 4 && (
            <span className="text-xs text-grove-text-dim">+{subject.keywords.length - 4}</span>
          )}
        </div>
      </div>
    </div>
  )
}

function TrendBadge({ delta, label }: { delta: number; label: string }) {
  const isPositive = delta > 0
  const isNegative = delta < 0
  const absValue = Math.abs(delta)

  let color = 'text-grove-text-dim'
  if (absValue >= 0.05) color = isPositive ? 'text-zone-green' : 'text-zone-red'

  const arrow = isPositive ? '↑' : isNegative ? '↓' : '→'

  return (
    <span className={`font-mono ${color}`}>
      {arrow} {(delta * 100).toFixed(1)}% <span className="text-grove-text-dim">{label}</span>
    </span>
  )
}

function DeltaBadge({ delta }: { delta: number }) {
  const absValue = Math.abs(delta)
  const isPositive = delta > 0

  let colorClass = 'text-zone-green'
  if (absValue >= 0.15) colorClass = 'text-zone-red'
  else if (absValue >= 0.05) colorClass = 'text-zone-yellow'

  const sign = isPositive ? '+' : ''

  return (
    <span className={`font-mono font-bold ${colorClass}`}>
      {sign}{(delta * 100).toFixed(1)}%
    </span>
  )
}

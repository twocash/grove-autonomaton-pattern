/**
 * SignalCard — Individual signal display with zone coloring
 *
 * Visual design:
 * - Zone-colored left border (green/yellow/red)
 * - Threat level badge
 * - Subject matches with proposed deltas
 * - Source reliability indicator
 */

import type { ClassifiedSignal } from '../../state/types'
import { getZoneLabel, getZoneThresholdLabel } from '../../config/zones'

interface SignalCardProps {
  signal: ClassifiedSignal
  onSelect?: (signal: ClassifiedSignal) => void
  isSelected?: boolean
}

export function SignalCard({ signal, onSelect, isSelected }: SignalCardProps) {
  const zoneColors = {
    green: 'border-l-zone-green bg-zone-green/5',
    yellow: 'border-l-zone-yellow bg-zone-yellow/5',
    red: 'border-l-zone-red bg-zone-red/5',
  }

  const threatColors = {
    routine: 'bg-zone-green/20 text-zone-green',
    significant: 'bg-zone-yellow/20 text-zone-yellow',
    critical: 'bg-zone-red/20 text-zone-red',
  }

  const tierColors = {
    0: 'bg-tier-0/20 text-tier-0',
    1: 'bg-tier-1/20 text-tier-1',
    2: 'bg-tier-2/20 text-tier-2',
    3: 'bg-tier-3/20 text-tier-3',
  }

  const impactIcons = {
    low: '↓',
    medium: '→',
    high: '↑',
  }

  const timeAgo = getTimeAgo(signal.timestamp)

  return (
    <div
      onClick={() => onSelect?.(signal)}
      className={`
        border-l-4 border border-grove-border p-4 cursor-pointer
        transition-all duration-200 hover:bg-grove-bg2
        ${zoneColors[signal.zone]}
        ${isSelected ? 'ring-1 ring-grove-amber' : ''}
      `}
    >
      {/* Header Row */}
      <div className="flex items-start justify-between gap-4 mb-3">
        <div className="flex-1 min-w-0">
          <h3 className="font-serif text-grove-text text-base leading-tight truncate">
            {signal.title}
          </h3>
          <div className="flex items-center gap-2 mt-1 text-xs text-grove-text-dim">
            <span>{signal.sourceName}</span>
            <span>•</span>
            <span>{timeAgo}</span>
            <span>•</span>
            <span className="text-grove-text-mid">
              {(signal.sourceReliability * 100).toFixed(0)}% reliable
            </span>
          </div>
        </div>

        {/* Badges */}
        <div className="flex items-center gap-2 flex-shrink-0">
          <span className={`px-2 py-0.5 text-xs font-mono uppercase ${threatColors[signal.threatLevel]}`}>
            {signal.threatLevel}
          </span>
          <span className={`px-2 py-0.5 text-xs font-mono ${tierColors[signal.tier]}`}>
            T{signal.tier}
          </span>
        </div>
      </div>

      {/* Content Preview */}
      <p className="text-sm text-grove-text-mid line-clamp-2 mb-3">
        {signal.content}
      </p>

      {/* Subject Matches */}
      {signal.subjects.length > 0 && (
        <div className="space-y-2">
          {signal.subjects.map((match) => (
            <div
              key={match.subjectId}
              className="flex items-center justify-between bg-grove-bg/50 px-3 py-2 text-sm"
            >
              <div className="flex items-center gap-2">
                <span className="text-grove-text">{match.subjectName}</span>
                <span className="text-grove-text-dim">
                  ({(match.relevanceScore * 100).toFixed(0)}% match)
                </span>
              </div>
              <div className="flex items-center gap-2">
                <DeltaBadge delta={match.proposedScoreDelta} />
                <span className="text-grove-text-dim text-xs">
                  {impactIcons[signal.impactLevel]}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Zone Context Footer */}
      <div className="flex items-center justify-between mt-3 pt-3 border-t border-grove-border text-xs">
        <span className={`font-mono uppercase ${zoneColors[signal.zone].replace('bg-', 'text-').replace('/5', '')}`}>
          {getZoneLabel(signal.zone)} Zone
        </span>
        <span className="text-grove-text-dim font-mono">
          {getZoneThresholdLabel(signal.zone)}
        </span>
        <span className="text-grove-text-dim">
          Confidence: {(signal.confidence * 100).toFixed(0)}%
        </span>
      </div>
    </div>
  )
}

/**
 * Delta Badge — Shows proposed score change with color coding
 */
function DeltaBadge({ delta }: { delta: number }) {
  const absValue = Math.abs(delta)
  const isPositive = delta > 0
  const isNegative = delta < 0

  // Color based on magnitude (matching zone thresholds)
  let colorClass = 'text-zone-green'
  if (absValue >= 0.15) colorClass = 'text-zone-red'
  else if (absValue >= 0.05) colorClass = 'text-zone-yellow'

  const sign = isPositive ? '+' : isNegative ? '' : ''
  const arrow = isPositive ? '▲' : isNegative ? '▼' : '•'

  return (
    <span className={`font-mono font-bold ${colorClass}`}>
      {arrow} {sign}{(delta * 100).toFixed(1)}%
    </span>
  )
}

/**
 * Format timestamp as relative time
 */
function getTimeAgo(timestamp: string): string {
  const now = Date.now()
  const then = new Date(timestamp).getTime()
  const diffMs = now - then
  const diffMin = Math.floor(diffMs / (1000 * 60))
  const diffHr = Math.floor(diffMs / (1000 * 60 * 60))
  const diffDay = Math.floor(diffMs / (1000 * 60 * 60 * 24))

  if (diffMin < 60) return `${diffMin}m ago`
  if (diffHr < 24) return `${diffHr}h ago`
  return `${diffDay}d ago`
}

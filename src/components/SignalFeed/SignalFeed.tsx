/**
 * SignalFeed — Main signal stream display
 *
 * Displays classified signals grouped by zone, with filtering and stats.
 * This replaces the chat-style InteractionPane for competitive intelligence.
 */

import { useState } from 'react'
import type { ClassifiedSignal, Zone, SignalLevel } from '../../state/types'
import { SignalCard } from './SignalCard'
import { demoSignals } from '../../config/demo/signals'

interface SignalFeedProps {
  signals?: ClassifiedSignal[]
  onSignalSelect?: (signal: ClassifiedSignal) => void
}

type FilterZone = Zone | 'all'
type FilterThreat = SignalLevel | 'all'

export function SignalFeed({ signals = demoSignals, onSignalSelect }: SignalFeedProps) {
  const [selectedSignalId, setSelectedSignalId] = useState<string | null>(null)
  const [zoneFilter, setZoneFilter] = useState<FilterZone>('all')
  const [threatFilter, setThreatFilter] = useState<FilterThreat>('all')

  // Apply filters
  const filteredSignals = signals.filter(s => {
    if (zoneFilter !== 'all' && s.zone !== zoneFilter) return false
    if (threatFilter !== 'all' && s.threatLevel !== threatFilter) return false
    return true
  })

  // Stats
  const stats = {
    total: signals.length,
    red: signals.filter(s => s.zone === 'red').length,
    yellow: signals.filter(s => s.zone === 'yellow').length,
    green: signals.filter(s => s.zone === 'green').length,
    critical: signals.filter(s => s.threatLevel === 'critical').length,
  }

  const handleSelect = (signal: ClassifiedSignal) => {
    setSelectedSignalId(signal.id)
    onSignalSelect?.(signal)
  }

  return (
    <div className="flex flex-col h-full">
      {/* Header with Stats */}
      <div className="border-b border-grove-border p-4 bg-grove-bg2">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-serif text-xl text-grove-text">Signal Feed</h2>
          <div className="flex items-center gap-4 text-sm font-mono">
            <span className="text-grove-text-dim">{stats.total} signals</span>
            {stats.critical > 0 && (
              <span className="text-zone-red animate-pulse">
                {stats.critical} critical
              </span>
            )}
          </div>
        </div>

        {/* Zone Stats Bar */}
        <div className="flex gap-2 mb-4">
          <ZoneStatPill zone="red" count={stats.red} onClick={() => setZoneFilter(zoneFilter === 'red' ? 'all' : 'red')} active={zoneFilter === 'red'} />
          <ZoneStatPill zone="yellow" count={stats.yellow} onClick={() => setZoneFilter(zoneFilter === 'yellow' ? 'all' : 'yellow')} active={zoneFilter === 'yellow'} />
          <ZoneStatPill zone="green" count={stats.green} onClick={() => setZoneFilter(zoneFilter === 'green' ? 'all' : 'green')} active={zoneFilter === 'green'} />
        </div>

        {/* Filter Row */}
        <div className="flex items-center gap-4 text-sm">
          <span className="text-grove-text-dim">Filter:</span>
          <select
            value={threatFilter}
            onChange={(e) => setThreatFilter(e.target.value as FilterThreat)}
            className="bg-grove-bg border border-grove-border px-2 py-1 text-grove-text text-sm focus:border-grove-amber focus:outline-none"
          >
            <option value="all">All Threat Levels</option>
            <option value="critical">Critical Only</option>
            <option value="significant">Significant</option>
            <option value="routine">Routine</option>
          </select>
          {(zoneFilter !== 'all' || threatFilter !== 'all') && (
            <button
              onClick={() => { setZoneFilter('all'); setThreatFilter('all') }}
              className="text-grove-amber hover:text-grove-amber-bright"
            >
              Clear filters
            </button>
          )}
        </div>
      </div>

      {/* Signal List */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3 scrollbar-thin">
        {filteredSignals.length === 0 ? (
          <div className="text-center py-12 text-grove-text-dim">
            <p className="font-serif text-lg mb-2">No signals match filters</p>
            <p className="text-sm">Adjust filters or wait for new signals</p>
          </div>
        ) : (
          filteredSignals.map((signal) => (
            <SignalCard
              key={signal.id}
              signal={signal}
              onSelect={handleSelect}
              isSelected={signal.id === selectedSignalId}
            />
          ))
        )}
      </div>

      {/* Footer with Zone Legend */}
      <div className="border-t border-grove-border p-3 bg-grove-bg2">
        <div className="flex items-center justify-between text-xs text-grove-text-dim">
          <div className="flex items-center gap-4">
            <span><span className="inline-block w-2 h-2 bg-zone-green mr-1" /> GREEN: Auto-execute (Δ &lt; 0.05)</span>
            <span><span className="inline-block w-2 h-2 bg-zone-yellow mr-1" /> YELLOW: Approval required (0.05 ≤ Δ &lt; 0.15)</span>
            <span><span className="inline-block w-2 h-2 bg-zone-red mr-1" /> RED: Human decision (Δ ≥ 0.15)</span>
          </div>
          <span className="font-mono">Pipeline: 5-stage invariant</span>
        </div>
      </div>
    </div>
  )
}

/**
 * Zone stat pill for quick filtering
 */
function ZoneStatPill({
  zone,
  count,
  onClick,
  active,
}: {
  zone: Zone
  count: number
  onClick: () => void
  active: boolean
}) {
  const colors = {
    green: 'bg-zone-green/20 text-zone-green border-zone-green',
    yellow: 'bg-zone-yellow/20 text-zone-yellow border-zone-yellow',
    red: 'bg-zone-red/20 text-zone-red border-zone-red',
  }

  const labels = {
    green: 'Routine',
    yellow: 'Significant',
    red: 'Structural',
  }

  return (
    <button
      onClick={onClick}
      className={`
        px-3 py-1.5 text-sm font-mono border transition-all
        ${colors[zone]}
        ${active ? 'ring-1 ring-offset-1 ring-offset-grove-bg' : 'opacity-70 hover:opacity-100'}
      `}
    >
      <span className="mr-2">{labels[zone]}</span>
      <span className="font-bold">{count}</span>
    </button>
  )
}

export default SignalFeed

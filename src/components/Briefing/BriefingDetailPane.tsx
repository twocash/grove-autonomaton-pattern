/**
 * BriefingDetailPane — Drill-down view for a briefing
 *
 * Shows the full briefing content when user clicks "View N signals".
 * For ad-hoc scans: Shows research analysis and real sources.
 * For signal-based briefings: Shows linked signals.
 */

import type { Briefing, ResearchSection } from '../../state/types'

interface BriefingDetailPaneProps {
  briefing: Briefing
}

export function BriefingDetailPane({ briefing }: BriefingDetailPaneProps) {
  return (
    <div className="h-full flex flex-col overflow-hidden">
      {/* Header */}
      <div className="p-4 border-b border-grove-border bg-grove-bg2">
        <div className="flex items-center gap-2 mb-2">
          <ZoneBadge zone={briefing.zone} />
          <span className="text-xs text-grove-text-dim font-mono">
            {new Date(briefing.timestamp).toLocaleString()}
          </span>
        </div>
        <h3 className="font-serif text-lg text-grove-text">{briefing.title}</h3>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin">
        {/* Summary */}
        <div>
          <h4 className="text-xs font-mono text-grove-text-dim uppercase tracking-wider mb-2">
            Summary
          </h4>
          <p className="text-sm text-grove-text leading-relaxed">
            {stripCitations(briefing.summary)}
          </p>
        </div>

        {/* Research Section (for ad-hoc scans) */}
        {briefing.research && (
          <ResearchDetails research={briefing.research} />
        )}

        {/* Highlights */}
        {briefing.highlights.length > 0 && (
          <div>
            <h4 className="text-xs font-mono text-grove-text-dim uppercase tracking-wider mb-2">
              Key Highlights
            </h4>
            <ul className="space-y-2">
              {briefing.highlights.map((h, i) => (
                <li key={i} className="flex items-start gap-2 text-sm">
                  <span className={`mt-1 ${
                    h.zone === 'red' ? 'text-zone-red' :
                    h.zone === 'yellow' ? 'text-zone-yellow' :
                    'text-zone-green'
                  }`}>
                    {h.zone === 'red' ? '!' : h.zone === 'yellow' ? '?' : '•'}
                  </span>
                  <span className="text-grove-text">{stripCitations(h.text)}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Recommendations */}
        {briefing.recommendations && briefing.recommendations.length > 0 && (
          <div>
            <h4 className="text-xs font-mono text-grove-text-dim uppercase tracking-wider mb-2">
              Recommendations
            </h4>
            <div className="space-y-3">
              {briefing.recommendations.map((rec, i) => (
                <div key={i} className="border-l-2 border-grove-amber pl-3">
                  <div className="flex items-center gap-2 mb-1">
                    <span className={`text-xs font-mono px-1 ${
                      rec.priority === 'high' ? 'bg-zone-red/20 text-zone-red' :
                      rec.priority === 'medium' ? 'bg-zone-yellow/20 text-zone-yellow' :
                      'bg-grove-bg3 text-grove-text-dim'
                    }`}>
                      {rec.priority.toUpperCase()}
                    </span>
                    {rec.subject && (
                      <span className="text-xs text-grove-text-dim">{rec.subject}</span>
                    )}
                  </div>
                  <p className="text-sm text-grove-text">{stripCitations(rec.action)}</p>
                  <p className="text-xs text-grove-text-dim mt-1">{stripCitations(rec.rationale)}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Pending Adjustments Preview */}
        {briefing.pendingAdjustments && briefing.pendingAdjustments.length > 0 && (
          <div>
            <h4 className="text-xs font-mono text-grove-text-dim uppercase tracking-wider mb-2">
              Pending Score Adjustments ({briefing.pendingAdjustments.length})
            </h4>
            <div className="space-y-2">
              {briefing.pendingAdjustments.map((adj) => (
                <div key={adj.id} className="bg-grove-bg3 p-2 text-sm">
                  <div className="flex items-center justify-between">
                    <span className="text-grove-text">{adj.subjectName}</span>
                    <span className={adj.delta > 0 ? 'text-zone-green' : 'text-zone-red'}>
                      {adj.delta > 0 ? '+' : ''}{(adj.delta * 100).toFixed(0)}%
                    </span>
                  </div>
                  <div className="text-xs text-grove-text-dim mt-1">{stripCitations(adj.reason)}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* No content fallback */}
        {!briefing.research && briefing.highlights.length === 0 && (
          <div className="text-center py-8 text-grove-text-dim">
            <p className="text-sm">No additional details available for this briefing.</p>
          </div>
        )}
      </div>

      {/* Footer with provenance */}
      <div className="border-t border-grove-border p-3 bg-grove-bg2">
        <div className="flex items-center justify-between text-xs text-grove-text-dim">
          <span>
            Tier {briefing.tier} | {briefing.signalCount} source{briefing.signalCount !== 1 ? 's' : ''}
          </span>
          <span className="font-mono">
            ID: {briefing.id.slice(0, 12)}...
          </span>
        </div>
      </div>
    </div>
  )
}

/**
 * Research details section — shows analysis and real sources
 */
function ResearchDetails({ research }: { research: ResearchSection }) {
  return (
    <>
      {/* Analysis */}
      <div>
        <h4 className="text-xs font-mono text-grove-text-dim uppercase tracking-wider mb-2">
          Analysis
        </h4>
        <p className="text-sm text-grove-text leading-relaxed">
          {stripCitations(research.analysis)}
        </p>
      </div>

      {/* Key Findings */}
      {research.keyFindings.length > 0 && (
        <div>
          <h4 className="text-xs font-mono text-grove-text-dim uppercase tracking-wider mb-2">
            Key Findings
          </h4>
          <ul className="space-y-2">
            {research.keyFindings.map((finding, i) => (
              <li key={i} className="flex items-start gap-2 text-sm">
                <span className="text-grove-amber mt-1">•</span>
                <span className="text-grove-text">{stripCitations(finding)}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Sources — REAL URLs from web search */}
      {research.sources.length > 0 && (
        <div>
          <h4 className="text-xs font-mono text-grove-text-dim uppercase tracking-wider mb-2">
            Sources ({research.sources.length})
          </h4>
          <div className="space-y-2">
            {research.sources.map((source, i) => (
              <a
                key={i}
                href={source.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-start gap-2 text-sm p-2 -mx-2 hover:bg-grove-bg3 transition-colors group"
              >
                <span className="text-grove-amber">↗</span>
                <div className="flex-1 min-w-0">
                  <div className="text-grove-text group-hover:text-grove-amber truncate">
                    {source.title}
                  </div>
                  {source.citedText && (
                    <div className="text-xs text-grove-text-dim mt-1 line-clamp-2">
                      "{source.citedText}"
                    </div>
                  )}
                  <div className="text-xs text-grove-text-dim mt-1 truncate">
                    {extractDomain(source.url)}
                    {source.pageAge && ` · ${source.pageAge}`}
                  </div>
                </div>
              </a>
            ))}
          </div>
        </div>
      )}

      {/* Provenance Footer */}
      <div className="flex items-center justify-between text-xs text-grove-text-dim border-t border-grove-border pt-3 mt-2">
        <span>
          {research.searchCount} web search{research.searchCount !== 1 ? 'es' : ''} executed
        </span>
        <span className="font-mono">
          Template #<span className="text-grove-amber">{research.templateHash}</span>
        </span>
      </div>
    </>
  )
}

/**
 * Zone badge component
 */
function ZoneBadge({ zone }: { zone: 'green' | 'yellow' | 'red' }) {
  const colors = {
    green: 'bg-zone-green text-grove-bg',
    yellow: 'bg-zone-yellow text-grove-bg',
    red: 'bg-zone-red text-grove-bg',
  }
  const labels = {
    green: 'GREEN',
    yellow: 'YELLOW',
    red: 'RED',
  }
  return (
    <span className={`px-2 py-0.5 text-xs font-mono uppercase font-bold ${colors[zone]}`}>
      {labels[zone]}
    </span>
  )
}

/**
 * Extract domain from URL for display
 */
function extractDomain(url: string): string {
  try {
    return new URL(url).hostname
  } catch {
    return url.slice(0, 30)
  }
}

/**
 * Strip <cite> tags from Claude's web search response
 * Sources are displayed separately, so we just need clean text
 */
function stripCitations(text: string): string {
  return text.replace(/<cite[^>]*>([\s\S]*?)<\/cite>/gi, '$1')
}

export default BriefingDetailPane

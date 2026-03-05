/**
 * Grove Autonomaton Pattern Playground
 *
 * A browser-based demo proving 9 architectural claims through user interaction.
 *
 * Layout:
 * ┌─────────────────────────────────────────────────────────────┐
 * │ Header (Mode Toggle, Model Config, Andon Cord)              │
 * ├─────────────────────────────────────────────────────────────┤
 * │ Pipeline Visualization (Hero Element)                       │
 * ├─────────────────────────────────────────────────────────────┤
 * │ Dashboard (Metrics)                                         │
 * ├──────────────────────────────┬──────────────────────────────┤
 * │ Interaction Pane             │ Config Editor / Skills       │
 * │                              │                              │
 * ├──────────────────────────────┴──────────────────────────────┤
 * │ Telemetry Stream                                            │
 * └─────────────────────────────────────────────────────────────┘
 *
 * Design System: Editorial Industrial (no rounded corners)
 */

import { useAppState } from './state/context'
import { PipelineVisualization } from './components/Pipeline'
import { Dashboard } from './components/Dashboard'
import { InteractionPane } from './components/Interaction'
import { FoundryPane } from './components/Foundry'
import { ConfigEditor } from './components/Config'
import { TelemetryStream } from './components/Telemetry'
import { Header } from './components/Header'
import { DeckOverlay } from './components/Deck'

// App version — update on each release
const APP_VERSION = '0.9.9'

export default function App() {
  const { currentView } = useAppState()

  return (
    <div className="h-screen bg-grove-bg text-grove-text flex flex-col overflow-hidden">
      <Header />
      <PipelineVisualization />
      <Dashboard />

      {/* Main Content */}
      <main className="flex-1 flex min-h-0 overflow-hidden">
        {/* LEFT PANE: View Router (v0.8.0) */}
        {currentView === 'sandbox' ? <InteractionPane /> : <FoundryPane />}
        {/* RIGHT PANE: Always visible */}
        <ConfigEditor />
      </main>

      <TelemetryStream />

      {/* Footer */}
      <footer className="border-t border-grove-border px-6 py-3 text-center text-xs text-grove-text-dim font-mono">
        <a href="https://the-grove.ai" target="_blank" rel="noopener noreferrer" className="hover:text-grove-text transition-colors">
          The Grove Autonomaton Pattern
        </a>
        {' '}• CC BY 4.0 • the-grove.ai | <span className="text-grove-green font-semibold">v{APP_VERSION}</span>
      </footer>

      {/* Deck overlay (v0.7.1) */}
      <DeckOverlay />
    </div>
  )
}

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
 */

import { useAppState } from './state/context'
import { PipelineVisualization } from './components/Pipeline'
import { Dashboard } from './components/Dashboard'
import { InteractionPane } from './components/Interaction'
import { ConfigEditor } from './components/Config'
import { TelemetryStream } from './components/Telemetry'
import { Header } from './components/Header'

export default function App() {
  const { tutorial } = useAppState()

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col">
      <Header />
      <PipelineVisualization />
      <Dashboard />

      {/* Main Content */}
      <main className="flex-1 flex overflow-hidden">
        <InteractionPane />
        <ConfigEditor />
      </main>

      <TelemetryStream />

      {/* Footer */}
      <footer className="border-t border-slate-700 px-6 py-3 text-center text-xs text-slate-500">
        The Grove Autonomaton Pattern • CC BY 4.0 • thegrovefoundation.org
      </footer>

      {/* Tutorial overlay would go here */}
      {tutorial.active && tutorial.currentStep === 0 && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
          <div className="bg-slate-800 border border-slate-600 rounded-xl p-8 max-w-lg text-center">
            <h2 className="text-2xl font-semibold text-white mb-4">
              Welcome to the Pattern Playground
            </h2>
            <p className="text-slate-300 mb-6">
              This demo proves the Grove Autonomaton pattern through your own actions.
              You'll experience zone governance, live config editing, and the skill flywheel.
            </p>
            <p className="text-sm text-slate-400 mb-6">
              Ready to see software that identifies its own issues, proposes its own fixes,
              and authors its own evolution — inside zones you control?
            </p>
            <div className="flex gap-4 justify-center">
              <button className="bg-blue-600 hover:bg-blue-500 text-white px-6 py-2 rounded-lg font-medium transition-colors">
                Start Tutorial
              </button>
              <button className="text-slate-400 hover:text-slate-300 px-4 py-2 text-sm">
                Skip to Sandbox →
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

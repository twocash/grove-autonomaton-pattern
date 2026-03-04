/**
 * Header — Logo, Deck Link, Mode Toggle
 *
 * Typography: Instrument Serif for logo
 * No rounded corners (strict geometry)
 *
 * v0.4.1: Andon dropdown moved to InteractionPane PromptTray
 */

import { useAppState, useAppDispatch } from '../../state/context'

export function Header() {
  const { mode } = useAppState()
  const dispatch = useAppDispatch()

  const handleModeToggle = () => {
    dispatch({ type: 'SET_MODE', mode: mode === 'demo' ? 'interactive' : 'demo' })
  }

  return (
    <header className="border-b border-grove-border px-6 py-4 bg-grove-bg2">
      <div className="flex items-center justify-between">
        {/* Logo — Instrument Serif */}
        <div>
          <h1 className="text-xl font-serif text-grove-text">
            Grove Autonomaton
          </h1>
          <p className="text-sm text-grove-text-dim">Pattern Playground</p>
        </div>

        <div className="flex items-center gap-6">
          {/* Manifesto Link */}
          <a
            href="grove-autonomaton-deck.html"
            target="_blank"
            rel="noopener noreferrer"
            className="font-serif text-grove-amber hover:text-grove-amber-bright transition-colors text-sm"
          >
            [ Read the Pattern Deck ]
          </a>

          {/* Mode Toggle */}
          <div className="flex items-center gap-2">
            <span className="text-sm text-grove-text-dim">Mode:</span>
            <button
              onClick={handleModeToggle}
              className={`
                px-3 py-1 text-sm font-medium transition-colors
                ${mode === 'demo'
                  ? 'bg-grove-amber text-white'
                  : 'bg-grove-green text-white'
                }
              `}
            >
              {mode === 'demo' ? 'Demo' : 'Interactive'}
            </button>
          </div>
        </div>
      </div>
    </header>
  )
}

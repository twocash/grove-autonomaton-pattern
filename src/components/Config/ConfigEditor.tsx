/**
 * ConfigEditor — Live-editable configuration files
 *
 * This proves Claim #3: Declarative configuration defines behavior.
 * Edit the config → behavior changes immediately → no deploy required.
 *
 * The "config ripple" animation is the proof: a visual pulse travels
 * from the editor to the interaction pane when changes are saved.
 */

import { useState } from 'react'
import { useRoutingConfig, useZonesSchema, useAppDispatch, useAppState } from '../../state/context'
import { serializeRoutingConfig, parseRoutingConfig } from '../../config/routing'
import { serializeZonesSchema } from '../../config/zones'

type Tab = 'routing' | 'zones'

export function ConfigEditor() {
  const [activeTab, setActiveTab] = useState<Tab>('routing')
  const [error, setError] = useState<string | null>(null)
  const routingConfig = useRoutingConfig()
  const zonesSchema = useZonesSchema()
  const dispatch = useAppDispatch()
  const { configRipple } = useAppState()

  const [routingText, setRoutingText] = useState(serializeRoutingConfig(routingConfig))
  const [zonesText, setZonesText] = useState(serializeZonesSchema(zonesSchema))

  const handleRoutingChange = (text: string) => {
    setRoutingText(text)
    setError(null)
  }

  const handleSaveRouting = () => {
    const result = parseRoutingConfig(routingText)
    if ('error' in result) {
      setError(result.error)
      return
    }

    dispatch({ type: 'UPDATE_ROUTING_CONFIG', config: result })
    dispatch({ type: 'TRIGGER_CONFIG_RIPPLE' })
    setTimeout(() => dispatch({ type: 'CLEAR_CONFIG_RIPPLE' }), 600)
    setError(null)
  }

  return (
    <div className="w-96 flex flex-col border-l border-slate-700 relative">
      {/* Config Ripple Animation */}
      {configRipple && (
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute inset-0 bg-blue-500/20 animate-ripple" />
        </div>
      )}

      {/* Tabs */}
      <div className="flex border-b border-slate-700">
        <button
          onClick={() => setActiveTab('routing')}
          className={`
            flex-1 px-4 py-2 text-sm font-medium transition-colors
            ${activeTab === 'routing'
              ? 'text-blue-400 border-b-2 border-blue-400'
              : 'text-slate-400 hover:text-slate-300'
            }
          `}
        >
          routing.config
        </button>
        <button
          onClick={() => setActiveTab('zones')}
          className={`
            flex-1 px-4 py-2 text-sm font-medium transition-colors
            ${activeTab === 'zones'
              ? 'text-blue-400 border-b-2 border-blue-400'
              : 'text-slate-400 hover:text-slate-300'
            }
          `}
        >
          zones.schema
        </button>
      </div>

      {/* Editor */}
      <div className="flex-1 p-4 overflow-y-auto">
        {activeTab === 'routing' ? (
          <textarea
            value={routingText}
            onChange={(e) => handleRoutingChange(e.target.value)}
            className="config-editor w-full h-full min-h-[300px]"
            spellCheck={false}
          />
        ) : (
          <textarea
            value={zonesText}
            onChange={(e) => setZonesText(e.target.value)}
            className="config-editor w-full h-full min-h-[300px]"
            spellCheck={false}
            readOnly
          />
        )}
      </div>

      {/* Validation & Save */}
      <div className="border-t border-slate-700 p-3 flex items-center justify-between">
        <div className="text-xs">
          {error ? (
            <span className="text-red-400">✗ {error}</span>
          ) : (
            <span className="text-green-400">✓ Valid</span>
          )}
        </div>
        {activeTab === 'routing' && (
          <button
            onClick={handleSaveRouting}
            className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-1 rounded text-sm font-medium transition-colors"
          >
            Apply Changes
          </button>
        )}
      </div>
    </div>
  )
}

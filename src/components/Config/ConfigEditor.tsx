/**
 * ConfigEditor — Live-editable configuration files
 *
 * This proves Claim #3: Declarative configuration defines behavior.
 * Edit the config → behavior changes immediately → no deploy required.
 *
 * The "config ripple" animation is the proof: a visual pulse travels
 * from the editor to the interaction pane when changes are saved.
 *
 * Four tabs:
 * - routing.config: Intent routing rules
 * - zones.schema: Zone governance definitions
 * - models.config: Tier-to-model mappings (proves Claim #8)
 * - skills.library: Approved cached patterns
 */

import { useState, useEffect } from 'react'
import { useRoutingConfig, useZonesSchema, useAppDispatch, useAppState, useSkills } from '../../state/context'
import { serializeRoutingConfig, parseRoutingConfig } from '../../config/routing'
import { serializeZonesSchema } from '../../config/zones'
import { serializeModelsConfig, parseModelsConfig } from '../../config/models'
import { serializeSkills } from '../../config/skills'

type Tab = 'routing' | 'zones' | 'models' | 'skills'

export function ConfigEditor() {
  const [activeTab, setActiveTab] = useState<Tab>('routing')
  const [error, setError] = useState<string | null>(null)
  const [hasEdited, setHasEdited] = useState(false)
  const routingConfig = useRoutingConfig()
  const zonesSchema = useZonesSchema()
  const state = useAppState()
  const skills = useSkills()
  const dispatch = useAppDispatch()
  const { configRipple, skillProposal } = state

  const [routingText, setRoutingText] = useState(serializeRoutingConfig(routingConfig))
  const [zonesText, setZonesText] = useState(serializeZonesSchema(zonesSchema))
  const [modelsText, setModelsText] = useState(serializeModelsConfig(state))
  const [skillsText, setSkillsText] = useState(serializeSkills(skills))

  // Update skills text when skills change
  useEffect(() => {
    setSkillsText(serializeSkills(skills))
  }, [skills])

  // Auto-switch to skills tab when skill is approved
  useEffect(() => {
    if (!skillProposal.active && skills.length > 0) {
      const lastSkill = skills[skills.length - 1]
      const isRecent = Date.now() - new Date(lastSkill.approvedAt).getTime() < 2000
      if (isRecent) {
        setActiveTab('skills')
      }
    }
  }, [skills, skillProposal.active])

  const handleRoutingChange = (text: string) => {
    setRoutingText(text)
    setError(null)
    if (!hasEdited) setHasEdited(true)
  }

  const handleModelsChange = (text: string) => {
    setModelsText(text)
    setError(null)
    if (!hasEdited) setHasEdited(true)
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

  const handleSaveModels = () => {
    const result = parseModelsConfig(modelsText)
    if ('error' in result) {
      setError(result.error)
      return
    }

    // Apply each tier's config
    const { modelConfig } = result
    dispatch({ type: 'SET_MODEL_CONFIG', tier: 1, config: modelConfig.tier1 })
    dispatch({ type: 'SET_MODEL_CONFIG', tier: 2, config: modelConfig.tier2 })
    dispatch({ type: 'SET_MODEL_CONFIG', tier: 3, config: modelConfig.tier3 })
    dispatch({ type: 'TRIGGER_CONFIG_RIPPLE' })
    setTimeout(() => dispatch({ type: 'CLEAR_CONFIG_RIPPLE' }), 600)
    setError(null)
  }

  const isEditable = activeTab === 'routing' || activeTab === 'models'

  return (
    <div className="w-96 flex flex-col border-l border-slate-700 relative">
      {/* Config Ripple Animation */}
      {configRipple && (
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute inset-0 bg-blue-500/20 animate-ripple" />
        </div>
      )}

      {/* Tabs */}
      <div className="flex border-b border-slate-700 overflow-x-auto">
        <TabButton
          label="routing.config"
          active={activeTab === 'routing'}
          onClick={() => setActiveTab('routing')}
        />
        <TabButton
          label="zones.schema"
          active={activeTab === 'zones'}
          onClick={() => setActiveTab('zones')}
        />
        <TabButton
          label="models.config"
          active={activeTab === 'models'}
          onClick={() => setActiveTab('models')}
          highlight={state.mode === 'interactive'}
        />
        <TabButton
          label="skills.library"
          active={activeTab === 'skills'}
          onClick={() => setActiveTab('skills')}
          badge={skills.length > 0 ? skills.length.toString() : undefined}
        />
      </div>

      {/* Editor */}
      <div className={`
        flex-1 p-4 overflow-y-auto
        ${!hasEdited && isEditable ? 'animate-pulse-border' : ''}
      `}>
        {activeTab === 'routing' && (
          <textarea
            value={routingText}
            onChange={(e) => handleRoutingChange(e.target.value)}
            className="config-editor w-full h-full min-h-[300px]"
            spellCheck={false}
          />
        )}
        {activeTab === 'zones' && (
          <textarea
            value={zonesText}
            onChange={(e) => setZonesText(e.target.value)}
            className="config-editor w-full h-full min-h-[300px]"
            spellCheck={false}
            readOnly
          />
        )}
        {activeTab === 'models' && (
          <textarea
            value={modelsText}
            onChange={(e) => handleModelsChange(e.target.value)}
            className="config-editor w-full h-full min-h-[300px]"
            spellCheck={false}
          />
        )}
        {activeTab === 'skills' && (
          <textarea
            value={skillsText}
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
          ) : isEditable ? (
            <span className="text-green-400">✓ Valid</span>
          ) : (
            <span className="text-slate-500">Read-only</span>
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
        {activeTab === 'models' && (
          <button
            onClick={handleSaveModels}
            className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-1 rounded text-sm font-medium transition-colors"
          >
            Apply Changes
          </button>
        )}
      </div>

      {/* First-edit hint */}
      {!hasEdited && isEditable && (
        <div className="absolute top-12 right-4 bg-blue-600 text-white text-xs px-2 py-1 rounded shadow-lg animate-bounce">
          Edit me — changes apply instantly!
        </div>
      )}
    </div>
  )
}

interface TabButtonProps {
  label: string
  active: boolean
  onClick: () => void
  highlight?: boolean
  badge?: string
}

function TabButton({ label, active, onClick, highlight, badge }: TabButtonProps) {
  return (
    <button
      onClick={onClick}
      className={`
        relative px-3 py-2 text-xs font-medium transition-colors whitespace-nowrap
        ${active
          ? 'text-blue-400 border-b-2 border-blue-400'
          : highlight
            ? 'text-yellow-400 hover:text-yellow-300'
            : 'text-slate-400 hover:text-slate-300'
        }
      `}
    >
      {label}
      {badge && (
        <span className="absolute -top-1 -right-1 bg-tier-0 text-black text-[10px] px-1.5 rounded-full font-bold">
          {badge}
        </span>
      )}
    </button>
  )
}

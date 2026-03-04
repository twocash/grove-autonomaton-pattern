/**
 * InteractionPane — User input and interaction history
 *
 * This is where users type requests and see responses.
 * Each interaction shows: tier, zone, cost, and the system response.
 */

import { useState } from 'react'
import { useInteractions, useTutorial, usePendingApproval } from '../../state/context'

export function InteractionPane() {
  const [input, setInput] = useState('')
  const interactions = useInteractions()
  const tutorial = useTutorial()
  const pendingApproval = usePendingApproval()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim()) return

    // TODO: Wire to orchestrator
    console.log('Submit:', input)
    setInput('')
  }

  return (
    <div className="flex-1 border-r border-slate-700 flex flex-col">
      {/* Interaction List */}
      <div className="flex-1 p-6 overflow-y-auto scrollbar-thin">
        {interactions.length === 0 ? (
          <div className="text-center text-slate-500 py-12">
            <p className="text-lg mb-2">Welcome to the Pattern Playground</p>
            <p className="text-sm">
              {tutorial.active
                ? 'Follow the tutorial to experience the Autonomaton pattern.'
                : 'Type a request below to begin.'}
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {interactions.map((interaction) => (
              <div
                key={interaction.id}
                className={`
                  bg-slate-800/50 rounded-lg p-4 border-l-4
                  ${interaction.zone === 'green' ? 'border-zone-green' : ''}
                  ${interaction.zone === 'yellow' ? 'border-zone-yellow' : ''}
                  ${interaction.zone === 'red' ? 'border-zone-red' : ''}
                `}
              >
                <div className="text-sm text-slate-400 mb-2">
                  {interaction.input}
                </div>
                <div className="flex items-center gap-3 text-xs mb-2">
                  <span className={`tier-${interaction.tier} px-2 py-0.5 rounded border`}>
                    Tier {interaction.tier}
                  </span>
                  <span className={`zone-${interaction.zone} px-2 py-0.5 rounded border`}>
                    {interaction.zone}
                  </span>
                  <span className="text-slate-500">
                    ${interaction.cost.toFixed(4)}
                  </span>
                </div>
                {interaction.response && (
                  <div className="text-sm text-slate-300 whitespace-pre-wrap">
                    {interaction.response}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Pending Approval Card */}
        {pendingApproval && (
          <div className="mt-4 bg-yellow-950/30 border border-zone-yellow rounded-lg p-4">
            <div className="flex items-center gap-2 text-zone-yellow font-medium mb-2">
              <span>✋</span>
              <span>Approval Required</span>
            </div>
            <p className="text-sm text-slate-300 mb-4">
              This action requires your approval before proceeding.
            </p>
            <div className="flex gap-2">
              <button className="bg-green-600 hover:bg-green-500 text-white px-4 py-2 rounded text-sm font-medium">
                Approve
              </button>
              <button className="bg-slate-700 hover:bg-slate-600 text-white px-4 py-2 rounded text-sm font-medium">
                Reject
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Input Area */}
      <form onSubmit={handleSubmit} className="border-t border-slate-700 p-4">
        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type your request..."
            className="flex-1 bg-slate-800 border border-slate-600 rounded-lg px-4 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
          />
          <button
            type="submit"
            className="bg-blue-600 hover:bg-blue-500 text-white px-6 py-2 rounded-lg font-medium transition-colors"
          >
            Send
          </button>
        </div>
      </form>
    </div>
  )
}

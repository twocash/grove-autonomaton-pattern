/**
 * Signal Watch — Competitive Intelligence Monitor
 *
 * Layout:
 * ┌─────────────────────────────────────────────────────────────┐
 * │ Header (Logo, API Key)                                      │
 * ├─────────────────────────────────────────────────────────────┤
 * │ Pipeline Visualization                                      │
 * ├────────────────┬──────────────────────────┬─────────────────┤
 * │ Signal Feed    │ Briefing Inbox (2/3)     │ Watchlist (1/3) │
 * │ (collapsible)  │                          │                 │
 * ├────────────────┴──────────────────────────┴─────────────────┤
 * │ Command Bar (ad-hoc scans)                                  │
 * ├─────────────────────────────────────────────────────────────┤
 * │ Telemetry Stream (provenance)                               │
 * └─────────────────────────────────────────────────────────────┘
 */

import { useState, useEffect } from 'react'
import { PipelineVisualization } from './components/Pipeline'
import { TelemetryStream } from './components/Telemetry'
import { Header } from './components/Header'
import { BriefingInbox, BriefingDetailPane } from './components/Briefing'
import { SignalFeed } from './components/SignalFeed'
import { WatchlistDashboard, SubjectDetailPane } from './components/Watchlist'
import { CommandBar } from './components/CommandBar'
import { useAppDispatch, useAppState } from './state/context'
import { executeCognitiveRequest, executeResearchRequest, type ResearchResult } from './services/CognitiveAdapter'
import { shouldProposeSkill, generatePatternDescription, getAdjustmentPatternKey, getBriefMeOnPatternKey } from './services'
import { defaultScanTemplate, serializeScanPrompt, parseScanResponse, hashScanConfig } from './config/prompts/scan.template'
import { defaultSubjectTemplate, serializeSubjectPrompt, parseSubjectResponse, hashSubjectConfig } from './config/prompts/subject.template'
import { defaultDomainTemplate, serializeDomainPrompt, parseDomainResponse, hashDomainConfig } from './config/prompts/domain.template'
import type { Briefing, WatchlistSubject, TelemetryEntry, ScoreHistoryEntry, ScoreAdjustment, ProposedSubject, DomainConfig, ResearchSection } from './state/types'

const API_KEY_STORAGE_KEY = 'signal_watch_api_key'
const BRIEFINGS_STORAGE_KEY = 'signal_watch_briefings'
const SUBJECTS_STORAGE_KEY = 'signal_watch_subjects'
const TRAINING_COMPLETE_KEY = 'signal_watch_training_complete'
const DOMAIN_CONFIG_KEY = 'signal_watch_domain_config'

const APP_VERSION = '0.2.0'
declare const __COMMIT_HASH__: string

// Load from localStorage — start empty for training mode
function loadBriefings(): Briefing[] {
  try {
    const stored = localStorage.getItem(BRIEFINGS_STORAGE_KEY)
    return stored ? JSON.parse(stored) : []
  } catch {
    return []
  }
}

function loadSubjects(): WatchlistSubject[] {
  try {
    const stored = localStorage.getItem(SUBJECTS_STORAGE_KEY)
    return stored ? JSON.parse(stored) : []
  } catch {
    return []
  }
}

function loadTrainingComplete(): boolean {
  return localStorage.getItem(TRAINING_COMPLETE_KEY) === 'true'
}

function loadDomainConfig(): DomainConfig | null {
  try {
    const stored = localStorage.getItem(DOMAIN_CONFIG_KEY)
    return stored ? JSON.parse(stored) : null
  } catch {
    return null
  }
}

export default function App() {
  const dispatch = useAppDispatch()
  const appState = useAppState()  // For flywheel pattern tracking

  // Local state for briefings and watchlist (persisted to localStorage)
  const [briefings, setBriefings] = useState<Briefing[]>(loadBriefings)
  const [subjects, setSubjects] = useState<WatchlistSubject[]>(loadSubjects)

  const [isSignalPanelOpen, setIsSignalPanelOpen] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)
  const [trainingComplete, setTrainingComplete] = useState(loadTrainingComplete)
  const [domainConfig, setDomainConfig] = useState<DomainConfig | null>(loadDomainConfig)
  const [domainSetupPhase, setDomainSetupPhase] = useState<'industry' | 'tracking' | null>(null)
  const [pendingIndustry, setPendingIndustry] = useState<string | null>(null)
  const [selectedBriefing, setSelectedBriefing] = useState<Briefing | null>(null)
  const [selectedSubject, setSelectedSubject] = useState<WatchlistSubject | null>(null)

  // Persist to localStorage on change
  useEffect(() => {
    localStorage.setItem(BRIEFINGS_STORAGE_KEY, JSON.stringify(briefings))
  }, [briefings])

  useEffect(() => {
    localStorage.setItem(SUBJECTS_STORAGE_KEY, JSON.stringify(subjects))
  }, [subjects])

  // Persist domain config
  useEffect(() => {
    if (domainConfig) {
      localStorage.setItem(DOMAIN_CONFIG_KEY, JSON.stringify(domainConfig))
    }
  }, [domainConfig])

  // Initialize domain setup phase on mount
  useEffect(() => {
    if (!domainConfig && domainSetupPhase === null) {
      setDomainSetupPhase('industry')
    }
  }, [domainConfig, domainSetupPhase])

  // Add telemetry entry
  const addTelemetry = (entry: Omit<TelemetryEntry, 'id' | 'timestamp'>) => {
    dispatch({
      type: 'ADD_TELEMETRY',
      entry: {
        id: `tel-${Date.now()}`,
        timestamp: new Date().toISOString(),
        ...entry,
      },
    })
  }

  // Animate pipeline stages
  const animatePipeline = async () => {
    const stages: Array<'telemetry' | 'recognition' | 'compilation' | 'approval' | 'execution'> = [
      'telemetry', 'recognition', 'compilation', 'approval', 'execution'
    ]
    for (const stage of stages) {
      dispatch({ type: 'SET_PIPELINE_STAGE', stage, state: 'active' })
      await sleep(400)
      dispatch({ type: 'SET_PIPELINE_STAGE', stage, state: 'complete' })
    }
    await sleep(300)
    dispatch({ type: 'RESET_PIPELINE' })
  }

  // Handle ad-hoc scan
  const handleScan = async (query: string) => {
    const apiKey = localStorage.getItem(API_KEY_STORAGE_KEY)

    if (!apiKey) {
      addTelemetry({
        intent: 'ad_hoc_scan',
        tier: 0,
        zone: 'red',
        confidence: 0,
        cost: 0,
        mode: 'interactive',
        latencyMs: 0,
        humanFeedback: null,
        skillMatch: null,
        message: `Scan failed: No API key configured. Click "Configure" in header.`,
      })
      return
    }

    setIsProcessing(true)
    const startTime = Date.now()

    addTelemetry({
      intent: 'ad_hoc_scan',
      tier: 2,
      zone: 'yellow',
      confidence: 0.8,
      cost: 0.01,
      mode: 'interactive',
      latencyMs: 0,
      humanFeedback: null,
      skillMatch: null,
      message: `Ad-hoc scan initiated: "${query}"`,
    })

    // Start pipeline animation
    const pipelinePromise = animatePipeline()

    // Build structured scan request using versioned template
    const scanRequest = {
      query,
      timestamp: new Date().toISOString(),
      subjects,
    }
    const scanPrompt = serializeScanPrompt(defaultScanTemplate, scanRequest)
    const templateHash = hashScanConfig(defaultScanTemplate)

    try {
      // Use research-enabled request with web search
      const result: ResearchResult = await executeResearchRequest(scanPrompt, {
        provider: 'anthropic',
        model: 'claude-sonnet-4-20250514',
        apiKey,
      })

      await pipelinePromise
      const latencyMs = Date.now() - startTime

      // Parse the response using template parser
      const parsed = parseScanResponse(result.text)

      // Build research section from real web search sources
      const research: ResearchSection | undefined = (parsed.research || (result.sources && result.sources.length > 0))
        ? {
            analysis: parsed.research?.analysis || parsed.summary,
            keyFindings: parsed.research?.keyFindings || [],
            sources: (result.sources || []).map(s => ({
              url: s.url,
              title: s.title,
              citedText: s.citedText,
              pageAge: s.pageAge,
            })),
            searchCount: result.searchCount || 0,
            templateHash,
          }
        : undefined

      // Build pending adjustments if any
      const pendingAdjustments: ScoreAdjustment[] = (parsed.adjustments || []).map((adj, i) => ({
        id: `adj-${Date.now()}-${i}`,
        subjectId: adj.subjectId,
        subjectName: adj.subjectName,
        currentScore: adj.currentScore,
        proposedScore: adj.proposedScore,
        delta: adj.delta,
        reason: adj.reason,
        confidence: adj.confidence,
        signalIds: [],
        triggeredBy: 'ad_hoc_scan',
        zone: Math.abs(adj.delta) >= 0.15 ? 'red' as const : Math.abs(adj.delta) >= 0.05 ? 'yellow' as const : 'green' as const,
        status: 'pending' as const,
        createdAt: new Date().toISOString(),
        decidedAt: null,
        decidedBy: null,
      }))

      // Create briefing with research section
      const newBriefing: Briefing = {
        id: `brief-${Date.now()}`,
        title: `Scan: ${query}`,
        type: parsed.zone === 'red' ? 'strategic' : parsed.zone === 'yellow' ? 'significant' : 'routine',
        timestamp: new Date().toISOString(),
        tier: 2,
        signalCount: research?.sources.length || parsed.highlights.length,
        summary: parsed.summary,
        highlights: parsed.highlights,
        research,  // Real sources from web search
        zone: parsed.zone,
        status: 'delivered',
        pendingAdjustments: pendingAdjustments.length > 0 ? pendingAdjustments : undefined,
      }

      setBriefings(prev => [newBriefing, ...prev])

      // Build telemetry message with research info
      const researchInfo = research
        ? ` | ${research.searchCount} search${research.searchCount !== 1 ? 'es' : ''}, ${research.sources.length} source${research.sources.length !== 1 ? 's' : ''}`
        : ''

      addTelemetry({
        intent: 'ad_hoc_scan',
        tier: 2,
        zone: parsed.zone,
        confidence: 0.85,
        cost: 0.01,
        mode: 'interactive',
        latencyMs,
        humanFeedback: null,
        skillMatch: null,
        message: `Research complete: "${query}" — ${parsed.zone.toUpperCase()} zone${researchInfo} #${templateHash}`,
      })

      // =========================================================================
      // FLYWHEEL: Track "brief me on" pattern for skill promotion
      // =========================================================================
      const briefMePattern = getBriefMeOnPatternKey(query, subjects)
      if (briefMePattern) {
        dispatch({ type: 'INCREMENT_PATTERN', intent: briefMePattern })

        const newCount = (appState.patternCounts[briefMePattern] || 0) + 1
        if (shouldProposeSkill(briefMePattern, { ...appState.patternCounts, [briefMePattern]: newCount }, appState.skills, appState.routingConfig)) {
          dispatch({
            type: 'PROPOSE_SKILL',
            intent: briefMePattern,
            pattern: generatePatternDescription(briefMePattern),
            count: newCount,
          })
        }
      }

    } catch (error) {
      await pipelinePromise
      const latencyMs = Date.now() - startTime
      const message = error instanceof Error ? error.message : String(error)

      addTelemetry({
        intent: 'ad_hoc_scan',
        tier: 2,
        zone: 'red',
        confidence: 0,
        cost: 0,
        mode: 'interactive',
        latencyMs,
        humanFeedback: null,
        skillMatch: null,
        message: `Scan failed: ${message}`,
      })
    }

    setIsProcessing(false)
  }

  // Handle adding a subject to watchlist (training mode)
  const handleAddSubject = async (name: string) => {
    const apiKey = localStorage.getItem(API_KEY_STORAGE_KEY)

    if (!apiKey) {
      addTelemetry({
        intent: 'add_subject',
        tier: 0,
        zone: 'red',
        confidence: 0,
        cost: 0,
        mode: 'interactive',
        latencyMs: 0,
        humanFeedback: null,
        skillMatch: null,
        message: `Research failed: No API key configured. Click "Configure" in header.`,
      })
      return
    }

    setIsProcessing(true)
    const startTime = Date.now()

    addTelemetry({
      intent: 'add_subject',
      tier: 2,
      zone: 'yellow',
      confidence: 0.8,
      cost: 0.01,
      mode: 'interactive',
      latencyMs: 0,
      humanFeedback: null,
      skillMatch: null,
      message: `Researching subject: "${name}"`,
    })

    const pipelinePromise = animatePipeline()

    // Build structured research request using versioned template
    const subjectRequest = {
      name,
      timestamp: new Date().toISOString(),
    }
    const subjectPrompt = serializeSubjectPrompt(defaultSubjectTemplate, subjectRequest)
    const templateHash = hashSubjectConfig(defaultSubjectTemplate)

    try {
      const result = await executeCognitiveRequest(subjectPrompt, {
        provider: 'anthropic',
        model: 'claude-sonnet-4-20250514',
        apiKey,
      })

      await pipelinePromise
      const latencyMs = Date.now() - startTime

      const parsed = parseSubjectResponse(result.text)

      if (!parsed) {
        addTelemetry({
          intent: 'add_subject',
          tier: 2,
          zone: 'red',
          confidence: 0,
          cost: 0.01,
          mode: 'interactive',
          latencyMs,
          humanFeedback: null,
          skillMatch: null,
          message: `Research failed: Could not parse response for "${name}"`,
        })
        setIsProcessing(false)
        return
      }

      // Create proposed subject
      const proposedSubject: ProposedSubject = {
        id: name.toLowerCase().replace(/\s+/g, '-'),
        name: parsed.name,
        type: parsed.type,
        tier: parsed.tier,
        keywords: parsed.keywords,
        aliases: parsed.aliases,
        initialScore: parsed.initialScore,
        rationale: parsed.rationale,
      }

      // Create YELLOW briefing with pending subject
      const newBriefing: Briefing = {
        id: `brief-${Date.now()}`,
        title: `Add Subject: ${parsed.name}`,
        type: 'significant',
        timestamp: new Date().toISOString(),
        tier: 2,
        signalCount: 0,
        summary: parsed.rationale,
        highlights: [
          { text: `Type: ${parsed.type}`, zone: 'green' },
          { text: `Tier: ${parsed.tier}`, zone: 'green' },
          { text: `Keywords: ${parsed.keywords.slice(0, 5).join(', ')}`, zone: 'green' },
          { text: `Initial Score: ${Math.round(parsed.initialScore * 100)}`, zone: 'yellow' },
        ],
        pendingSubject: proposedSubject,
        zone: 'yellow',
        status: 'delivered',
      }

      setBriefings(prev => [newBriefing, ...prev])

      addTelemetry({
        intent: 'add_subject',
        tier: 2,
        zone: 'yellow',
        confidence: 0.85,
        cost: 0.01,
        mode: 'interactive',
        latencyMs,
        humanFeedback: null,
        skillMatch: null,
        message: `Subject researched: ${parsed.name} — awaiting approval #${templateHash}`,
      })

    } catch (error) {
      await pipelinePromise
      const latencyMs = Date.now() - startTime
      const message = error instanceof Error ? error.message : String(error)

      addTelemetry({
        intent: 'add_subject',
        tier: 2,
        zone: 'red',
        confidence: 0,
        cost: 0,
        mode: 'interactive',
        latencyMs,
        humanFeedback: null,
        skillMatch: null,
        message: `Research failed: ${message}`,
      })
    }

    setIsProcessing(false)
  }

  /**
   * Handle domain configuration (Phase 1 of training)
   * Called after user answers both domain questions
   */
  const handleConfigureDomain = async (industry: string, trackingPrefs: string) => {
    const apiKey = localStorage.getItem(API_KEY_STORAGE_KEY)
    if (!apiKey) {
      addTelemetry({
        intent: 'configure_domain',
        tier: 0,
        zone: 'red',
        confidence: 0,
        cost: 0,
        mode: 'interactive',
        latencyMs: 0,
        humanFeedback: null,
        skillMatch: null,
        message: 'API key required for domain configuration',
      })
      return
    }

    setIsProcessing(true)
    const startTime = Date.now()

    addTelemetry({
      intent: 'configure_domain',
      tier: 2,
      zone: 'yellow',
      confidence: 0.8,
      cost: 0.01,
      mode: 'interactive',
      latencyMs: 0,
      humanFeedback: null,
      skillMatch: null,
      message: `Configuring domain: "${industry}" with preferences: "${trackingPrefs}"`,
    })

    const pipelinePromise = animatePipeline()

    // Build structured domain request using versioned template
    const domainRequest = {
      industry,
      trackingPrefs,
      timestamp: new Date().toISOString(),
    }
    const domainPrompt = serializeDomainPrompt(defaultDomainTemplate, domainRequest)
    const templateHash = hashDomainConfig({ version: '1.0.0' } as DomainConfig)

    try {
      const result = await executeCognitiveRequest(domainPrompt, {
        provider: 'anthropic',
        model: 'claude-sonnet-4-20250514',
        apiKey,
      })

      await pipelinePromise
      const latencyMs = Date.now() - startTime

      const parsed = parseDomainResponse(result.text, domainRequest)

      if (!parsed) {
        addTelemetry({
          intent: 'configure_domain',
          tier: 2,
          zone: 'red',
          confidence: 0,
          cost: 0.01,
          mode: 'interactive',
          latencyMs,
          humanFeedback: null,
          skillMatch: null,
          message: 'Failed to parse domain configuration response',
        })
        setIsProcessing(false)
        return
      }

      // Create YELLOW briefing with pending domain config
      const newBriefing: Briefing = {
        id: `brief-domain-${Date.now()}`,
        title: `Domain Configuration: ${parsed.domain.name}`,
        type: 'significant',
        timestamp: new Date().toISOString(),
        tier: 2,
        signalCount: 0,
        summary: `Proposed configuration for tracking ${parsed.domain.name}. ${parsed.signalTypes.length} signal types, ${parsed.scoringRubric.factors.length} scoring factors.`,
        highlights: [
          { text: `Signal types: ${parsed.signalTypes.map(s => s.label).join(', ')}`, zone: 'green' },
          { text: `Subject categories: ${parsed.subjectTypes.map(s => s.label).join(', ')}`, zone: 'green' },
          { text: `Domain keywords: ${parsed.domainKeywords.slice(0, 5).join(', ')}...`, zone: 'green' },
        ],
        pendingDomainConfig: parsed,
        zone: 'yellow',
        status: 'draft',
      }

      setBriefings(prev => [newBriefing, ...prev])

      addTelemetry({
        intent: 'configure_domain',
        tier: 2,
        zone: 'yellow',
        confidence: 0.85,
        cost: 0.01,
        mode: 'interactive',
        latencyMs,
        humanFeedback: null,
        skillMatch: null,
        message: `Domain configured: ${parsed.domain.name} — awaiting approval #${templateHash}`,
      })

    } catch (error) {
      await pipelinePromise
      const latencyMs = Date.now() - startTime
      const message = error instanceof Error ? error.message : String(error)

      addTelemetry({
        intent: 'configure_domain',
        tier: 2,
        zone: 'red',
        confidence: 0,
        cost: 0,
        mode: 'interactive',
        latencyMs,
        humanFeedback: null,
        skillMatch: null,
        message: `Domain configuration failed: ${message}`,
      })
    }

    setIsProcessing(false)
  }

  // Handle domain config approval
  const handleApproveDomainConfig = (briefingId: string) => {
    const briefing = briefings.find(b => b.id === briefingId)
    if (!briefing?.pendingDomainConfig) return

    const config = briefing.pendingDomainConfig

    // Save domain config
    setDomainConfig(config)
    setDomainSetupPhase(null)
    setPendingIndustry(null)

    // Remove from briefings or mark as approved
    setBriefings(prev => prev.filter(b => b.id !== briefingId))

    addTelemetry({
      intent: 'approve_domain_config',
      tier: 0,
      zone: 'green',
      confidence: 1,
      cost: 0,
      mode: 'interactive',
      latencyMs: 0,
      humanFeedback: 'approved',
      skillMatch: null,
      message: `Domain configuration approved: ${config.domain.name} [${config.hash}]`,
    })
  }

  // Handle domain config rejection
  const handleRejectDomainConfig = (briefingId: string) => {
    const briefing = briefings.find(b => b.id === briefingId)
    if (!briefing?.pendingDomainConfig) return

    // Remove briefing, reset to industry phase
    setBriefings(prev => prev.filter(b => b.id !== briefingId))
    setDomainSetupPhase('industry')
    setPendingIndustry(null)

    addTelemetry({
      intent: 'reject_domain_config',
      tier: 0,
      zone: 'green',
      confidence: 1,
      cost: 0,
      mode: 'interactive',
      latencyMs: 0,
      humanFeedback: 'rejected',
      skillMatch: null,
      message: 'Domain configuration rejected — restart setup',
    })
  }

  // Training phases
  const needsSubjectTraining = domainConfig && !trainingComplete && subjects.length < 10

  // Training mode: persists until user types "done"
  const isTrainingMode = needsSubjectTraining

  // Handle training completion
  const handleCompleteTraining = () => {
    setTrainingComplete(true)
    localStorage.setItem(TRAINING_COMPLETE_KEY, 'true')
    addTelemetry({
      intent: 'complete_training',
      tier: 0,
      zone: 'green',
      confidence: 1,
      cost: 0,
      mode: 'interactive',
      latencyMs: 0,
      humanFeedback: null,
      skillMatch: null,
      message: `Training complete. Watchlist has ${subjects.length} subjects.`,
    })
  }

  // Handle briefing drill-down
  const handleDrillDown = (briefing: Briefing) => {
    setSelectedBriefing(briefing)
    setSelectedSubject(null)
    setIsSignalPanelOpen(true)
  }

  // Handle subject selection from watchlist
  const handleSubjectSelect = (subject: WatchlistSubject) => {
    setSelectedSubject(subject)
    setSelectedBriefing(null)
    setIsSignalPanelOpen(true)

    addTelemetry({
      intent: 'view_subject',
      tier: 0,
      zone: 'green',
      confidence: 1,
      cost: 0,
      mode: 'interactive',
      latencyMs: 0,
      humanFeedback: null,
      skillMatch: null,
      message: `Viewing signals for: ${subject.name}`,
    })
  }

  // Handle approval
  const handleApprove = (adjustmentId: string) => {
    // Find the adjustment across all briefings
    let adjustment: any = null
    let briefingId: string | null = null

    for (const b of briefings) {
      const adj = b.pendingAdjustments?.find(a => a.id === adjustmentId)
      if (adj) {
        adjustment = adj
        briefingId = b.id
        break
      }
    }

    if (!adjustment || !briefingId) return

    // Get subject type for flywheel pattern
    const subject = subjects.find(s => s.id === adjustment.subjectId)
    const subjectType = subject?.type || 'competitor'

    // Update briefing - remove the adjustment
    setBriefings(prev => prev.map(b => {
      if (b.id !== briefingId) return b
      const newAdjustments = b.pendingAdjustments?.filter(a => a.id !== adjustmentId) || []
      // If no more pending adjustments in a yellow briefing, it becomes green
      const newZone = newAdjustments.length === 0 && b.zone === 'yellow' ? 'green' : b.zone
      return {
        ...b,
        pendingAdjustments: newAdjustments,
        zone: newZone,
      }
    }))

    // Update watchlist subject score
    setSubjects(prev => prev.map(s => {
      if (s.id !== adjustment.subjectId) return s
      const newEntry: ScoreHistoryEntry = {
        timestamp: new Date().toISOString(),
        score: adjustment.proposedScore,
        delta: adjustment.delta,
        reason: `Approved: ${adjustment.reason}`,
        signalId: adjustment.signalIds?.[0] || null,
        approvedBy: 'human',
      }
      return {
        ...s,
        baselineScore: adjustment.proposedScore,
        history: [...s.history, newEntry],
      }
    }))

    // =========================================================================
    // FLYWHEEL: Track pattern for skill learning (3 approvals → auto-approve)
    // =========================================================================
    const patternKey = getAdjustmentPatternKey(subjectType, adjustment.delta)

    if (patternKey) {
      // Increment pattern count
      dispatch({ type: 'INCREMENT_PATTERN', intent: patternKey })

      // Check if we should propose a skill (threshold from routingConfig)
      const newCount = (appState.patternCounts[patternKey] || 0) + 1
      if (shouldProposeSkill(patternKey, { ...appState.patternCounts, [patternKey]: newCount }, appState.skills, appState.routingConfig)) {
        dispatch({
          type: 'PROPOSE_SKILL',
          intent: patternKey,
          pattern: generatePatternDescription(patternKey),
          count: newCount,
        })
      }
    }

    // Log to telemetry
    addTelemetry({
      intent: patternKey || 'approve_adjustment',
      tier: 0,
      zone: 'green',
      confidence: 1,
      cost: 0,
      mode: 'interactive',
      latencyMs: 0,
      humanFeedback: 'approved',
      skillMatch: null,
      message: `Approved: ${adjustment.subjectName} score ${(adjustment.currentScore * 100).toFixed(0)} → ${(adjustment.proposedScore * 100).toFixed(0)}`,
    })
  }

  // Handle rejection
  const handleReject = (adjustmentId: string) => {
    // Find the adjustment
    let adjustment: any = null
    let briefingId: string | null = null

    for (const b of briefings) {
      const adj = b.pendingAdjustments?.find(a => a.id === adjustmentId)
      if (adj) {
        adjustment = adj
        briefingId = b.id
        break
      }
    }

    if (!adjustment || !briefingId) return

    // Update briefing - remove the adjustment
    setBriefings(prev => prev.map(b => {
      if (b.id !== briefingId) return b
      const newAdjustments = b.pendingAdjustments?.filter(a => a.id !== adjustmentId) || []
      const newZone = newAdjustments.length === 0 && b.zone === 'yellow' ? 'green' : b.zone
      return {
        ...b,
        pendingAdjustments: newAdjustments,
        zone: newZone,
      }
    }))

    // Log to telemetry
    addTelemetry({
      intent: 'reject_adjustment',
      tier: 0,
      zone: 'green',
      confidence: 1,
      cost: 0,
      mode: 'interactive',
      latencyMs: 0,
      humanFeedback: 'rejected',
      skillMatch: null,
      message: `Rejected: ${adjustment.subjectName} adjustment — human override`,
    })
  }

  // Handle subject approval (add to watchlist)
  const handleApproveSubject = (briefingId: string) => {
    const briefing = briefings.find(b => b.id === briefingId)
    if (!briefing?.pendingSubject) return

    const proposed = briefing.pendingSubject

    // Create new watchlist subject from proposal
    const newSubject: WatchlistSubject = {
      id: proposed.id,
      name: proposed.name,
      type: proposed.type,
      tier: proposed.tier,
      baselineScore: proposed.initialScore,
      keywords: proposed.keywords,
      aliases: proposed.aliases,
      sources: [],
      lastUpdated: new Date().toISOString(),
      history: [{
        timestamp: new Date().toISOString(),
        score: proposed.initialScore,
        delta: 0,
        reason: 'Initial assessment',
        signalId: null,
        approvedBy: 'human',
      }],
    }

    // Add to watchlist
    setSubjects(prev => [...prev, newSubject])

    // Update briefing - mark as complete
    setBriefings(prev => prev.map(b => {
      if (b.id !== briefingId) return b
      return {
        ...b,
        pendingSubject: undefined,
        zone: 'green' as const,
      }
    }))

    // Log to telemetry
    addTelemetry({
      intent: 'approve_subject',
      tier: 0,
      zone: 'green',
      confidence: 1,
      cost: 0,
      mode: 'interactive',
      latencyMs: 0,
      humanFeedback: 'approved',
      skillMatch: null,
      message: `Added to watchlist: ${proposed.name} (${proposed.type}, ${proposed.tier})`,
    })
  }

  // Handle subject rejection
  const handleRejectSubject = (briefingId: string) => {
    const briefing = briefings.find(b => b.id === briefingId)
    if (!briefing?.pendingSubject) return

    const proposed = briefing.pendingSubject

    // Update briefing - remove pending subject
    setBriefings(prev => prev.map(b => {
      if (b.id !== briefingId) return b
      return {
        ...b,
        pendingSubject: undefined,
        zone: 'green' as const,
      }
    }))

    // Log to telemetry
    addTelemetry({
      intent: 'reject_subject',
      tier: 0,
      zone: 'green',
      confidence: 1,
      cost: 0,
      mode: 'interactive',
      latencyMs: 0,
      humanFeedback: 'rejected',
      skillMatch: null,
      message: `Rejected subject: ${proposed.name} — human override`,
    })
  }

  return (
    <div className="h-screen bg-grove-bg text-grove-text flex flex-col overflow-hidden">
      <Header />
      <PipelineVisualization />

      {/* Main Content: 2/3 briefing, 1/3 watchlist */}
      <main className="flex-1 flex min-h-0 overflow-hidden">
        {/* LEFT: Signal Feed (collapsible drill-down) */}
        <div
          className={`border-r border-grove-border transition-all duration-300 flex-shrink-0 ${
            isSignalPanelOpen ? 'w-72' : 'w-0'
          } overflow-hidden`}
        >
          <div className="w-72 h-full flex flex-col">
            <div className="flex items-center justify-between p-3 border-b border-grove-border bg-grove-bg2">
              <span className="text-sm font-mono text-grove-text-dim truncate">
                {selectedSubject
                  ? selectedSubject.name
                  : selectedBriefing
                    ? selectedBriefing.title
                    : 'Signal Feed'}
              </span>
              <button
                onClick={() => {
                  setIsSignalPanelOpen(false)
                  setSelectedSubject(null)
                  setSelectedBriefing(null)
                }}
                className="text-grove-text-dim hover:text-grove-text ml-2"
              >
                ×
              </button>
            </div>
            <div className="flex-1 overflow-hidden">
              {selectedSubject ? (
                <SubjectDetailPane subject={selectedSubject} />
              ) : selectedBriefing ? (
                <BriefingDetailPane briefing={selectedBriefing} />
              ) : (
                <SignalFeed />
              )}
            </div>
          </div>
        </div>

        {/* CENTER: Briefing Inbox (2/3 of remaining space) */}
        <div className="flex-[2] min-w-0 border-r border-grove-border">
          <BriefingInbox
            briefings={briefings}
            onApprove={handleApprove}
            onReject={handleReject}
            onApproveSubject={handleApproveSubject}
            onRejectSubject={handleRejectSubject}
            onApproveDomainConfig={handleApproveDomainConfig}
            onRejectDomainConfig={handleRejectDomainConfig}
            onDrillDown={handleDrillDown}
          />
        </div>

        {/* RIGHT: Watchlist Scorecard (1/3 of remaining space) */}
        <div className="flex-1 min-w-0">
          <WatchlistDashboard
            subjects={subjects}
            onSubjectSelect={handleSubjectSelect}
          />
        </div>
      </main>

      {/* Command Bar - styled prominently above telemetry */}
      <CommandBar
        onSubmit={(input) => {
          // Phase 1: Domain setup
          if (domainSetupPhase === 'industry') {
            setPendingIndustry(input)
            setDomainSetupPhase('tracking')
          } else if (domainSetupPhase === 'tracking' && pendingIndustry) {
            handleConfigureDomain(pendingIndustry, input)
            // Phase will reset after approval
          }
          // Phase 2: Subject training
          else if (isTrainingMode && input.toLowerCase().trim() === 'done') {
            if (subjects.length === 0) {
              // Can't complete with empty watchlist
              return
            }
            handleCompleteTraining()
          } else if (isTrainingMode) {
            handleAddSubject(input)
          }
          // Phase 3: Operational
          else {
            handleScan(input)
          }
        }}
        isProcessing={isProcessing}
        placeholder={
          domainSetupPhase === 'industry'
            ? 'What industry or domain are you monitoring? (e.g., AI/ML, Healthcare, Fintech)'
            : domainSetupPhase === 'tracking'
            ? `Tracking ${pendingIndustry}. What signals matter? (e.g., funding, launches, pricing, partnerships...)`
            : isTrainingMode
            ? subjects.length === 0
              ? `${domainConfig?.domain.name || 'Domain'}: Add your first competitor`
              : `Added ${subjects.length} subject${subjects.length > 1 ? 's' : ''}. Add more, or type "done" to start monitoring`
            : 'Brief me on... (e.g., "Anthropic this week", "OpenAI pricing changes")'
        }
      />

      <TelemetryStream />

      {/* Footer */}
      <footer className="border-t border-grove-border px-6 py-2 text-center text-xs text-grove-text-dim font-mono">
        Signal Watch • Built on{' '}
        <a
          href="https://the-grove.ai"
          target="_blank"
          rel="noopener noreferrer"
          className="hover:text-grove-text transition-colors"
        >
          Grove Autonomaton Pattern
        </a>
        {' '}• v{APP_VERSION}{' '}
        <span className="text-grove-text-dim">#{__COMMIT_HASH__}</span>
      </footer>
    </div>
  )
}

function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms))
}

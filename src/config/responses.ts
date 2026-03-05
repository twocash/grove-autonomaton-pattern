/**
 * Simulated Responses — Demo Mode
 *
 * Canned responses for each intent type.
 * These make demo mode feel real without requiring API calls.
 *
 * In Interactive mode, these are replaced by actual LLM responses.
 */

const RESPONSES: Record<string, (input: string) => string> = {
  capture_idea: (input: string) => {
    const topic = extractTopic(input)
    return `Got it! I've captured your idea about "${topic}".

Added to your notes with timestamp. You can find it in your recent captures.

Want me to expand on this thought later?`
  },

  summarize_notes: () => {
    return `Here's a summary of your recent notes:

**Key Themes:**
• Project planning and architecture decisions
• API integration patterns
• Performance optimization ideas

**Action Items:**
1. Review the caching strategy
2. Document the routing logic
3. Set up monitoring

**Insights:**
Your notes show a focus on system reliability and maintainability. Consider scheduling a review session to prioritize these items.`
  },

  research_topic: (input: string) => {
    const topic = extractTopic(input)
    return `**Research: ${topic}**

**Overview:**
Based on current best practices and recent developments...

**Key Findings:**
1. Modern approaches favor declarative over imperative patterns
2. Separation of concerns improves maintainability
3. Observability is increasingly important

**Recommendations:**
• Start with a minimal implementation
• Iterate based on actual usage patterns
• Build in telemetry from day one

**Sources to explore:**
• Technical documentation
• Community case studies
• Reference implementations`
  },

  draft_email: (input: string) => {
    const context = extractTopic(input)
    return `**Draft Email**

---
**Subject:** Follow-up: ${context}

Hi team,

I wanted to follow up on our recent discussion about ${context}.

Here are the key points:
• [Point 1]
• [Point 2]
• [Point 3]

Let me know if you have any questions or if you'd like to discuss further.

Best regards

---

*This is a draft. Review and customize before sending.*`
  },

  propose_skill: (input: string) => {
    const topic = extractTopic(input)
    return `**Skill Proposal: Auto-${topic}**

I've noticed a pattern in your requests. Here's what I can automate:

**Trigger:** When you mention "${topic}"
**Action:** Automatically [describe action]
**Zone:** Would recommend GREEN (autonomous)

**Benefits:**
• Saves ~2 minutes per occurrence
• Reduces cognitive load
• Consistent execution

Shall I create this skill?`
  },

  analyze_data: (input: string) => {
    const topic = extractTopic(input)
    return `**Analysis: ${topic}**

**Summary Statistics:**
• Total records: 1,247
• Date range: Last 30 days
• Key metric trend: +12.3%

**Insights:**
1. Notable spike on day 15 correlates with product launch
2. Weekday performance 23% higher than weekends
3. Top segment contributes 67% of total

**Recommendations:**
• Focus resources on high-performing segments
• Investigate the day-15 spike for replication
• Consider weekend-specific strategies

*Data analysis complete. Would you like me to drill down on any area?*`
  },

  deploy_change: (input: string) => {
    const topic = extractTopic(input)
    return `[DEPLOY] **Deployment Request: ${topic}**

This action is in the **RED ZONE** — human-only.

**What I can tell you:**
• Current system status: Healthy
• Last deployment: 3 days ago
• Pending changes: 2 PRs merged

**What you need to do:**
1. Review the changes manually
2. Run the deployment checklist
3. Execute the deployment yourself

*I've surfaced the relevant information. The decision and execution are yours.*`
  },

  delete_data: (input: string) => {
    const topic = extractTopic(input)
    return `🛑 **Destructive Operation: ${topic}**

This action is in the **RED ZONE** — human-only.

**I will not execute this action.**

**What I can tell you:**
• Affected records: Unknown without explicit query
• Recovery options: Depends on backup status
• Impact assessment: Potentially severe

**If you need to proceed:**
1. Verify backup status
2. Document the reason
3. Execute manually with appropriate access

*This is a guardrail, not a limitation. Destructive actions require human judgment.*`
  },

  ad_hoc_query: (input: string) => {
    return `I understood your request: "${input}"

This is a custom query that doesn't match a specific intent in my routing configuration.

**What happens now:**
• Routed to Tier 2 for general handling
• Yellow zone: supervised execution
• Flywheel-eligible: may become a skill if pattern recurs

**Options:**
1. Proceed with this ad-hoc request
2. Check the routing.config to add as a formal intent
3. If this recurs, I'll propose creating a skill

*Tip: Common intents include capturing ideas, summarizing notes, drafting emails, and research.*`
  },
}

/**
 * Get a simulated response for an intent
 */
export function getSimulatedResponse(intent: string, input: string): string {
  const responder = RESPONSES[intent] || RESPONSES.ad_hoc_query
  return responder(input)
}

/**
 * Extract the main topic from user input
 */
function extractTopic(input: string): string {
  // Remove common prefixes
  const cleaned = input
    .replace(/^(please |can you |i want to |help me )/i, '')
    .replace(/^(capture |draft |research |analyze |summarize |delete |deploy )/i, '')
    .trim()

  // Take first meaningful chunk
  const words = cleaned.split(' ').slice(0, 5)
  return words.join(' ') || 'your request'
}

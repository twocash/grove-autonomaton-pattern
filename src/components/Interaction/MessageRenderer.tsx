/**
 * MessageRenderer — Markdown rendering for LLM responses
 *
 * Uses react-markdown with GFM support for tables, code blocks, etc.
 * Styled with Tailwind Typography in dark/hacker-chic aesthetic.
 */

import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'

interface MessageRendererProps {
  content: string
}

export function MessageRenderer({ content }: MessageRendererProps) {
  return (
    <div className="prose prose-invert prose-sm max-w-none
                    prose-pre:bg-grove-bg2 prose-pre:border prose-pre:border-grove-border
                    prose-code:text-grove-amber prose-code:bg-grove-bg2 prose-code:px-1
                    prose-a:text-grove-amber prose-a:no-underline hover:prose-a:underline
                    prose-headings:text-grove-text prose-headings:font-mono
                    prose-strong:text-grove-text">
      <ReactMarkdown remarkPlugins={[remarkGfm]}>
        {content}
      </ReactMarkdown>
    </div>
  )
}

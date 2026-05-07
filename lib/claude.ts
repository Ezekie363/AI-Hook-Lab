import Anthropic from '@anthropic-ai/sdk'
import type { Hook } from '@/types'

const MODEL = 'claude-sonnet-4-6'

type RawHook = {
  style: string
  content: string
  score: number
  reason: string
}

export function parseHooks(text: string): Omit<Hook, 'isFavorite'>[] {
  const cleaned = text
    .replace(/^```json\s*/i, '')
    .replace(/^```\s*/i, '')
    .replace(/\s*```$/i, '')
    .trim()

  const raw = JSON.parse(cleaned) as RawHook[]
  return raw.map((h) => ({
    id: crypto.randomUUID(),
    style: String(h.style),
    content: String(h.content),
    score: Math.min(10, Math.max(1, Number(h.score))),
    reason: String(h.reason),
  }))
}

export async function generateHooks(
  systemPrompt: string,
  userPrompt: string
): Promise<Omit<Hook, 'isFavorite'>[]> {
  const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

  const message = await client.messages.create({
    model: MODEL,
    max_tokens: 4096,
    system: systemPrompt,
    messages: [{ role: 'user', content: userPrompt }],
  })

  const block = message.content[0]
  const text = block.type === 'text' ? block.text : ''
  return parseHooks(text)
}

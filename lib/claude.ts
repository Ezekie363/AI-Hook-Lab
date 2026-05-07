import type { Hook } from '@/types'

const DEEPSEEK_API_URL = 'https://api.deepseek.com/chat/completions'
const MODEL = 'deepseek-chat'

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
  const res = await fetch(DEEPSEEK_API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${process.env.DEEPSEEK_API_KEY}`,
    },
    body: JSON.stringify({
      model: MODEL,
      max_tokens: 4096,
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt },
      ],
    }),
  })

  if (!res.ok) {
    const err = await res.text()
    throw new Error(`DeepSeek API error ${res.status}: ${err}`)
  }

  const data = await res.json()
  const text: string = data.choices?.[0]?.message?.content ?? ''
  return parseHooks(text)
}

import { NextRequest, NextResponse } from 'next/server'
import { buildSystemPrompt, buildUserPrompt } from '@/lib/prompt'
import { generateHooks } from '@/lib/claude'
import type { Platform, ContentType, Hook } from '@/types'

const VALID_PLATFORMS = new Set(['小红书', '抖音', 'B站', 'YouTube', 'X'])
const VALID_TYPES = new Set(['视频', '图文', '产品广告', '教程', '观点贴'])

export async function POST(req: NextRequest) {
  if (!process.env.ANTHROPIC_API_KEY) {
    return NextResponse.json(
      { error: '未配置 ANTHROPIC_API_KEY，请在 .env.local 中设置', code: 'NO_API_KEY' },
      { status: 500 }
    )
  }

  let topic: string, platform: Platform, contentType: ContentType
  try {
    const body = await req.json()
    topic = String(body.topic ?? '').slice(0, 100).trim()
    platform = body.platform as Platform
    contentType = body.contentType as ContentType

    if (!topic) throw new Error('topic is empty')
    if (!VALID_PLATFORMS.has(platform)) throw new Error('invalid platform')
    if (!VALID_TYPES.has(contentType)) throw new Error('invalid contentType')
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'invalid input'
    return NextResponse.json({ error: `参数错误: ${msg}`, code: 'INVALID_INPUT' }, { status: 400 })
  }

  try {
    const systemPrompt = buildSystemPrompt(platform)
    const userPrompt = buildUserPrompt(topic, platform, contentType)
    const rawHooks = await generateHooks(systemPrompt, userPrompt)
    const hooks: Hook[] = rawHooks.map((h) => ({ ...h, isFavorite: false }))
    return NextResponse.json({ hooks })
  } catch (err) {
    const message = err instanceof Error ? err.message : ''
    if (message.toLowerCase().includes('json') || message.toLowerCase().includes('parse')) {
      return NextResponse.json(
        { error: '生成结果格式错误，请重试', code: 'PARSE_ERROR' },
        { status: 500 }
      )
    }
    return NextResponse.json(
      { error: 'AI 生成失败，请重试', code: 'CLAUDE_ERROR' },
      { status: 500 }
    )
  }
}

import { describe, it, expect } from 'vitest'
import { buildSystemPrompt, buildUserPrompt } from '@/lib/prompt'

describe('buildSystemPrompt', () => {
  it('includes platform-specific guidance for 小红书', () => {
    const prompt = buildSystemPrompt('小红书')
    expect(prompt).toContain('小红书')
    expect(prompt).toContain('emoji')
  })

  it('includes platform-specific guidance for 抖音', () => {
    const prompt = buildSystemPrompt('抖音')
    expect(prompt).toContain('抖音')
    expect(prompt).toContain('节奏')
  })

  it('always requires JSON output', () => {
    const prompt = buildSystemPrompt('B站')
    expect(prompt).toContain('JSON')
    expect(prompt).toContain('style')
    expect(prompt).toContain('content')
    expect(prompt).toContain('score')
    expect(prompt).toContain('reason')
  })
})

describe('buildUserPrompt', () => {
  it('includes topic, platform and contentType', () => {
    const prompt = buildUserPrompt('AI副业', '小红书', '视频')
    expect(prompt).toContain('AI副业')
    expect(prompt).toContain('小红书')
    expect(prompt).toContain('视频')
  })

  it('requests 8 preset styles', () => {
    const prompt = buildUserPrompt('健身', '抖音', '教程')
    expect(prompt).toContain('悬念式')
    expect(prompt).toContain('痛点直击式')
  })
})

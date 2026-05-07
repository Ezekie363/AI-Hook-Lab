import { describe, it, expect } from 'vitest'
import { parseHooks } from '@/lib/claude'

describe('parseHooks', () => {
  it('parses a valid JSON array', () => {
    const input = JSON.stringify([
      { style: '悬念式', content: '你真的了解自己吗？', score: 9, reason: '制造悬念' },
      { style: '数据式', content: '90%的人不知道', score: 8, reason: '数字冲击' },
    ])
    const result = parseHooks(input)
    expect(result).toHaveLength(2)
    expect(result[0].style).toBe('悬念式')
    expect(result[0].content).toBe('你真的了解自己吗？')
    expect(result[0].score).toBe(9)
    expect(result[0].reason).toBe('制造悬念')
    expect(result[0].id).toMatch(/^[0-9a-f-]{36}$/)
  })

  it('strips markdown code fences if present', () => {
    const input = '```json\n[{"style":"悬念式","content":"test","score":8,"reason":"r"}]\n```'
    const result = parseHooks(input)
    expect(result).toHaveLength(1)
    expect(result[0].content).toBe('test')
  })

  it('clamps score above 10 to 10', () => {
    const input = JSON.stringify([{ style: 'x', content: 'y', score: 15, reason: 'z' }])
    expect(parseHooks(input)[0].score).toBe(10)
  })

  it('clamps score below 1 to 1', () => {
    const input = JSON.stringify([{ style: 'x', content: 'y', score: -3, reason: 'z' }])
    expect(parseHooks(input)[0].score).toBe(1)
  })

  it('throws on invalid JSON', () => {
    expect(() => parseHooks('not json')).toThrow()
  })
})

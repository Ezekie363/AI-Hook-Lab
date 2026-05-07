import { describe, it, expect, beforeEach } from 'vitest'
import {
  getHistory,
  addToHistory,
  deleteFromHistory,
  getFavorites,
  addFavorite,
  removeFavorite,
  isFavorited,
} from '@/lib/storage'
import type { HistoryEntry, Hook } from '@/types'

function makeHook(overrides: Partial<Hook> = {}): Hook {
  return {
    id: 'hook-1',
    content: '测试内容',
    style: '悬念式',
    score: 8,
    reason: '测试原因',
    isFavorite: false,
    ...overrides,
  }
}

function makeEntry(overrides: Partial<HistoryEntry> = {}): HistoryEntry {
  return {
    id: 'entry-1',
    topic: '测试主题',
    platform: '小红书',
    contentType: '视频',
    hooks: [makeHook()],
    createdAt: new Date().toISOString(),
    ...overrides,
  }
}

beforeEach(() => {
  localStorage.clear()
})

describe('history', () => {
  it('returns empty array when no history', () => {
    expect(getHistory()).toEqual([])
  })

  it('adds an entry and retrieves it', () => {
    const entry = makeEntry()
    addToHistory(entry)
    const history = getHistory()
    expect(history).toHaveLength(1)
    expect(history[0].id).toBe('entry-1')
  })

  it('newest entry appears first', () => {
    addToHistory(makeEntry({ id: 'old', createdAt: '2024-01-01T00:00:00.000Z' }))
    addToHistory(makeEntry({ id: 'new', createdAt: '2024-06-01T00:00:00.000Z' }))
    expect(getHistory()[0].id).toBe('new')
  })

  it('prunes to 20 entries when exceeded', () => {
    for (let i = 0; i < 25; i++) {
      addToHistory(makeEntry({ id: `entry-${i}` }))
    }
    expect(getHistory()).toHaveLength(20)
  })

  it('deletes an entry by id', () => {
    addToHistory(makeEntry({ id: 'to-delete' }))
    addToHistory(makeEntry({ id: 'to-keep' }))
    deleteFromHistory('to-delete')
    const history = getHistory()
    expect(history).toHaveLength(1)
    expect(history[0].id).toBe('to-keep')
  })
})

describe('favorites', () => {
  it('returns empty array when no favorites', () => {
    expect(getFavorites()).toEqual([])
  })

  it('adds a hook to favorites', () => {
    addFavorite(makeHook({ id: 'fav-1' }))
    expect(getFavorites()).toHaveLength(1)
    expect(getFavorites()[0].id).toBe('fav-1')
  })

  it('does not add duplicate', () => {
    addFavorite(makeHook({ id: 'fav-1' }))
    addFavorite(makeHook({ id: 'fav-1' }))
    expect(getFavorites()).toHaveLength(1)
  })

  it('removes a hook from favorites', () => {
    addFavorite(makeHook({ id: 'fav-1' }))
    removeFavorite('fav-1')
    expect(getFavorites()).toHaveLength(0)
  })

  it('isFavorited returns true for saved hook', () => {
    addFavorite(makeHook({ id: 'fav-1' }))
    expect(isFavorited('fav-1')).toBe(true)
    expect(isFavorited('fav-2')).toBe(false)
  })
})

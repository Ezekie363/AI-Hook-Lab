'use client'

import { useState, useEffect } from 'react'
import InputPanel from '@/components/InputPanel'
import ResultsGrid from '@/components/ResultsGrid'
import HistoryDrawer from '@/components/HistoryDrawer'
import FavoritesDrawer from '@/components/FavoritesDrawer'
import ErrorBanner from '@/components/ErrorBanner'
import {
  getHistory,
  addToHistory,
  deleteFromHistory,
  getFavorites,
  addFavorite,
  removeFavorite,
} from '@/lib/storage'
import type { Hook, HistoryEntry, Platform, ContentType } from '@/types'

type ActiveDrawer = 'history' | 'favorites' | null
type AppError = { message: string; code: string } | null

export default function HomePage() {
  const [topic, setTopic] = useState('')
  const [platform, setPlatform] = useState<Platform>('小红书')
  const [contentType, setContentType] = useState<ContentType>('视频')
  const [hooks, setHooks] = useState<Hook[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<AppError>(null)
  const [history, setHistory] = useState<HistoryEntry[]>([])
  const [favorites, setFavorites] = useState<Hook[]>([])
  const [activeDrawer, setActiveDrawer] = useState<ActiveDrawer>(null)

  // Load persisted data on mount (client only)
  useEffect(() => {
    setHistory(getHistory())
    setFavorites(getFavorites())
  }, [])

  async function handleGenerate() {
    if (!topic.trim() || loading) return
    setLoading(true)
    setError(null)
    setHooks([])

    try {
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ topic: topic.trim(), platform, contentType }),
      })

      const data = await res.json()

      if (!res.ok) {
        setError({ message: data.error ?? '未知错误', code: data.code ?? 'UNKNOWN' })
        return
      }

      const newHooks: Hook[] = data.hooks

      // Sync isFavorite with current favorites
      const favIds = new Set(getFavorites().map((h) => h.id))
      const syncedHooks = newHooks.map((h) => ({ ...h, isFavorite: favIds.has(h.id) }))
      setHooks(syncedHooks)

      // Save to history
      const entry: HistoryEntry = {
        id: crypto.randomUUID(),
        topic: topic.trim(),
        platform,
        contentType,
        hooks: syncedHooks,
        createdAt: new Date().toISOString(),
      }
      addToHistory(entry)
      setHistory(getHistory())
    } catch {
      setError({ message: '网络错误，请检查连接后重试', code: 'NETWORK_ERROR' })
    } finally {
      setLoading(false)
    }
  }

  function handleToggleFavorite(hook: Hook) {
    if (hook.isFavorite) {
      removeFavorite(hook.id)
    } else {
      addFavorite(hook)
    }
    const updatedFavorites = getFavorites()
    setFavorites(updatedFavorites)
    const favIds = new Set(updatedFavorites.map((h) => h.id))
    setHooks((prev) => prev.map((h) => ({ ...h, isFavorite: favIds.has(h.id) })))
  }

  function handleDeleteHistory(id: string) {
    deleteFromHistory(id)
    setHistory(getHistory())
  }

  function handleRestoreHistory(entry: HistoryEntry) {
    setTopic(entry.topic)
    setPlatform(entry.platform)
    setContentType(entry.contentType)
    const favIds = new Set(getFavorites().map((h) => h.id))
    setHooks(entry.hooks.map((h) => ({ ...h, isFavorite: favIds.has(h.id) })))
    setError(null)
  }

  function handleRemoveFavorite(hookId: string) {
    removeFavorite(hookId)
    setFavorites(getFavorites())
    setHooks((prev) =>
      prev.map((h) => (h.id === hookId ? { ...h, isFavorite: false } : h))
    )
  }

  return (
    <div className="flex min-h-screen flex-col">
      {/* Navbar */}
      <header className="sticky top-0 z-30 border-b border-dark-border bg-dark-base/80 backdrop-blur">
        <div className="mx-auto flex max-w-3xl items-center justify-between px-4 py-3">
          <span className="bg-gradient-to-r from-indigo-400 to-violet-400 bg-clip-text text-lg font-bold tracking-tight text-transparent">
            ⚡ AI HOOK LAB
          </span>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setActiveDrawer(activeDrawer === 'favorites' ? null : 'favorites')}
              className="rounded-lg border border-dark-border px-3 py-1.5 text-xs text-slate-400 transition hover:border-violet-500/40 hover:text-violet-400"
            >
              收藏
              {favorites.length > 0 && (
                <span className="ml-1 text-violet-400">{favorites.length}</span>
              )}
            </button>
            <button
              type="button"
              onClick={() => setActiveDrawer(activeDrawer === 'history' ? null : 'history')}
              className="rounded-lg border border-dark-border px-3 py-1.5 text-xs text-slate-400 transition hover:border-violet-500/40 hover:text-violet-400"
            >
              历史记录
            </button>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="mx-auto w-full max-w-3xl flex-1 px-4 py-8">
        {/* Tagline */}
        <div className="mb-8 text-center">
          <h1 className="mb-2 text-2xl font-bold text-slate-100 sm:text-3xl">
            一键生成 10 个爆款开头
          </h1>
          <p className="text-sm text-slate-500">
            覆盖 8 种经典风格 + 2 个 AI 自由发挥，找到最适合你的 Hook
          </p>
        </div>

        {/* Input */}
        <div className="mb-8 rounded-2xl border border-dark-border bg-dark-card p-5 sm:p-6">
          <InputPanel
            topic={topic}
            platform={platform}
            contentType={contentType}
            loading={loading}
            onTopicChange={setTopic}
            onPlatformChange={setPlatform}
            onContentTypeChange={setContentType}
            onGenerate={handleGenerate}
          />
        </div>

        {/* Error */}
        {error && (
          <div className="mb-6">
            <ErrorBanner code={error.code} message={error.message} />
          </div>
        )}

        {/* Results */}
        <ResultsGrid
          hooks={hooks}
          loading={loading}
          onToggleFavorite={handleToggleFavorite}
        />
      </main>

      {/* Drawers */}
      <HistoryDrawer
        open={activeDrawer === 'history'}
        history={history}
        onClose={() => setActiveDrawer(null)}
        onDelete={handleDeleteHistory}
        onRestore={handleRestoreHistory}
      />
      <FavoritesDrawer
        open={activeDrawer === 'favorites'}
        favorites={favorites}
        onClose={() => setActiveDrawer(null)}
        onRemoveFavorite={handleRemoveFavorite}
      />
    </div>
  )
}

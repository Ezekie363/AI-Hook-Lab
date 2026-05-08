'use client'

import { useState, useEffect, useCallback } from 'react'
import ThemeToggle from '@/components/ThemeToggle'
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
  const [toast, setToast] = useState(false)

  useEffect(() => {
    setHistory(getHistory())
    setFavorites(getFavorites())
  }, [])

  const handleGenerate = useCallback(async () => {
    if (!topic.trim() || loading) return
    setLoading(true)
    setError(null)
    setHooks([])
    setToast(false)

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
      const favIds = new Set(getFavorites().map((h) => h.id))
      const syncedHooks = newHooks.map((h) => ({ ...h, isFavorite: favIds.has(h.id) }))
      setHooks(syncedHooks)

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

      // Show completion toast
      setToast(true)
      setTimeout(() => setToast(false), 2000)
    } catch {
      setError({ message: '网络错误，请检查连接后重试', code: 'NETWORK_ERROR' })
    } finally {
      setLoading(false)
    }
  }, [topic, platform, contentType, loading])

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

      {/* ── Navbar ── */}
      <header className="sticky top-0 z-30 border-b border-warm-200 bg-cream/90 backdrop-blur">
        <div className="mx-auto flex max-w-4xl items-center justify-between px-6 py-4">
          <span className="font-serif text-base font-light tracking-widest text-ink-2 uppercase">
            AI Hook Lab
          </span>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => setActiveDrawer(activeDrawer === 'favorites' ? null : 'favorites')}
                className="relative rounded-full px-3 py-1.5 text-xs font-medium tracking-wide text-ink-3 transition hover:text-ink"
              >
                收藏
                {favorites.length > 0 && (
                  <span className="ml-1 font-mono text-accent">{favorites.length}</span>
                )}
              </button>
              <div className="h-3 w-px bg-warm-300" />
              <button
                type="button"
                onClick={() => setActiveDrawer(activeDrawer === 'history' ? null : 'history')}
                className="rounded-full px-3 py-1.5 text-xs font-medium tracking-wide text-ink-3 transition hover:text-ink"
              >
                历史
              </button>
            </div>
            <ThemeToggle />
          </div>
        </div>
      </header>

      {/* ── Hero (compact) ── */}
      <section className="relative overflow-hidden border-b border-warm-200 px-6 py-10 text-center sm:py-14">
        <div className="hero-grain pointer-events-none absolute inset-0 opacity-[0.03]" />
        <p className="mb-4 text-[10px] font-medium uppercase tracking-[0.35em] text-ink-3">
          AI Copywriting · 爆款文案
        </p>
        <h1 className="hero-title font-serif font-light leading-[0.9] tracking-tight text-ink">
          Hook Lab
        </h1>
        <p className="mx-auto mt-6 max-w-sm text-sm leading-relaxed text-ink-3">
          输入主题，选择平台与内容类型，一次生成 10 个爆款开头
        </p>
      </section>

      {/* ── Main ── */}
      <main className="mx-auto w-full max-w-4xl flex-1 px-6 py-10">

        {/* Input card */}
        <div className="mb-10 rounded-2xl border border-warm-200 bg-surface p-6 shadow-[0_2px_16px_rgba(26,25,22,0.05)] sm:p-8">
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
          <div className="mb-8">
            <ErrorBanner code={error.code} message={error.message} />
          </div>
        )}

        {/* Results */}
        <ResultsGrid
          hooks={hooks}
          loading={loading}
          onToggleFavorite={handleToggleFavorite}
        />

        {/* Regenerate button — shown after results appear */}
        {hooks.length > 0 && !loading && (
          <div className="mt-10 text-center">
            <button
              type="button"
              onClick={handleGenerate}
              className="rounded-full border border-warm-200 px-6 py-2 text-xs tracking-wide text-ink-3 transition hover:border-warm-300 hover:text-ink"
            >
              重新生成
            </button>
          </div>
        )}
      </main>

      {/* ── Footer ── */}
      <footer className="border-t border-warm-200 px-6 py-6 text-center">
        <p className="text-[11px] tracking-wider text-ink-3 uppercase">AI Hook Lab</p>
      </footer>

      {/* ── Drawers ── */}
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

      {/* ── Toast ── */}
      <div
        className={`pointer-events-none fixed bottom-6 left-1/2 z-50 -translate-x-1/2 rounded-full border border-warm-200 bg-surface px-5 py-2 text-xs tracking-wide text-ink-2 shadow-sm transition-all duration-300 ${
          toast ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
        }`}
      >
        ✓ 生成完成
      </div>
    </div>
  )
}

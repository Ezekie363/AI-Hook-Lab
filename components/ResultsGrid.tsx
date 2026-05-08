'use client'

import { useEffect, useState, useCallback } from 'react'
import HookCard from './HookCard'
import type { Hook } from '@/types'

interface ResultsGridProps {
  hooks: Hook[]
  loading: boolean
  onToggleFavorite: (hook: Hook) => void
}

function SkeletonCard() {
  return (
    <div className="flex flex-col gap-4 rounded-xl border border-warm-200 bg-surface p-5 animate-pulse">
      <div className="flex items-center justify-between">
        <div className="h-5 w-14 rounded-full bg-warm-100" />
        <div className="h-4 w-6 rounded bg-warm-100" />
      </div>
      <div className="space-y-2">
        <div className="h-4 w-full rounded bg-warm-100" />
        <div className="h-4 w-5/6 rounded bg-warm-100" />
        <div className="h-4 w-4/6 rounded bg-warm-100" />
      </div>
      <div className="h-3 w-3/4 rounded bg-warm-100" />
      <div className="flex gap-3 border-t border-warm-100 pt-3">
        <div className="h-4 flex-1 rounded bg-warm-100" />
        <div className="h-4 w-4 rounded bg-warm-100" />
      </div>
    </div>
  )
}

export default function ResultsGrid({ hooks, loading, onToggleFavorite }: ResultsGridProps) {
  const [visibleCount, setVisibleCount] = useState(0)
  const [copiedAll, setCopiedAll] = useState(false)

  const handleCopyAll = useCallback(async () => {
    const text = hooks
      .map((h, i) => `${i + 1}. ${h.content}`)
      .join('\n')
    await navigator.clipboard.writeText(text)
    setCopiedAll(true)
    setTimeout(() => setCopiedAll(false), 1500)
  }, [hooks])

  useEffect(() => {
    if (hooks.length === 0) {
      setVisibleCount(0)
      return
    }
    setVisibleCount(0)
    const timers = hooks.map((_, i) =>
      setTimeout(() => setVisibleCount((prev) => Math.max(prev, i + 1)), i * 80)
    )
    return () => timers.forEach(clearTimeout)
  }, [hooks])

  if (loading) {
    return (
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {Array.from({ length: 10 }).map((_, i) => (
          <SkeletonCard key={i} />
        ))}
      </div>
    )
  }

  if (hooks.length === 0) return null

  return (
    <>
      <div className="mb-6 flex items-center gap-4">
        <div className="h-px flex-1 bg-warm-200" />
        <span className="text-[10px] uppercase tracking-[0.25em] text-ink-3">
          {hooks.length} 个 Hook
        </span>
        <div className="h-px flex-1 bg-warm-200" />
        <button
          type="button"
          onClick={handleCopyAll}
          className="shrink-0 text-[10px] tracking-wide text-ink-3 transition hover:text-ink"
        >
          {copiedAll ? '✓ 已复制' : '复制全部'}
        </button>
      </div>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {hooks.map((hook, i) => (
          <div
            key={hook.id}
            className={`transition-all duration-300 ${
              i < visibleCount ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-3'
            }`}
          >
            <HookCard hook={hook} onToggleFavorite={onToggleFavorite} />
          </div>
        ))}
      </div>
    </>
  )
}

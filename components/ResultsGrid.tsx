'use client'

import { useEffect, useState } from 'react'
import HookCard from './HookCard'
import type { Hook } from '@/types'

interface ResultsGridProps {
  hooks: Hook[]
  loading: boolean
  onToggleFavorite: (hook: Hook) => void
}

function SkeletonCard() {
  return (
    <div className="flex flex-col gap-3 rounded-xl border border-dark-border bg-dark-card p-4 animate-pulse">
      <div className="flex items-center justify-between">
        <div className="h-5 w-16 rounded bg-dark-border" />
        <div className="h-4 w-8 rounded bg-dark-border" />
      </div>
      <div className="space-y-2">
        <div className="h-4 w-full rounded bg-dark-border" />
        <div className="h-4 w-4/5 rounded bg-dark-border" />
      </div>
      <div className="h-3 w-3/4 rounded bg-dark-border" />
      <div className="flex gap-2 pt-1">
        <div className="h-7 flex-1 rounded-lg bg-dark-border" />
        <div className="h-7 w-10 rounded-lg bg-dark-border" />
      </div>
    </div>
  )
}

export default function ResultsGrid({ hooks, loading, onToggleFavorite }: ResultsGridProps) {
  const [visibleCount, setVisibleCount] = useState(0)

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
  )
}

'use client'

import { useState } from 'react'
import type { Hook } from '@/types'

interface HookCardProps {
  hook: Hook
  onToggleFavorite: (hook: Hook) => void
}

export default function HookCard({ hook, onToggleFavorite }: HookCardProps) {
  const [copied, setCopied] = useState(false)

  async function handleCopy() {
    await navigator.clipboard.writeText(hook.content)
    setCopied(true)
    setTimeout(() => setCopied(false), 1500)
  }

  const scoreColor =
    hook.score >= 9
      ? 'text-accent'
      : hook.score >= 7
        ? 'text-ink-2'
        : 'text-ink-3'

  return (
    <div className="group flex flex-col gap-4 rounded-xl border border-warm-200 bg-surface p-5 transition-all duration-200 hover:-translate-y-0.5 hover:border-warm-300 hover:shadow-[0_6px_24px_rgba(26,25,22,0.07)]">

      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="rounded-full border border-warm-200 px-2.5 py-0.5 text-[10px] font-medium tracking-wide text-ink-3">
            {hook.style}
          </span>
          <span className="text-[10px] text-ink-3">{hook.content.length} 字</span>
        </div>
        <span className={`font-serif text-lg font-light ${scoreColor}`}>
          {hook.score.toFixed(1)}
        </span>
      </div>

      {/* Content */}
      <p className="flex-1 text-sm leading-relaxed text-ink">{hook.content}</p>

      {/* Reason */}
      <p className="text-xs leading-relaxed text-ink-3">{hook.reason}</p>

      {/* Actions */}
      <div className="flex items-center gap-3 border-t border-warm-100 pt-3">
        <button
          type="button"
          onClick={handleCopy}
          className="flex-1 text-center text-xs text-ink-3 transition hover:text-ink"
        >
          {copied ? '✓ 已复制' : '复制文案'}
        </button>
        <div className="h-3 w-px bg-warm-200" />
        <button
          type="button"
          onClick={() => onToggleFavorite(hook)}
          aria-label={hook.isFavorite ? '取消收藏' : '收藏'}
          className={`text-sm transition ${
            hook.isFavorite ? 'text-accent' : 'text-ink-3 hover:text-accent'
          }`}
        >
          {hook.isFavorite ? '♥' : '♡'}
        </button>
      </div>
    </div>
  )
}

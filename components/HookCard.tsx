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
      ? 'text-yellow-400'
      : hook.score >= 7
        ? 'text-green-400'
        : 'text-slate-400'

  return (
    <div className="flex flex-col gap-3 rounded-xl border border-dark-border bg-dark-card p-4 transition hover:border-violet-500/40">
      {/* Header: style tag + score */}
      <div className="flex items-center justify-between">
        <span className="rounded-md bg-dark-card2 px-2 py-0.5 text-xs font-medium text-violet-400">
          {hook.style}
        </span>
        <span className={`text-sm font-bold ${scoreColor}`}>
          ★ {hook.score.toFixed(1)}
        </span>
      </div>

      {/* Hook content */}
      <p className="flex-1 text-sm leading-relaxed text-slate-100">{hook.content}</p>

      {/* Reason */}
      <p className="text-xs text-slate-500">{hook.reason}</p>

      {/* Actions */}
      <div className="flex items-center gap-2 pt-1">
        <button
          onClick={handleCopy}
          className="flex flex-1 items-center justify-center gap-1.5 rounded-lg border border-dark-border py-1.5 text-xs text-slate-400 transition hover:border-slate-500 hover:text-slate-200"
        >
          {copied ? '✓ 已复制' : '复制'}
        </button>
        <button
          onClick={() => onToggleFavorite(hook)}
          className={`rounded-lg border px-3 py-1.5 text-sm transition ${
            hook.isFavorite
              ? 'border-rose-500/40 bg-rose-950/20 text-rose-400'
              : 'border-dark-border text-slate-500 hover:border-rose-500/40 hover:text-rose-400'
          }`}
          aria-label={hook.isFavorite ? '取消收藏' : '收藏'}
        >
          {hook.isFavorite ? '♥' : '♡'}
        </button>
      </div>
    </div>
  )
}

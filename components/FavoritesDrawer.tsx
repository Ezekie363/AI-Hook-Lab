'use client'

import { useEffect, useState } from 'react'
import type { Hook } from '@/types'

interface FavoritesDrawerProps {
  open: boolean
  favorites: Hook[]
  onClose: () => void
  onRemoveFavorite: (hookId: string) => void
}

function FavoriteItem({ hook, onRemove }: { hook: Hook; onRemove: () => void }) {
  const [copied, setCopied] = useState(false)

  async function handleCopy() {
    await navigator.clipboard.writeText(hook.content)
    setCopied(true)
    setTimeout(() => setCopied(false), 1500)
  }

  return (
    <div className="rounded-xl border border-warm-200 bg-surface p-4">
      <div className="mb-2 flex items-center justify-between">
        <span className="rounded-full border border-warm-200 px-2.5 py-0.5 text-[10px] tracking-wide text-ink-3">
          {hook.style}
        </span>
        <button
          type="button"
          onClick={onRemove}
          className="text-xs text-ink-3 transition hover:text-red-400"
        >
          取消收藏
        </button>
      </div>
      <p className="mb-3 text-sm leading-relaxed text-ink">{hook.content}</p>
      <button
        type="button"
        onClick={handleCopy}
        className="w-full rounded-lg border border-warm-200 py-1.5 text-xs text-ink-3 transition hover:border-ink hover:text-ink"
      >
        {copied ? '✓ 已复制' : '复制文案'}
      </button>
    </div>
  )
}

export default function FavoritesDrawer({
  open,
  favorites,
  onClose,
  onRemoveFavorite,
}: FavoritesDrawerProps) {
  useEffect(() => {
    if (!open) return
    function handleKey(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [open, onClose])

  return (
    <>
      {open && (
        <div
          className="fixed inset-0 z-40 bg-ink/20 backdrop-blur-sm"
          onClick={onClose}
        />
      )}

      <div
        className={`fixed inset-y-0 right-0 z-50 flex w-full max-w-sm flex-col border-l border-warm-200 bg-cream shadow-[−8px_0_40px_rgba(26,25,22,0.06)] transition-transform duration-300 ${
          open ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="flex items-center justify-between border-b border-warm-200 px-6 py-5">
          <h2 className="font-serif text-lg font-light text-ink">
            收藏夹
            {favorites.length > 0 && (
              <span className="ml-2 font-sans text-sm font-normal text-ink-3">
                {favorites.length}
              </span>
            )}
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="text-ink-3 transition hover:text-ink"
          >
            ✕
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-5 py-4">
          {favorites.length === 0 ? (
            <p className="mt-12 text-center text-xs tracking-wide text-ink-3">
              点击卡片上的 ♡ 收藏 Hook
            </p>
          ) : (
            <div className="flex flex-col gap-3">
              {favorites.map((hook) => (
                <FavoriteItem
                  key={hook.id}
                  hook={hook}
                  onRemove={() => onRemoveFavorite(hook.id)}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  )
}

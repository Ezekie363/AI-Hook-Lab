'use client'

import { useState } from 'react'
import type { Hook } from '@/types'

interface FavoritesDrawerProps {
  open: boolean
  favorites: Hook[]
  onClose: () => void
  onRemoveFavorite: (hookId: string) => void
}

function FavoriteItem({
  hook,
  onRemove,
}: {
  hook: Hook
  onRemove: () => void
}) {
  const [copied, setCopied] = useState(false)

  async function handleCopy() {
    await navigator.clipboard.writeText(hook.content)
    setCopied(true)
    setTimeout(() => setCopied(false), 1500)
  }

  return (
    <div className="rounded-xl border border-dark-border bg-dark-card p-4">
      <div className="mb-2 flex items-center justify-between">
        <span className="rounded-md bg-dark-card2 px-2 py-0.5 text-xs font-medium text-violet-400">
          {hook.style}
        </span>
        <button
          onClick={onRemove}
          className="text-xs text-slate-600 transition hover:text-red-400"
        >
          取消收藏
        </button>
      </div>
      <p className="mb-3 text-sm leading-relaxed text-slate-100">{hook.content}</p>
      <button
        onClick={handleCopy}
        className="w-full rounded-lg border border-dark-border py-1.5 text-xs text-slate-400 transition hover:border-slate-500 hover:text-slate-200"
      >
        {copied ? '✓ 已复制' : '复制'}
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
  return (
    <>
      {open && (
        <div
          className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm"
          onClick={onClose}
        />
      )}

      <div
        className={`fixed inset-y-0 right-0 z-50 flex w-full max-w-sm flex-col border-l border-dark-border bg-dark-base shadow-2xl transition-transform duration-300 ${
          open ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="flex items-center justify-between border-b border-dark-border px-5 py-4">
          <h2 className="font-semibold text-slate-100">
            收藏夹
            {favorites.length > 0 && (
              <span className="ml-2 rounded-full bg-dark-card2 px-2 py-0.5 text-xs text-violet-400">
                {favorites.length}
              </span>
            )}
          </h2>
          <button onClick={onClose} className="text-slate-400 transition hover:text-slate-100">
            ✕
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-4 py-3">
          {favorites.length === 0 ? (
            <p className="mt-8 text-center text-sm text-slate-500">
              还没有收藏，点击 Hook 卡片上的 ♡ 收藏
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

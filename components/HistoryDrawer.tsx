'use client'

import { useEffect } from 'react'
import type { HistoryEntry } from '@/types'

interface HistoryDrawerProps {
  open: boolean
  history: HistoryEntry[]
  onClose: () => void
  onDelete: (id: string) => void
  onRestore: (entry: HistoryEntry) => void
}

export default function HistoryDrawer({
  open,
  history,
  onClose,
  onDelete,
  onRestore,
}: HistoryDrawerProps) {
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
          <h2 className="font-serif text-lg font-light text-ink">历史记录</h2>
          <button
            type="button"
            onClick={onClose}
            className="text-ink-3 transition hover:text-ink"
          >
            ✕
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-5 py-4">
          {history.length === 0 ? (
            <p className="mt-12 text-center text-xs tracking-wide text-ink-3">暂无历史记录</p>
          ) : (
            <div className="flex flex-col gap-3">
              {history.map((entry) => (
                <div
                  key={entry.id}
                  className="rounded-xl border border-warm-200 bg-surface p-4"
                >
                  <div className="mb-2 flex items-start justify-between gap-2">
                    <div>
                      <p className="text-sm font-medium text-ink">{entry.topic}</p>
                      <p className="mt-0.5 text-xs text-ink-3">
                        {entry.platform} · {entry.contentType} ·{' '}
                        {new Date(entry.createdAt).toLocaleDateString('zh-CN', {
                          month: 'short',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => onDelete(entry.id)}
                      className="shrink-0 text-xs text-ink-3 transition hover:text-red-400"
                    >
                      删除
                    </button>
                  </div>

                  <div className="mb-3 space-y-1">
                    {entry.hooks.slice(0, 2).map((hook) => (
                      <p key={hook.id} className="truncate text-xs text-ink-3">
                        · {hook.content}
                      </p>
                    ))}
                    {entry.hooks.length > 2 && (
                      <p className="text-xs text-ink-3">…共 {entry.hooks.length} 个</p>
                    )}
                  </div>

                  <button
                    type="button"
                    onClick={() => { onRestore(entry); onClose() }}
                    className="w-full rounded-lg border border-warm-200 py-1.5 text-xs text-ink-3 transition hover:border-ink hover:text-ink"
                  >
                    查看完整结果
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  )
}

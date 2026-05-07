'use client'

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
  return (
    <>
      {/* Backdrop */}
      {open && (
        <div
          className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm"
          onClick={onClose}
        />
      )}

      {/* Drawer */}
      <div
        className={`fixed inset-y-0 right-0 z-50 flex w-full max-w-sm flex-col border-l border-dark-border bg-dark-base shadow-2xl transition-transform duration-300 ${
          open ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-dark-border px-5 py-4">
          <h2 className="font-semibold text-slate-100">历史记录</h2>
          <button
            onClick={onClose}
            className="text-slate-400 transition hover:text-slate-100"
          >
            ✕
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto px-4 py-3">
          {history.length === 0 ? (
            <p className="mt-8 text-center text-sm text-slate-500">暂无历史记录</p>
          ) : (
            <div className="flex flex-col gap-3">
              {history.map((entry) => (
                <div
                  key={entry.id}
                  className="rounded-xl border border-dark-border bg-dark-card p-4"
                >
                  <div className="mb-2 flex items-start justify-between gap-2">
                    <div>
                      <p className="font-medium text-slate-100">{entry.topic}</p>
                      <p className="text-xs text-slate-500">
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
                      onClick={() => onDelete(entry.id)}
                      className="shrink-0 text-xs text-slate-600 transition hover:text-red-400"
                    >
                      删除
                    </button>
                  </div>

                  {/* Preview of first 2 hooks */}
                  <div className="mb-3 space-y-1">
                    {entry.hooks.slice(0, 2).map((hook) => (
                      <p key={hook.id} className="truncate text-xs text-slate-400">
                        · {hook.content}
                      </p>
                    ))}
                    {entry.hooks.length > 2 && (
                      <p className="text-xs text-slate-600">…共 {entry.hooks.length} 个</p>
                    )}
                  </div>

                  <button
                    onClick={() => { onRestore(entry); onClose() }}
                    className="w-full rounded-lg border border-dark-border py-1.5 text-xs text-slate-400 transition hover:border-violet-500/40 hover:text-violet-400"
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

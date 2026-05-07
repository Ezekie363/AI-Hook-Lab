'use client'

import { PLATFORMS, CONTENT_TYPES } from '@/types'
import type { Platform, ContentType } from '@/types'

interface InputPanelProps {
  topic: string
  platform: Platform
  contentType: ContentType
  loading: boolean
  onTopicChange: (v: string) => void
  onPlatformChange: (v: Platform) => void
  onContentTypeChange: (v: ContentType) => void
  onGenerate: () => void
}

export default function InputPanel({
  topic,
  platform,
  contentType,
  loading,
  onTopicChange,
  onPlatformChange,
  onContentTypeChange,
  onGenerate,
}: InputPanelProps) {
  return (
    <div className="flex flex-col gap-4">
      {/* Topic input */}
      <div>
        <label className="mb-1.5 block text-xs font-medium uppercase tracking-widest text-slate-400">
          主题
        </label>
        <input
          type="text"
          value={topic}
          onChange={(e) => onTopicChange(e.target.value)}
          placeholder="例如：AI 变现副业、护肤入门、健身减脂..."
          maxLength={100}
          disabled={loading}
          className="w-full rounded-xl border border-dark-border bg-dark-card px-4 py-3 text-slate-100 placeholder-slate-600 outline-none transition focus:border-violet-500 focus:ring-1 focus:ring-violet-500/50 disabled:opacity-50"
        />
      </div>

      {/* Platform + ContentType row */}
      <div className="flex flex-col gap-4 sm:flex-row">
        {/* Platform pills */}
        <div className="flex-1">
          <label className="mb-1.5 block text-xs font-medium uppercase tracking-widest text-slate-400">
            平台
          </label>
          <div className="flex flex-wrap gap-2">
            {PLATFORMS.map((p) => (
              <button
                key={p}
                onClick={() => onPlatformChange(p)}
                disabled={loading}
                className={`rounded-full border px-3 py-1 text-sm transition ${
                  platform === p
                    ? 'border-violet-500 bg-dark-card2 text-violet-300'
                    : 'border-dark-border text-slate-500 hover:border-slate-500 hover:text-slate-300'
                } disabled:opacity-50`}
              >
                {p}
              </button>
            ))}
          </div>
        </div>

        {/* ContentType pills */}
        <div className="flex-1">
          <label className="mb-1.5 block text-xs font-medium uppercase tracking-widest text-slate-400">
            内容类型
          </label>
          <div className="flex flex-wrap gap-2">
            {CONTENT_TYPES.map((ct) => (
              <button
                key={ct}
                onClick={() => onContentTypeChange(ct)}
                disabled={loading}
                className={`rounded-full border px-3 py-1 text-sm transition ${
                  contentType === ct
                    ? 'border-violet-500 bg-dark-card2 text-violet-300'
                    : 'border-dark-border text-slate-500 hover:border-slate-500 hover:text-slate-300'
                } disabled:opacity-50`}
              >
                {ct}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Generate button */}
      <button
        onClick={onGenerate}
        disabled={loading || !topic.trim()}
        className="flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-500 px-6 py-3 font-semibold text-white shadow-lg transition hover:from-indigo-500 hover:to-violet-400 disabled:cursor-not-allowed disabled:opacity-40"
      >
        {loading ? (
          <>
            <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
            生成中…
          </>
        ) : (
          '⚡ 生成 10 个 Hook'
        )}
      </button>
    </div>
  )
}

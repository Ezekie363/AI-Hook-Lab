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
    <div className="flex flex-col gap-6">

      {/* Topic */}
      <div>
        <label className="mb-2 block text-[10px] font-medium uppercase tracking-[0.2em] text-ink-3">
          主题
        </label>
        <input
          type="text"
          value={topic}
          onChange={(e) => onTopicChange(e.target.value)}
          placeholder="例如：AI 变现副业、护肤入门、健身减脂…"
          maxLength={100}
          disabled={loading}
          className="w-full border-0 border-b border-warm-200 bg-transparent pb-2 text-base text-ink placeholder-warm-300 outline-none transition focus:border-ink disabled:opacity-40"
        />
      </div>

      {/* Platform + ContentType */}
      <div className="flex flex-col gap-5 sm:flex-row">
        <div className="flex-1">
          <label className="mb-2.5 block text-[10px] font-medium uppercase tracking-[0.2em] text-ink-3">
            平台
          </label>
          <div className="flex flex-wrap gap-2">
            {PLATFORMS.map((p) => (
              <button
                key={p}
                type="button"
                onClick={() => onPlatformChange(p)}
                disabled={loading}
                className={`rounded-full border px-3.5 py-1 text-xs transition-all ${
                  platform === p
                    ? 'border-ink bg-ink text-surface'
                    : 'border-warm-200 text-ink-3 hover:border-warm-300 hover:text-ink-2'
                } disabled:opacity-40`}
              >
                {p}
              </button>
            ))}
          </div>
        </div>

        <div className="flex-1">
          <label className="mb-2.5 block text-[10px] font-medium uppercase tracking-[0.2em] text-ink-3">
            内容类型
          </label>
          <div className="flex flex-wrap gap-2">
            {CONTENT_TYPES.map((ct) => (
              <button
                key={ct}
                onClick={() => onContentTypeChange(ct)}
                disabled={loading}
                className={`rounded-full border px-3.5 py-1 text-xs transition-all ${
                  contentType === ct
                    ? 'border-ink bg-ink text-surface'
                    : 'border-warm-200 text-ink-3 hover:border-warm-300 hover:text-ink-2'
                } disabled:opacity-40`}
              >
                {ct}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Generate */}
      <button
        type="submit"
        onClick={onGenerate}
        disabled={loading || !topic.trim()}
        className="flex items-center justify-center gap-2.5 rounded-xl bg-ink px-6 py-3.5 text-sm font-medium tracking-wide text-surface transition-all hover:bg-accent disabled:cursor-not-allowed disabled:opacity-30"
      >
        {loading ? (
          <>
            <span className="inline-block h-3.5 w-3.5 animate-spin rounded-full border-2 border-surface/30 border-t-surface" />
            生成中…
          </>
        ) : (
          '生成 10 个 Hook'
        )}
      </button>
    </div>
  )
}

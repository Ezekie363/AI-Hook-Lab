'use client'

interface ErrorBannerProps {
  code: string
  message: string
}

export default function ErrorBanner({ code, message }: ErrorBannerProps) {
  if (code === 'NO_API_KEY') {
    return (
      <div className="rounded-xl border border-warm-200 bg-surface p-5 text-sm">
        <p className="mb-2 font-medium text-ink">未检测到 API Key</p>
        <p className="text-xs leading-relaxed text-ink-3">
          请在项目根目录创建{' '}
          <code className="rounded bg-warm-100 px-1 py-0.5 font-mono text-ink-2">.env.local</code>{' '}
          文件并添加：
        </p>
        <pre className="mt-2 rounded-lg bg-warm-100 p-3 text-xs text-ink-2">
          DEEPSEEK_API_KEY=your_key_here
        </pre>
        <p className="mt-2 text-xs text-ink-3">然后重启开发服务器。</p>
      </div>
    )
  }

  return (
    <div className="rounded-xl border border-warm-200 bg-surface p-5 text-sm">
      <p className="font-medium text-ink">生成失败</p>
      <p className="mt-1 text-xs text-ink-3">{message}</p>
    </div>
  )
}

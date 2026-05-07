'use client'

interface ErrorBannerProps {
  code: string
  message: string
}

export default function ErrorBanner({ code, message }: ErrorBannerProps) {
  if (code === 'NO_API_KEY') {
    return (
      <div className="rounded-xl border border-red-500/40 bg-red-950/30 p-4 text-sm">
        <p className="mb-2 font-semibold text-red-400">⚠️ 未检测到 API Key</p>
        <p className="text-slate-300">
          请在项目根目录创建 <code className="rounded bg-dark-card px-1 py-0.5 text-violet-300">.env.local</code> 文件并添加：
        </p>
        <pre className="mt-2 rounded bg-dark-card p-3 text-xs text-green-400">
          ANTHROPIC_API_KEY=your_key_here
        </pre>
        <p className="mt-2 text-slate-400">然后重启开发服务器。</p>
      </div>
    )
  }

  return (
    <div className="rounded-xl border border-red-500/40 bg-red-950/30 p-4 text-sm">
      <p className="font-semibold text-red-400">⚠️ 生成失败</p>
      <p className="mt-1 text-slate-300">{message}</p>
    </div>
  )
}

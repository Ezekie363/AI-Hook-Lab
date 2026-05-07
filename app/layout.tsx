import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'AI Hook Lab',
  description: '一键生成 10 个爆款开头 Hook，覆盖小红书、抖音、B站、YouTube、X',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="zh-CN">
      <body className="bg-dark-base text-slate-200 min-h-screen">{children}</body>
    </html>
  )
}

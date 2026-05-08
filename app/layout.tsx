import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'AI Hook Lab',
  description: '一键生成 10 个爆款开头 Hook，覆盖小红书、抖音、B站、YouTube、X',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="zh-CN">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;1,300;1,400&family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="bg-cream text-ink min-h-screen">{children}</body>
    </html>
  )
}

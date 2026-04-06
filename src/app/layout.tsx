import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: '桃山社中 DX推進ポータル | 補助金・AI導入戦略 2026',
  description: '株式会社桃山社中の2026年度AI導入補助金活用・DX推進管理システム',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ja">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body>{children}</body>
    </html>
  )
}

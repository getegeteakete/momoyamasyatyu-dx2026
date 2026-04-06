import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: '桃山社中 補助金進捗管理 | DX推進ポータル 2026',
  description: '補助金申請・採択・実施の進捗管理システム',
}

export default function CRMLayout({ children }: { children: React.ReactNode }) {
  return children
}

'use client'
import { useState } from 'react'
const nav = [
  { id: 'dashboard', label: 'ダッシュボード' },
  { id: 'subsidies', label: '補助金一覧' },
  { id: 'schedule', label: 'スケジュール' },
  { id: 'calculator', label: '効果試算' },
  { id: 'tax', label: '税制優遇' },
  { id: 'tracker', label: '進捗管理' },
  { id: 'action', label: 'アクション' },
]
export default function Header({ activeSection }: { activeSection: string }) {
  const [open, setOpen] = useState(false)
  const scrollTo = (id: string) => { document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' }); setOpen(false) }
  return (
    <header style={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100, background: 'rgba(10,10,15,.9)', backdropFilter: 'blur(20px)', borderBottom: '1px solid rgba(201,168,76,.15)' }}>
      <div style={{ maxWidth: 1280, margin: '0 auto', padding: '0 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 64 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ width: 38, height: 38, borderRadius: '50%', background: 'linear-gradient(135deg,#c9a84c,#a07830)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16, fontFamily: "'Shippori Mincho',serif", color: '#0a0a0f', fontWeight: 700 }}>桃</div>
          <div>
            <div style={{ fontFamily: "'Shippori Mincho',serif", fontSize: 13, color: 'var(--kogane)', fontWeight: 700, lineHeight: 1.2 }}>桃山社中</div>
            <div style={{ fontSize: 10, color: 'rgba(245,240,232,.4)', letterSpacing: '.1em', textTransform: 'uppercase' }}>DX推進ポータル 2026</div>
          </div>
        </div>
        <nav className="hidden-mobile" style={{ display: 'flex', gap: 4 }}>
          {nav.map(item => (
            <button key={item.id} onClick={() => scrollTo(item.id)} style={{ background: activeSection === item.id ? 'rgba(201,168,76,.15)' : 'transparent', border: 'none', color: activeSection === item.id ? 'var(--kogane)' : 'rgba(245,240,232,.55)', padding: '6px 13px', borderRadius: 6, cursor: 'pointer', fontFamily: "'DM Sans',sans-serif", fontSize: 13, fontWeight: activeSection === item.id ? 600 : 400, transition: 'all .2s' }}>{item.label}</button>
          ))}
        </nav>
        <button className="mobile-menu-btn" onClick={() => setOpen(!open)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--kogane)', padding: 8, display: 'none' }}>
          <svg width="22" height="22" viewBox="0 0 22 22" fill="none">{open ? <path d="M4 4l14 14M18 4L4 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/> : <path d="M3 6h16M3 11h16M3 16h16" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>}</svg>
        </button>
      </div>
      {open && (
        <div style={{ background: 'var(--sumi)', borderTop: '1px solid rgba(201,168,76,.15)', padding: '12px 24px 20px' }}>
          {nav.map(item => (
            <button key={item.id} onClick={() => scrollTo(item.id)} style={{ display: 'block', width: '100%', textAlign: 'left', background: 'none', border: 'none', color: activeSection === item.id ? 'var(--kogane)' : 'rgba(245,240,232,.7)', padding: '11px 0', cursor: 'pointer', fontFamily: "'DM Sans',sans-serif", fontSize: 15, borderBottom: '1px solid rgba(255,255,255,.05)' }}>{item.label}</button>
          ))}
        </div>
      )}
    </header>
  )
}

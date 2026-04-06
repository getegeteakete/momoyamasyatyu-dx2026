'use client'
import { useEffect, useState } from 'react'

export default function ScrollToTop() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 400)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const scrollTop = () => window.scrollTo({ top: 0, behavior: 'smooth' })

  return (
    <>
      <button
        onClick={scrollTop}
        aria-label="ページトップへ戻る"
        style={{
          position: 'fixed',
          bottom: 28,
          right: 24,
          zIndex: 999,
          width: 48,
          height: 48,
          borderRadius: '50%',
          background: 'rgba(201,168,76,0.92)',
          border: '1.5px solid rgba(232,200,110,0.6)',
          boxShadow: '0 4px 20px rgba(0,0,0,0.45)',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          opacity: visible ? 1 : 0,
          transform: visible ? 'translateY(0)' : 'translateY(16px)',
          transition: 'opacity 0.3s ease, transform 0.3s ease',
          pointerEvents: visible ? 'auto' : 'none',
        }}
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
          stroke="#1a1f3a" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="18 15 12 9 6 15" />
        </svg>
      </button>
    </>
  )
}

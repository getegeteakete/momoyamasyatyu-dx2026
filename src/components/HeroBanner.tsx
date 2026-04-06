'use client'
import { useEffect, useState } from 'react'
const stats = [
  { label: '活用可能補助金総額', value: '¥4,100万', sub: '最大受給可能額（複数組み合わせ）' },
  { label: '補助率', value: '最大4/5', sub: 'インボイス枠・小規模特例' },
  { label: '申請開始', value: '2026.03.30', sub: '第1次締切：5月12日' },
  { label: '税額控除', value: '7%', sub: '中小企業投資促進税制' },
]
export default function HeroBanner() {
  const [v, setV] = useState(false)
  useEffect(() => { setTimeout(() => setV(true), 100) }, [])
  return (
    <div style={{ paddingTop: 100, padding: '100px 24px 60px', maxWidth: 1280, margin: '0 auto' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 24, opacity: v ? 1 : 0, transition: 'opacity .8s .1s' }}>
        <div className="pulse-dot" style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--kin)' }} />
        <span style={{ fontSize: 12, letterSpacing: '.15em', color: 'var(--kin)', textTransform: 'uppercase', fontFamily: "'JetBrains Mono',monospace" }}>令和8年度 公的支援活用戦略 — Momoyama DX Portal</span>
      </div>
      <h1 style={{ fontFamily: "'Shippori Mincho',serif", fontSize: 'clamp(32px,6vw,68px)', fontWeight: 800, lineHeight: 1.15, letterSpacing: '-.02em', marginBottom: 20, opacity: v ? 1 : 0, transform: v ? 'none' : 'translateY(30px)', transition: 'all .8s .2s' }}>
        <span className="kinpaku-text">AIシステム導入</span>で<br />
        <span style={{ color: 'var(--shiro)' }}>伝統と革新を</span><span className="kinpaku-text">統合</span>する
      </h1>
      <p style={{ fontSize: 16, color: 'rgba(245,240,232,.6)', maxWidth: 640, lineHeight: 1.8, marginBottom: 48, opacity: v ? 1 : 0, transition: 'opacity .8s .4s' }}>
        株式会社桃山社中 ・ 大阪市中央区森ノ宮 ／ 2026年度（令和8年度）補助金・助成金・税制優遇の全容とAI導入による生産性向上をリアルタイムで管理・試算するDX推進ポータルです。
      </p>
      <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginBottom: 64, opacity: v ? 1 : 0, transition: 'opacity .8s .5s' }}>
        <button className="btn-kin" onClick={() => document.getElementById('calculator')?.scrollIntoView({ behavior: 'smooth' })}>💰 効果を試算する</button>
        <button className="btn-ghost" onClick={() => document.getElementById('schedule')?.scrollIntoView({ behavior: 'smooth' })}>申請スケジュールを確認</button>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(200px,1fr))', gap: 16, opacity: v ? 1 : 0, transform: v ? 'none' : 'translateY(20px)', transition: 'all .9s .6s' }}>
        {stats.map((s, i) => (
          <div key={i} className="kinpaku-border" style={{ padding: '20px 24px', background: 'rgba(26,31,58,.6)', borderRadius: 12 }}>
            <div style={{ fontSize: 11, color: 'var(--kin)', letterSpacing: '.1em', textTransform: 'uppercase', marginBottom: 8 }}>{s.label}</div>
            <div style={{ fontFamily: "'Shippori Mincho',serif", fontSize: 'clamp(22px,3vw,28px)', fontWeight: 700, color: 'var(--shiro)', marginBottom: 4 }}>{s.value}</div>
            <div style={{ fontSize: 11, color: 'rgba(245,240,232,.45)' }}>{s.sub}</div>
          </div>
        ))}
      </div>
      <div style={{ marginTop: 48, display: 'flex', gap: 0, flexWrap: 'wrap', opacity: v ? 1 : 0, transition: 'opacity 1s .8s' }}>
        {[
          { num: '01', title: 'GビズID取得', desc: 'SECURITY ACTION一つ星も同時に申請。2月中完了が理想。' },
          { num: '02', title: 'ITベンダー選定', desc: 'AI登録済みのIT支援事業者と共同で事業計画を策定。' },
          { num: '03', title: '3月30日申請開始', desc: '交付申請→採択→導入→実績報告まで一元管理。' },
        ].map((step, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 16, padding: '20px 32px 20px 0', flex: '1 1 250px' }}>
            <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 28, fontWeight: 700, color: 'rgba(201,168,76,.25)', lineHeight: 1, minWidth: 40 }}>{step.num}</div>
            <div>
              <div style={{ fontWeight: 600, color: 'var(--shiro)', marginBottom: 4 }}>{step.title}</div>
              <div style={{ fontSize: 13, color: 'rgba(245,240,232,.5)', lineHeight: 1.6 }}>{step.desc}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

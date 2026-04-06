'use client'

const taxes = [
  { name: '中小企業投資促進税制', deadline: '2026年度末', cond: '70万円以上のソフトウェア・機械装置', benefit: '7%税額控除 または 30%特別償却', icon: '💻', color: '#c9a84c', detail: 'AIツール・業務管理ソフトウェア（70万円以上）の購入に適用。法人税額から投資額の7%を直接控除。キャッシュフロー改善に直結。' },
  { name: 'DX投資促進税制', deadline: '2026年度改正延長', cond: 'DX認定取得＋データ連携を伴う大規模投資', benefit: '最大7%税額控除 または 即時償却（100%損金算入）', icon: '⚡', color: '#5f8aff', detail: 'DX認定（経済産業省）取得が前提。データ連携を行う基幹システム・AI解析基盤の導入で即時償却も可能。' },
  { name: '少額減価償却資産の特例', deadline: '2028年度末', cond: '30万円未満の資産（一定条件で40万円未満）', benefit: '取得価額の全額を即時損金算入', icon: '🔖', color: '#5fb896', detail: 'AIカメラ・ビーコン・デジタルサイネージなど小型ハードウェア。30万円未満なら全額一括経費化が可能。' },
]

export default function TaxBenefits() {
  return (
    <div style={{ padding: '80px 24px', maxWidth: 1280, margin: '0 auto', background: 'rgba(10,10,15,.3)' }}>
      <div style={{ marginBottom: 48 }}>
        <div className="badge badge-green" style={{ marginBottom: 12 }}>税制優遇措置</div>
        <h2 style={{ fontFamily: "'Shippori Mincho',serif", fontSize: 'clamp(26px,4vw,42px)', fontWeight: 700, color: 'var(--shiro)', marginBottom: 12 }}>補助金と組み合わせる <span className="kinpaku-text">税制優遇</span></h2>
        <p style={{ color: 'rgba(245,240,232,.55)', fontSize: 14, maxWidth: 560 }}>補助金（直接給付）＋税額控除・特別償却の三層構造でAI導入の実質コストを最小化。</p>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(280px,1fr))', gap: 20, marginBottom: 32 }}>
        {taxes.map((m,i) => (
          <div key={i} className="card-glass" style={{ padding: '28px', borderTop: `3px solid ${m.color}` }}>
            <div style={{ fontSize: 28, marginBottom: 12 }}>{m.icon}</div>
            <div style={{ fontWeight: 700, fontSize: 16, color: 'var(--shiro)', marginBottom: 8 }}>{m.name}</div>
            <div style={{ marginBottom: 10 }}><span className="badge badge-gray">{m.deadline}</span></div>
            <div style={{ fontSize: 13, color: 'rgba(245,240,232,.5)', marginBottom: 10, lineHeight: 1.5 }}>{m.cond}</div>
            <div style={{ background: `${m.color}18`, border: `1px solid ${m.color}30`, borderRadius: 8, padding: '10px 14px', fontFamily: "'JetBrains Mono',monospace", fontSize: 12, color: m.color, fontWeight: 600, marginBottom: 14 }}>{m.benefit}</div>
            <div style={{ fontSize: 12, color: 'rgba(245,240,232,.55)', lineHeight: 1.7 }}>{m.detail}</div>
          </div>
        ))}
      </div>
      <div className="card-glass" style={{ padding: '28px 32px' }}>
        <div style={{ display: 'flex', gap: 20, flexWrap: 'wrap', alignItems: 'flex-start' }}>
          <div style={{ width: 52, height: 52, borderRadius: 12, background: 'rgba(201,168,76,.15)', border: '1px solid rgba(201,168,76,.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24, flexShrink: 0 }}>🏦</div>
          <div style={{ flex: 1, minWidth: 240 }}>
            <div style={{ fontWeight: 700, fontSize: 16, color: 'var(--shiro)', marginBottom: 6 }}>日本政策金融公庫 AI活用特別貸付</div>
            <p style={{ fontSize: 13, color: 'rgba(245,240,232,.6)', lineHeight: 1.7, marginBottom: 12 }}>補助金は後払い（精算払い）のため、導入時に一時的な自己資金が必要。日本公庫の特別融資を「つなぎ融資」として活用し、補助金交付決定後に返済することで財務の健全性を維持できる。スマートSMEサポーター等の専門家指導を受けてAIを導入する場合、貸付利率が優遇される。</p>
            <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
              <div className="badge badge-green">利率優遇あり</div>
              <div className="badge badge-blue">補助金つなぎ融資対応</div>
              <div className="badge badge-gold">長期償還期間</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

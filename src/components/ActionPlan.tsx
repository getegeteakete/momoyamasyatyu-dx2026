'use client'

const scenarios = [
  {
    title:'AIチャットボット × 顧問神主サービス高度化', subsidy:'デジタル化・AI導入補助金 通常枠', amount:'〜150万円', rate:'1/2', icon:'🤖', color:'#c9a84c',
    effects:['スタッフの電話応対時間を週10時間削減','24時間365日の問い合わせ対応','高付加価値業務へのリソース集中'],
    flow:['要件定義 → ベンダー選定 → 申請（3月30日〜）','採択 → システム導入（2ヶ月）','研修 → 本番稼働 → 実績報告'],
  },
  {
    title:'AI祝詞・ナレーション自動生成システム開発', subsidy:'ものづくり補助金 製品高付加価値化枠', amount:'750万〜4,000万円', rate:'1/2', icon:'⛩️', color:'#5f8aff',
    effects:['業界初の祝詞AI自動生成による差別化','神前結婚式・地鎮祭の司会コスト削減','多言語対応で訪日外国人向けサービス拡大'],
    flow:['革新性の論証資料作成（2026年2月〜）','第23次公募申請 → 採択','開発（6〜12ヶ月） → β版リリース'],
  },
  {
    title:'VR/AR × AIリモート地鎮祭システム', subsidy:'ものづくり補助金 ＋ 大阪産業局DX補助金', amount:'最大4,300万円', rate:'1/2〜2/3', icon:'🥽', color:'#5fb896',
    effects:['遠隔地・海外からの地鎮祭参加が可能に','新たな収益源（デジタル儀礼パッケージ）の創出','「デジタルの守護神」ブランドの確立'],
    flow:['大阪産業局のPoC補助でプロトタイプ制作','ものづくり補助金で本格開発','リリース → 全国展開'],
  },
]

const steps = [
  { step:'STEP 1', title:'GビズID＋SECURITY ACTION 即時取得', deadline:'2026年2月中', desc:'電子申請の基盤。SECURITY ACTIONの発行には約1週間かかるため今すぐ着手が必要。', url:'https://gbiz-id.go.jp/', urlLabel:'GビズIDを申請', color:'#c9a84c' },
  { step:'STEP 2', title:'AI登録済みITベンダーとの協議開始', deadline:'2026年3月上旬', desc:'2026年度版「AIツール登録」完了済みのIT導入支援事業者を特定。神事・イベント管理に特化したAIソリューションを検討。', url:'https://it-shien.smrj.go.jp/', urlLabel:'IT導入補助金ポータル', color:'#5f8aff' },
  { step:'STEP 3', title:'大阪産業局・大阪府の独自支援を確認', deadline:'2026年3月', desc:'国補助金（通常枠）と大阪産業局の伴走支援を開発フェーズに応じて使い分け。リスキリング補助も同時確認。', url:'https://www.obda.or.jp/', urlLabel:'大阪産業局', color:'#5fb896' },
  { step:'STEP 4', title:'賃上げ・生産性向上シミュレーション作成', deadline:'2026年4月（申請前）', desc:'AI導入による残業削減・売上向上を数値化。「付加価値額年率3%増」の根拠を構築。補助金採択の最重要資料。', url:'#calculator', urlLabel:'試算ツールを使う', color:'var(--kin)' },
]

export default function ActionPlan() {
  return (
    <div style={{ padding: '80px 24px', maxWidth: 1280, margin: '0 auto' }}>
      <div style={{ marginBottom: 48 }}>
        <div className="badge badge-gold" style={{ marginBottom: 12 }}>提言・アクションプラン</div>
        <h2 style={{ fontFamily: "'Shippori Mincho',serif", fontSize: 'clamp(26px,4vw,42px)', fontWeight: 700, color: 'var(--shiro)', marginBottom: 12 }}>桃山社中への <span className="kinpaku-text">戦略的提言</span></h2>
        <p style={{ color: 'rgba(245,240,232,.55)', maxWidth: 600, lineHeight: 1.7, fontSize: 14 }}>伝統文化の精髄を守りつつ、AIという現代の叡智を統合する。大阪を代表するDX先行企業への飛躍を支援するロードマップ。</p>
      </div>

      <div style={{ marginBottom: 52 }}>
        <div style={{ fontSize: 15, fontWeight: 700, color: 'var(--shiro)', marginBottom: 20, fontFamily: "'Shippori Mincho',serif" }}>AI活用シナリオ × 補助金の最適組み合わせ</div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(280px,1fr))', gap: 20 }}>
          {scenarios.map((s,i) => (
            <div key={i} className="card-glass" style={{ padding: '26px 28px', borderLeft: `3px solid ${s.color}` }}>
              <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start', marginBottom: 16 }}>
                <span style={{ fontSize: 28 }}>{s.icon}</span>
                <div>
                  <div style={{ fontWeight: 700, fontSize: 14, color: 'var(--shiro)', lineHeight: 1.4, marginBottom: 4 }}>{s.title}</div>
                  <div style={{ fontSize: 12, color: s.color }}>{s.subsidy}</div>
                </div>
              </div>
              <div style={{ display: 'flex', gap: 10, marginBottom: 16 }}>
                <div style={{ flex:1, background:`${s.color}18`, borderRadius:8, padding:'8px 12px', textAlign:'center' }}>
                  <div style={{ fontSize:10, color:'rgba(245,240,232,.5)', marginBottom:2 }}>補助上限</div>
                  <div style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:12, color:s.color, fontWeight:700 }}>{s.amount}</div>
                </div>
                <div style={{ flex:.5, background:'rgba(255,255,255,.05)', borderRadius:8, padding:'8px 12px', textAlign:'center' }}>
                  <div style={{ fontSize:10, color:'rgba(245,240,232,.5)', marginBottom:2 }}>補助率</div>
                  <div style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:12, color:'rgba(245,240,232,.7)', fontWeight:700 }}>{s.rate}</div>
                </div>
              </div>
              <div style={{ marginBottom: 14 }}>
                <div style={{ fontSize:11, color:'rgba(245,240,232,.4)', marginBottom:6, textTransform:'uppercase', letterSpacing:'.08em' }}>期待効果</div>
                {s.effects.map((e,j) => <div key={j} style={{ display:'flex', gap:6, marginBottom:5 }}><span style={{color:s.color,fontSize:12}}>◆</span><span style={{fontSize:12,color:'rgba(245,240,232,.65)',lineHeight:1.5}}>{e}</span></div>)}
              </div>
              <div>
                <div style={{ fontSize:11, color:'rgba(245,240,232,.4)', marginBottom:6, textTransform:'uppercase', letterSpacing:'.08em' }}>進め方</div>
                {s.flow.map((f,j) => <div key={j} style={{ display:'flex', gap:8, marginBottom:4 }}><span style={{fontFamily:"'JetBrains Mono',monospace",fontSize:11,color:s.color,fontWeight:700,flexShrink:0}}>{j+1}.</span><span style={{fontSize:12,color:'rgba(245,240,232,.55)'}}>{f}</span></div>)}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div>
        <div style={{ fontSize: 15, fontWeight: 700, color: 'var(--shiro)', marginBottom: 20, fontFamily: "'Shippori Mincho',serif" }}>推奨アクションプラン（今すぐ動く4ステップ）</div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(240px,1fr))', gap: 16 }}>
          {steps.map((a,i) => (
            <div key={i} className="card-glass" style={{ padding: '24px' }}>
              <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:12 }}>
                <span style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:11, color:a.color, fontWeight:700, letterSpacing:'.1em' }}>{a.step}</span>
                <span className="badge badge-red" style={{fontSize:10}}>{a.deadline}</span>
              </div>
              <div style={{ fontWeight:700, fontSize:14, color:'var(--shiro)', marginBottom:10, lineHeight:1.4 }}>{a.title}</div>
              <p style={{ fontSize:13, color:'rgba(245,240,232,.6)', lineHeight:1.7, marginBottom:14 }}>{a.desc}</p>
              <a href={a.url} target={a.url.startsWith('http')?'_blank':undefined} rel="noopener noreferrer" style={{ display:'inline-flex', alignItems:'center', gap:6, fontSize:12, color:a.color, borderBottom:`1px solid ${a.color}55`, paddingBottom:2, textDecoration:'none' }}>
                {a.urlLabel} <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M7 17L17 7M7 7h10v10"/></svg>
              </a>
            </div>
          ))}
        </div>
      </div>

      <div style={{ marginTop: 52, textAlign:'center', padding:'40px 20px', background:'rgba(26,31,58,.4)', borderRadius:16, border:'1px solid rgba(201,168,76,.15)' }}>
        <div style={{ fontSize:28, marginBottom:12 }}>⛩️</div>
        <blockquote style={{ fontFamily:"'Shippori Mincho',serif", fontSize:'clamp(15px,2.5vw,21px)', color:'var(--shiro)', lineHeight:1.8, maxWidth:640, margin:'0 auto', marginBottom:16 }}>
          「伝統文化の精髄を守りつつ、AIという現代の叡智を統合することで、<br/>大阪を代表する<span className="kinpaku-text">デジタルの守護神</span>として飛躍する」
        </blockquote>
        <p style={{ fontSize:13, color:'rgba(245,240,232,.4)' }}>株式会社桃山社中 ／ 2026年度 DX推進戦略報告書</p>
      </div>
    </div>
  )
}

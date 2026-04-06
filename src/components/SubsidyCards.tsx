'use client'
import { useState } from 'react'

const subsidies = [
  {
    id: 'digital-ai', category: '国', badge: '主力', badgeClass: 'badge-gold',
    name: 'デジタル化・AI導入補助金2026', subtitle: '旧IT導入補助金 ／ 令和8年度',
    maxAmount: '最大450万円', rate: '1/2〜4/5', startDate: '2026年3月30日', color: '#c9a84c',
    frames: [
      { name: '通常枠（小規模プロセス）', max: '150万円未満', rate: '1/2', desc: 'AIチャットボット・受注管理システム' },
      { name: '通常枠（高度連携プロセス）', max: '450万円', rate: '1/2', desc: 'AI搭載ERP・4プロセス以上' },
      { name: 'インボイス枠', max: '350万円', rate: '2/3〜4/5', desc: '会計・受発注・決済・PC・タブレット' },
      { name: 'セキュリティ対策推進枠', max: '150万円', rate: '1/2（小規模2/3）', desc: 'サイバーセキュリティ対策' },
      { name: '複数者連携AI導入枠', max: '3,000万円（グループ）', rate: '2/3', desc: 'AIカメラ・消費動向分析・データ連携' },
    ],
    conditions: ['GビズIDプライム取得必須', 'SECURITY ACTION宣言必須', 'IT導入支援事業者との共同申請', '賃上げ要件（再申請時）'],
    scenario: '神事・イベント受注管理AIシステム／AIチャットボット（24h対応）',
  },
  {
    id: 'monodukuri', category: '国', badge: 'R&D', badgeClass: 'badge-blue',
    name: 'ものづくり補助金', subtitle: '第23次公募 ／ 2026年2月〜',
    maxAmount: '最大4,000万円', rate: '1/2（小規模2/3）', startDate: '2026年2月〜', color: '#5f8aff',
    frames: [{ name: '製品・サービス高付加価値化枠', max: '750万〜4,000万', rate: '1/2', desc: 'AI祝詞自動生成・VRリモート地鎮祭システム開発' }],
    conditions: ['GビズIDプライム取得必須', '付加価値額年率3%以上向上', '業界初の革新性を論証', '給与支給総額年平均1.5%向上'],
    scenario: 'AI祝詞・ナレーション自動生成システム開発／VR×AIリモート地鎮祭構築',
  },
  {
    id: 'osaka-dx', category: '大阪', badge: '大阪独自', badgeClass: 'badge-green',
    name: '大阪産業局 中小企業DX支援補助金', subtitle: '大阪DX推進プロジェクト ／ OBDA',
    maxAmount: '最大300万円', rate: '2/3程度', startDate: '随時（年度ごと公募）', color: '#5fb896',
    frames: [{ name: 'DX推進支援（カスタマイズ開発）', max: '300万円前後', rate: '2/3', desc: '自社課題に合わせたカスタム開発・実証実験（PoC）' }],
    conditions: ['大阪府内に本社・事業所', '専門家コンサルティングとセット', '国補助金と使い分けが鍵'],
    scenario: '神事予約・在庫管理の自社仕様カスタマイズ開発フェーズで活用',
  },
  {
    id: 'reskilling', category: '大阪', badge: '人材育成', badgeClass: 'badge-blue',
    name: '大阪府リスキリング支援補助金', subtitle: '2026年度継続・拡充',
    maxAmount: '受講費の一部', rate: 'デジタル研修は補助率引上げ', startDate: '2026年度通年', color: '#8aadff',
    frames: [{ name: 'AI・デジタルスキル研修', max: '費用の一部', rate: '優遇率', desc: '生成AI活用・データ分析・クラウド管理研修' }],
    conditions: ['IoT/AI/クラウド/ビッグデータ関連研修', 'デジタル関連は補助率引上げ', '神職・事務スタッフ対象'],
    scenario: '神職・スタッフへの生成AI（ChatGPT）活用・データ経営管理講座受講',
  },
]

export default function SubsidyCards() {
  const [expanded, setExpanded] = useState<string | null>('digital-ai')
  return (
    <div style={{ padding: '80px 24px', maxWidth: 1280, margin: '0 auto' }}>
      <div style={{ marginBottom: 48 }}>
        <div className="badge badge-gold" style={{ marginBottom: 12 }}>活用可能な支援制度</div>
        <h2 style={{ fontFamily: "'Shippori Mincho',serif", fontSize: 'clamp(26px,4vw,42px)', fontWeight: 700, color: 'var(--shiro)', marginBottom: 12 }}>補助金・助成金 <span className="kinpaku-text">全容マップ</span></h2>
        <p style={{ color: 'rgba(245,240,232,.55)', maxWidth: 600, lineHeight: 1.7 }}>桃山社中のAI導入フェーズに応じて組み合わせ活用が可能。国・大阪府・税制の三層で最大効果を。</p>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        {subsidies.map(sub => (
          <div key={sub.id} className="card-glass" style={{ overflow: 'hidden', border: expanded === sub.id ? `1px solid ${sub.color}55` : '1px solid rgba(201,168,76,.12)', transition: 'border-color .3s' }}>
            <div style={{ padding: '24px 28px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16, flexWrap: 'wrap' }} onClick={() => setExpanded(expanded === sub.id ? null : sub.id)}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 16, flex: 1, minWidth: 240 }}>
                <div style={{ width: 44, height: 44, borderRadius: 10, background: `${sub.color}22`, border: `1px solid ${sub.color}44`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, color: sub.color, fontWeight: 700, flexShrink: 0 }}>{sub.category}</div>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}><span className={`badge ${sub.badgeClass}`}>{sub.badge}</span></div>
                  <div style={{ fontWeight: 600, color: 'var(--shiro)', fontSize: 15 }}>{sub.name}</div>
                  <div style={{ fontSize: 12, color: 'rgba(245,240,232,.45)', marginTop: 2 }}>{sub.subtitle}</div>
                </div>
              </div>
              <div style={{ display: 'flex', gap: 24, alignItems: 'center', flexShrink: 0 }}>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontFamily: "'Shippori Mincho',serif", fontSize: 20, fontWeight: 700, color: sub.color }}>{sub.maxAmount}</div>
                  <div style={{ fontSize: 11, color: 'rgba(245,240,232,.4)' }}>補助率 {sub.rate}</div>
                </div>
                <div style={{ color: 'rgba(245,240,232,.4)', transition: 'transform .3s', transform: expanded === sub.id ? 'rotate(180deg)' : 'none' }}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M6 9l6 6 6-6"/></svg>
                </div>
              </div>
            </div>
            {expanded === sub.id && (
              <div style={{ padding: '0 28px 28px', borderTop: '1px solid rgba(255,255,255,.06)' }}>
                <div style={{ marginTop: 20, marginBottom: 24 }}>
                  <div style={{ fontSize: 12, color: 'var(--kin)', letterSpacing: '.1em', textTransform: 'uppercase', marginBottom: 12 }}>申請枠の詳細</div>
                  <div className="table-scroll">
                    <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
                      <thead><tr style={{ borderBottom: '1px solid rgba(201,168,76,.2)' }}>
                        {['枠名称','補助上限','補助率','活用場面'].map(h => <th key={h} style={{ padding: '8px 12px', textAlign: 'left', color: 'var(--kin)', fontWeight: 600, fontSize: 11, whiteSpace: 'nowrap' }}>{h}</th>)}
                      </tr></thead>
                      <tbody>{sub.frames.map((f, i) => (
                        <tr key={i} style={{ borderBottom: '1px solid rgba(255,255,255,.04)' }}>
                          <td style={{ padding: '10px 12px', color: 'var(--shiro)', fontWeight: 500 }}>{f.name}</td>
                          <td style={{ padding: '10px 12px', color: sub.color, fontFamily: "'JetBrains Mono',monospace", fontWeight: 600, whiteSpace: 'nowrap' }}>{f.max}</td>
                          <td style={{ padding: '10px 12px', color: 'rgba(245,240,232,.7)', whiteSpace: 'nowrap' }}>{f.rate}</td>
                          <td style={{ padding: '10px 12px', color: 'rgba(245,240,232,.55)', fontSize: 12 }}>{f.desc}</td>
                        </tr>
                      ))}</tbody>
                    </table>
                  </div>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(260px,1fr))', gap: 16 }}>
                  <div style={{ background: 'rgba(0,0,0,.25)', borderRadius: 10, padding: '16px 20px' }}>
                    <div style={{ fontSize: 12, color: 'var(--kin)', marginBottom: 10, fontWeight: 600 }}>申請要件チェック</div>
                    {sub.conditions.map((c, i) => (
                      <div key={i} style={{ display: 'flex', gap: 8, alignItems: 'flex-start', marginBottom: 6 }}>
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#c9a84c" strokeWidth="2.5" style={{ marginTop: 2, flexShrink: 0 }}><path d="M9 12l2 2 4-4"/><circle cx="12" cy="12" r="9"/></svg>
                        <span style={{ fontSize: 13, color: 'rgba(245,240,232,.7)', lineHeight: 1.5 }}>{c}</span>
                      </div>
                    ))}
                  </div>
                  <div style={{ background: `${sub.color}11`, borderRadius: 10, padding: '16px 20px', border: `1px solid ${sub.color}25` }}>
                    <div style={{ fontSize: 12, color: sub.color, marginBottom: 10, fontWeight: 600 }}>桃山社中 活用シナリオ</div>
                    <div style={{ fontSize: 13, color: 'rgba(245,240,232,.75)', lineHeight: 1.7 }}>{sub.scenario}</div>
                    <div style={{ marginTop: 12, fontSize: 11, color: 'rgba(245,240,232,.4)' }}>申請開始: {sub.startDate}</div>
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

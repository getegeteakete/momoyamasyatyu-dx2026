'use client'
import { useState } from 'react'

const TODAY = new Date('2026-02-23')
const milestones = [
  { date: '2026-02-28', label: '2月末', title: 'GビズID・SECURITY ACTION取得完了', desc: '電子申請インフラの整備。SECURITY ACTION一つ星の申請（発行まで約1週間）。GビズIDプライムの取得。', tag: '準備', tagClass: 'badge-gold' },
  { date: '2026-03-15', label: '3月中旬', title: 'ITベンダー・IT支援事業者の確定', desc: '2026年度版AIツール登録済みのIT導入支援事業者を特定。神事・イベント管理に最適なAIソリューションの検討開始。', tag: '選定', tagClass: 'badge-blue' },
  { date: '2026-03-30', label: '3月30日 10:00〜', title: 'デジタル化・AI導入補助金2026 交付申請開始', desc: 'IT導入支援事業者と共同で交付申請を提出。通常枠（小規模プロセス）またはインボイス枠を選択。', tag: 'OPEN', tagClass: 'badge-green' },
  { date: '2026-05-12', label: '第1次締切', title: 'デジタル化・AI導入補助金 第1次締切', desc: '交付決定予定：2026年6月18日。実績報告期限：2026年12月25日。', tag: '締切1', tagClass: 'badge-red' },
  { date: '2026-06-15', label: '第2次締切', title: '第2次締切', desc: '交付決定予定：2026年7月23日。実績報告：2027年1月29日。', tag: '締切2', tagClass: 'badge-gray' },
  { date: '2026-07-21', label: '第3次締切', title: '第3次締切', desc: '交付決定：2026年9月2日。実績報告：2027年2月26日。', tag: '締切3', tagClass: 'badge-gray' },
  { date: '2026-08-25', label: '第4次締切', title: '第4次締切（最終）', desc: '交付決定：2026年10月7日。実績報告：2027年3月31日。', tag: '締切4', tagClass: 'badge-gray' },
  { date: '2026-12-25', label: '12月25日', title: '実績報告・効果確認（第1次採択分）', desc: 'ITツール導入完了・稼働状況の報告。補助金の精算払い手続き。賃金台帳・給与改善の証憑提出。', tag: '報告', tagClass: 'badge-blue' },
]

function getDays(d: string) { return Math.ceil((new Date(d).getTime() - TODAY.getTime()) / 86400000) }

function ChecklistItem({ text }: { text: string }) {
  const [checked, setChecked] = useState(false)
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '7px 0', cursor: 'pointer', borderBottom: '1px solid rgba(255,255,255,.04)' }} onClick={() => setChecked(!checked)}>
      <div style={{ width: 18, height: 18, borderRadius: 4, border: checked ? 'none' : '1.5px solid rgba(201,168,76,.4)', background: checked ? 'var(--kin)' : 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, transition: 'all .2s' }}>
        {checked && <svg width="11" height="11" viewBox="0 0 12 12" fill="none"><path d="M2 6l3 3 5-5" stroke="#0a0a0f" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>}
      </div>
      <span style={{ fontSize: 13, color: checked ? 'rgba(245,240,232,.4)' : 'rgba(245,240,232,.75)', textDecoration: checked ? 'line-through' : 'none', transition: 'all .2s' }}>{text}</span>
    </div>
  )
}

export default function ScheduleTimeline() {
  const [sel, setSel] = useState<number | null>(null)
  return (
    <div style={{ padding: '80px 24px', maxWidth: 1280, margin: '0 auto', background: 'rgba(26,31,58,.15)' }}>
      <div style={{ marginBottom: 48 }}>
        <div className="badge badge-blue" style={{ marginBottom: 12 }}>申請スケジュール</div>
        <h2 style={{ fontFamily: "'Shippori Mincho',serif", fontSize: 'clamp(26px,4vw,42px)', fontWeight: 700, color: 'var(--shiro)', marginBottom: 12 }}>2026年度 <span className="kinpaku-text">申請タイムライン</span></h2>
        <p style={{ color: 'rgba(245,240,232,.55)', fontSize: 14 }}>現在日：2026年2月23日 ／ タップで詳細確認。</p>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }} className="grid-2">
        <div style={{ position: 'relative', paddingLeft: 40 }}>
          <div className="timeline-line" />
          {milestones.map((m, i) => {
            const days = getDays(m.date)
            const isPast = days < 0
            const isNext = !isPast && milestones.slice(0, i).every(mm => getDays(mm.date) < 0)
            return (
              <div key={i} style={{ position: 'relative', marginBottom: 22, cursor: 'pointer' }} onClick={() => setSel(sel === i ? null : i)}>
                <div style={{ position: 'absolute', left: -32, top: 6, width: 14, height: 14, borderRadius: '50%', background: isPast ? 'rgba(255,255,255,.1)' : isNext ? 'var(--kin)' : 'var(--kon)', border: `2px solid ${isPast ? 'rgba(255,255,255,.15)' : isNext ? 'var(--kogane)' : 'rgba(201,168,76,.35)'}`, boxShadow: isNext ? '0 0 10px rgba(201,168,76,.5)' : 'none' }} />
                <div className="card-glass" style={{ padding: '12px 16px', border: sel === i ? '1px solid rgba(201,168,76,.4)' : '1px solid rgba(201,168,76,.07)', opacity: isPast ? 0.45 : 1 }}>
                  <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 8 }}>
                    <div>
                      <div style={{ display: 'flex', gap: 6, alignItems: 'center', marginBottom: 3 }}>
                        <span className={`badge ${m.tagClass}`}>{m.tag}</span>
                        <span style={{ fontSize: 11, color: 'rgba(245,240,232,.35)' }}>{m.label}</span>
                      </div>
                      <div style={{ fontWeight: 600, fontSize: 13, color: 'var(--shiro)', lineHeight: 1.4 }}>{m.title}</div>
                    </div>
                    <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 12, fontWeight: 700, color: days <= 30 && days > 0 ? 'var(--akane)' : days <= 0 ? 'rgba(255,255,255,.2)' : 'var(--kogane)', flexShrink: 0 }}>
                      {days < 0 ? `${Math.abs(days)}日前` : days === 0 ? '本日！' : `残り${days}日`}
                    </div>
                  </div>
                  {sel === i && <div style={{ marginTop: 8, paddingTop: 8, borderTop: '1px solid rgba(255,255,255,.06)', fontSize: 12, color: 'rgba(245,240,232,.6)', lineHeight: 1.7 }}>{m.desc}</div>}
                </div>
              </div>
            )
          })}
        </div>
        <div>
          <div className="card-glass" style={{ padding: '24px 28px' }}>
            <div style={{ fontSize: 13, color: 'var(--kin)', fontWeight: 600, marginBottom: 20 }}>締切スケジュール一覧</div>
            <div className="table-scroll">
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12 }}>
                <thead><tr style={{ borderBottom: '1px solid rgba(201,168,76,.2)' }}>
                  {['締切','交付申請締切','交付決定','実績報告'].map(h => <th key={h} style={{ padding: '6px 8px', textAlign: 'left', color: 'var(--kin)', fontSize: 10 }}>{h}</th>)}
                </tr></thead>
                <tbody>
                  {[['第1次','2026/05/12','2026/06/18','2026/12/25'],['第2次','2026/06/15','2026/07/23','2027/01/29'],['第3次','2026/07/21','2026/09/02','2027/02/26'],['第4次','2026/08/25','2026/10/07','2027/03/31']].map(([r,...ds],i) => (
                    <tr key={i} style={{ borderBottom: '1px solid rgba(255,255,255,.04)' }}>
                      <td style={{ padding: '8px', color: 'var(--kogane)', fontWeight: 700, fontFamily: "'JetBrains Mono',monospace" }}>{r}</td>
                      {ds.map((d,j) => <td key={j} style={{ padding: '8px', color: j===0?'#f08080':'rgba(245,240,232,.6)', fontFamily: "'JetBrains Mono',monospace", fontSize: 11 }}>{d}</td>)}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div style={{ marginTop: 24 }}>
              <div style={{ fontSize: 13, color: 'var(--kin)', fontWeight: 600, marginBottom: 12 }}>申請前準備チェックリスト</div>
              {['GビズIDプライム取得','SECURITY ACTION 一つ星 申請','IT導入支援事業者の選定','AIツール登録製品の特定','生産性向上シミュレーション作成','賃上げ計画の策定'].map(t => <ChecklistItem key={t} text={t} />)}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

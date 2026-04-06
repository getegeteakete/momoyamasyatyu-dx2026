'use client'
import { useState, useMemo } from 'react'

const FRAMES: Record<string,{name:string;cap:number;rate:number}> = {
  'normal-small': { name: '通常枠（小規模プロセス）', cap: 1500000, rate: 0.5 },
  'normal-high': { name: '通常枠（桃山社中プラン：目標350万円）', cap: 3500000, rate: 0.667 },
  'invoice': { name: 'インボイス枠', cap: 3500000, rate: 0.667 },
  'security': { name: 'セキュリティ対策推進枠', cap: 1500000, rate: 0.5 },
  'monodukuri': { name: 'ものづくり補助金', cap: 7500000, rate: 0.5 },
  'osaka-dx': { name: '大阪産業局DX支援補助金', cap: 3000000, rate: 0.667 },
}

function Slider({ label, value, min, max, step, fmt, onChange }: { label:string;value:number;min:number;max:number;step:number;fmt:(n:number)=>string;onChange:(n:number)=>void }) {
  const pct = ((value - min) / (max - min)) * 100
  return (
    <div style={{ marginBottom: 20 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
        <label style={{ fontSize: 12, color: 'rgba(245,240,232,.5)' }}>{label}</label>
        <span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 13, color: 'var(--kogane)', fontWeight: 600 }}>{fmt(value)}</span>
      </div>
      <input type="range" min={min} max={max} step={step} value={value} onChange={e => onChange(Number(e.target.value))} style={{ width:'100%',height:4,appearance:'none',background:`linear-gradient(to right,var(--kin) ${pct}%,rgba(255,255,255,.1) ${pct}%)`,borderRadius:2,border:'none',outline:'none',cursor:'pointer',padding:0 }} />
      <style>{`input[type=range]::-webkit-slider-thumb{appearance:none;width:14px;height:14px;border-radius:50%;background:var(--kin);border:2px solid var(--kogane);cursor:pointer;box-shadow:0 0 8px rgba(201,168,76,.4)}`}</style>
    </div>
  )
}

function Box({ label, value, color, sub }: { label:string;value:string;color:string;sub:string }) {
  return (
    <div className="card-glass" style={{ padding: '18px 20px' }}>
      <div style={{ fontSize: 11, color: 'rgba(245,240,232,.45)', marginBottom: 6, lineHeight: 1.4 }}>{label}</div>
      <div style={{ fontFamily: "'Shippori Mincho',serif", fontSize: 22, fontWeight: 700, color, marginBottom: 4 }}>{value}</div>
      <div style={{ fontSize: 11, color: 'rgba(245,240,232,.35)' }}>{sub}</div>
    </div>
  )
}

export default function BenefitCalculator() {
  const [inv, setInv] = useState(5250000)
  const [frame, setFrame] = useState('normal-high')
  const [emp, setEmp] = useState(5)
  const [rev, setRev] = useState(2000000)
  const [hours, setHours] = useState(80)
  const [rate, setRate] = useState(2500)
  const [eff, setEff] = useState(40)
  const [wage, setWage] = useState(1.5)

  const r = useMemo(() => {
    const f = FRAMES[frame]
    const subsidy = Math.min(inv * f.rate, f.cap)
    const self = inv - subsidy
    const tax = inv * 0.07
    const savedHrs = (hours * (eff/100)) * 12
    const labor = savedHrs * rate
    const revUplift = rev * 0.08 * 12
    const total = labor + revUplift
    const net = self - tax
    const payback = net > 0 ? Math.ceil((net/total)*12) : 0
    const roi = net > 0 ? Math.round(((total*3-net)/net)*100) : 999
    return { subsidy, self, tax, net, savedHrs, labor, revUplift, total, payback, roi, wageCost: emp*300000*12*(wage/100) }
  }, [inv, frame, emp, rev, hours, rate, eff, wage])

  const fk = (n: number) => n >= 1000000 ? `¥${(n/10000).toFixed(0)}万` : `¥${n.toLocaleString()}`

  return (
    <div style={{ padding: '80px 24px', maxWidth: 1280, margin: '0 auto' }}>
      <div style={{ marginBottom: 48 }}>
        <div className="badge badge-gold" style={{ marginBottom: 12 }}>インタラクティブ試算</div>
        <h2 style={{ fontFamily: "'Shippori Mincho',serif", fontSize: 'clamp(26px,4vw,42px)', fontWeight: 700, color: 'var(--shiro)', marginBottom: 12 }}>AI導入 <span className="kinpaku-text">効果・補助額シミュレーター</span></h2>
        <p style={{ color: 'rgba(245,240,232,.55)', fontSize: 14 }}>スライダーで数値を変更すると、補助額・ROI・回収期間がリアルタイムで更新されます。</p>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 28 }} className="grid-2">
        <div className="card-glass" style={{ padding: '28px 32px' }}>
          <div style={{ fontSize: 13, color: 'var(--kin)', fontWeight: 600, marginBottom: 24 }}>入力パラメータ</div>
          <Slider label="AI導入投資総額" value={inv} min={500000} max={10000000} step={100000} fmt={fk} onChange={setInv} />
          <div style={{ marginBottom: 20 }}>
            <label style={{ fontSize: 12, color: 'rgba(245,240,232,.5)', display: 'block', marginBottom: 8 }}>申請枠の選択</label>
            <select value={frame} onChange={e => setFrame(e.target.value)}>
              {Object.entries(FRAMES).map(([k,v]) => <option key={k} value={k}>{v.name}</option>)}
            </select>
          </div>
          <Slider label="従業員数" value={emp} min={1} max={50} step={1} fmt={n=>`${n}名`} onChange={setEmp} />
          <Slider label="月次売上（概算）" value={rev} min={500000} max={20000000} step={100000} fmt={fk} onChange={setRev} />
          <Slider label="月次バックオフィス作業時間" value={hours} min={10} max={300} step={5} fmt={n=>`${n}時間`} onChange={setHours} />
          <Slider label="時給換算単価" value={rate} min={1000} max={6000} step={100} fmt={n=>`¥${n.toLocaleString()}`} onChange={setRate} />
          <Slider label="AI導入による業務効率化率" value={eff} min={10} max={80} step={5} fmt={n=>`${n}%削減`} onChange={setEff} />
          <Slider label="賃上げ目標率" value={wage} min={1} max={5} step={0.1} fmt={n=>`${n.toFixed(1)}%増`} onChange={setWage} />
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <Box label="補助金受給額（推計）" value={fk(r.subsidy)} color="var(--kogane)" sub={`自己負担 ${fk(r.self)}`} />
            <Box label="税額控除（7%）" value={fk(r.tax)} color="#5fb896" sub="中小企業投資促進税制" />
            <Box label="実質コスト（補助+税控除後）" value={fk(r.net)} color="#8aadff" sub={`節約 ${fk(r.subsidy+r.tax)}`} />
            <Box label="3年間ROI" value={`${r.roi}%`} color="var(--kin)" sub={`回収期間 約${r.payback}ヶ月`} />
          </div>
          <div className="card-glass" style={{ padding: '24px 28px' }}>
            <div style={{ fontSize: 13, color: 'var(--kin)', fontWeight: 600, marginBottom: 18 }}>年間効果の内訳</div>
            {[
              { label: `労務費削減（${Math.round(r.savedHrs)}h/年×¥${rate.toLocaleString()}/h）`, value: fk(r.labor), color: '#5fb896' },
              { label: 'AI活用による売上向上（+8%試算）', value: fk(r.revUplift), color: 'var(--kogane)' },
            ].map((row,i) => (
              <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10, gap: 12 }}>
                <span style={{ fontSize: 13, color: 'rgba(245,240,232,.65)', flex: 1 }}>{row.label}</span>
                <span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 14, color: row.color, fontWeight: 600, flexShrink: 0 }}>{row.value}</span>
              </div>
            ))}
            <div style={{ borderTop: '1px solid rgba(201,168,76,.2)', marginTop: 12, paddingTop: 12, display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ fontSize: 13, color: 'rgba(245,240,232,.65)' }}>年間総効果（合計）</span>
              <span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 16, color: 'var(--kin)', fontWeight: 700 }}>{fk(r.total)}</span>
            </div>
            <div style={{ marginTop: 14, padding: '10px 14px', background: 'rgba(139,38,53,.15)', borderRadius: 8, border: '1px solid rgba(139,38,53,.3)' }}>
              <div style={{ fontSize: 12, color: '#f08080', marginBottom: 4 }}>⚠ 賃上げコスト（補助金要件達成のための必要支出）</div>
              <div style={{ fontFamily: "'JetBrains Mono',monospace", color: 'rgba(240,128,128,.8)', fontSize: 14 }}>+{fk(r.wageCost)}/年</div>
            </div>
          </div>
          <div style={{ fontSize: 12, color: 'rgba(245,240,232,.3)', lineHeight: 1.7 }}>※本試算は参考値です。実際の補助額は審査結果・事業計画により異なります。税務・財務については専門家へご相談ください。</div>
        </div>
      </div>
    </div>
  )
}

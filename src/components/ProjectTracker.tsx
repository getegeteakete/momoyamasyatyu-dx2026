'use client'
import { useState } from 'react'

const INIT_TASKS = [
  { id:1, phase:'準備フェーズ', title:'GビズIDプライムの取得申請', owner:'代表', deadline:'2026-02-28', status:'in-progress', priority:'high' },
  { id:2, phase:'準備フェーズ', title:'SECURITY ACTION一つ星申請', owner:'情報担当', deadline:'2026-02-28', status:'todo', priority:'high' },
  { id:3, phase:'準備フェーズ', title:'IT導入支援事業者候補リスト作成', owner:'代表', deadline:'2026-03-10', status:'todo', priority:'high' },
  { id:4, phase:'選定フェーズ', title:'AIツール登録済みベンダーのヒアリング（3社）', owner:'代表', deadline:'2026-03-20', status:'todo', priority:'medium' },
  { id:5, phase:'選定フェーズ', title:'自社課題整理・要件定義（神事受注管理AI）', owner:'事務局', deadline:'2026-03-20', status:'todo', priority:'medium' },
  { id:6, phase:'選定フェーズ', title:'IT導入支援事業者の最終決定', owner:'代表', deadline:'2026-03-25', status:'todo', priority:'high' },
  { id:7, phase:'申請フェーズ', title:'事業計画書・生産性向上シミュレーション作成', owner:'代表+ベンダー', deadline:'2026-04-15', status:'todo', priority:'high' },
  { id:8, phase:'申請フェーズ', title:'交付申請提出（第1次：5月12日締切）', owner:'代表', deadline:'2026-05-10', status:'todo', priority:'high' },
  { id:9, phase:'導入フェーズ', title:'AIシステム導入・設定', owner:'ベンダー+事務局', deadline:'2026-09-30', status:'todo', priority:'medium' },
  { id:10, phase:'導入フェーズ', title:'スタッフ研修・リスキリング研修申請', owner:'事務局', deadline:'2026-10-31', status:'todo', priority:'medium' },
  { id:11, phase:'報告フェーズ', title:'実績報告書・賃金台帳の準備', owner:'経理', deadline:'2026-12-10', status:'todo', priority:'medium' },
  { id:12, phase:'報告フェーズ', title:'補助金実績報告提出（12月25日期限）', owner:'代表', deadline:'2026-12-24', status:'todo', priority:'high' },
]
const PHASES = ['準備フェーズ','選定フェーズ','申請フェーズ','導入フェーズ','報告フェーズ']
const SL: Record<string,{label:string;color:string;cls:string}> = {
  done: { label:'完了', color:'#5fb896', cls:'badge-green' },
  'in-progress': { label:'進行中', color:'var(--kogane)', cls:'badge-gold' },
  todo: { label:'未着手', color:'rgba(245,240,232,.4)', cls:'badge-gray' },
  blocked: { label:'ブロック', color:'#f08080', cls:'badge-red' },
}
const CYCLE: Record<string,string> = { todo:'in-progress', 'in-progress':'done', done:'todo', blocked:'todo' }

export default function ProjectTracker() {
  const [tasks, setTasks] = useState(INIT_TASKS)
  const [filterPhase, setFilterPhase] = useState('全フェーズ')
  const [showAdd, setShowAdd] = useState(false)
  const [nt, setNt] = useState({ title:'', owner:'', deadline:'', phase:'準備フェーズ' })

  const filtered = filterPhase === '全フェーズ' ? tasks : tasks.filter(t => t.phase === filterPhase)
  const done = tasks.filter(t => t.status === 'done').length
  const pct = Math.round((done/tasks.length)*100)

  const addTask = () => {
    if (!nt.title) return
    setTasks(p => [...p, { ...nt, id: Date.now(), status: 'todo', priority: 'medium' }])
    setNt({ title:'', owner:'', deadline:'', phase:'準備フェーズ' })
    setShowAdd(false)
  }

  return (
    <div style={{ padding: '80px 24px', maxWidth: 1280, margin: '0 auto' }}>
      <div style={{ marginBottom: 40 }}>
        <div className="badge badge-blue" style={{ marginBottom: 12 }}>プロジェクト管理</div>
        <h2 style={{ fontFamily: "'Shippori Mincho',serif", fontSize: 'clamp(26px,4vw,42px)', fontWeight: 700, color: 'var(--shiro)', marginBottom: 12 }}><span className="kinpaku-text">DX推進タスク</span> 進捗管理</h2>
        <p style={{ color: 'rgba(245,240,232,.55)', fontSize: 14 }}>クリックでステータスを切り替え。タスクの追加も可能。</p>
      </div>

      <div className="card-glass" style={{ padding: '20px 28px', marginBottom: 20, display: 'flex', alignItems: 'center', gap: 24, flexWrap: 'wrap' }}>
        <div style={{ flex: 1, minWidth: 200 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
            <span style={{ fontSize: 13, color: 'rgba(245,240,232,.6)' }}>全体進捗</span>
            <span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 16, color: 'var(--kin)', fontWeight: 700 }}>{pct}%</span>
          </div>
          <div style={{ height: 8, background: 'rgba(255,255,255,.08)', borderRadius: 4, overflow: 'hidden' }}>
            <div className="progress-fill" style={{ height:'100%', width:`${pct}%`, background:'linear-gradient(90deg,var(--kin),var(--kogane))', borderRadius: 4 }} />
          </div>
          <div style={{ display: 'flex', gap: 16, marginTop: 8 }}>
            {Object.entries(SL).map(([k,v]) => <span key={k} style={{ fontSize: 11, color: v.color }}>{tasks.filter(t=>t.status===k).length} {v.label}</span>)}
          </div>
        </div>
        <button className="btn-kin" onClick={() => setShowAdd(!showAdd)}>＋ タスク追加</button>
      </div>

      {showAdd && (
        <div className="card-glass" style={{ padding: '24px 28px', marginBottom: 16, border: '1px solid rgba(201,168,76,.3)' }}>
          <div style={{ fontSize: 13, color: 'var(--kin)', fontWeight: 600, marginBottom: 14 }}>新規タスクを追加</div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(180px,1fr))', gap: 12 }}>
            <div><label style={{ fontSize: 11, color: 'rgba(245,240,232,.5)', display:'block', marginBottom: 6 }}>タスク名</label><input placeholder="例: ベンダー選定" value={nt.title} onChange={e=>setNt(p=>({...p,title:e.target.value}))} /></div>
            <div><label style={{ fontSize: 11, color: 'rgba(245,240,232,.5)', display:'block', marginBottom: 6 }}>担当者</label><input placeholder="例: 代表" value={nt.owner} onChange={e=>setNt(p=>({...p,owner:e.target.value}))} /></div>
            <div><label style={{ fontSize: 11, color: 'rgba(245,240,232,.5)', display:'block', marginBottom: 6 }}>期限</label><input type="date" value={nt.deadline} onChange={e=>setNt(p=>({...p,deadline:e.target.value}))} /></div>
            <div><label style={{ fontSize: 11, color: 'rgba(245,240,232,.5)', display:'block', marginBottom: 6 }}>フェーズ</label><select value={nt.phase} onChange={e=>setNt(p=>({...p,phase:e.target.value}))}>{PHASES.map(ph=><option key={ph} value={ph}>{ph}</option>)}</select></div>
          </div>
          <div style={{ display: 'flex', gap: 10, marginTop: 14 }}>
            <button className="btn-kin" onClick={addTask}>追加する</button>
            <button className="btn-ghost" onClick={()=>setShowAdd(false)}>キャンセル</button>
          </div>
        </div>
      )}

      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 16 }}>
        {['全フェーズ',...PHASES].map(ph => (
          <button key={ph} onClick={()=>setFilterPhase(ph)} style={{ padding:'6px 14px', borderRadius:100, border:'none', cursor:'pointer', fontFamily:"'DM Sans',sans-serif", fontSize:12, background: filterPhase===ph?'var(--kin)':'rgba(255,255,255,.06)', color: filterPhase===ph?'var(--kuro)':'rgba(245,240,232,.6)', fontWeight: filterPhase===ph?700:400, transition:'all .2s' }}>{ph}</button>
        ))}
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
        {filtered.map(task => {
          const s = SL[task.status]
          return (
            <div key={task.id} className="card-glass" style={{ padding:'14px 20px', cursor:'pointer', display:'flex', alignItems:'center', gap:14, flexWrap:'wrap', opacity:task.status==='done'?0.5:1, transition:'opacity .2s' }} onClick={()=>setTasks(p=>p.map(t=>t.id===task.id?{...t,status:CYCLE[t.status]||'todo'}:t))}>
              <div style={{ width:20, height:20, borderRadius:'50%', flexShrink:0, border:`2px solid ${s.color}`, background:task.status==='done'?s.color:'transparent', display:'flex', alignItems:'center', justifyContent:'center' }}>
                {task.status==='done'&&<svg width="10" height="10" viewBox="0 0 12 12" fill="none"><path d="M2 6l3 3 5-5" stroke="#0a0a0f" strokeWidth="2" strokeLinecap="round"/></svg>}
                {task.status==='in-progress'&&<div style={{width:6,height:6,borderRadius:'50%',background:s.color}}/>}
              </div>
              <div style={{ flex:1, minWidth:200 }}>
                <div style={{ fontSize:14, color:task.status==='done'?'rgba(245,240,232,.4)':'var(--shiro)', fontWeight:500, textDecoration:task.status==='done'?'line-through':'none' }}>{task.title}</div>
                <div style={{ display:'flex', gap:8, marginTop:3 }}>
                  <span style={{ fontSize:11, color:'rgba(245,240,232,.4)' }}>{task.phase}</span>
                  <span style={{ fontSize:11, color:'rgba(245,240,232,.4)' }}>担当: {task.owner}</span>
                </div>
              </div>
              <div style={{ display:'flex', gap:8, alignItems:'center', flexShrink:0 }}>
                {task.priority==='high'&&<span className="badge badge-red" style={{fontSize:10}}>重要</span>}
                <span className={`badge ${s.cls}`}>{s.label}</span>
                {task.deadline&&<span style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:11, color:'rgba(245,240,232,.3)' }}>{task.deadline}</span>}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

'use client'

import { useEffect, useState, useCallback } from 'react'
import { supabase, Subsidy, Task, Note, FileRecord } from '@/lib/supabase'

const STATUS_LABELS = ['未着手','準備中','申請済','採択','実施中','完了']
const STATUS_PROGRESS = [0, 20, 45, 60, 80, 100]
const STATUS_PILL_BG = [
  'rgba(255,255,255,0.08)','rgba(201,168,76,0.2)','rgba(95,130,255,0.2)',
  'rgba(95,184,150,0.2)','rgba(240,128,128,0.2)','rgba(180,100,220,0.2)'
]
const STATUS_PILL_COLOR = ['rgba(245,240,232,0.5)','#e8c86e','#8aadff','#5fb896','#f08080','#d47fff']
const STATUS_BAR = ['#444','#c9a84c','#8aadff','#5fb896','#d47fff','#5fb896']

const TAB_ICONS = ['⊞','◈','◷','⊟']
const TAB_LABELS = ['ダッシュ','補助金','スケジュール','書類']
const TAB_KEYS = ['overview','subsidies','timeline','docs']
type Tab = 'overview'|'subsidies'|'timeline'|'docs'

const DEFAULT_SUBSIDIES = [
  { id: 'digital-ai', name: 'デジタル化・AI導入補助金2026', category: '国', max_amount: '¥450万', rate: '1/2〜4/5', status: 1, priority: '高', deadline: '2026-05-12' },
  { id: 'monodukuri', name: 'ものづくり補助金 第23次', category: '国', max_amount: '¥4,000万', rate: '1/2〜2/3', status: 1, priority: '高', deadline: '2026-06-30' },
  { id: 'osaka-dx', name: '大阪産業局 DX支援補助金', category: '大阪府', max_amount: '¥300万', rate: '2/3', status: 0, priority: '中', deadline: '2026-08-31' },
  { id: 'reskilling', name: '大阪府リスキリング支援補助金', category: '大阪府', max_amount: '費用の一部', rate: '優遇率', status: 0, priority: '低', deadline: '2026-12-31' },
]
const DEFAULT_TASKS = [
  { id: 't-d1', subsidy_id: 'digital-ai', text: 'GビズIDプライム取得', done: true, date: '2026-02-28' },
  { id: 't-d2', subsidy_id: 'digital-ai', text: 'SECURITY ACTION一つ星申請', done: true, date: '2026-02-28' },
  { id: 't-d3', subsidy_id: 'digital-ai', text: 'IT支援事業者選定', done: false, date: '2026-03-20' },
  { id: 't-d4', subsidy_id: 'digital-ai', text: '事業計画書作成', done: false, date: '2026-04-20' },
  { id: 't-d5', subsidy_id: 'digital-ai', text: '交付申請提出', done: false, date: '2026-05-10' },
  { id: 't-m1', subsidy_id: 'monodukuri', text: '革新性論証資料作成', done: false, date: '2026-03-31' },
  { id: 't-m2', subsidy_id: 'monodukuri', text: '技術開発計画策定', done: false, date: '2026-04-30' },
  { id: 't-m3', subsidy_id: 'monodukuri', text: '申請書提出', done: false, date: '2026-06-25' },
  { id: 't-o1', subsidy_id: 'osaka-dx', text: 'DX課題整理ヒアリング', done: false, date: '2026-05-15' },
  { id: 't-o2', subsidy_id: 'osaka-dx', text: '専門家コンサル手配', done: false, date: '2026-06-01' },
  { id: 't-o3', subsidy_id: 'osaka-dx', text: '申請書類準備', done: false, date: '2026-08-15' },
  { id: 't-r1', subsidy_id: 'reskilling', text: '対象研修プログラム確認', done: false, date: '2026-07-01' },
  { id: 't-r2', subsidy_id: 'reskilling', text: '受講申込', done: false, date: '2026-09-01' },
]

export default function SubsidyCRM() {
  const [subsidies, setSubsidies] = useState<Subsidy[]>([])
  const [tasks, setTasks]         = useState<Record<string, Task[]>>({})
  const [notes, setNotes]         = useState<Record<string, Note[]>>({})
  const [files, setFiles]         = useState<Record<string, FileRecord[]>>({})
  const [tab, setTab]             = useState<Tab>('overview')
  const [selectedId, setSelectedId] = useState<string|null>(null)
  const [loading, setLoading]     = useState(true)
  const [synced, setSynced]       = useState(false)
  const [noteInputs, setNoteInputs] = useState<Record<string,string>>({})
  const [modal, setModal]         = useState<{type:string;sid?:string}|null>(null)
  const [mStatus, setMStatus]     = useState(0)
  const [mMemo, setMMemo]         = useState('')
  const [mTask, setMTask]         = useState('')
  const [mDate, setMDate]         = useState('2026-05-01')
  const [mFName, setMFName]       = useState('')
  const [mFType, setMFType]       = useState('申請書類')
  const [mFSid, setMFSid]         = useState('')

  const flash = () => { setSynced(true); setTimeout(() => setSynced(false), 2000) }

  const groupBy = <T extends {subsidy_id:string}>(arr: T[]) =>
    arr.reduce((acc, x) => { (acc[x.subsidy_id] ??= []).push(x); return acc }, {} as Record<string,T[]>)

  const loadAll = useCallback(async () => {
    setLoading(true)
    const [r1, r2, r3, r4] = await Promise.all([
      supabase.from('subsidies').select('*').order('created_at'),
      supabase.from('tasks').select('*').order('created_at'),
      supabase.from('notes').select('*').order('created_at', { ascending: false }),
      supabase.from('files').select('*').order('created_at', { ascending: false }),
    ])
    if (r1.data && r1.data.length === 0) {
      await supabase.from('subsidies').upsert(DEFAULT_SUBSIDIES)
      await supabase.from('tasks').upsert(DEFAULT_TASKS)
      const { data: s2 } = await supabase.from('subsidies').select('*').order('created_at')
      const { data: t2 } = await supabase.from('tasks').select('*').order('created_at')
      if (s2) setSubsidies(s2)
      if (t2) setTasks(groupBy(t2))
      setLoading(false); setSynced(true); return
    }
    if (r1.data) setSubsidies(r1.data)
    if (r2.data) setTasks(groupBy(r2.data))
    if (r3.data) setNotes(groupBy(r3.data))
    if (r4.data) setFiles(groupBy(r4.data))
    setLoading(false); setSynced(true)
  }, [])

  useEffect(() => {
    loadAll()
    const ch = supabase.channel('crm-rt')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'subsidies' }, loadAll)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'tasks' }, loadAll)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'notes' }, loadAll)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'files' }, loadAll)
      .subscribe()
    return () => { supabase.removeChannel(ch) }
  }, [loadAll])

  const toggleTask = async (t: Task) => {
    await supabase.from('tasks').update({ done: !t.done }).eq('id', t.id)
    flash(); loadAll()
  }
  const updateStatus = async (sid: string, status: number, memo: string) => {
    await supabase.from('subsidies').update({ status }).eq('id', sid)
    if (memo.trim()) await supabase.from('notes').insert({ id: crypto.randomUUID(), subsidy_id: sid, text: `【ステータス更新】${STATUS_LABELS[status]} ／ ${memo}`, author: '担当者' })
    flash(); loadAll()
  }
  const addTask = async (sid: string, text: string, date: string) => {
    if (!text.trim()) return
    await supabase.from('tasks').insert({ id: crypto.randomUUID(), subsidy_id: sid, text, done: false, date })
    flash(); loadAll()
  }
  const addNote = async (sid: string) => {
    const text = noteInputs[sid]?.trim()
    if (!text) return
    await supabase.from('notes').insert({ id: crypto.randomUUID(), subsidy_id: sid, text, author: '担当者' })
    setNoteInputs(p => ({ ...p, [sid]: '' }))
    flash(); loadAll()
  }
  const addFile = async (sid: string, name: string, type: string) => {
    if (!name.trim()) return
    await supabase.from('files').insert({ id: crypto.randomUUID(), subsidy_id: sid, name, type })
    flash(); loadAll()
  }

  const daysDiff  = (d: string) => Math.ceil((new Date(d).getTime() - new Date().setHours(0,0,0,0)) / 86400000)
  const dColor    = (n: number) => n < 0 ? '#f08080' : n < 14 ? '#f08080' : n < 30 ? '#c9a84c' : '#5fb896'

  const allDeadlines = () => {
    const items: {text:string;date:string;sub:string}[] = []
    subsidies.forEach(s => {
      items.push({ text: `申請締切：${s.name.slice(0,16)}`, date: s.deadline, sub: s.name.slice(0,18) })
      ;(tasks[s.id]||[]).filter(t=>!t.done).forEach(t =>
        items.push({ text: t.text, date: t.date, sub: s.name.slice(0,18) })
      )
    })
    return items.sort((a,b) => new Date(a.date).getTime() - new Date(b.date).getTime())
  }

  const totalT  = Object.values(tasks).flat().length
  const doneT   = Object.values(tasks).flat().filter(t=>t.done).length
  const pct     = totalT ? Math.round(doneT/totalT*100) : 0
  const activeC = subsidies.filter(s=>s.status>0&&s.status<5).length
  const doneC   = subsidies.filter(s=>s.status===5).length
  const selected = selectedId ? subsidies.find(s=>s.id===selectedId) : null

  const fmtTime = (ts?: string) => ts ? new Date(ts).toLocaleString('ja-JP',{month:'2-digit',day:'2-digit',hour:'2-digit',minute:'2-digit'}) : ''

  const inputStyle: React.CSSProperties = { width:'100%', background:'rgba(0,0,0,0.4)', border:'1px solid rgba(201,168,76,0.2)', borderRadius:10, padding:'12px 14px', fontSize:16, color:'#f5f0e8', outline:'none', fontFamily:'sans-serif', boxSizing:'border-box', marginBottom:12 }
  const selStyle:   React.CSSProperties = { ...inputStyle, appearance:'none', WebkitAppearance:'none', background:'rgba(10,10,20,0.9)' }
  const btnPri  = (lbl: string, fn: () => void) => <button onClick={fn} style={{ flex:1, background:'rgba(201,168,76,0.3)', border:'1px solid rgba(201,168,76,0.5)', color:'#e8c86e', fontSize:15, padding:12, borderRadius:10, cursor:'pointer', fontFamily:'sans-serif' }}>{lbl}</button>
  const btnSec  = (lbl: string, fn: () => void) => <button onClick={fn} style={{ flex:1, background:'transparent', border:'1px solid rgba(255,255,255,0.15)', color:'rgba(245,240,232,0.6)', fontSize:15, padding:12, borderRadius:10, cursor:'pointer', fontFamily:'sans-serif' }}>{lbl}</button>

  if (loading) return (
    <div style={{ background:'#0a0a0f', minHeight:'100dvh', display:'flex', alignItems:'center', justifyContent:'center', flexDirection:'column', gap:16 }}>
      <div style={{ width:40, height:40, borderRadius:'50%', border:'3px solid rgba(201,168,76,0.2)', borderTopColor:'#c9a84c', animation:'spin 0.8s linear infinite' }} />
      <div style={{ color:'#c9a84c', fontSize:14 }}>データベースに接続中...</div>
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
    </div>
  )

  return (
    <div style={{ background:'#0a0a0f', minHeight:'100dvh', fontFamily:'sans-serif', display:'flex', flexDirection:'column' }}>

      {/* ── Header ── */}
      <div style={{ background:'#0a0a0f', padding:'12px 16px', borderBottom:'1px solid rgba(201,168,76,0.2)', display:'flex', alignItems:'center', justifyContent:'space-between', position:'sticky', top:0, zIndex:50, flexShrink:0 }}>
        <div style={{ display:'flex', alignItems:'center', gap:10 }}>
          <div style={{ width:32, height:32, borderRadius:'50%', background:'linear-gradient(135deg,#c9a84c,#a07830)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:14, color:'#0a0a0f', fontWeight:700, flexShrink:0 }}>桃</div>
          <div>
            <div style={{ fontSize:13, color:'#e8c86e', fontWeight:500 }}>補助金進捗管理</div>
            <div style={{ fontSize:10, color:'rgba(245,240,232,0.35)' }}>桃山社中 DX推進ポータル 2026</div>
          </div>
        </div>
        <div style={{ display:'flex', alignItems:'center', gap:6, background: synced ? 'rgba(95,184,150,0.12)' : 'rgba(201,168,76,0.08)', border:`1px solid ${synced?'rgba(95,184,150,0.35)':'rgba(201,168,76,0.2)'}`, color: synced?'#5fb896':'#c9a84c', fontSize:10, padding:'4px 10px', borderRadius:20, transition:'all 0.4s' }}>
          <div style={{ width:5, height:5, borderRadius:'50%', background:'currentColor', animation:'pulse 2s infinite' }} />
          {synced ? 'DB同期完了 ✓' : '接続中'}
        </div>
      </div>

      {/* ── Desktop tabs ── */}
      <div className="desk-tabs" style={{ display:'flex', background:'#0a0a0f', borderBottom:'1px solid rgba(255,255,255,0.06)', flexShrink:0 }}>
        {TAB_KEYS.map((t,i) => (
          <div key={t} onClick={() => setTab(t as Tab)} style={{ padding:'11px 20px', fontSize:13, color: tab===t?'#e8c86e':'rgba(245,240,232,0.45)', borderBottom: tab===t?'2px solid #c9a84c':'2px solid transparent', cursor:'pointer', userSelect:'none' }}>
            {TAB_LABELS[i]}
          </div>
        ))}
      </div>

      {/* ── Main ── */}
      <div style={{ flex:1, overflowY:'auto', padding:'16px', paddingBottom:80 }}>

        {/* OVERVIEW */}
        {tab==='overview' && <>
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:10, marginBottom:20 }}>
            {[
              { label:'補助金総数', val:`${subsidies.length}件`, sub:'活用可能',    color:'#f5f0e8' },
              { label:'進行中',    val:`${activeC}件`,           sub:'申請・実施中', color:'#c9a84c' },
              { label:'タスク進捗',val:`${pct}%`,                sub:`${doneT}/${totalT} 完了`, color:'#5fb896' },
              { label:'完了',      val:`${doneC}件`,             sub:'受給済',       color:'#f5f0e8' },
            ].map(k => (
              <div key={k.label} style={{ background:'rgba(26,31,58,0.7)', border:'1px solid rgba(201,168,76,0.1)', borderRadius:12, padding:14 }}>
                <div style={{ fontSize:11, color:'rgba(245,240,232,0.45)', marginBottom:6 }}>{k.label}</div>
                <div style={{ fontSize:24, fontWeight:500, color:k.color, lineHeight:1 }}>{k.val}</div>
                <div style={{ fontSize:11, color:'rgba(245,240,232,0.3)', marginTop:5 }}>{k.sub}</div>
              </div>
            ))}
          </div>
          <div style={{ background:'rgba(26,31,58,0.5)', border:'1px solid rgba(255,255,255,0.06)', borderRadius:12, padding:'14px 16px', marginBottom:20 }}>
            <div style={{ display:'flex', justifyContent:'space-between', marginBottom:8 }}>
              <span style={{ fontSize:12, color:'rgba(245,240,232,0.5)' }}>全タスク進捗</span>
              <span style={{ fontSize:12, color:'#c9a84c', fontWeight:500 }}>{pct}%</span>
            </div>
            <div style={{ height:8, background:'rgba(255,255,255,0.08)', borderRadius:4 }}>
              <div style={{ height:'100%', borderRadius:4, width:`${pct}%`, background:'linear-gradient(90deg,#c9a84c,#e8c86e)', transition:'width 0.8s' }} />
            </div>
          </div>
          <div style={{ fontSize:11, color:'#c9a84c', fontWeight:500, marginBottom:10, letterSpacing:'0.07em', textTransform:'uppercase' }}>補助金一覧</div>
          {subsidies.map(s => <SCard key={s.id} s={s} tasks={tasks[s.id]||[]} selected={false} onClick={() => { setSelectedId(s.id); setTab('subsidies') }} />)}
          <div style={{ fontSize:11, color:'#c9a84c', fontWeight:500, margin:'20px 0 10px', letterSpacing:'0.07em', textTransform:'uppercase' }}>直近の締め切り</div>
          <DList items={allDeadlines().slice(0,6)} daysDiff={daysDiff} dColor={dColor} />
        </>}

        {/* SUBSIDIES */}
        {tab==='subsidies' && <>
          {subsidies.map(s => <SCard key={s.id} s={s} tasks={tasks[s.id]||[]} selected={selectedId===s.id} onClick={() => setSelectedId(selectedId===s.id?null:s.id)} />)}
          {selected && (
            <div style={{ background:'rgba(26,31,58,0.5)', border:'1px solid rgba(201,168,76,0.2)', borderRadius:14, padding:16, marginTop:4 }}>
              <div style={{ display:'flex', alignItems:'flex-start', gap:8, marginBottom:16 }}>
                <div style={{ flex:1, fontSize:13, color:'#e8c86e', fontWeight:500, lineHeight:1.4 }}>{selected.name}</div>
                <button onClick={() => { setMStatus(selected.status); setMMemo(''); setModal({type:'status',sid:selected.id}) }}
                  style={{ background:'rgba(201,168,76,0.2)', border:'1px solid rgba(201,168,76,0.4)', color:'#e8c86e', fontSize:12, padding:'8px 14px', borderRadius:8, cursor:'pointer', whiteSpace:'nowrap', flexShrink:0 }}>ステータス変更</button>
              </div>
              <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:10 }}>
                <span style={{ fontSize:12, color:'#c9a84c', fontWeight:500 }}>タスク</span>
                <button onClick={() => { setMTask(''); setMDate('2026-05-01'); setModal({type:'task',sid:selected.id}) }}
                  style={{ background:'rgba(201,168,76,0.15)', border:'1px solid rgba(201,168,76,0.3)', color:'#c9a84c', fontSize:12, padding:'7px 12px', borderRadius:8, cursor:'pointer' }}>＋ 追加</button>
              </div>
              <div style={{ display:'flex', flexDirection:'column', gap:6, marginBottom:20 }}>
                {(tasks[selected.id]||[]).length===0
                  ? <div style={{ fontSize:13, color:'rgba(245,240,232,0.3)', padding:'10px 0' }}>タスクなし</div>
                  : (tasks[selected.id]||[]).map(t => (
                    <div key={t.id} onClick={() => toggleTask(t)} style={{ display:'flex', alignItems:'center', gap:12, padding:'12px 14px', background:'rgba(0,0,0,0.25)', borderRadius:10, cursor:'pointer', minHeight:48 }}>
                      <div style={{ width:20, height:20, borderRadius:6, border:`2px solid ${t.done?'#5fb896':'rgba(201,168,76,0.4)'}`, background:t.done?'#5fb896':'transparent', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
                        {t.done && <svg width="11" height="11" viewBox="0 0 12 12"><path d="M2 6l3 3 5-5" stroke="#0a0a0f" strokeWidth="2.5" fill="none" strokeLinecap="round"/></svg>}
                      </div>
                      <span style={{ flex:1, fontSize:13, color:t.done?'rgba(245,240,232,0.4)':'rgba(245,240,232,0.9)', textDecoration:t.done?'line-through':'none', lineHeight:1.4 }}>{t.text}</span>
                      <span style={{ fontSize:11, color:'rgba(245,240,232,0.3)', flexShrink:0 }}>{t.date}</span>
                    </div>
                  ))
                }
              </div>
              <div style={{ borderTop:'1px solid rgba(255,255,255,0.06)', paddingTop:14 }}>
                <div style={{ fontSize:12, color:'#c9a84c', fontWeight:500, marginBottom:10 }}>コメント・メモ</div>
                <div style={{ display:'flex', gap:8, marginBottom:10 }}>
                  <input value={noteInputs[selected.id]||''} onChange={e => setNoteInputs(p=>({...p,[selected.id]:e.target.value}))} onKeyDown={e=>e.key==='Enter'&&addNote(selected.id)} placeholder="進捗メモ・連絡事項..."
                    style={{ flex:1, background:'rgba(0,0,0,0.3)', border:'1px solid rgba(201,168,76,0.2)', borderRadius:10, padding:'12px 14px', fontSize:15, color:'#f5f0e8', outline:'none', fontFamily:'sans-serif' }} />
                  <button onClick={()=>addNote(selected.id)} style={{ background:'rgba(201,168,76,0.2)', border:'1px solid rgba(201,168,76,0.4)', color:'#e8c86e', fontSize:13, padding:'0 16px', borderRadius:10, cursor:'pointer' }}>追加</button>
                </div>
                <div style={{ display:'flex', flexDirection:'column', gap:8 }}>
                  {(notes[selected.id]||[]).map(n => (
                    <div key={n.id} style={{ background:'rgba(0,0,0,0.2)', borderRadius:10, padding:'10px 14px', borderLeft:'3px solid rgba(201,168,76,0.4)' }}>
                      <div style={{ fontSize:13, color:'rgba(245,240,232,0.8)', lineHeight:1.6 }}>{n.text}</div>
                      <div style={{ fontSize:11, color:'rgba(245,240,232,0.3)', marginTop:4 }}>{n.author}　—　{fmtTime(n.created_at)}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
          {!selected && <div style={{ textAlign:'center', color:'rgba(245,240,232,0.3)', fontSize:13, padding:'24px 0' }}>カードをタップして詳細を表示</div>}
        </>}

        {/* TIMELINE */}
        {tab==='timeline' && <>
          <div style={{ fontSize:11, color:'#c9a84c', fontWeight:500, marginBottom:12, letterSpacing:'0.07em', textTransform:'uppercase' }}>全スケジュール</div>
          <DList items={allDeadlines()} daysDiff={daysDiff} dColor={dColor} />
        </>}

        {/* DOCS */}
        {tab==='docs' && <>
          <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:16 }}>
            <div style={{ fontSize:11, color:'#c9a84c', fontWeight:500, letterSpacing:'0.07em', textTransform:'uppercase' }}>書類管理</div>
            <button onClick={() => { setMFSid(subsidies[0]?.id||''); setMFName(''); setMFType('申請書類'); setModal({type:'file'}) }}
              style={{ background:'rgba(201,168,76,0.15)', border:'1px solid rgba(201,168,76,0.3)', color:'#c9a84c', fontSize:13, padding:'8px 14px', borderRadius:8, cursor:'pointer' }}>＋ 登録</button>
          </div>
          {subsidies.map(s => (
            <div key={s.id} style={{ marginBottom:16 }}>
              <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:8 }}>
                <span style={{ background:STATUS_PILL_BG[s.status], color:STATUS_PILL_COLOR[s.status], fontSize:10, padding:'2px 8px', borderRadius:20 }}>{STATUS_LABELS[s.status]}</span>
                <span style={{ fontSize:12, color:'rgba(245,240,232,0.7)' }}>{s.name.slice(0,22)}</span>
              </div>
              {(files[s.id]||[]).length===0
                ? <div style={{ fontSize:12, color:'rgba(245,240,232,0.3)', padding:'8px 14px' }}>書類未登録</div>
                : (files[s.id]||[]).map(f => (
                  <div key={f.id} style={{ display:'flex', alignItems:'center', gap:10, padding:'12px 14px', background:'rgba(26,31,58,0.5)', borderRadius:10, marginBottom:4 }}>
                    <span style={{ fontSize:18 }}>📄</span>
                    <div style={{ flex:1, minWidth:0 }}>
                      <div style={{ fontSize:13, color:'rgba(245,240,232,0.85)', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{f.name}</div>
                      <div style={{ fontSize:11, color:'rgba(245,240,232,0.35)', marginTop:2 }}>{f.type}　{f.created_at?new Date(f.created_at).toLocaleDateString('ja-JP'):''}</div>
                    </div>
                  </div>
                ))
              }
            </div>
          ))}
        </>}
      </div>

      {/* ── Bottom Nav (mobile only) ── */}
      <div className="bottom-nav" style={{ position:'fixed', bottom:0, left:0, right:0, background:'rgba(10,10,20,0.97)', borderTop:'1px solid rgba(201,168,76,0.15)', display:'flex', zIndex:100, paddingBottom:'env(safe-area-inset-bottom)' }}>
        {TAB_KEYS.map((t,i) => (
          <div key={t} onClick={() => setTab(t as Tab)} style={{ flex:1, display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', padding:'10px 4px 8px', cursor:'pointer', gap:3, color: tab===t?'#e8c86e':'rgba(245,240,232,0.35)', transition:'color 0.2s', position:'relative' }}>
            {tab===t && <div style={{ position:'absolute', top:0, width:24, height:2, background:'#c9a84c', borderRadius:1 }} />}
            <span style={{ fontSize:18, lineHeight:1 }}>{TAB_ICONS[i]}</span>
            <span style={{ fontSize:10, fontWeight:tab===t?500:400 }}>{TAB_LABELS[i]}</span>
          </div>
        ))}
      </div>

      {/* ── Modal (bottom sheet) ── */}
      {modal && (
        <div onClick={e => e.target===e.currentTarget&&setModal(null)} style={{ position:'fixed', inset:0, background:'rgba(0,0,0,0.7)', display:'flex', alignItems:'flex-end', justifyContent:'center', zIndex:200 }}>
          <div style={{ background:'#12121a', border:'1px solid rgba(201,168,76,0.25)', borderRadius:'16px 16px 0 0', padding:'20px 20px calc(20px + env(safe-area-inset-bottom))', width:'100%', maxWidth:560, maxHeight:'85dvh', overflowY:'auto' }}>
            <div style={{ width:40, height:4, background:'rgba(255,255,255,0.15)', borderRadius:2, margin:'0 auto 18px' }} />
            {modal.type==='status' && <>
              <div style={{ fontSize:16, color:'#e8c86e', fontWeight:500, marginBottom:16 }}>ステータス更新</div>
              <div style={{ fontSize:12, color:'rgba(245,240,232,0.5)', marginBottom:6 }}>ステータス</div>
              <select value={mStatus} onChange={e => setMStatus(Number(e.target.value))} style={selStyle}>
                {STATUS_LABELS.map((l,i) => <option key={i} value={i} style={{background:'#12121a'}}>{l}</option>)}
              </select>
              <div style={{ fontSize:12, color:'rgba(245,240,232,0.5)', marginBottom:6 }}>メモ（任意）</div>
              <input value={mMemo} onChange={e=>setMMemo(e.target.value)} placeholder="変更理由・連絡事項" style={inputStyle} />
              <div style={{ display:'flex', gap:10, marginTop:8 }}>{btnSec('キャンセル',()=>setModal(null))}{btnPri('保存',()=>{updateStatus(modal.sid!,mStatus,mMemo);setModal(null)})}</div>
            </>}
            {modal.type==='task' && <>
              <div style={{ fontSize:16, color:'#e8c86e', fontWeight:500, marginBottom:16 }}>タスク追加</div>
              <div style={{ fontSize:12, color:'rgba(245,240,232,0.5)', marginBottom:6 }}>タスク名</div>
              <input value={mTask} onChange={e=>setMTask(e.target.value)} placeholder="例：事業計画書 第2稿作成" style={inputStyle} />
              <div style={{ fontSize:12, color:'rgba(245,240,232,0.5)', marginBottom:6 }}>期限日</div>
              <input type="date" value={mDate} onChange={e=>setMDate(e.target.value)} style={inputStyle} />
              <div style={{ display:'flex', gap:10, marginTop:8 }}>{btnSec('キャンセル',()=>setModal(null))}{btnPri('追加',()=>{addTask(modal.sid!,mTask,mDate);setModal(null)})}</div>
            </>}
            {modal.type==='file' && <>
              <div style={{ fontSize:16, color:'#e8c86e', fontWeight:500, marginBottom:16 }}>書類登録</div>
              <div style={{ fontSize:12, color:'rgba(245,240,232,0.5)', marginBottom:6 }}>補助金</div>
              <select value={mFSid} onChange={e=>setMFSid(e.target.value)} style={selStyle}>
                {subsidies.map(s => <option key={s.id} value={s.id} style={{background:'#12121a'}}>{s.name.slice(0,22)}</option>)}
              </select>
              <div style={{ fontSize:12, color:'rgba(245,240,232,0.5)', marginBottom:6 }}>書類名</div>
              <input value={mFName} onChange={e=>setMFName(e.target.value)} placeholder="例：事業計画書_v2.pdf" style={inputStyle} />
              <div style={{ fontSize:12, color:'rgba(245,240,232,0.5)', marginBottom:6 }}>種別</div>
              <select value={mFType} onChange={e=>setMFType(e.target.value)} style={selStyle}>
                {['申請書類','見積書','契約書','報告書','その他'].map(t => <option key={t} style={{background:'#12121a'}}>{t}</option>)}
              </select>
              <div style={{ display:'flex', gap:10, marginTop:8 }}>{btnSec('キャンセル',()=>setModal(null))}{btnPri('登録',()=>{addFile(mFSid,mFName,mFType);setModal(null)})}</div>
            </>}
          </div>
        </div>
      )}

      <style>{`
        @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:.4} }
        @keyframes spin   { to{transform:rotate(360deg)} }
        * { box-sizing:border-box; -webkit-tap-highlight-color:transparent; }
        input[type=date]::-webkit-calendar-picker-indicator { filter:invert(0.8); }
        @media (min-width:640px) { .bottom-nav{display:none!important} .desk-tabs{display:flex!important} }
        @media (max-width:639px) { .desk-tabs{display:none!important} .bottom-nav{display:flex!important} }
      `}</style>
    </div>
  )
}

function SCard({ s, tasks, selected, onClick }: { s: Subsidy; tasks: Task[]; selected: boolean; onClick: () => void }) {
  return (
    <div onClick={onClick} style={{ background:'rgba(26,31,58,0.7)', borderRadius:12, border:`1px solid ${selected?'rgba(201,168,76,0.5)':'rgba(255,255,255,0.07)'}`, overflow:'hidden', cursor:'pointer', marginBottom:10, transition:'border-color 0.2s' }}>
      <div style={{ padding:'14px 16px 10px' }}>
        <div style={{ display:'flex', alignItems:'flex-start', justifyContent:'space-between', gap:10, marginBottom:10 }}>
          <div style={{ fontSize:14, color:'#f5f0e8', fontWeight:500, lineHeight:1.4 }}>{s.name}</div>
          <div style={{ background:STATUS_PILL_BG[s.status], color:STATUS_PILL_COLOR[s.status], fontSize:11, padding:'4px 10px', borderRadius:20, flexShrink:0, fontWeight:500 }}>{STATUS_LABELS[s.status]}</div>
        </div>
        <div style={{ height:5, background:'rgba(255,255,255,0.08)', borderRadius:3, margin:'8px 0 6px' }}>
          <div style={{ height:'100%', borderRadius:3, width:`${STATUS_PROGRESS[s.status]}%`, background:STATUS_BAR[s.status], transition:'width 0.5s' }} />
        </div>
        <div style={{ display:'flex', justifyContent:'space-between', fontSize:11, color:'rgba(245,240,232,0.4)' }}>
          <span>{s.max_amount}　{s.rate}</span><span>期限: {s.deadline}</span>
        </div>
      </div>
      {tasks.length>0 && (
        <div style={{ background:'rgba(0,0,0,0.2)', padding:'8px 14px', display:'flex', gap:5, flexWrap:'wrap' }}>
          {tasks.slice(0,3).map(t => (
            <span key={t.id} style={{ fontSize:11, padding:'3px 8px', borderRadius:4, border:`1px solid ${t.done?'rgba(95,184,150,0.3)':'rgba(255,255,255,0.08)'}`, color:t.done?'#5fb896':'rgba(245,240,232,0.5)', textDecoration:t.done?'line-through':'none' }}>
              {t.text.slice(0,10)}
            </span>
          ))}
          {tasks.length>3 && <span style={{ fontSize:11, color:'rgba(245,240,232,0.3)' }}>+{tasks.length-3}</span>}
        </div>
      )}
    </div>
  )
}

function DList({ items, daysDiff, dColor }: { items:{text:string;date:string;sub:string}[]; daysDiff:(d:string)=>number; dColor:(n:number)=>string }) {
  return (
    <div style={{ background:'rgba(26,31,58,0.4)', border:'1px solid rgba(255,255,255,0.07)', borderRadius:12, overflow:'hidden' }}>
      {items.map((d,i) => {
        const diff = daysDiff(d.date)
        const c = dColor(diff)
        return (
          <div key={i} style={{ display:'flex', gap:12, padding:'13px 16px', borderBottom:i<items.length-1?'1px solid rgba(255,255,255,0.04)':'none', alignItems:'flex-start', minHeight:54 }}>
            <div style={{ width:8, height:8, borderRadius:'50%', background:c, marginTop:5, flexShrink:0 }} />
            <div style={{ flex:1, minWidth:0 }}>
              <div style={{ fontSize:13, color:diff<0?'rgba(245,240,232,0.4)':'#f5f0e8', lineHeight:1.4 }}>{d.text}</div>
              <div style={{ fontSize:11, color:'rgba(245,240,232,0.35)', marginTop:2 }}>{d.sub}　{d.date}</div>
            </div>
            <div style={{ fontSize:12, fontWeight:500, color:c, flexShrink:0, marginTop:2 }}>
              {diff<0?'期限切れ':diff===0?'本日':`${diff}日後`}
            </div>
          </div>
        )
      })}
    </div>
  )
}

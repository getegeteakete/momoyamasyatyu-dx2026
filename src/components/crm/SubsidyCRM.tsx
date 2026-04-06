'use client'

import { useEffect, useState, useCallback, useRef } from 'react'
import { supabase, Subsidy, Task, Note, FileRecord } from '@/lib/supabase'

const STATUS_LABELS = ['未着手','準備中','申請済','採択','実施中','完了']
const STATUS_BAR_COLORS = ['#444','#c9a84c','#8aadff','#5fb896','#d47fff','#5fb896']
const STATUS_PROGRESS = [0, 20, 45, 60, 80, 100]
const STATUS_PILL_BG = [
  'rgba(255,255,255,0.07)', 'rgba(201,168,76,0.18)', 'rgba(95,130,255,0.18)',
  'rgba(95,184,150,0.18)', 'rgba(240,128,128,0.18)', 'rgba(180,100,220,0.18)'
]
const STATUS_PILL_COLOR = ['rgba(245,240,232,0.5)','#e8c86e','#8aadff','#5fb896','#f08080','#d47fff']

type Tab = 'overview' | 'subsidies' | 'timeline' | 'docs'

export default function SubsidyCRM() {
  const [subsidies, setSubsidies] = useState<Subsidy[]>([])
  const [tasks, setTasks] = useState<Record<string, Task[]>>({})
  const [notes, setNotes] = useState<Record<string, Note[]>>({})
  const [files, setFiles] = useState<Record<string, FileRecord[]>>({})
  const [tab, setTab] = useState<Tab>('overview')
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [syncStatus, setSyncStatus] = useState<'syncing' | 'ok'>('syncing')
  const [modal, setModal] = useState<{ type: string; sid?: string } | null>(null)
  const [modalStatusVal, setModalStatusVal] = useState(0)
  const [modalMemo, setModalMemo] = useState('')
  const [modalTaskText, setModalTaskText] = useState('')
  const [modalTaskDate, setModalTaskDate] = useState('2026-05-01')
  const [modalFileName, setModalFileName] = useState('')
  const [modalFileType, setModalFileType] = useState('申請書類')
  const [modalFileSid, setModalFileSid] = useState('')
  const [noteInputs, setNoteInputs] = useState<Record<string, string>>({})

  const showSync = useCallback(() => {
    setSyncStatus('ok')
    setTimeout(() => setSyncStatus('syncing'), 2000)
  }, [])

  const DEFAULT_SUBSIDIES = [
    { id: 'digital-ai', name: 'デジタル化・AI導入補助金2026', category: '国', max_amount: '¥450万', rate: '1/2〜4/5', status: 1, priority: '高', deadline: '2026-05-12' },
    { id: 'monodukuri', name: 'ものづくり補助金 第23次', category: '国', max_amount: '¥4,000万', rate: '1/2〜2/3', status: 1, priority: '高', deadline: '2026-06-30' },
    { id: 'osaka-dx',   name: '大阪産業局 DX支援補助金', category: '大阪府', max_amount: '¥300万', rate: '2/3', status: 0, priority: '中', deadline: '2026-08-31' },
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

  const loadAll = useCallback(async () => {
    setLoading(true)
    const [{ data: subs }, { data: allTasks }, { data: allNotes }, { data: allFiles }] = await Promise.all([
      supabase.from('subsidies').select('*').order('created_at'),
      supabase.from('tasks').select('*').order('created_at'),
      supabase.from('notes').select('*').order('created_at', { ascending: false }),
      supabase.from('files').select('*').order('created_at', { ascending: false }),
    ])
    if (subs && subs.length > 0) {
      setSubsidies(subs)
    } else if (subs && subs.length === 0) {
      // テーブルは存在するがデータが空 → 初期データを自動投入
      await supabase.from('subsidies').upsert(DEFAULT_SUBSIDIES)
      await supabase.from('tasks').upsert(DEFAULT_TASKS)
      const { data: freshSubs } = await supabase.from('subsidies').select('*').order('created_at')
      const { data: freshTasks } = await supabase.from('tasks').select('*').order('created_at')
      if (freshSubs) setSubsidies(freshSubs)
      if (freshTasks) {
        const grouped: Record<string, Task[]> = {}
        for (const t of freshTasks) {
          if (!grouped[t.subsidy_id]) grouped[t.subsidy_id] = []
          grouped[t.subsidy_id].push(t)
        }
        setTasks(grouped)
      }
      setLoading(false)
      setSyncStatus('ok')
      return
    }
    if (allTasks) {
      const grouped: Record<string, Task[]> = {}
      for (const t of allTasks) {
        if (!grouped[t.subsidy_id]) grouped[t.subsidy_id] = []
        grouped[t.subsidy_id].push(t)
      }
      setTasks(grouped)
    }
    if (allNotes) {
      const grouped: Record<string, Note[]> = {}
      for (const n of allNotes) {
        if (!grouped[n.subsidy_id]) grouped[n.subsidy_id] = []
        grouped[n.subsidy_id].push(n)
      }
      setNotes(grouped)
    }
    if (allFiles) {
      const grouped: Record<string, FileRecord[]> = {}
      for (const f of allFiles) {
        if (!grouped[f.subsidy_id]) grouped[f.subsidy_id] = []
        grouped[f.subsidy_id].push(f)
      }
      setFiles(grouped)
    }
    setLoading(false)
    setSyncStatus('ok')
  }, [])

  useEffect(() => {
    loadAll()
    const channel = supabase
      .channel('crm-realtime')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'subsidies' }, loadAll)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'tasks' }, loadAll)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'notes' }, loadAll)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'files' }, loadAll)
      .subscribe()
    return () => { supabase.removeChannel(channel) }
  }, [loadAll])

  const toggleTask = async (t: Task) => {
    await supabase.from('tasks').update({ done: !t.done }).eq('id', t.id)
    showSync()
    loadAll()
  }

  const updateStatus = async (sid: string, status: number, memo: string) => {
    await supabase.from('subsidies').update({ status }).eq('id', sid)
    if (memo.trim()) {
      await supabase.from('notes').insert({
        id: crypto.randomUUID(), subsidy_id: sid,
        text: `【ステータス更新】${STATUS_LABELS[status]} ／ ${memo}`, author: '担当者'
      })
    }
    showSync()
    loadAll()
  }

  const addTask = async (sid: string, text: string, date: string) => {
    if (!text.trim()) return
    await supabase.from('tasks').insert({ id: crypto.randomUUID(), subsidy_id: sid, text, done: false, date })
    showSync()
    loadAll()
  }

  const addNote = async (sid: string) => {
    const text = noteInputs[sid]?.trim()
    if (!text) return
    await supabase.from('notes').insert({ id: crypto.randomUUID(), subsidy_id: sid, text, author: '担当者' })
    setNoteInputs(p => ({ ...p, [sid]: '' }))
    showSync()
    loadAll()
  }

  const addFile = async (sid: string, name: string, type: string) => {
    if (!name.trim()) return
    await supabase.from('files').insert({ id: crypto.randomUUID(), subsidy_id: sid, name, type })
    showSync()
    loadAll()
  }

  const getAllDeadlines = () => {
    const items: { text: string; date: string; subsidy: string; done?: boolean }[] = []
    subsidies.forEach(s => {
      items.push({ text: `申請締切：${s.name.slice(0, 15)}`, date: s.deadline, subsidy: s.name.slice(0, 18) })
      const sTasks = tasks[s.id] || []
      sTasks.filter(t => !t.done).forEach(t =>
        items.push({ text: t.text, date: t.date, subsidy: s.name.slice(0, 18) })
      )
    })
    return items.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
  }

  const daysDiff = (dateStr: string) => {
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    return Math.ceil((new Date(dateStr).getTime() - today.getTime()) / 86400000)
  }

  const totalTasks = Object.values(tasks).flat().length
  const doneTasks = Object.values(tasks).flat().filter(t => t.done).length
  const pct = totalTasks ? Math.round(doneTasks / totalTasks * 100) : 0
  const activeCount = subsidies.filter(s => s.status > 0 && s.status < 5).length
  const doneCount = subsidies.filter(s => s.status === 5).length

  const selected = selectedId ? subsidies.find(s => s.id === selectedId) : null

  if (loading) return (
    <div style={{ background: '#0a0a0f', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ color: '#c9a84c', fontSize: 14 }}>データベースに接続中...</div>
    </div>
  )

  return (
    <div style={{ background: '#0a0a0f', minHeight: '100vh', fontFamily: 'sans-serif' }}>

      {/* Header */}
      <div style={{ background: '#0a0a0f', padding: '12px 24px', borderBottom: '1px solid rgba(201,168,76,0.25)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ width: 34, height: 34, borderRadius: '50%', background: 'linear-gradient(135deg,#c9a84c,#a07830)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 15, color: '#0a0a0f', fontWeight: 700 }}>桃</div>
          <div>
            <div style={{ fontSize: 14, color: '#e8c86e', fontWeight: 500 }}>桃山社中 補助金進捗管理システム</div>
            <div style={{ fontSize: 11, color: 'rgba(245,240,232,0.4)', letterSpacing: '0.08em' }}>DX推進ポータル 2026 — リアルタイム共有</div>
          </div>
        </div>
        <div style={{ background: 'rgba(95,184,150,0.12)', border: '1px solid rgba(95,184,150,0.35)', color: '#5fb896', fontSize: 11, padding: '4px 12px', borderRadius: 20, display: 'flex', alignItems: 'center', gap: 6 }}>
          <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#5fb896', animation: 'pulse 2s infinite' }} />
          {syncStatus === 'ok' ? 'DB同期完了 ✓' : 'Supabase 接続中'}
        </div>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: 4, padding: '0 24px', background: '#0a0a0f', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
        {(['overview', 'subsidies', 'timeline', 'docs'] as Tab[]).map((t, i) => (
          <div key={t} onClick={() => setTab(t)} style={{ padding: '10px 18px', fontSize: 13, color: tab === t ? '#e8c86e' : 'rgba(245,240,232,0.5)', borderBottom: tab === t ? '2px solid #c9a84c' : '2px solid transparent', cursor: 'pointer' }}>
            {['ダッシュボード', '補助金管理', 'スケジュール', '書類管理'][i]}
          </div>
        ))}
      </div>

      {/* Main */}
      <div style={{ padding: 24, background: '#0c0c14', minHeight: 'calc(100vh - 130px)' }}>

        {/* OVERVIEW */}
        {tab === 'overview' && (
          <>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 14, marginBottom: 24 }}>
              {[
                { label: '補助金総数', val: `${subsidies.length}件`, sub: '活用可能' },
                { label: '進行中', val: `${activeCount}件`, sub: '申請・実施中', color: '#c9a84c' },
                { label: 'タスク進捗', val: `${pct}%`, sub: `${doneTasks}/${totalTasks} 完了`, color: '#5fb896' },
                { label: '完了', val: `${doneCount}件`, sub: '補助金受給済' },
              ].map(k => (
                <div key={k.label} style={{ background: 'rgba(26,31,58,0.6)', border: '1px solid rgba(201,168,76,0.12)', borderRadius: 10, padding: '14px 16px' }}>
                  <div style={{ fontSize: 11, color: 'rgba(245,240,232,0.45)', marginBottom: 6 }}>{k.label}</div>
                  <div style={{ fontSize: 22, fontWeight: 500, color: k.color || '#f5f0e8' }}>{k.val}</div>
                  <div style={{ fontSize: 11, color: 'rgba(245,240,232,0.35)', marginTop: 3 }}>{k.sub}</div>
                </div>
              ))}
            </div>

            <div style={{ fontSize: 12, color: '#c9a84c', fontWeight: 500, marginBottom: 12, letterSpacing: '0.06em', textTransform: 'uppercase' }}>補助金ステータス</div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginBottom: 24 }}>
              {subsidies.map(s => (
                <SubsidyCard key={s.id} s={s} tasks={tasks[s.id] || []} onClick={() => { setSelectedId(s.id); setTab('subsidies') }} />
              ))}
            </div>

            <div style={{ fontSize: 12, color: '#c9a84c', fontWeight: 500, marginBottom: 12, letterSpacing: '0.06em', textTransform: 'uppercase' }}>直近の締め切り</div>
            <div style={{ background: 'rgba(26,31,58,0.4)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 10, padding: '12px 16px' }}>
              {getAllDeadlines().slice(0, 6).map((d, i) => {
                const diff = daysDiff(d.date)
                const color = diff < 0 ? '#f08080' : diff < 14 ? '#f08080' : diff < 30 ? '#c9a84c' : '#5fb896'
                return (
                  <div key={i} style={{ display: 'flex', gap: 14, padding: '8px 0', borderBottom: i < 5 ? '1px solid rgba(255,255,255,0.04)' : 'none', alignItems: 'flex-start' }}>
                    <div style={{ width: 8, height: 8, borderRadius: '50%', background: color, marginTop: 4, flexShrink: 0 }} />
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 12, color: '#f5f0e8' }}>{d.text}</div>
                      <div style={{ fontSize: 11, color: 'rgba(245,240,232,0.4)', marginTop: 2 }}>{d.subsidy}　／　{d.date}</div>
                    </div>
                    <div style={{ fontSize: 11, fontWeight: 500, color, flexShrink: 0 }}>
                      {diff < 0 ? '期限切れ' : diff === 0 ? '本日' : `${diff}日後`}
                    </div>
                  </div>
                )
              })}
            </div>
          </>
        )}

        {/* SUBSIDIES */}
        {tab === 'subsidies' && (
          <>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginBottom: 20 }}>
              {subsidies.map(s => (
                <SubsidyCard key={s.id} s={s} tasks={tasks[s.id] || []} selected={selectedId === s.id} onClick={() => setSelectedId(selectedId === s.id ? null : s.id)} />
              ))}
            </div>

            {selected && (
              <div style={{ background: 'rgba(26,31,58,0.5)', border: '1px solid rgba(201,168,76,0.2)', borderRadius: 10, padding: '16px 20px' }}>
                <div style={{ display: 'flex', alignItems: 'center', marginBottom: 16, gap: 8 }}>
                  <span style={{ color: '#c9a84c' }}>◆</span>
                  <span style={{ fontSize: 14, color: '#e8c86e', fontWeight: 500, flex: 1 }}>{selected.name}</span>
                  <button onClick={() => { setModalStatusVal(selected.status); setModalMemo(''); setModal({ type: 'status', sid: selected.id }) }}
                    style={{ background: 'rgba(201,168,76,0.2)', border: '1px solid rgba(201,168,76,0.4)', color: '#e8c86e', fontSize: 12, padding: '6px 14px', borderRadius: 8, cursor: 'pointer' }}>
                    ステータス変更
                  </button>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
                  <div style={{ fontSize: 12, color: '#c9a84c', fontWeight: 500, letterSpacing: '0.05em' }}>タスク</div>
                  <button onClick={() => { setModalTaskText(''); setModalTaskDate('2026-05-01'); setModal({ type: 'task', sid: selected.id }) }}
                    style={{ background: 'rgba(201,168,76,0.15)', border: '1px solid rgba(201,168,76,0.3)', color: '#c9a84c', fontSize: 12, padding: '5px 12px', borderRadius: 8, cursor: 'pointer' }}>
                    ＋ タスク追加
                  </button>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginBottom: 20 }}>
                  {(tasks[selected.id] || []).map(t => (
                    <div key={t.id} onClick={() => toggleTask(t)}
                      style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 12px', background: 'rgba(0,0,0,0.2)', borderRadius: 8, cursor: 'pointer', border: '1px solid transparent' }}>
                      <div style={{ width: 16, height: 16, borderRadius: 4, border: `1.5px solid ${t.done ? '#5fb896' : 'rgba(201,168,76,0.4)'}`, background: t.done ? '#5fb896' : 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                        {t.done && <svg width="10" height="10" viewBox="0 0 12 12"><path d="M2 6l3 3 5-5" stroke="#0a0a0f" strokeWidth="2" fill="none" strokeLinecap="round" /></svg>}
                      </div>
                      <span style={{ fontSize: 12, color: t.done ? 'rgba(245,240,232,0.4)' : 'rgba(245,240,232,0.85)', textDecoration: t.done ? 'line-through' : 'none', flex: 1 }}>{t.text}</span>
                      <span style={{ fontSize: 11, color: 'rgba(245,240,232,0.3)' }}>{t.date}</span>
                    </div>
                  ))}
                  {(tasks[selected.id] || []).length === 0 && (
                    <div style={{ fontSize: 12, color: 'rgba(245,240,232,0.3)', padding: '8px 12px' }}>タスクなし。追加してください。</div>
                  )}
                </div>

                <div style={{ borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: 14 }}>
                  <div style={{ fontSize: 12, color: '#c9a84c', fontWeight: 500, marginBottom: 10 }}>コメント・メモ（クライアント共有）</div>
                  <div style={{ display: 'flex', gap: 8, marginBottom: 10 }}>
                    <input value={noteInputs[selected.id] || ''} onChange={e => setNoteInputs(p => ({ ...p, [selected.id]: e.target.value }))}
                      onKeyDown={e => e.key === 'Enter' && addNote(selected.id)}
                      placeholder="進捗メモ・クライアントへの連絡事項..."
                      style={{ flex: 1, background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(201,168,76,0.2)', borderRadius: 8, padding: '8px 12px', fontSize: 12, color: '#f5f0e8', outline: 'none', fontFamily: 'sans-serif' }} />
                    <button onClick={() => addNote(selected.id)}
                      style={{ background: 'rgba(201,168,76,0.2)', border: '1px solid rgba(201,168,76,0.4)', color: '#e8c86e', fontSize: 12, padding: '7px 14px', borderRadius: 8, cursor: 'pointer' }}>
                      追加
                    </button>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                    {(notes[selected.id] || []).map(n => (
                      <div key={n.id} style={{ background: 'rgba(0,0,0,0.2)', borderRadius: 8, padding: '8px 12px', borderLeft: '3px solid rgba(201,168,76,0.4)' }}>
                        <div style={{ fontSize: 12, color: 'rgba(245,240,232,0.8)', lineHeight: 1.5 }}>{n.text}</div>
                        <div style={{ fontSize: 10, color: 'rgba(245,240,232,0.3)', marginTop: 3 }}>
                          {n.author}　—　{n.created_at ? new Date(n.created_at).toLocaleString('ja-JP', { month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' }) : ''}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
            {!selected && <div style={{ textAlign: 'center', color: 'rgba(245,240,232,0.3)', fontSize: 13, padding: 24 }}>カードをクリックして詳細を表示</div>}
          </>
        )}

        {/* TIMELINE */}
        {tab === 'timeline' && (
          <>
            <div style={{ fontSize: 12, color: '#c9a84c', fontWeight: 500, marginBottom: 14, letterSpacing: '0.06em', textTransform: 'uppercase' }}>全スケジュール</div>
            <div style={{ background: 'rgba(26,31,58,0.4)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 10, padding: '12px 16px' }}>
              {getAllDeadlines().map((d, i, arr) => {
                const diff = daysDiff(d.date)
                const color = diff < 0 ? 'rgba(240,128,128,0.5)' : diff < 14 ? '#f08080' : diff < 30 ? '#c9a84c' : '#5fb896'
                return (
                  <div key={i} style={{ display: 'flex', gap: 14, padding: '9px 0', borderBottom: i < arr.length - 1 ? '1px solid rgba(255,255,255,0.04)' : 'none', alignItems: 'flex-start' }}>
                    <div style={{ width: 8, height: 8, borderRadius: '50%', background: color, marginTop: 4, flexShrink: 0 }} />
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 13, color: diff < 0 ? 'rgba(245,240,232,0.4)' : '#f5f0e8' }}>{d.text}</div>
                      <div style={{ fontSize: 11, color: 'rgba(245,240,232,0.4)', marginTop: 2 }}>{d.subsidy}　／　{d.date}</div>
                    </div>
                    <div style={{ fontSize: 12, fontWeight: 500, color, flexShrink: 0 }}>
                      {diff < 0 ? '期限切れ' : diff === 0 ? '本日' : `${diff}日後`}
                    </div>
                  </div>
                )
              })}
            </div>
          </>
        )}

        {/* DOCS */}
        {tab === 'docs' && (
          <>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <div style={{ fontSize: 12, color: '#c9a84c', fontWeight: 500, letterSpacing: '0.06em', textTransform: 'uppercase' }}>書類・ファイル管理</div>
              <button onClick={() => { setModalFileSid(subsidies[0]?.id || ''); setModalFileName(''); setModalFileType('申請書類'); setModal({ type: 'file' }) }}
                style={{ background: 'rgba(201,168,76,0.15)', border: '1px solid rgba(201,168,76,0.3)', color: '#c9a84c', fontSize: 12, padding: '6px 14px', borderRadius: 8, cursor: 'pointer' }}>
                ＋ ファイル登録
              </button>
            </div>
            {subsidies.map(s => (
              <div key={s.id} style={{ marginBottom: 20 }}>
                <div style={{ fontSize: 12, color: '#c9a84c', marginBottom: 8, display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span style={{ background: STATUS_PILL_BG[s.status], color: STATUS_PILL_COLOR[s.status], fontSize: 10, padding: '2px 8px', borderRadius: 20 }}>{STATUS_LABELS[s.status]}</span>
                  {s.name}
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                  {(files[s.id] || []).length === 0
                    ? <div style={{ fontSize: 12, color: 'rgba(245,240,232,0.3)', padding: '6px 12px' }}>書類未登録</div>
                    : (files[s.id] || []).map(f => (
                      <div key={f.id} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '7px 12px', background: 'rgba(0,0,0,0.2)', borderRadius: 8 }}>
                        <span style={{ fontSize: 14 }}>📄</span>
                        <span style={{ fontSize: 13, color: 'rgba(245,240,232,0.8)', flex: 1 }}>{f.name}</span>
                        <span style={{ fontSize: 11, color: 'rgba(245,240,232,0.35)' }}>{f.type}　／　{f.created_at ? new Date(f.created_at).toLocaleDateString('ja-JP') : ''}</span>
                      </div>
                    ))}
                </div>
              </div>
            ))}
          </>
        )}
      </div>

      {/* Modal */}
      {modal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.65)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 200 }}>
          <div style={{ background: '#12121a', border: '1px solid rgba(201,168,76,0.3)', borderRadius: 12, padding: 22, width: 400, maxWidth: '95vw' }}>
            {modal.type === 'status' && (
              <>
                <div style={{ fontSize: 15, color: '#e8c86e', fontWeight: 500, marginBottom: 16 }}>ステータス更新</div>
                <label style={{ fontSize: 11, color: 'rgba(245,240,232,0.5)', marginBottom: 5, display: 'block' }}>ステータス</label>
                <select value={modalStatusVal} onChange={e => setModalStatusVal(Number(e.target.value))}
                  style={{ width: '100%', background: 'rgba(0,0,0,0.4)', border: '1px solid rgba(201,168,76,0.2)', borderRadius: 8, padding: '8px 12px', fontSize: 13, color: '#f5f0e8', marginBottom: 12, outline: 'none', fontFamily: 'sans-serif' }}>
                  {STATUS_LABELS.map((l, i) => <option key={i} value={i} style={{ background: '#12121a' }}>{l}</option>)}
                </select>
                <label style={{ fontSize: 11, color: 'rgba(245,240,232,0.5)', marginBottom: 5, display: 'block' }}>メモ（任意）</label>
                <input value={modalMemo} onChange={e => setModalMemo(e.target.value)} placeholder="変更理由・連絡事項"
                  style={{ width: '100%', background: 'rgba(0,0,0,0.4)', border: '1px solid rgba(201,168,76,0.2)', borderRadius: 8, padding: '8px 12px', fontSize: 13, color: '#f5f0e8', marginBottom: 16, outline: 'none', fontFamily: 'sans-serif', boxSizing: 'border-box' }} />
                <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
                  <button onClick={() => setModal(null)} style={{ background: 'transparent', border: '1px solid rgba(255,255,255,0.15)', color: 'rgba(245,240,232,0.6)', fontSize: 13, padding: '8px 16px', borderRadius: 8, cursor: 'pointer' }}>キャンセル</button>
                  <button onClick={() => { updateStatus(modal.sid!, modalStatusVal, modalMemo); setModal(null) }}
                    style={{ background: 'rgba(201,168,76,0.3)', border: '1px solid rgba(201,168,76,0.5)', color: '#e8c86e', fontSize: 13, padding: '8px 16px', borderRadius: 8, cursor: 'pointer' }}>保存</button>
                </div>
              </>
            )}
            {modal.type === 'task' && (
              <>
                <div style={{ fontSize: 15, color: '#e8c86e', fontWeight: 500, marginBottom: 16 }}>タスク追加</div>
                <label style={{ fontSize: 11, color: 'rgba(245,240,232,0.5)', marginBottom: 5, display: 'block' }}>タスク名</label>
                <input value={modalTaskText} onChange={e => setModalTaskText(e.target.value)} placeholder="例: 事業計画書 第2稿作成"
                  style={{ width: '100%', background: 'rgba(0,0,0,0.4)', border: '1px solid rgba(201,168,76,0.2)', borderRadius: 8, padding: '8px 12px', fontSize: 13, color: '#f5f0e8', marginBottom: 12, outline: 'none', fontFamily: 'sans-serif', boxSizing: 'border-box' }} />
                <label style={{ fontSize: 11, color: 'rgba(245,240,232,0.5)', marginBottom: 5, display: 'block' }}>期限日</label>
                <input type="date" value={modalTaskDate} onChange={e => setModalTaskDate(e.target.value)}
                  style={{ width: '100%', background: 'rgba(0,0,0,0.4)', border: '1px solid rgba(201,168,76,0.2)', borderRadius: 8, padding: '8px 12px', fontSize: 13, color: '#f5f0e8', marginBottom: 16, outline: 'none', fontFamily: 'sans-serif', boxSizing: 'border-box' }} />
                <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
                  <button onClick={() => setModal(null)} style={{ background: 'transparent', border: '1px solid rgba(255,255,255,0.15)', color: 'rgba(245,240,232,0.6)', fontSize: 13, padding: '8px 16px', borderRadius: 8, cursor: 'pointer' }}>キャンセル</button>
                  <button onClick={() => { addTask(modal.sid!, modalTaskText, modalTaskDate); setModal(null) }}
                    style={{ background: 'rgba(201,168,76,0.3)', border: '1px solid rgba(201,168,76,0.5)', color: '#e8c86e', fontSize: 13, padding: '8px 16px', borderRadius: 8, cursor: 'pointer' }}>追加</button>
                </div>
              </>
            )}
            {modal.type === 'file' && (
              <>
                <div style={{ fontSize: 15, color: '#e8c86e', fontWeight: 500, marginBottom: 16 }}>書類登録</div>
                <label style={{ fontSize: 11, color: 'rgba(245,240,232,0.5)', marginBottom: 5, display: 'block' }}>補助金</label>
                <select value={modalFileSid} onChange={e => setModalFileSid(e.target.value)}
                  style={{ width: '100%', background: 'rgba(0,0,0,0.4)', border: '1px solid rgba(201,168,76,0.2)', borderRadius: 8, padding: '8px 12px', fontSize: 13, color: '#f5f0e8', marginBottom: 12, outline: 'none', fontFamily: 'sans-serif' }}>
                  {subsidies.map(s => <option key={s.id} value={s.id} style={{ background: '#12121a' }}>{s.name.slice(0, 22)}</option>)}
                </select>
                <label style={{ fontSize: 11, color: 'rgba(245,240,232,0.5)', marginBottom: 5, display: 'block' }}>書類名</label>
                <input value={modalFileName} onChange={e => setModalFileName(e.target.value)} placeholder="例: 事業計画書_v2.pdf"
                  style={{ width: '100%', background: 'rgba(0,0,0,0.4)', border: '1px solid rgba(201,168,76,0.2)', borderRadius: 8, padding: '8px 12px', fontSize: 13, color: '#f5f0e8', marginBottom: 12, outline: 'none', fontFamily: 'sans-serif', boxSizing: 'border-box' }} />
                <label style={{ fontSize: 11, color: 'rgba(245,240,232,0.5)', marginBottom: 5, display: 'block' }}>種別</label>
                <select value={modalFileType} onChange={e => setModalFileType(e.target.value)}
                  style={{ width: '100%', background: 'rgba(0,0,0,0.4)', border: '1px solid rgba(201,168,76,0.2)', borderRadius: 8, padding: '8px 12px', fontSize: 13, color: '#f5f0e8', marginBottom: 16, outline: 'none', fontFamily: 'sans-serif' }}>
                  {['申請書類','見積書','契約書','報告書','その他'].map(t => <option key={t} style={{ background: '#12121a' }}>{t}</option>)}
                </select>
                <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
                  <button onClick={() => setModal(null)} style={{ background: 'transparent', border: '1px solid rgba(255,255,255,0.15)', color: 'rgba(245,240,232,0.6)', fontSize: 13, padding: '8px 16px', borderRadius: 8, cursor: 'pointer' }}>キャンセル</button>
                  <button onClick={() => { addFile(modalFileSid, modalFileName, modalFileType); setModal(null) }}
                    style={{ background: 'rgba(201,168,76,0.3)', border: '1px solid rgba(201,168,76,0.5)', color: '#e8c86e', fontSize: 13, padding: '8px 16px', borderRadius: 8, cursor: 'pointer' }}>登録</button>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      <style>{`
        @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.4} }
        input[type=date]::-webkit-calendar-picker-indicator { filter: invert(0.8); }
        * { box-sizing: border-box; }
      `}</style>
    </div>
  )
}

function SubsidyCard({ s, tasks, selected, onClick }: { s: Subsidy; tasks: Task[]; selected?: boolean; onClick: () => void }) {
  const STATUS_PILL_BG = ['rgba(255,255,255,0.07)','rgba(201,168,76,0.18)','rgba(95,130,255,0.18)','rgba(95,184,150,0.18)','rgba(240,128,128,0.18)','rgba(180,100,220,0.18)']
  const STATUS_PILL_COLOR = ['rgba(245,240,232,0.5)','#e8c86e','#8aadff','#5fb896','#f08080','#d47fff']
  const STATUS_BAR = ['#444','#c9a84c','#8aadff','#5fb896','#d47fff','#5fb896']
  const STATUS_PROGRESS = [0,20,45,60,80,100]
  const STATUS_LABELS = ['未着手','準備中','申請済','採択','実施中','完了']
  return (
    <div onClick={onClick} style={{ background: 'rgba(26,31,58,0.7)', borderRadius: 10, border: `1px solid ${selected ? 'rgba(201,168,76,0.5)' : 'rgba(255,255,255,0.07)'}`, overflow: 'hidden', cursor: 'pointer' }}>
      <div style={{ padding: '14px 16px 10px' }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 8, marginBottom: 8 }}>
          <div style={{ fontSize: 13, color: '#f5f0e8', fontWeight: 500, lineHeight: 1.4 }}>{s.name}</div>
          <div style={{ background: STATUS_PILL_BG[s.status], color: STATUS_PILL_COLOR[s.status], fontSize: 10, padding: '3px 9px', borderRadius: 20, flexShrink: 0, fontWeight: 500 }}>{STATUS_LABELS[s.status]}</div>
        </div>
        <div style={{ height: 4, background: 'rgba(255,255,255,0.08)', borderRadius: 2, margin: '8px 0 4px' }}>
          <div style={{ height: '100%', borderRadius: 2, width: `${STATUS_PROGRESS[s.status]}%`, background: STATUS_BAR[s.status], transition: 'width 0.5s' }} />
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: 'rgba(245,240,232,0.4)' }}>
          <span>{s.max_amount}　補助率 {s.rate}</span>
          <span>期限: {s.deadline}</span>
        </div>
      </div>
      <div style={{ background: 'rgba(0,0,0,0.2)', padding: '7px 14px', display: 'flex', gap: 5, flexWrap: 'wrap' }}>
        {tasks.slice(0, 4).map(t => (
          <span key={t.id} style={{ fontSize: 10, padding: '2px 7px', borderRadius: 4, border: '1px solid rgba(255,255,255,0.08)', color: t.done ? '#5fb896' : 'rgba(245,240,232,0.5)', textDecoration: t.done ? 'line-through' : 'none', borderColor: t.done ? 'rgba(95,184,150,0.3)' : 'rgba(255,255,255,0.08)' }}>
            {t.text.slice(0, 9)}
          </span>
        ))}
      </div>
    </div>
  )
}

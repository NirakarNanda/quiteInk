'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import TypewriterSVG from '../components/TypewriterSVG'
import Paper from '../components/Paper'
import AIResponse from '../components/AIResponse'
import EntriesPanel, { type SavedEntry } from '../components/EntriesPanel'
import TitleModal from '../components/home/TitleModal'
import Candle from '../components/home/Candle'
import Dustbin from '../components/home/Dustbin'
import { createTypewriterSound, FALLBACKS, getDateStamp } from '../utils/audioUtils'

// ─── Rose pink from the Royal typewriter body ─────────────────────────────────
const ROSE       = '#cc9898'
const ROSE_LIGHT = '#ecc0bc'
const ROSE_GLOW  = 'rgba(204,152,152,0.22)'

interface CompletedPage { text: string; pageNumber: number }

export default function Home() {
  const [text, setText] = useState('')
  const [pressedKey, setPressedKey] = useState<string | null>(null)
  const [leverSwing, setLeverSwing] = useState(false)
  const [wobble, setWobble] = useState(false)
  const [isActive, setIsActive] = useState(false)
  const [dateStamp] = useState(getDateStamp)

  const [aiText, setAiText] = useState('')
  const [aiThinking, setAiThinking] = useState(false)
  const [aiVisible, setAiVisible] = useState(false)
  const [isThinking, setIsThinking] = useState(false)
  const [currentAiReply, setCurrentAiReply] = useState('')

  const [showPanel, setShowPanel] = useState(false)
  const [entries, setEntries] = useState<SavedEntry[]>([])
  const [savedFlash, setSavedFlash] = useState(false)

  const [completedPages, setCompletedPages] = useState<CompletedPage[]>([])
  const [currentPage, setCurrentPage] = useState(1)
  const [deletingPageNum, setDeletingPageNum] = useState<number | null>(null)

  const [isSaving, setIsSaving] = useState(false)
  const [saveTitle, setSaveTitle] = useState('')
  const [userName, setUserName] = useState('')

  // hover states for rose buttons
  const [entriesHover, setEntriesHover] = useState(false)
  const [topSaveHover, setTopSaveHover] = useState(false)
  const [actionSaveHover, setActionSaveHover] = useState(false)
  const [newEntryHover, setNewEntryHover] = useState(false)

  const inputRef    = useRef<HTMLTextAreaElement>(null)
  const audioCtxRef = useRef<AudioContext | null>(null)
  const timerRef    = useRef<ReturnType<typeof setTimeout> | null>(null)
  const lineCharsRef = useRef(0)

  // load entries
  const loadEntries = useCallback(async () => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/journals`)
      if (res.ok) setEntries(await res.json())
    } catch {}
  }, [])
  useEffect(() => {
    loadEntries()
    try {
      const stored = localStorage.getItem('userInfo')
      if (stored) {
        const u = JSON.parse(stored)
        if (u && u.firstName) setUserName(u.firstName)
      }
    } catch {}
  }, [loadEntries])

  // audio
  const getCtx = useCallback(() => {
    if (!audioCtxRef.current)
      audioCtxRef.current = new (window.AudioContext || (window as any).webkitAudioContext)()
    return audioCtxRef.current
  }, [])
  const play = useCallback((t: 'key'|'return'|'ding') => {
    try { createTypewriterSound(getCtx(), t) } catch {}
  }, [getCtx])

  const activate = useCallback(() => { setIsActive(true); inputRef.current?.focus() }, [])
  const flashKey  = useCallback((k: string, ms = 130) => { setPressedKey(k); setTimeout(() => setPressedKey(null), ms) }, [])
  const doWobble  = useCallback(() => { setWobble(true); setTimeout(() => setWobble(false), 300) }, [])

  const triggerAI = useCallback(async (full: string) => {
    if (isThinking) return
    setIsThinking(true); setAiVisible(true); setAiThinking(true); setAiText('')
    let reply = ''
    try {
      const r = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: 'claude-sonnet-4-20250514', max_tokens: 1000,
          system: `You are QuietInk — a gentle, thoughtful journaling companion.
The user has typed private thoughts into a vintage Royal typewriter at night.
Respond with 2-4 warm, empathetic sentences like a wise friend sitting nearby.
Never give unsolicited advice. Reflect emotions with warmth and care.
Use poetic but clear language. Never start with "I" or the user's name.
Feel like a whisper, not a lecture.`,
          messages: [{ role: 'user', content: `They wrote: "${full.trim()}"` }],
        }),
      })
      const d = await r.json()
      reply = d.content?.[0]?.text || FALLBACKS[Math.floor(Math.random() * FALLBACKS.length)]
    } catch {
      reply = FALLBACKS[Math.floor(Math.random() * FALLBACKS.length)]
    }
    setCurrentAiReply(reply); setAiThinking(false)
    let i = 0
    const iv = setInterval(() => {
      if (i < reply.length) { setAiText(reply.slice(0, ++i)) }
      else { clearInterval(iv); setIsThinking(false) }
    }, 24)
  }, [isThinking])

  const handleKeyDown = useCallback((e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    const ctx = getCtx()
    if (ctx.state === 'suspended') ctx.resume()
    if (e.key === 'Enter') {
      play('return'); setLeverSwing(true); setTimeout(() => setLeverSwing(false), 450); flashKey('Enter', 200)
      if (lineCharsRef.current > 50) { setTimeout(() => play('ding'), 80); lineCharsRef.current = 0 }
    } else if (e.key === 'Backspace') {
      play('key'); flashKey('Backspace'); doWobble()
      lineCharsRef.current = Math.max(0, lineCharsRef.current - 1)
    } else if (e.key === 'Shift' || e.key === 'Control' || e.key === 'Alt') {
      flashKey(e.key)
    } else if (e.key === ' ') {
      play('key'); flashKey(' '); doWobble(); lineCharsRef.current++
      if (lineCharsRef.current === 58) setTimeout(() => play('ding'), 0)
    } else if (e.key.length === 1) {
      play('key'); flashKey(e.key.toUpperCase()); doWobble(); lineCharsRef.current++
      if (lineCharsRef.current === 58) setTimeout(() => play('ding'), 0)
    }
  }, [play, flashKey, doWobble, getCtx])

  const handleChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const v = e.target.value; setText(v)
    if (timerRef.current) clearTimeout(timerRef.current)
    if (v.trim().length >= 20) timerRef.current = setTimeout(() => triggerAI(v), 3200)
  }, [triggerAI])

  const initiateSave = useCallback(() => {
    if (!text.trim() && completedPages.length === 0) return
    setIsSaving(true)
  }, [text, completedPages])

  const finalizeSave = useCallback(async () => {
    if (!saveTitle.trim()) return
    const pages = [...completedPages, { text: text.trim(), pageNumber: currentPage }]
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/journals`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: saveTitle.trim(), pages, aiReply: currentAiReply || undefined }),
      })
      if (res.ok) {
        setSavedFlash(true); setSaveTitle(''); setIsSaving(false); loadEntries()
        setTimeout(() => setSavedFlash(false), 2000)
      }
    } catch {}
  }, [saveTitle, text, completedPages, currentPage, currentAiReply, loadEntries])

  const deleteEntry = useCallback(async (id: string) => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/journals/${id}`, { method: 'DELETE' })
      if (res.ok) setEntries(p => p.filter(e => e._id !== id))
    } catch {}
  }, [])

  const loadEntry = useCallback((entry: SavedEntry) => {
    const [first, ...rest] = entry.pages
    setText(first?.text || '')
    setCompletedPages(rest.map(p => ({ text: p.text, pageNumber: p.pageNumber })))
    setCurrentPage(entry.pages.length)
    setCurrentAiReply(entry.aiReply || '')
    if (entry.aiReply) { setAiText(entry.aiReply); setAiVisible(true); setAiThinking(false) }
    setShowPanel(false); setIsActive(true); inputRef.current?.focus()
  }, [])

  const newEntry = useCallback(() => {
    setText(''); setAiText(''); setAiVisible(false); setAiThinking(false)
    setCurrentAiReply(''); setIsThinking(false); setCompletedPages([]); setCurrentPage(1)
    lineCharsRef.current = 0
    if (timerRef.current) clearTimeout(timerRef.current)
    inputRef.current?.focus()
  }, [])

  const handlePageFull = useCallback(() => {
    if (!text.trim()) return
    setCompletedPages(p => [...p, { text, pageNumber: currentPage }])
    setCurrentPage(p => p + 1); setText(''); lineCharsRef.current = 0; inputRef.current?.focus()
  }, [text, currentPage])

  const deleteCompletedPage = useCallback((num: number) => {
    setDeletingPageNum(num)
    setTimeout(() => { setCompletedPages(p => p.filter(x => x.pageNumber !== num)); setDeletingPageNum(null) }, 500)
  }, [])

  const showActions = text.length > 0 || aiVisible

  // ── shared button style helpers ──
  const roseBtn = (hovered: boolean): React.CSSProperties => ({
    background:    hovered ? 'rgba(204,152,152,0.12)' : 'rgba(204,152,152,0.06)',
    border:        `1px solid ${hovered ? ROSE : 'rgba(204,152,152,0.4)'}`,
    borderRadius:  '20px', padding: '7px 18px', cursor: 'pointer',
    fontFamily:    '"Special Elite", cursive', fontSize: '0.68rem',
    letterSpacing: '0.14em', color: hovered ? ROSE_LIGHT : ROSE,
    textTransform: 'uppercase' as const, transition: 'all 0.25s ease',
    display: 'flex', alignItems: 'center', gap: '7px',
    boxShadow: hovered ? `0 0 0 2px ${ROSE_GLOW}` : 'none',
  })

  const flashStyle: React.CSSProperties = {
    background: 'rgba(120,180,100,0.14)', border: '1px solid rgba(120,180,100,0.45)',
    borderRadius: '20px', padding: '7px 18px', cursor: 'default',
    fontFamily: '"Special Elite", cursive', fontSize: '0.68rem',
    letterSpacing: '0.14em', color: '#78c850', textTransform: 'uppercase',
    display: 'flex', alignItems: 'center', gap: '7px',
  }

  return (
    <main
      style={{
        minHeight: '100vh',
        background: `
          radial-gradient(ellipse 80% 50% at 50% -5%, rgba(26,60,90,0.35) 0%, transparent 70%),
          radial-gradient(ellipse 60% 80% at 20% 100%, rgba(40,20,10,0.8) 0%, transparent 60%),
          #1c1410
        `,
        paddingBottom: '120px', position: 'relative', overflow: 'hidden',
      }}
      onClick={() => !isActive && activate()}
    >
      {/* Vignette */}
      <div style={{
        position: 'fixed', inset: 0,
        background: 'radial-gradient(ellipse at center, transparent 30%, rgba(8,4,2,0.72) 100%)',
        pointerEvents: 'none', zIndex: 0,
      }} />

      {/* ─── TOP BAR ─────────────────────────────────────────────────────────── */}
      <div style={{
        position: 'relative', zIndex: 10,
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        padding: '20px 28px 0',
      }}>
        {/* Saved entries */}
        <button
          onClick={e => { e.stopPropagation(); setShowPanel(true) }}
          onMouseEnter={() => setEntriesHover(true)}
          onMouseLeave={() => setEntriesHover(false)}
          style={roseBtn(entriesHover)}
        >
          <span style={{ fontSize: '0.95rem', lineHeight: 1 }}>📋</span>
          <span>Saved ({entries.length})</span>
        </button>

        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          {/* Save entry */}
          <button
            onClick={e => { e.stopPropagation(); initiateSave() }}
            onMouseEnter={() => setTopSaveHover(true)}
            onMouseLeave={() => setTopSaveHover(false)}
            style={savedFlash ? flashStyle : roseBtn(topSaveHover)}
          >
            <span style={{ fontSize: '0.95rem', lineHeight: 1 }}>{savedFlash ? '✓' : '💾'}</span>
            <span>{savedFlash ? 'Saved!' : 'Save Entry'}</span>
          </button>

          {/* Profile → login */}
          <a
            href="/login"
            onClick={e => e.stopPropagation()}
            style={{
              background: 'rgba(204,152,152,0.06)', border: '1px solid rgba(204,152,152,0.4)',
              borderRadius: '50%', width: '36px', height: '36px',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              cursor: 'pointer', fontSize: '1.05rem', color: ROSE,
              transition: 'all 0.25s ease', textDecoration: 'none', flexShrink: 0,
            }}
            onMouseOver={e => {
              const el = e.currentTarget as HTMLAnchorElement
              el.style.color = ROSE_LIGHT; el.style.borderColor = ROSE
              el.style.boxShadow = `0 0 0 2px ${ROSE_GLOW}`; el.style.transform = 'scale(1.08)'
            }}
            onMouseOut={e => {
              const el = e.currentTarget as HTMLAnchorElement
              el.style.color = ROSE; el.style.borderColor = 'rgba(204,152,152,0.4)'
              el.style.boxShadow = 'none'; el.style.transform = 'scale(1)'
            }}
          >
            👤
          </a>
        </div>
      </div>

      {/* ─── HEADER ──────────────────────────────────────────────────────────── */}
      <div style={{
        textAlign: 'center', padding: '28px 0 20px',
        position: 'relative', zIndex: 10,
        opacity: isActive ? 0.35 : 1, transition: 'opacity 0.8s ease',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 14, marginBottom: 8 }}>
          <div style={{ width: 44, height: 1, background: 'linear-gradient(90deg,transparent,rgba(184,150,90,0.3))' }} />
          <span style={{ fontFamily: '"Special Elite",cursive', fontSize: '0.62rem', letterSpacing: '0.3em', color: 'rgba(184,150,90,0.32)', textTransform: 'uppercase' }}>est. tonight</span>
          <div style={{ width: 44, height: 1, background: 'linear-gradient(270deg,transparent,rgba(184,150,90,0.3))' }} />
        </div>
        <h1 style={{ fontFamily: '"Special Elite",cursive', fontSize: 'clamp(2.4rem,6vw,3.8rem)', color: '#e8dfc8', letterSpacing: '0.15em', textShadow: '0 2px 30px rgba(74,143,168,0.2),0 0 60px rgba(26,60,90,0.5)' }}>
          QuietInk
        </h1>
        <p style={{ fontStyle: 'italic', fontSize: '0.82rem', color: 'rgba(232,223,200,0.26)', letterSpacing: '0.18em', marginTop: 5, fontFamily: '"Lora",Georgia,serif' }}>
          write. breathe. be heard.
        </p>
      </div>

      {/* ─── MAIN COLUMN ─────────────────────────────────────────────────────── */}
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', position: 'relative', zIndex: 10, padding: '0 16px' }}>

        {/* Paper */}
        <div style={{ width: '100%', maxWidth: '700px', marginBottom: '4px' }}>
          <Paper text={text} visible={isActive || text.length > 0} wobble={wobble} dateStamp={dateStamp} pageNumber={currentPage} onPageFull={handlePageFull} />
        </div>

        {/* Typewriter */}
        <div style={{ width: '100%', maxWidth: '700px', cursor: isActive ? 'text' : 'pointer', position: 'relative' }} onClick={activate}>
          {!isActive && (
            <div style={{ position: 'absolute', bottom: '20%', left: '50%', transform: 'translateX(-50%)', fontStyle: 'italic', fontSize: '0.8rem', color: 'rgba(240,225,190,0.28)', pointerEvents: 'none', whiteSpace: 'nowrap', zIndex: 5 }}>
              click to begin writing
            </div>
          )}
          <TypewriterSVG pressedKey={pressedKey} leverSwing={leverSwing} userName={userName} />
        </div>

        {/* Hidden textarea */}
        <textarea
          ref={inputRef} value={text} onChange={handleChange} onKeyDown={handleKeyDown}
          style={{ position: 'fixed', top: '-9999px', left: '-9999px', width: '1px', height: '1px', opacity: 0, resize: 'none', border: 'none', outline: 'none', fontSize: '16px' }}
          autoComplete="off" spellCheck={false} aria-hidden="true"
        />

        {isActive && (
          <p style={{ fontStyle: 'italic', fontSize: '0.75rem', color: 'rgba(240,232,200,0.2)', letterSpacing: '0.08em', textAlign: 'center', marginTop: '18px' }}>
            type your thoughts — the page is listening
          </p>
        )}

        {/* AI */}
        <AIResponse text={aiText} thinking={aiThinking} visible={aiVisible} />

        {/* ─── ACTION BUTTONS ──────────────────────────────────────────────── */}
        {showActions && (
          <div style={{ display: 'flex', gap: '12px', marginTop: '28px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <button
              onClick={e => { e.stopPropagation(); initiateSave() }}
              onMouseEnter={() => setActionSaveHover(true)}
              onMouseLeave={() => setActionSaveHover(false)}
              style={savedFlash ? {
                background: 'rgba(100,180,80,0.12)', border: '1px solid rgba(100,180,80,0.4)',
                borderRadius: '24px', padding: '9px 24px', cursor: 'default',
                fontFamily: '"Special Elite",cursive', fontSize: '0.72rem', letterSpacing: '0.16em',
                color: '#78c850', textTransform: 'uppercase',
              } : {
                background: actionSaveHover ? 'rgba(204,152,152,0.12)' : 'rgba(204,152,152,0.06)',
                border: `1px solid ${actionSaveHover ? ROSE : 'rgba(204,152,152,0.4)'}`,
                borderRadius: '24px', padding: '9px 24px', cursor: 'pointer',
                fontFamily: '"Special Elite",cursive', fontSize: '0.72rem', letterSpacing: '0.16em',
                color: actionSaveHover ? ROSE_LIGHT : ROSE, textTransform: 'uppercase',
                transition: 'all 0.25s ease',
                boxShadow: actionSaveHover ? `0 0 0 2px ${ROSE_GLOW}` : 'none',
              }}
            >
              {savedFlash ? '✓  Saved!' : '💾  Save Entry'}
            </button>

            <button
              onClick={e => { e.stopPropagation(); newEntry() }}
              onMouseEnter={() => setNewEntryHover(true)}
              onMouseLeave={() => setNewEntryHover(false)}
              style={{
                background: 'none',
                border: `1px solid ${newEntryHover ? 'rgba(204,152,152,0.3)' : 'rgba(204,152,152,0.15)'}`,
                borderRadius: '24px', padding: '9px 24px', cursor: 'pointer',
                fontFamily: '"Special Elite",cursive', fontSize: '0.72rem', letterSpacing: '0.16em',
                color: newEntryHover ? ROSE : 'rgba(204,152,152,0.5)', textTransform: 'uppercase',
                transition: 'all 0.25s ease',
              }}
            >
              begin new entry
            </button>
          </div>
        )}
      </div>

      {/* ─── ENTRIES PANEL ───────────────────────────────────────────────────── */}
      {showPanel && (
        <>
          <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 40, backdropFilter: 'blur(3px)' }} onClick={() => setShowPanel(false)} />
          <EntriesPanel entries={entries} onClose={() => setShowPanel(false)} onDelete={deleteEntry} onLoad={loadEntry} />
        </>
      )}

      {/* ─── COMPLETED PAGES STACK ───────────────────────────────────────────── */}
      {completedPages.length > 0 && (
        <div style={{ position: 'fixed', right: '24px', top: '50%', transform: 'translateY(-50%)', display: 'flex', flexDirection: 'column', gap: '12px', zIndex: 20, maxHeight: '60vh', overflowY: 'auto', padding: '8px' }}>
          {completedPages.map(page => {
            const del = deletingPageNum === page.pageNumber
            return (
              <div
                key={page.pageNumber}
                onClick={e => { e.stopPropagation(); deleteCompletedPage(page.pageNumber) }}
                style={{
                  width: '120px', background: '#faf7ef',
                  backgroundImage: `repeating-linear-gradient(transparent,transparent 27px,rgba(100,118,200,0.13) 27px,rgba(100,118,200,0.13) 28px)`,
                  borderRadius: '3px', boxShadow: '0 4px 16px rgba(0,0,0,0.4),0 0 0 1px rgba(200,190,170,0.3)',
                  padding: '10px 8px 6px 16px', position: 'relative', cursor: 'pointer',
                  transition: 'all 0.5s cubic-bezier(0.36,0.07,0.19,0.97)',
                  transform: del ? 'translateY(200px) rotate(25deg) scale(0.3)' : 'scale(1)',
                  opacity: del ? 0 : 1,
                }}
                onMouseOver={e => { if (!del) e.currentTarget.style.transform = 'scale(1.05)' }}
                onMouseOut={e => { if (!del) e.currentTarget.style.transform = 'scale(1)' }}
              >
                <div style={{ position: 'absolute', top: 0, bottom: 0, left: '12px', width: '1px', background: 'rgba(220,80,70,0.15)' }} />
                <div style={{ fontFamily: '"Courier Prime",monospace', fontSize: '5px', lineHeight: '8px', color: '#1c2340', overflow: 'hidden', maxHeight: '80px', whiteSpace: 'pre-wrap', wordBreak: 'break-word', opacity: 0.7 }}>{page.text}</div>
                <div style={{ fontFamily: '"Special Elite",cursive', fontSize: '0.55rem', color: 'rgba(26,48,92,0.4)', textAlign: 'center', marginTop: '6px', borderTop: '1px solid rgba(100,118,200,0.1)', paddingTop: '4px', letterSpacing: '0.1em' }}>Page {page.pageNumber}</div>
              </div>
            )
          })}
        </div>
      )}

      <Dustbin active={deletingPageNum !== null} />
      <Candle />
      <TitleModal isOpen={isSaving} title={saveTitle} onTitleChange={setSaveTitle} onCancel={() => setIsSaving(false)} onFinalize={finalizeSave} />
    </main>
  )
}
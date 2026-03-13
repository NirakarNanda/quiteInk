'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import TypewriterSVG from '../components/TypewriterSVG'
import Paper from '../components/Paper'
import AIResponse from '../components/AIResponse'
import EntriesPanel, { type SavedEntry } from '../components/EntriesPanel'

// Components
import TopBar from '../components/home/TopBar'
import Header from '../components/home/Header'
import ActionButtons from '../components/home/ActionButtons'
import TitleModal from '../components/home/TitleModal'
import Candle from '../components/home/Candle'
import Dustbin from '../components/home/Dustbin'

// Utils
import { createTypewriterSound, FALLBACKS, getDateStamp } from '../utils/audioUtils'

interface CompletedPage {
  text: string
  pageNumber: number
}

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

  // Multi-page system
  const [completedPages, setCompletedPages] = useState<CompletedPage[]>([])
  const [currentPage, setCurrentPage] = useState(1)
  const [deletingPageNum, setDeletingPageNum] = useState<number | null>(null)

  const [isSaving, setIsSaving] = useState(false)
  const [saveTitle, setSaveTitle] = useState('')

  const inputRef = useRef<HTMLTextAreaElement>(null)
  const audioCtxRef = useRef<AudioContext | null>(null)
  const typingTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const charsOnLineRef = useRef(0)

  // Load entries from Backend
  const loadEntries = useCallback(async () => {
    try {
      const res = await fetch('/api/journals')
      if (res.ok) {
        const data = await res.json()
        setEntries(data)
      }
    } catch (err) {
      console.error('Failed to load entries:', err)
    }
  }, [])

  useEffect(() => {
    loadEntries()
  }, [loadEntries])

  // Get/create AudioContext lazily
  const getAudioCtx = useCallback(() => {
    if (!audioCtxRef.current) {
      audioCtxRef.current = new (window.AudioContext || (window as any).webkitAudioContext)()
    }
    return audioCtxRef.current
  }, [])

  const playSound = useCallback((type: 'key' | 'return' | 'ding') => {
    try { createTypewriterSound(getAudioCtx(), type) } catch { }
  }, [getAudioCtx])

  const activate = useCallback(() => {
    setIsActive(true)
    inputRef.current?.focus()
  }, [])

  const flashKey = useCallback((key: string, duration = 130) => {
    setPressedKey(key)
    setTimeout(() => setPressedKey(null), duration)
  }, [])

  const triggerWobble = useCallback(() => {
    setWobble(true)
    setTimeout(() => setWobble(false), 300)
  }, [])

  const triggerAI = useCallback(async (fullText: string) => {
    if (isThinking) return
    setIsThinking(true)
    setAiVisible(true)
    setAiThinking(true)
    setAiText('')

    let reply = ''
    try {
      const res = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: 'claude-sonnet-4-20250514',
          max_tokens: 1000,
          system: `You are QuietInk — a gentle, thoughtful journaling companion.
The user has typed private thoughts into a vintage Royal typewriter at night.
Respond with 2-4 warm, empathetic sentences like a wise friend sitting nearby.
Never give unsolicited advice. Reflect emotions with warmth and care.
Use poetic but clear language. Never start with "I" or the user's name.
Feel like a whisper, not a lecture.`,
          messages: [{ role: 'user', content: `They wrote: "${fullText.trim()}"` }],
        }),
      })
      const data = await res.json()
      reply = data.content?.[0]?.text || FALLBACKS[Math.floor(Math.random() * FALLBACKS.length)]
    } catch {
      reply = FALLBACKS[Math.floor(Math.random() * FALLBACKS.length)]
    }

    setCurrentAiReply(reply)
    setAiThinking(false)

    // Typewriter stream the reply
    let i = 0
    const iv = setInterval(() => {
      if (i < reply.length) {
        setAiText(reply.slice(0, i + 1))
        i++
      } else {
        clearInterval(iv)
        setIsThinking(false)
      }
    }, 24)
  }, [isThinking])

  // Handle keyboard input
  const handleKeyDown = useCallback((e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    const ctx = getAudioCtx()
    if (ctx.state === 'suspended') ctx.resume()

    if (e.key === 'Enter') {
      playSound('return')
      setLeverSwing(true)
      setTimeout(() => setLeverSwing(false), 450)
      flashKey('Enter', 200)
      if (charsOnLineRef.current > 50) {
        setTimeout(() => playSound('ding'), 80)
        charsOnLineRef.current = 0
      }
    } else if (e.key === 'Backspace') {
      playSound('key')
      flashKey('Backspace')
      triggerWobble()
      charsOnLineRef.current = Math.max(0, charsOnLineRef.current - 1)
    } else if (e.key === 'Shift' || e.key === 'Control' || e.key === 'Alt') {
      flashKey(e.key)
    } else if (e.key === ' ') {
      playSound('key')
      flashKey(' ')
      triggerWobble()
      charsOnLineRef.current++
      if (charsOnLineRef.current === 58) setTimeout(() => playSound('ding'), 0)
    } else if (e.key.length === 1) {
      playSound('key')
      flashKey(e.key.toUpperCase())
      triggerWobble()
      charsOnLineRef.current++
      if (charsOnLineRef.current === 58) setTimeout(() => playSound('ding'), 0)
    }
  }, [playSound, flashKey, triggerWobble, getAudioCtx])

  const handleChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const val = e.target.value
    setText(val)

    if (typingTimerRef.current) clearTimeout(typingTimerRef.current)
    if (val.trim().length >= 20) {
      typingTimerRef.current = setTimeout(() => triggerAI(val), 3200)
    }
  }, [triggerAI])

  // Save current entry
  const initiateSave = useCallback(() => {
    if (!text.trim() && completedPages.length === 0) return
    setIsSaving(true)
  }, [text, completedPages])

  const finalizeSave = useCallback(async () => {
    if (!saveTitle.trim()) return

    const pages = [...completedPages, { text: text.trim(), pageNumber: currentPage }]
    const payload = {
      title: saveTitle.trim(),
      pages,
      aiReply: currentAiReply || undefined,
    }

    try {
      const res = await fetch('/api/journals', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      if (res.ok) {
        setSavedFlash(true)
        setSaveTitle('')
        setIsSaving(false)
        loadEntries()
        setTimeout(() => setSavedFlash(false), 2000)
      }
    } catch (err) {
      console.error('Save failed:', err)
    }
  }, [saveTitle, text, completedPages, currentPage, currentAiReply, loadEntries])

  const deleteEntry = useCallback(async (id: string) => {
    try {
      const res = await fetch(`/api/journals/${id}`, { method: 'DELETE' })
      if (res.ok) {
        setEntries(prev => prev.filter(e => e._id !== id))
      }
    } catch (err) {
      console.error('Delete failed:', err)
    }
  }, [])

  const loadEntry = useCallback((entry: SavedEntry) => {
    const [first, ...rest] = entry.pages
    setText(first?.text || '')
    setCompletedPages(rest.map(p => ({ text: p.text, pageNumber: p.pageNumber })))
    setCurrentPage(entry.pages.length)

    setCurrentAiReply(entry.aiReply || '')
    if (entry.aiReply) {
      setAiText(entry.aiReply)
      setAiVisible(true)
      setAiThinking(false)
    }
    setShowPanel(false)
    setIsActive(true)
    inputRef.current?.focus()
  }, [])

  const newEntry = useCallback(() => {
    setText('')
    setAiText('')
    setAiVisible(false)
    setAiThinking(false)
    setCurrentAiReply('')
    setIsThinking(false)
    setCompletedPages([])
    setCurrentPage(1)
    charsOnLineRef.current = 0
    if (typingTimerRef.current) clearTimeout(typingTimerRef.current)
    inputRef.current?.focus()
  }, [])

  const handlePageFull = useCallback(() => {
    if (!text.trim()) return
    setCompletedPages(prev => [...prev, { text, pageNumber: currentPage }])
    setCurrentPage(prev => prev + 1)
    setText('')
    charsOnLineRef.current = 0
    inputRef.current?.focus()
  }, [text, currentPage])

  const deleteCompletedPage = useCallback((pageNumber: number) => {
    setDeletingPageNum(pageNumber)
    setTimeout(() => {
      setCompletedPages(prev => prev.filter(p => p.pageNumber !== pageNumber))
      setDeletingPageNum(null)
    }, 500)
  }, [])

  return (
    <main
      style={{
        minHeight: '100vh',
        background: `
          radial-gradient(ellipse 80% 50% at 50% -5%, rgba(26,60,90,0.35) 0%, transparent 70%),
          radial-gradient(ellipse 60% 80% at 20% 100%, rgba(40,20,10,0.8) 0%, transparent 60%),
          #1c1410
        `,
        paddingBottom: '120px',
        position: 'relative',
        overflow: 'hidden',
      }}
      onClick={() => !isActive && activate()}
    >

      <div style={{
        position: 'fixed', inset: 0,
        background: 'radial-gradient(ellipse at center, transparent 30%, rgba(8,4,2,0.72) 100%)',
        pointerEvents: 'none', zIndex: 0,
      }} />

      <TopBar
        entriesCount={entries.length}
        savedFlash={savedFlash}
        onShowPanel={() => setShowPanel(true)}
        onSave={initiateSave}
      />

      <Header isActive={isActive} />

      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        position: 'relative',
        zIndex: 10,
        padding: '0 16px',
      }}>

        <div style={{ width: '100%', maxWidth: '700px', marginBottom: '4px' }}>
          <Paper
            text={text}
            visible={isActive || text.length > 0}
            wobble={wobble}
            dateStamp={dateStamp}
            pageNumber={currentPage}
            onPageFull={handlePageFull}
          />
        </div>

        <div
          style={{
            width: '100%', maxWidth: '700px',
            cursor: isActive ? 'text' : 'pointer',
            position: 'relative',
          }}
          onClick={activate}
        >
          {!isActive && (
            <div style={{
              position: 'absolute', bottom: '20%', left: '50%',
              transform: 'translateX(-50%)',
              fontStyle: 'italic', fontSize: '0.8rem',
              color: 'rgba(240,225,190,0.28)',
              pointerEvents: 'none', whiteSpace: 'nowrap', zIndex: 5,
              animation: 'twinkle 2.8s ease-in-out infinite',
            }}>
              click to begin writing
            </div>
          )}
          <TypewriterSVG pressedKey={pressedKey} leverSwing={leverSwing} />
        </div>

        <textarea
          ref={inputRef}
          value={text}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          style={{
            position: 'fixed', top: '-9999px', left: '-9999px',
            width: '1px', height: '1px', opacity: 0,
            resize: 'none', border: 'none', outline: 'none',
            fontSize: '16px',
          }}
          autoComplete="off"
          spellCheck={false}
          aria-hidden="true"
        />

        {isActive && (
          <p style={{
            fontStyle: 'italic', fontSize: '0.75rem',
            color: 'rgba(240,232,200,0.2)', letterSpacing: '0.08em',
            textAlign: 'center', marginTop: '18px',
          }}>
            type your thoughts — the page is listening
          </p>
        )}

        <AIResponse text={aiText} thinking={aiThinking} visible={aiVisible} />

        <ActionButtons
          textLength={text.length}
          aiVisible={aiVisible}
          savedFlash={savedFlash}
          onSave={initiateSave}
          onNewEntry={newEntry}
        />
      </div>

      {showPanel && (
        <>
          <div
            style={{
              position: 'fixed', inset: 0,
              background: 'rgba(0,0,0,0.5)',
              zIndex: 40, backdropFilter: 'blur(3px)',
            }}
            onClick={() => setShowPanel(false)}
          />
          <EntriesPanel
            entries={entries}
            onClose={() => setShowPanel(false)}
            onDelete={deleteEntry}
            onLoad={loadEntry}
          />
        </>
      )}

      {completedPages.length > 0 && (
        <div style={{
          position: 'fixed',
          right: '24px',
          top: '50%',
          transform: 'translateY(-50%)',
          display: 'flex',
          flexDirection: 'column',
          gap: '12px',
          zIndex: 20,
          maxHeight: '60vh',
          overflowY: 'auto',
          padding: '8px',
        }}>
          {completedPages.map((page) => {
            const isDeleting = deletingPageNum === page.pageNumber
            return (
              <div
                key={page.pageNumber}
                className={isDeleting ? '' : 'fade-in-up'}
                onClick={(e) => { e.stopPropagation(); deleteCompletedPage(page.pageNumber) }}
                style={{
                  width: '120px',
                  background: '#faf7ef',
                  backgroundImage: `repeating-linear-gradient(
                    transparent, transparent 27px,
                    rgba(100,118,200,0.13) 27px,
                    rgba(100,118,200,0.13) 28px
                  )`,
                  borderRadius: '3px',
                  boxShadow: '0 4px 16px rgba(0,0,0,0.4), 0 0 0 1px rgba(200,190,170,0.3)',
                  padding: '10px 8px 6px 16px',
                  position: 'relative',
                  cursor: 'pointer',
                  transition: 'all 0.5s cubic-bezier(0.36, 0.07, 0.19, 0.97)',
                  transform: isDeleting
                    ? 'translateY(200px) rotate(25deg) scale(0.3)'
                    : 'scale(1)',
                  opacity: isDeleting ? 0 : 1,
                }}
                onMouseOver={e => { if (!isDeleting) e.currentTarget.style.transform = 'scale(1.05)' }}
                onMouseOut={e => { if (!isDeleting) e.currentTarget.style.transform = 'scale(1)' }}
              >
                <div style={{
                  position: 'absolute', top: 0, bottom: 0, left: '12px',
                  width: '1px',
                  background: 'rgba(220,80,70,0.15)',
                }} />
                <div style={{
                  fontFamily: '"Courier Prime", monospace',
                  fontSize: '5px',
                  lineHeight: '8px',
                  color: '#1c2340',
                  overflow: 'hidden',
                  maxHeight: '80px',
                  whiteSpace: 'pre-wrap',
                  wordBreak: 'break-word',
                  opacity: 0.7,
                }}>
                  {page.text}
                </div>
                <div style={{
                  fontFamily: '"Special Elite", cursive',
                  fontSize: '0.55rem',
                  color: 'rgba(26,48,92,0.4)',
                  textAlign: 'center',
                  marginTop: '6px',
                  borderTop: '1px solid rgba(100,118,200,0.1)',
                  paddingTop: '4px',
                  letterSpacing: '0.1em',
                }}>
                  Page {page.pageNumber}
                </div>
              </div>
            )
          })}
        </div>
      )}

      <Dustbin active={deletingPageNum !== null} />
      <Candle />

      <TitleModal
        isOpen={isSaving}
        title={saveTitle}
        onTitleChange={setSaveTitle}
        onCancel={() => setIsSaving(false)}
        onFinalize={finalizeSave}
      />
    </main>
  )
}
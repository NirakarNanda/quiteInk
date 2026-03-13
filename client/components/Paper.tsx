'use client'

import { useRef, useEffect } from 'react'

interface PaperProps {
    text: string
    visible: boolean
    wobble: boolean
    dateStamp: string
    pageNumber?: number
    onPageFull?: () => void
}

export default function Paper({ text, visible, wobble, dateStamp, pageNumber = 1, onPageFull }: PaperProps) {
    const contentRef = useRef<HTMLDivElement>(null)
    const textRef = useRef<HTMLDivElement>(null)

    // Auto-scroll to bottom as user types
    useEffect(() => {
        if (contentRef.current) {
            contentRef.current.scrollTop = contentRef.current.scrollHeight
        }
    }, [text])

    // Detect overflow — when text fills the page
    useEffect(() => {
        if (contentRef.current && onPageFull) {
            const el = contentRef.current
            // Check if content exceeds the visible area
            if (el.scrollHeight > el.clientHeight + 10) {
                onPageFull()
            }
        }
    }, [text, onPageFull])

    return (
        <div
            className="flex justify-center"
            style={{
                width: '100%',
            }}
        >
            {visible && (
                <div
                    className={`relative ${wobble ? 'paper-wobble' : 'paper-float'}`}
                    style={{
                        width: 'min(420px, 85%)',
                    }}
                >
                    {/* Paper sheet */}
                    <div
                        className="relative"
                        style={{
                            background: '#faf7ef',
                            backgroundImage: `
                repeating-linear-gradient(
                  transparent, transparent 27px,
                  rgba(100,118,200,0.13) 27px,
                  rgba(100,118,200,0.13) 28px
                )
              `,
                            borderRadius: '3px 3px 0 0',
                            boxShadow: `
                -4px -6px 28px rgba(0,0,0,0.4),
                4px -6px 28px rgba(0,0,0,0.28),
                0 0 0 1px rgba(200,190,170,0.3)
              `,
                        }}
                    >
                        {/* Paper top edge — slightly curved/rolled */}
                        <div style={{
                            position: 'absolute', top: 0, left: 0, right: 0,
                            height: '4px',
                            background: 'linear-gradient(180deg, rgba(180,165,130,0.3), transparent)',
                            borderRadius: '3px 3px 0 0',
                        }} />

                        {/* Red margin line */}
                        <div style={{
                            position: 'absolute', top: 0, bottom: 0, left: '58px',
                            width: '1px',
                            background: 'rgba(220,80,70,0.18)',
                        }} />

                        {/* Hole punches */}
                        {[18, '48%'].map((top, i) => (
                            <div key={i} style={{
                                position: 'absolute', left: '18px',
                                top: typeof top === 'number' ? `${top}px` : top,
                                width: '13px', height: '13px',
                                borderRadius: '50%',
                                background: 'rgba(255,255,255,0.5)',
                                border: '1px solid rgba(255,255,255,0.25)',
                                boxShadow: 'inset 0 1px 3px rgba(0,0,0,0.18)',
                            }} />
                        ))}

                        {/* Content */}
                        <div
                            ref={contentRef}
                            style={{
                                padding: '14px 22px 22px 70px',
                                maxHeight: '280px',
                                overflowY: 'auto',
                            }}
                        >
                            {/* Date stamp */}
                            <div style={{
                                fontFamily: '"Courier Prime", monospace',
                                fontSize: '0.67rem',
                                color: 'rgba(26,48,92,0.32)',
                                textAlign: 'right',
                                marginBottom: '10px',
                            }}>
                                {dateStamp}
                            </div>

                            {/* Typed text + cursor */}
                            <div
                                ref={textRef}
                                style={{
                                    fontFamily: '"Courier Prime", monospace',
                                    fontSize: '14px',
                                    lineHeight: '28px',
                                    color: '#1c2340',
                                    whiteSpace: 'pre-wrap',
                                    wordBreak: 'break-word',
                                    minHeight: '28px',
                                }}
                            >
                                {text}
                                <span className="tw-cursor" />
                            </div>
                        </div>

                        {/* Page number */}
                        <div style={{
                            fontFamily: '"Courier Prime", monospace',
                            fontSize: '0.6rem',
                            color: 'rgba(26,48,92,0.25)',
                            textAlign: 'center',
                            padding: '4px 0 8px',
                            borderTop: '1px solid rgba(100,118,200,0.08)',
                        }}>
                            — {pageNumber} —
                        </div>
                    </div>

                    {/* Paper shadow / gap separator */}
                    <div style={{
                        position: 'absolute',
                        bottom: '-20px', left: '5%', right: '5%',
                        height: '20px',
                        background: 'linear-gradient(180deg, rgba(0,0,0,0.15), transparent)',
                        filter: 'blur(6px)',
                        pointerEvents: 'none',
                    }} />
                </div>
            )}
        </div>
    )
}
'use client'

interface AIResponseProps {
    text: string
    thinking: boolean
    visible: boolean
}

export default function AIResponse({ text, thinking, visible }: AIResponseProps) {
    if (!visible) return null

    return (
        <div className="fade-in-up" style={{ width: 'min(520px, 95%)', margin: '40px auto 0' }}>
            {/* Divider */}
            <div style={{
                display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '20px',
            }}>
                <div style={{ flex: 1, height: '1px', background: 'linear-gradient(90deg,transparent,rgba(180,150,100,0.18),transparent)' }} />
                <span style={{
                    fontFamily: '"Special Elite", cursive',
                    fontSize: '0.6rem', letterSpacing: '0.22em',
                    color: 'rgba(180,150,100,0.32)', textTransform: 'uppercase',
                }}>✦ a quiet reply ✦</span>
                <div style={{ flex: 1, height: '1px', background: 'linear-gradient(90deg,transparent,rgba(180,150,100,0.18),transparent)' }} />
            </div>

            {/* Card */}
            <div style={{
                background: 'linear-gradient(135deg,rgba(28,22,16,0.72),rgba(14,10,6,0.88))',
                border: '1px solid rgba(180,150,100,0.1)',
                borderRadius: '14px',
                padding: '26px 30px',
                backdropFilter: 'blur(12px)',
                boxShadow: '0 8px 32px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.04)',
                position: 'relative',
            }}>
                {/* Corner decorations */}
                {[
                    { top: '9px', left: '9px', borderTop: '1px solid', borderLeft: '1px solid', borderRadius: '2px 0 0 0' },
                    { top: '9px', right: '9px', borderTop: '1px solid', borderRight: '1px solid', borderRadius: '0 2px 0 0' },
                    { bottom: '9px', left: '9px', borderBottom: '1px solid', borderLeft: '1px solid', borderRadius: '0 0 0 2px' },
                    { bottom: '9px', right: '9px', borderBottom: '1px solid', borderRight: '1px solid', borderRadius: '0 0 2px 0' },
                ].map((s, i) => (
                    <div key={i} style={{
                        position: 'absolute', width: '12px', height: '12px',
                        borderColor: 'rgba(180,150,100,0.18)', ...s,
                    }} />
                ))}

                {/* Thinking state */}
                {thinking && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <span style={{
                            fontFamily: '"Lora", serif', fontStyle: 'italic',
                            fontSize: '0.82rem', color: 'rgba(240,230,200,0.3)',
                        }}>listening quietly</span>
                        <span style={{ display: 'flex', gap: '5px' }}>
                            {[0, 1, 2].map(i => (
                                <span key={i} className="dot-bounce" style={{
                                    display: 'inline-block', width: '4px', height: '4px',
                                    borderRadius: '50%', background: 'rgba(200,160,80,0.7)',
                                }} />
                            ))}
                        </span>
                    </div>
                )}

                {/* Response text */}
                {!thinking && text && (
                    <p style={{
                        fontFamily: '"Lora", serif', fontStyle: 'italic',
                        fontSize: '1rem', lineHeight: 1.88,
                        color: 'rgba(240,230,200,0.68)',
                    }}>{text}</p>
                )}
            </div>
        </div>
    )
}
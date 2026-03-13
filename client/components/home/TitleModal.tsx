interface TitleModalProps {
    isOpen: boolean
    title: string
    onTitleChange: (val: string) => void
    onCancel: () => void
    onFinalize: () => void
}

export default function TitleModal({ isOpen, title, onTitleChange, onCancel, onFinalize }: TitleModalProps) {
    if (!isOpen) return null

    return (
        <div style={{
            position: 'fixed', inset: 0,
            background: 'rgba(0,0,0,0.7)',
            backdropFilter: 'blur(8px)',
            zIndex: 100,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            padding: '20px',
        }} onClick={onCancel}>
            <div style={{
                background: '#1c1410',
                border: '1px solid rgba(180,150,100,0.15)',
                boxShadow: '0 20px 50px rgba(0,0,0,0.6)',
                borderRadius: '12px',
                padding: '32px',
                width: '100%', maxWidth: '400px',
                animation: 'fadeInUp 0.4s ease-out',
            }} onClick={e => e.stopPropagation()}>
                <h3 style={{
                    fontFamily: '"Special Elite", cursive',
                    fontSize: '1.1rem',
                    color: 'rgba(240,232,210,0.85)',
                    marginBottom: '16px',
                    letterSpacing: '0.05em',
                }}>Title your entry</h3>
                <input
                    autoFocus
                    value={title}
                    onChange={e => onTitleChange(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && onFinalize()}
                    placeholder="Midnight Musings..."
                    style={{
                        width: '100%',
                        background: 'rgba(255,255,255,0.03)',
                        border: '1px solid rgba(180,150,100,0.1)',
                        padding: '12px 16px',
                        borderRadius: '8px',
                        color: '#f0e8d4',
                        fontFamily: '"Special Elite", cursive',
                        fontSize: '0.9rem',
                        outline: 'none',
                        marginBottom: '24px',
                    }}
                />
                <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
                    <button
                        onClick={onCancel}
                        style={{
                            background: 'none', border: 'none',
                            color: 'rgba(240,225,190,0.25)',
                            fontFamily: '"Special Elite", cursive',
                            fontSize: '0.75rem', cursor: 'pointer',
                            textTransform: 'uppercase', letterSpacing: '0.1em',
                        }}
                    >cancel</button>
                    <button
                        onClick={onFinalize}
                        disabled={!title.trim()}
                        style={{
                            background: 'rgba(180,150,100,0.1)',
                            border: '1px solid rgba(180,150,100,0.2)',
                            color: title.trim() ? 'rgba(240,232,210,0.85)' : 'rgba(240,232,210,0.3)',
                            padding: '8px 20px',
                            borderRadius: '20px',
                            fontFamily: '"Special Elite", cursive',
                            fontSize: '0.75rem', cursor: title.trim() ? 'pointer' : 'default',
                            textTransform: 'uppercase', letterSpacing: '0.1em',
                        }}
                    >save entry</button>
                </div>
            </div>
        </div>
    )
}

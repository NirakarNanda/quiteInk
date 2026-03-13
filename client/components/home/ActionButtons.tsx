interface ActionButtonsProps {
    textLength: number
    aiVisible: boolean
    savedFlash: boolean
    onSave: () => void
    onNewEntry: () => void
}

export default function ActionButtons({ textLength, aiVisible, savedFlash, onSave, onNewEntry }: ActionButtonsProps) {
    if (textLength === 0 && !aiVisible) return null

    return (
        <div className="fade-in-up" style={{
            display: 'flex', gap: '12px', marginTop: '28px', justifyContent: 'center',
            flexWrap: 'wrap',
        }}>
            <button
                onClick={e => { e.stopPropagation(); onSave() }}
                style={{
                    background: savedFlash ? 'rgba(100,160,80,0.12)' : 'none',
                    border: `1px solid ${savedFlash ? 'rgba(100,160,80,0.3)' : 'rgba(180,150,100,0.18)'}`,
                    borderRadius: '24px', padding: '9px 22px',
                    cursor: 'pointer',
                    fontFamily: '"Special Elite",cursive',
                    fontSize: '0.7rem', letterSpacing: '0.15em',
                    color: savedFlash ? 'rgba(140,210,100,0.8)' : 'rgba(240,225,190,0.35)',
                    textTransform: 'uppercase', transition: 'all 0.3s',
                }}
                onMouseOver={e => { if (!savedFlash) e.currentTarget.style.color = 'rgba(240,225,190,0.65)' }}
                onMouseOut={e => { if (!savedFlash) e.currentTarget.style.color = 'rgba(240,225,190,0.35)' }}
            >
                {savedFlash ? '✓ Saved!' : '💾 Save Entry'}
            </button>
            <button
                onClick={e => { e.stopPropagation(); onNewEntry() }}
                style={{
                    background: 'none',
                    border: '1px solid rgba(180,150,100,0.12)',
                    borderRadius: '24px', padding: '9px 22px',
                    cursor: 'pointer',
                    fontFamily: '"Special Elite",cursive',
                    fontSize: '0.7rem', letterSpacing: '0.15em',
                    color: 'rgba(240,225,190,0.28)',
                    textTransform: 'uppercase', transition: 'all 0.3s',
                }}
                onMouseOver={e => e.currentTarget.style.color = 'rgba(240,225,190,0.55)'}
                onMouseOut={e => e.currentTarget.style.color = 'rgba(240,225,190,0.28)'}
            >
                begin new entry
            </button>
        </div>
    )
}

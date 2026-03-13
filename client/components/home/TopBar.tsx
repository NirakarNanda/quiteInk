import { SavedEntry } from "../EntriesPanel"

interface TopBarProps {
    entriesCount: number
    savedFlash: boolean
    onShowPanel: () => void
    onSave: () => void
}

export default function TopBar({ entriesCount, savedFlash, onShowPanel, onSave }: TopBarProps) {
    return (
        <div style={{
            position: 'relative', zIndex: 10,
            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
            padding: '20px 28px 0',
        }}>
            {/* Entries button */}
            <button
                onClick={e => { e.stopPropagation(); onShowPanel() }}
                style={{
                    background: 'none',
                    border: '1px solid rgba(180,150,100,0.14)',
                    borderRadius: '20px',
                    padding: '7px 16px',
                    cursor: 'pointer',
                    fontFamily: '"Special Elite", cursive',
                    fontSize: '0.65rem',
                    letterSpacing: '0.15em',
                    color: 'rgba(240,225,190,0.3)',
                    textTransform: 'uppercase',
                    transition: 'all 0.3s',
                    display: 'flex', alignItems: 'center', gap: '7px',
                }}
                onMouseOver={e => { e.currentTarget.style.color = 'rgba(240,225,190,0.65)'; e.currentTarget.style.borderColor = 'rgba(180,150,100,0.3)' }}
                onMouseOut={e => { e.currentTarget.style.color = 'rgba(240,225,190,0.3)'; e.currentTarget.style.borderColor = 'rgba(180,150,100,0.14)' }}
            >
                <span>📋</span>
                <span>Saved ({entriesCount})</span>
            </button>

            {/* Save button */}
            <button
                onClick={e => { e.stopPropagation(); onSave() }}
                style={{
                    background: savedFlash ? 'rgba(120,180,100,0.15)' : 'none',
                    border: `1px solid ${savedFlash ? 'rgba(120,180,100,0.35)' : 'rgba(180,150,100,0.14)'}`,
                    borderRadius: '20px',
                    padding: '7px 16px',
                    cursor: 'pointer',
                    fontFamily: '"Special Elite", cursive',
                    fontSize: '0.65rem',
                    letterSpacing: '0.15em',
                    color: savedFlash ? 'rgba(160,220,120,0.8)' : 'rgba(240,225,190,0.3)',
                    textTransform: 'uppercase',
                    transition: 'all 0.3s',
                    display: 'flex', alignItems: 'center', gap: '7px',
                }}
                onMouseOver={e => { if (!savedFlash) { e.currentTarget.style.color = 'rgba(240,225,190,0.65)'; e.currentTarget.style.borderColor = 'rgba(180,150,100,0.3)' } }}
                onMouseOut={e => { if (!savedFlash) { e.currentTarget.style.color = 'rgba(240,225,190,0.3)'; e.currentTarget.style.borderColor = 'rgba(180,150,100,0.14)' } }}
            >
                <span>{savedFlash ? '✓' : '💾'}</span>
                <span>{savedFlash ? 'Saved!' : 'Save Entry'}</span>
            </button>
        </div>
    )
}

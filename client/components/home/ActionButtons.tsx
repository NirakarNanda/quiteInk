'use client'

// Rose pink from the Royal typewriter body
const ROSE       = '#cc9898'
const ROSE_LIGHT = '#ecc0bc'
const ROSE_GLOW  = 'rgba(204,152,152,0.22)'

interface ActionButtonsProps {
  textLength: number
  aiVisible:  boolean
  savedFlash: boolean
  onSave:     () => void
  onNewEntry: () => void
}

export default function ActionButtons({
  textLength,
  aiVisible,
  savedFlash,
  onSave,
  onNewEntry,
}: ActionButtonsProps) {
  const visible = textLength > 0 || aiVisible
  if (!visible) return null

  return (
    <div
      className="fade-in-up"
      style={{
        display:       'flex',
        gap:           '12px',
        marginTop:     '28px',
        justifyContent:'center',
        flexWrap:      'wrap',
      }}
    >
      {/* Save Entry */}
      <button
        onClick={(e) => { e.stopPropagation(); onSave() }}
        style={savedFlash ? flashSaveStyle() : saveStyle(false)}
        onMouseOver={(e) => { if (!savedFlash) Object.assign(e.currentTarget.style, saveStyle(true)) }}
        onMouseOut={(e)  => { if (!savedFlash) Object.assign(e.currentTarget.style, saveStyle(false)) }}
      >
        {savedFlash ? '✓  Saved!' : '💾  Save Entry'}
      </button>

      {/* New Entry */}
      <button
        onClick={(e) => { e.stopPropagation(); onNewEntry() }}
        style={newStyle(false)}
        onMouseOver={(e) => Object.assign(e.currentTarget.style, newStyle(true))}
        onMouseOut={(e)  => Object.assign(e.currentTarget.style, newStyle(false))}
      >
        begin new entry
      </button>
    </div>
  )
}

// ─── Style helpers ────────────────────────────────────────────────────────────

function saveStyle(hovered: boolean): React.CSSProperties {
  return {
    background:    hovered ? 'rgba(204,152,152,0.14)' : 'rgba(204,152,152,0.07)',
    border:        `1px solid ${hovered ? ROSE : 'rgba(204,152,152,0.45)'}`,
    borderRadius:  '24px',
    padding:       '9px 24px',
    cursor:        'pointer',
    fontFamily:    '"Special Elite", cursive',
    fontSize:      '0.72rem',
    letterSpacing: '0.16em',
    color:         hovered ? ROSE_LIGHT : ROSE,
    textTransform: 'uppercase' as const,
    transition:    'all 0.25s ease',
    boxShadow:     hovered ? `0 0 0 2px ${ROSE_GLOW}` : 'none',
  }
}

function flashSaveStyle(): React.CSSProperties {
  return {
    background:    'rgba(100,180,80,0.12)',
    border:        '1px solid rgba(100,180,80,0.4)',
    borderRadius:  '24px',
    padding:       '9px 24px',
    cursor:        'default',
    fontFamily:    '"Special Elite", cursive',
    fontSize:      '0.72rem',
    letterSpacing: '0.16em',
    color:         '#78c850',
    textTransform: 'uppercase' as const,
    transition:    'all 0.25s ease',
  }
}

function newStyle(hovered: boolean): React.CSSProperties {
  return {
    background:    'none',
    border:        `1px solid ${hovered ? 'rgba(204,152,152,0.3)' : 'rgba(204,152,152,0.15)'}`,
    borderRadius:  '24px',
    padding:       '9px 24px',
    cursor:        'pointer',
    fontFamily:    '"Special Elite", cursive',
    fontSize:      '0.72rem',
    letterSpacing: '0.16em',
    color:         hovered ? ROSE : 'rgba(204,152,152,0.5)',
    textTransform: 'uppercase' as const,
    transition:    'all 0.25s ease',
  }
}
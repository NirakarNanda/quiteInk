'use client'

// Rose pink palette pulled directly from the Royal typewriter SVG:
//   body gradient: #e0b4b0 → #cc9898 → #b87878
//   highlight:     #ecc0bc
//   dark:          #9a6464
// We use these as button accent colors so they echo the machine sitting below.

const ROSE       = '#cc9898'   // mid-tone typewriter body
const ROSE_LIGHT = '#ecc0bc'   // highlight / hover
const ROSE_DARK  = '#9a6464'   // shadow / active
const ROSE_GLOW  = 'rgba(204,152,152,0.25)'

interface TopBarProps {
  entriesCount: number
  savedFlash:   boolean
  onShowPanel:  () => void
  onSave:       () => void
}

export default function TopBar({
  entriesCount,
  savedFlash,
  onShowPanel,
  onSave,
}: TopBarProps) {
  return (
    <div
      style={{
        position: 'relative',
        zIndex: 10,
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '20px 28px 0',
      }}
    >
      {/* ── Saved Entries button ── */}
      <button
        onClick={(e) => { e.stopPropagation(); onShowPanel() }}
        style={roseBtn(false)}
        onMouseOver={(e) => applyHover(e.currentTarget as HTMLButtonElement, true)}
        onMouseOut={(e)  => applyHover(e.currentTarget as HTMLButtonElement, false)}
      >
        <span style={{ fontSize: '0.95rem', lineHeight: 1 }}>📋</span>
        <span>Saved ({entriesCount})</span>
      </button>

      {/* ── Right side cluster ── */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>

        {/* Save Entry button */}
        <button
          onClick={(e) => { e.stopPropagation(); onSave() }}
          style={savedFlash ? savedFlashStyle() : roseBtn(false)}
          onMouseOver={(e) => { if (!savedFlash) applyHover(e.currentTarget as HTMLButtonElement, true) }}
          onMouseOut={(e)  => { if (!savedFlash) applyHover(e.currentTarget as HTMLButtonElement, false) }}
        >
          <span style={{ fontSize: '0.95rem', lineHeight: 1 }}>
            {savedFlash ? '✓' : '💾'}
          </span>
          <span>{savedFlash ? 'Saved!' : 'Save Entry'}</span>
        </button>

        {/* Profile / Login icon */}
        <a
          href="/login"
          onClick={(e) => e.stopPropagation()}
          style={profileBtn()}
          onMouseOver={(e) => {
            const el = e.currentTarget as HTMLAnchorElement
            el.style.color       = ROSE_LIGHT
            el.style.borderColor = ROSE
            el.style.boxShadow   = `0 0 0 2px ${ROSE_GLOW}`
            el.style.transform   = 'scale(1.08)'
          }}
          onMouseOut={(e) => {
            const el = e.currentTarget as HTMLAnchorElement
            el.style.color       = ROSE
            el.style.borderColor = 'rgba(204,152,152,0.4)'
            el.style.boxShadow   = 'none'
            el.style.transform   = 'scale(1)'
          }}
        >
          👤
        </a>
      </div>
    </div>
  )
}

// ─── Style helpers ────────────────────────────────────────────────────────────

function roseBtn(hovered: boolean): React.CSSProperties {
  return {
    background:    hovered ? 'rgba(204,152,152,0.12)' : 'rgba(204,152,152,0.06)',
    border:        `1px solid ${hovered ? ROSE : 'rgba(204,152,152,0.4)'}`,
    borderRadius:  '20px',
    padding:       '7px 18px',
    cursor:        'pointer',
    fontFamily:    '"Special Elite", cursive',
    fontSize:      '0.68rem',
    letterSpacing: '0.14em',
    color:         hovered ? ROSE_LIGHT : ROSE,
    textTransform: 'uppercase' as const,
    transition:    'all 0.25s ease',
    display:       'flex',
    alignItems:    'center',
    gap:           '7px',
    boxShadow:     hovered ? `0 0 0 2px ${ROSE_GLOW}` : 'none',
  }
}

function savedFlashStyle(): React.CSSProperties {
  return {
    background:    'rgba(120,180,100,0.14)',
    border:        '1px solid rgba(120,180,100,0.45)',
    borderRadius:  '20px',
    padding:       '7px 18px',
    cursor:        'default',
    fontFamily:    '"Special Elite", cursive',
    fontSize:      '0.68rem',
    letterSpacing: '0.14em',
    color:         '#78c850',
    textTransform: 'uppercase' as const,
    transition:    'all 0.25s ease',
    display:       'flex',
    alignItems:    'center',
    gap:           '7px',
  }
}

function profileBtn(): React.CSSProperties {
  return {
    background:     'rgba(204,152,152,0.06)',
    border:         '1px solid rgba(204,152,152,0.4)',
    borderRadius:   '50%',
    width:          '36px',
    height:         '36px',
    display:        'flex',
    alignItems:     'center',
    justifyContent: 'center',
    cursor:         'pointer',
    fontSize:       '1.05rem',
    color:          ROSE,
    transition:     'all 0.25s ease',
    textDecoration: 'none',
    flexShrink:     0,
  }
}

function applyHover(el: HTMLButtonElement, on: boolean) {
  Object.assign(el.style, roseBtn(on))
}
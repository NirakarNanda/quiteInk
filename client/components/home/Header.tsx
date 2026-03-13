interface HeaderProps {
    isActive: boolean
}

export default function Header({ isActive }: HeaderProps) {
    return (
        <header style={{
            textAlign: isActive ? 'left' : 'center',
            padding: isActive ? '12px 28px 10px' : '28px 20px 24px',
            position: 'relative', zIndex: 10,
            transition: 'all 0.6s cubic-bezier(0.16,1,0.3,1)',
        }}>
            {!isActive && (
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '14px', marginBottom: '8px' }}>
                    <div style={{ width: '44px', height: '1px', background: 'linear-gradient(90deg,transparent,rgba(180,150,100,0.28))' }} />
                    <span style={{ fontFamily: '"Special Elite",cursive', fontSize: '0.6rem', letterSpacing: '0.3em', color: 'rgba(180,150,100,0.28)', textTransform: 'uppercase' }}>est. tonight</span>
                    <div style={{ width: '44px', height: '1px', background: 'linear-gradient(270deg,transparent,rgba(180,150,100,0.28))' }} />
                </div>
            )}
            <h1 style={{
                fontFamily: '"Special Elite",cursive',
                fontSize: isActive ? '1.4rem' : 'clamp(2.6rem,6vw,3.8rem)',
                color: '#f0e8d4',
                letterSpacing: '0.15em',
                textShadow: '0 2px 28px rgba(74,140,168,0.2), 0 0 60px rgba(26,50,80,0.5)',
                transition: 'font-size 0.6s cubic-bezier(0.16,1,0.3,1)',
            }}>QuietInk</h1>
            <p style={{
                fontStyle: 'italic',
                fontSize: isActive ? '0.65rem' : '0.8rem',
                color: 'rgba(240,232,200,0.24)',
                letterSpacing: '0.18em',
                marginTop: '3px',
                transition: 'font-size 0.6s cubic-bezier(0.16,1,0.3,1)',
            }}>
                write. breathe. be heard.
            </p>
        </header>
    )
}

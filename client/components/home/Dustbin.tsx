interface DustbinProps {
    active: boolean
}

export default function Dustbin({ active }: DustbinProps) {
    return (
        <div style={{
            position: 'fixed', bottom: '24px', right: '30px',
            display: 'flex', flexDirection: 'column', alignItems: 'center',
            zIndex: 25,
            transition: 'transform 0.3s ease, filter 0.3s ease',
            transform: active ? 'scale(1.2)' : 'scale(1)',
            filter: active ? 'drop-shadow(0 0 12px rgba(220,160,60,0.5))' : 'none',
        }}>
            {/* Lid */}
            <div style={{
                width: '36px', height: '4px',
                background: 'linear-gradient(90deg,#6a6a72,#8a8a94,#6a6a72)',
                borderRadius: '2px 2px 0 0',
                position: 'relative',
                transition: 'transform 0.3s ease',
                transformOrigin: 'left center',
                transform: active ? 'rotate(-15deg) translateY(-2px)' : 'rotate(0deg)',
            }}>
                {/* Lid handle */}
                <div style={{
                    position: 'absolute', top: '-6px', left: '50%', transform: 'translateX(-50%)',
                    width: '12px', height: '5px',
                    background: '#7a7a84',
                    borderRadius: '3px 3px 0 0',
                }} />
            </div>
            {/* Body */}
            <div style={{
                width: '30px', height: '38px',
                background: 'linear-gradient(180deg,#5a5a64,#3a3a44)',
                borderRadius: '0 0 4px 4px',
                position: 'relative',
                overflow: 'hidden',
            }}>
                {/* Vertical lines */}
                {[8, 15, 22].map(x => (
                    <div key={x} style={{
                        position: 'absolute', left: `${x}px`, top: '4px',
                        width: '1px', height: '30px',
                        background: 'rgba(255,255,255,0.08)',
                    }} />
                ))}
            </div>
            {/* Label */}
            <span style={{
                fontFamily: '"Special Elite", cursive',
                fontSize: '0.45rem',
                color: 'rgba(240,225,190,0.25)',
                marginTop: '5px',
                letterSpacing: '0.1em',
                textTransform: 'uppercase',
            }}>trash</span>
        </div>
    )
}

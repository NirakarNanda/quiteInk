export default function Candle() {
    return (
        <div style={{
            position: 'fixed', bottom: '28px', left: '32px',
            display: 'flex', flexDirection: 'column', alignItems: 'center',
            zIndex: 10,
            animation: 'sceneFadeIn 2s ease 3s both',
        }}>
            <div style={{
                position: 'absolute', bottom: '44px', left: '50%', transform: 'translateX(-50%)',
                width: '65px', height: '65px', borderRadius: '50%',
                background: 'radial-gradient(circle,rgba(200,165,70,0.2) 0%,transparent 70%)',
                animation: 'twinkle 3s ease-in-out infinite',
            }} />
            <div style={{
                width: '10px', height: '19px',
                background: 'radial-gradient(ellipse at 50% 80%,#fff 5%,#ffe060 28%,#ff8800 62%,transparent 100%)',
                borderRadius: '50% 50% 28% 28%',
                filter: 'blur(0.4px)', marginBottom: '0',
                animation: 'twinkle 2.7s ease-in-out infinite',
            }} />
            <div style={{ width: '1px', height: '5px', background: '#444' }} />
            <div style={{
                width: '16px', height: '40px', borderRadius: '3px',
                background: 'linear-gradient(90deg,#d2c5a4,#ece4cc,#c4b894)',
                boxShadow: '1px 2px 8px rgba(0,0,0,0.35)',
            }} />
            <div style={{
                width: '22px', height: '6px', borderRadius: '3px',
                background: 'linear-gradient(180deg,#b8965a,#8a6a30)',
            }} />
        </div>
    )
}

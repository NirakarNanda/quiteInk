'use client'

interface TypewriterSVGProps {
    pressedKey: string | null
    leverSwing: boolean
    userName?: string
}

export default function TypewriterSVG({ pressedKey, leverSwing, userName }: TypewriterSVGProps) {
    // Key rows matching the Royal in the photo
    const ROW_NUMS = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0', '-', '=']
    const ROW_QWERTY = ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P']
    const ROW_ASDF = ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L']
    const ROW_ZXCV = ['Z', 'X', 'C', 'V', 'B', 'N', 'M', ',', '.', '/']

    const isPressed = (k: string) => pressedKey?.toUpperCase() === k.toUpperCase()

    // Single round cream key renderer
    const RoundKey = ({
        cx, cy, label, r = 18, pressed = false, fontSize = 11
    }: {
        cx: number; cy: number; label: string; r?: number; pressed?: boolean; fontSize?: number
    }) => {
        const dy = pressed ? 4 : 0
        return (
            <g className={pressed ? 'key-tap' : ''} style={{ transformOrigin: `${cx}px ${cy + r}px` }}>
                {/* Side cylinder face (3D depth) */}
                <ellipse cx={cx} cy={cy + r + (pressed ? 3 : 5)} rx={r * 0.98} ry={r * 0.28}
                    fill="#b0ad9c" />
                <rect x={cx - r * 0.98} y={cy + r * 0.4 + dy * 0.5} width={r * 2 * 0.98}
                    height={pressed ? r * 0.65 : r * 0.9} fill="#c8c5b0" />
                {/* Top circle */}
                <circle cx={cx} cy={cy + dy} r={r}
                    fill="url(#keyCreamy)" stroke="rgba(0,0,0,0.12)" strokeWidth="0.8" />
                {/* Top specular highlight (upper arc) */}
                <path
                    d={`M ${cx - r * 0.65},${cy + dy - r * 0.55} A ${r * 0.8},${r * 0.8} 0 0 1 ${cx + r * 0.65},${cy + dy - r * 0.55}`}
                    fill="none" stroke="rgba(255,255,255,0.55)" strokeWidth="2.2" strokeLinecap="round"
                />
                {/* Key label */}
                <text
                    x={cx} y={cy + dy + fontSize * 0.42}
                    textAnchor="middle" dominantBaseline="middle"
                    fill="#2c2820" fontSize={fontSize}
                    fontFamily="'Special Elite', cursive"
                    fontWeight="bold"
                >{label}</text>
            </g>
        )
    }

    // Wide rectangular key (Enter, Shift, Space, Backspace)
    const WideKey = ({
        x, y, w, h = 30, label, pressed = false, fontSize = 9
    }: {
        x: number; y: number; w: number; h?: number; label: string; pressed?: boolean; fontSize?: number
    }) => {
        const dy = pressed ? 4 : 0
        return (
            <g className={pressed ? 'key-tap' : ''} style={{ transformOrigin: `${x + w / 2}px ${y + h}px` }}>
                {/* Front face */}
                <rect x={x + 1} y={y + h * 0.55 + (pressed ? 3 : 5)} width={w - 2} height={pressed ? h * 0.5 : h * 0.7}
                    rx="3" fill="#b0ad9c" />
                {/* Top face */}
                <rect x={x} y={y + dy} width={w} height={h} rx="5"
                    fill="url(#keyCreamy)" stroke="rgba(0,0,0,0.1)" strokeWidth="0.8" />
                <rect x={x + 2} y={y + dy + 2} width={w - 4} height={h * 0.38} rx="3"
                    fill="rgba(255,255,255,0.28)" />
                <text x={x + w / 2} y={y + dy + h * 0.54} textAnchor="middle" dominantBaseline="middle"
                    fill="#2c2820" fontSize={fontSize} fontFamily="'Special Elite', cursive">{label}</text>
            </g>
        )
    }

    return (
        <svg
            viewBox="0 55 860 470"

            xmlns="http://www.w3.org/2000/svg"
            className="w-full h-full"
            style={{
                filter:
                    'drop-shadow(0 40px 80px rgba(0,0,0,0.9)) drop-shadow(0 12px 24px rgba(0,0,0,0.65))',
            }}
        >
            <defs>
                {/* Rose body */}
                <linearGradient id="roseBody" x1="0%" y1="0%" x2="8%" y2="100%">
                    <stop offset="0%" stopColor="#e0b4b0" />
                    <stop offset="28%" stopColor="#cc9898" />
                    <stop offset="65%" stopColor="#b87878" />
                    <stop offset="100%" stopColor="#9a6464" />
                </linearGradient>
                <linearGradient id="roseTop" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="#ecc0bc" />
                    <stop offset="45%" stopColor="#d4a4a0" />
                    <stop offset="100%" stopColor="#c08888" />
                </linearGradient>
                <linearGradient id="roseSideR" x1="100%" y1="0%" x2="0%" y2="0%">
                    <stop offset="0%" stopColor="#7a4a4a" />
                    <stop offset="100%" stopColor="#c08888" />
                </linearGradient>
                <linearGradient id="roseSideL" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#7a4a4a" />
                    <stop offset="100%" stopColor="#c08888" />
                </linearGradient>
                {/* Grey base */}
                <linearGradient id="greyBase" x1="0%" y1="0%" x2="5%" y2="100%">
                    <stop offset="0%" stopColor="#9c9ca6" />
                    <stop offset="38%" stopColor="#7c7c88" />
                    <stop offset="100%" stopColor="#54545e" />
                </linearGradient>
                <linearGradient id="greyTop" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="#a4a4b0" />
                    <stop offset="100%" stopColor="#8a8a96" />
                </linearGradient>
                <linearGradient id="greySideR" x1="100%" y1="0%" x2="0%" y2="0%">
                    <stop offset="0%" stopColor="#3a3a44" />
                    <stop offset="100%" stopColor="#707080" />
                </linearGradient>
                <linearGradient id="greyFront" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="#6e6e7a" />
                    <stop offset="100%" stopColor="#424250" />
                </linearGradient>
                {/* Silver platen */}
                <linearGradient id="platen" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="#dce0e8" />
                    <stop offset="30%" stopColor="#b4b8c4" />
                    <stop offset="65%" stopColor="#8890a0" />
                    <stop offset="100%" stopColor="#6a7080" />
                </linearGradient>
                <linearGradient id="platenHL" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="rgba(255,255,255,0.14)" />
                    <stop offset="100%" stopColor="rgba(255,255,255,0)" />
                </linearGradient>
                {/* Chrome */}
                <linearGradient id="chrome" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="#ecf0f4" />
                    <stop offset="42%" stopColor="#b4bcc8" />
                    <stop offset="100%" stopColor="#848c9c" />
                </linearGradient>
                <linearGradient id="chromeH" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#8090a0" />
                    <stop offset="35%" stopColor="#d8dce8" />
                    <stop offset="65%" stopColor="#9098a8" />
                    <stop offset="100%" stopColor="#7080a0" />
                </linearGradient>
                {/* Rubber roller */}
                <linearGradient id="rubber" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="#3c3c40" />
                    <stop offset="50%" stopColor="#1e1e22" />
                    <stop offset="100%" stopColor="#0e0e12" />
                </linearGradient>
                {/* Cream keys */}
                <radialGradient id="keyCreamy" cx="38%" cy="32%" r="65%">
                    <stop offset="0%" stopColor="#f6f3e8" />
                    <stop offset="55%" stopColor="#e8e4d4" />
                    <stop offset="100%" stopColor="#d4d0c0" />
                </radialGradient>
                {/* Red badge */}
                <linearGradient id="redBadge" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="#d43030" />
                    <stop offset="100%" stopColor="#8c1818" />
                </linearGradient>
                {/* Lever chrome */}
                <linearGradient id="leverG" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#9098a8" />
                    <stop offset="40%" stopColor="#d8dce8" />
                    <stop offset="100%" stopColor="#8090a0" />
                </linearGradient>
                {/* Scale */}
                <linearGradient id="scaleG" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="#d4d8e0" />
                    <stop offset="100%" stopColor="#a8acb8" />
                </linearGradient>
                {/* Paper */}
                <linearGradient id="paperG" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#dedad0" />
                    <stop offset="6%" stopColor="#faf8f0" />
                    <stop offset="94%" stopColor="#faf8f0" />
                    <stop offset="100%" stopColor="#dedad0" />
                </linearGradient>
                {/* Floor shadow */}
                <radialGradient id="floorSh" cx="50%" cy="50%" r="50%">
                    <stop offset="0%" stopColor="rgba(0,0,0,0.55)" />
                    <stop offset="100%" stopColor="rgba(0,0,0,0)" />
                </radialGradient>
                {/* Knob */}
                <radialGradient id="knobG" cx="34%" cy="28%" r="70%">
                    <stop offset="0%" stopColor="#dcdce0" />
                    <stop offset="55%" stopColor="#a0a4b0" />
                    <stop offset="100%" stopColor="#6c7080" />
                </radialGradient>
            </defs>

            {/* ░░ FLOOR SHADOW ░░ */}
            <ellipse cx="430" cy="500" rx="360" ry="14" fill="url(#floorSh)" />

            {/* ══════════════════════════════════════════
          GREY BASE — 3D extruded box
      ══════════════════════════════════════════ */}
            {/* Right side */}
            <polygon points="740,290 776,272 776,462 740,480" fill="url(#greySideR)" />
            <line x1="740" y1="290" x2="776" y2="272" stroke="rgba(255,255,255,0.07)" strokeWidth="1" />
            {/* Left side */}
            <polygon points="84,290 48,272 48,462 84,480" fill="url(#greySideR)" opacity="0.6" />
            {/* Front face */}
            <polygon points="84,460 740,460 776,442 48,442" fill="url(#greyFront)" />
            {/* Bottom */}
            <polygon points="48,462 776,462 776,480 48,480" fill="#2e2e38" />
            {/* Top perspective */}
            <polygon points="48,272 776,272 740,290 84,290" fill="url(#greyTop)" />
            <line x1="48" y1="272" x2="776" y2="272" stroke="rgba(255,255,255,0.08)" strokeWidth="1.5" />
            {/* Main top surface of grey base */}
            <rect x="84" y="290" width="656" height="170" rx="5" fill="url(#greyBase)" />
            <rect x="84" y="290" width="656" height="4" rx="2" fill="rgba(255,255,255,0.06)" />
            {/* Inner groove around base top */}
            <rect x="94" y="298" width="636" height="155" rx="4" fill="none"
                stroke="rgba(0,0,0,0.18)" strokeWidth="1.5" />

            {/* ══════════════════════════════════════════
          PINK/ROSE UPPER BODY
      ══════════════════════════════════════════ */}
            {/* Right side face */}
            <polygon points="714,142 748,126 748,306 714,322" fill="url(#roseSideR)" />
            <line x1="714" y1="142" x2="748" y2="126" stroke="rgba(255,255,255,0.1)" strokeWidth="1" />
            {/* Left side face */}
            <polygon points="110,142 76,126 76,306 110,322" fill="url(#roseSideL)" />
            {/* Top perspective face */}
            <polygon points="76,126 748,126 714,142 110,142" fill="#ddb8b4" />
            <polygon points="76,126 748,126 714,142 110,142" fill="url(#roseTop)" opacity="0.92" />
            <line x1="76" y1="126" x2="748" y2="126" stroke="rgba(255,255,255,0.16)" strokeWidth="2" />
            {/* Main rose body surface */}
            <rect x="110" y="142" width="604" height="180" rx="10" fill="url(#roseBody)" />
            {/* Subtle knit/textile texture dots */}
            {Array.from({ length: 18 }, (_, row) =>
                Array.from({ length: 36 }, (_, col) => (
                    <circle key={`${row}-${col}`}
                        cx={118 + col * 16.2} cy={150 + row * 9.8}
                        r="0.7" fill="rgba(0,0,0,0.055)" />
                ))
            )}
            {/* Top shine band */}
            <rect x="110" y="142" width="604" height="6" rx="4" fill="rgba(255,255,255,0.12)" />
            {/* Side inner shadows */}
            <rect x="110" y="142" width="28" height="180" rx="6" fill="rgba(0,0,0,0.1)" />
            <rect x="686" y="142" width="28" height="180" rx="6" fill="rgba(0,0,0,0.1)" />
            {/* Body outline */}
            <rect x="110" y="142" width="604" height="180" rx="10" fill="none"
                stroke="rgba(0,0,0,0.12)" strokeWidth="1.2" />

            {/* ══════════════════════════════════════════
          PLATEN ASSEMBLY (cylinder + knobs + rollers)
      ══════════════════════════════════════════ */}
            {/* Platen arm mounts */}
            <rect x="134" y="96" width="16" height="74" rx="5" fill="#7a7a86"
                stroke="rgba(255,255,255,0.06)" strokeWidth="1" />
            <rect x="674" y="96" width="16" height="74" rx="5" fill="#7a7a86"
                stroke="rgba(255,255,255,0.06)" strokeWidth="1" />

            {/* Main platen cylinder */}
            <rect x="126" y="72" width="572" height="58" rx="15" fill="url(#platen)" />
            {/* Platen highlight */}
            <rect x="130" y="75" width="564" height="22" rx="10" fill="url(#platenHL)" />
            <text
                x="412"
                y="110"
                textAnchor="middle"
                fill="#1e1b16"
                fontSize="13"
                fontWeight="bold"
                fontFamily="'Special Elite', cursive"
                letterSpacing="0.12em"
                style={{
                    opacity: 2,
                    pointerEvents: "none"
                }}
            >
                Click Here (Every story begins with a keystroke)
            </text>
            {/* Lower shadow */}
            <rect x="126" y="114" width="572" height="16" rx="0" fill="rgba(0,0,0,0.16)" />
            {/* Groove lines */}
            {Array.from({ length: 26 }, (_, i) => (
                <line key={i}
                    x1={148 + i * 21} y1="74" x2={148 + i * 21} y2="128"
                    stroke="rgba(0,0,0,0.09)" strokeWidth="1.2" />
            ))}
            <rect x="126" y="72" width="572" height="58" rx="15" fill="none"
                stroke="rgba(255,255,255,0.07)" strokeWidth="1" />

            {/* Black rubber rollers (the two black cylinders on platen) */}
            <rect x="188" y="76" width="26" height="50" rx="6" fill="url(#rubber)" />
            <rect x="188" y="76" width="26" height="12" rx="6" fill="rgba(255,255,255,0.07)" />
            <rect x="610" y="76" width="26" height="50" rx="6" fill="url(#rubber)" />
            <rect x="610" y="76" width="26" height="12" rx="6" fill="rgba(255,255,255,0.07)" />

            {/* Left platen knob (small) */}
            <ellipse cx="126" cy="101" rx="7" ry="29" fill="#606872" />
            <circle cx="115" cy="101" r="24" fill="url(#chrome)" />
            <circle cx="115" cy="101" r="16" fill="#909aa8" />
            <circle cx="115" cy="101" r="9" fill="url(#chrome)" />
            <circle cx="115" cy="101" r="4" fill="#d8dce4" />
            <line x1="107" y1="101" x2="123" y2="101" stroke="rgba(0,0,0,0.3)" strokeWidth="2" />
            <line x1="115" y1="93" x2="115" y2="109" stroke="rgba(0,0,0,0.3)" strokeWidth="2" />

            {/* Right platen knob (larger — the thumbscrew) */}
            <ellipse cx="698" cy="101" rx="7" ry="29" fill="#606872" />
            <circle cx="710" cy="101" r="30" fill="url(#chrome)" />
            <circle cx="710" cy="101" r="22" fill="#808898" />
            <circle cx="710" cy="101" r="14" fill="url(#chrome)" />
            <circle cx="710" cy="101" r="6" fill="#d0d4dc" />
            {/* Knurling lines */}
            {Array.from({ length: 10 }, (_, i) => {
                const angle = (i / 10) * Math.PI * 2
                return (
                    <line key={i}
                        x1={710 + Math.cos(angle) * 8} y1={101 + Math.sin(angle) * 8}
                        x2={710 + Math.cos(angle) * 21} y2={101 + Math.sin(angle) * 21}
                        stroke="rgba(0,0,0,0.25)" strokeWidth="2" />
                )
            })}

            {/* Paper slot (dark gap between platen and body) */}
            <rect x="162" y="128" width="500" height="18" rx="3" fill="#0a0a0e" />
            <rect x="162" y="128" width="500" height="7" rx="3" fill="#141418" />

            {/* ══ SCALE RULER ══ */}
            <rect x="162" y="144" width="500" height="13" rx="2" fill="url(#scaleG)" />
            {Array.from({ length: 52 }, (_, i) => (
                <line key={i}
                    x1={167 + i * 9.3} y1="144"
                    x2={167 + i * 9.3} y2={i % 5 === 0 ? "150" : "148"}
                    stroke="rgba(0,0,0,0.38)" strokeWidth={i % 5 === 0 ? "1.2" : "0.7"}
                />
            ))}
            {[10, 20, 30, 40, 50, 60, 70, 80].map((n, i) => (
                <text key={n}
                    x={167 + (i * 5 + 4.5) * 9.3} y="154"
                    textAnchor="middle" fill="rgba(0,0,0,0.45)"
                    fontSize="5" fontFamily="Courier Prime, monospace"
                >{n}</text>
            ))}
            <rect x="162" y="144" width="500" height="13" rx="2" fill="none"
                stroke="rgba(0,0,0,0.18)" strokeWidth="0.8" />

            {/* Paper bail wire */}
            <rect x="158" y="155" width="508" height="7" rx="3.5" fill="url(#chromeH)" />
            {/* Bail rollers */}
            {[230, 362, 500].map(x => (
                <g key={x}>
                    <ellipse cx={x} cy="158" rx="11" ry="6.5" fill="url(#chrome)" />
                    <ellipse cx={x} cy="158" rx="7" ry="4" fill="#d8dce4" />
                </g>
            ))}
            {/* Margin stops — black tabs */}
            <rect x="238" y="151" width="12" height="10" rx="2" fill="#1e1e22" />
            <rect x="488" y="151" width="12" height="10" rx="2" fill="#1e1e22" />

            {/* ══════════════════════════════════════════
          CARRIAGE RETURN LEVER — left side, curved (like photo)
      ══════════════════════════════════════════ */}
            <g className={leverSwing ? 'carriage-swing' : ''} style={{ transformOrigin: '110px 155px' }}>
                {/* Main lever arm (curved chrome rod) */}
                <path d="M 110,155 Q 82,138 68,116 Q 54,92 66,76 Q 76,62 92,72"
                    fill="none" stroke="url(#leverG)" strokeWidth="9" strokeLinecap="round" />
                {/* Shine highlight on lever */}
                <path d="M 110,155 Q 82,138 68,116 Q 54,92 66,76 Q 76,62 92,72"
                    fill="none" stroke="rgba(255,255,255,0.28)" strokeWidth="3.5" strokeLinecap="round" />
                {/* Lever handle paddle (the flat oval at the end) */}
                <g transform="rotate(-28, 88, 70)">
                    <ellipse cx="88" cy="68" rx="22" ry="13" fill="url(#leverG)" />
                    <ellipse cx="88" cy="68" rx="16" ry="9" fill="#c8d0dc" />
                    <ellipse cx="88" cy="68" rx="9" ry="5" fill="url(#chrome)" />
                    <ellipse cx="85" cy="65" rx="4" ry="2.5" fill="rgba(255,255,255,0.4)" />
                </g>
                {/* Lever pivot bracket */}
                <circle cx="110" cy="155" r="7" fill="url(#chrome)" />
                <circle cx="110" cy="155" r="4" fill="#c0c8d4" />
            </g>

            {/* Right side small adjustment knob */}
            <path d="M 720,152 Q 740,140 748,126"
                fill="none" stroke="url(#chrome)" strokeWidth="5" strokeLinecap="round" />
            <circle cx="748" cy="126" r="8" fill="url(#knobG)" />
            <circle cx="748" cy="126" r="4" fill="#d0d4dc" />

            {/* ══ RIBBON SPOOLS ══ */}
            {[218, 606].map(cx => (
                <g key={cx}>
                    <circle cx={cx} cy="195" r="28" fill="#282830" />
                    <circle cx={cx} cy="195" r="21" fill="#1a1a20" />
                    <circle cx={cx} cy="195" r="13" fill="#282830" />
                    <circle cx={cx} cy="195" r="5.5" fill="#3a3a42" />
                    {Array.from({ length: 6 }, (_, i) => {
                        const a = (i / 6) * Math.PI * 2
                        return (
                            <line key={i}
                                x1={cx + Math.cos(a) * 7} y1={195 + Math.sin(a) * 7}
                                x2={cx + Math.cos(a) * 19} y2={195 + Math.sin(a) * 19}
                                stroke="rgba(255,255,255,0.07)" strokeWidth="2.5" />
                        )
                    })}
                    <circle cx={cx - 4} cy="190" r="4" fill="rgba(255,255,255,0.03)" />
                </g>
            ))}
            {/* Ribbon strip */}
            <path d="M 246 196 Q 412 180 578 196"
                stroke="#181818" strokeWidth="5.5" fill="none" />
            <path d="M 246 200 Q 412 184 578 200"
                stroke="rgba(140,20,20,0.35)" strokeWidth="2.5" fill="none" />

            {/* Type guide bar */}
            <rect x="295" y="208" width="234" height="13" rx="4.5" fill="#181820" />
            <rect x="295" y="208" width="234" height="6" rx="4" fill="rgba(255,255,255,0.04)" />
            <rect x="378" y="205" width="68" height="18" rx="3" fill="#0e0e14" />

            {/* ══════════════════════════════════════════
          ROYAL BADGE
      ══════════════════════════════════════════ */}
            {/* Outer chrome frame */}
            <path d="M 352,224 Q 352,214 412,214 Q 472,214 472,224 L 472,244 Q 472,252 412,252 Q 352,252 352,244 Z"
                fill="url(#chrome)" />
            {/* Red body */}
            <path d="M 355,226 Q 355,217 412,217 Q 469,217 469,226 L 469,242 Q 469,249 412,249 Q 355,249 355,242 Z"
                fill="url(#redBadge)" />
            {/* Badge inner highlight */}
            <path d="M 358,219 Q 412,215 466,219" fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="1" />
            {/* ROYAL text */}
            <text x="412" y="236" textAnchor="middle" dominantBaseline="middle"
                fill="white" fontSize="15"
                fontFamily="'Special Elite', cursive"
                letterSpacing="3" fontWeight="bold">{userName ? userName.toUpperCase() : 'NIRAKAR'}</text>
            {/* Decorative dots above text */}
            {Array.from({ length: 7 }, (_, i) => (
                <circle key={i} cx={367 + i * 14} cy="222" r="1.5" fill="rgba(255,255,255,0.45)" />
            ))}

            {/* TAB CLEAR (left button) */}
            <g>
                <rect x="136" y="258" width="74" height="26" rx="6" fill="#c4c0ac" />
                <rect x="136" y="258" width="74" height="10" rx="6" fill="rgba(255,255,255,0.28)" />
                <text x="173" y="272" textAnchor="middle" dominantBaseline="middle"
                    fill="#3a3830" fontSize="7" fontFamily="'Special Elite', cursive"
                    letterSpacing="0.5">TAB CLEAR</text>
                <rect x="138" y="283" width="70" height="5" rx="2.5" fill="#9a9886" />
            </g>
            {/* TAB SET (right button) */}
            <g>
                <rect x="614" y="258" width="70" height="26" rx="6" fill="#c4c0ac" />
                <rect x="614" y="258" width="70" height="10" rx="6" fill="rgba(255,255,255,0.28)" />
                <text x="649" y="272" textAnchor="middle" dominantBaseline="middle"
                    fill="#3a3830" fontSize="7" fontFamily="'Special Elite', cursive"
                    letterSpacing="0.5">TAB SET</text>
                <rect x="616" y="283" width="66" height="5" rx="2.5" fill="#9a9886" />
            </g>

            {/* ══════════════════════════════════════════
          KEYBOARD WELL (recessed dark area)
      ══════════════════════════════════════════ */}
            <rect x="122" y="290" width="580" height="166" rx="14"
                fill="rgba(0,0,0,0.40)" />
            <rect x="122" y="290" width="580" height="5" rx="4"
                fill="rgba(255,255,255,0.035)" />
            {/* Inner side shadows */}
            <rect x="122" y="290" width="18" height="166" rx="5" fill="rgba(0,0,0,0.22)" />
            <rect x="684" y="290" width="18" height="166" rx="5" fill="rgba(0,0,0,0.22)" />

            {/* Fancy "Click here to write" prompt */}
            <g style={{ opacity: 0.25 }}>
                <text
                    x="412" y="303"
                    textAnchor="middle"
                    fill="url(#roseBody)"
                    fontSize="9.5"
                    fontFamily="'Special Elite', cursive"
                    style={{
                        letterSpacing: '0.2em',
                        textTransform: 'uppercase',
                        pointerEvents: 'none'
                    }}
                >
                    — click here to write —
                </text>
            </g>

            {/* ══════════════════════════════════════════
          KEYS — round cream cylindrical Royal-style
      ══════════════════════════════════════════ */}

            {/* NUMBER ROW (y=308, 12 keys) */}
            {ROW_NUMS.map((label, i) => (
                <RoundKey key={label}
                    cx={148 + i * 48} cy={308}
                    label={label}
                    r={17}
                    pressed={isPressed(label)}
                    fontSize={11}
                />
            ))}

            {/* QWERTY ROW (y=358, offset +24) */}
            {ROW_QWERTY.map((label, i) => (
                <RoundKey key={label}
                    cx={172 + i * 48} cy={358}
                    label={label}
                    r={18}
                    pressed={isPressed(label)}
                />
            ))}
            {/* Backspace */}
            <WideKey
                x={658} y={356} w={56} h={34}
                label="← BSP"
                pressed={isPressed('Backspace')}
                fontSize={8}
            />

            {/* ASDF ROW (y=408, offset +38) */}
            {ROW_ASDF.map((label, i) => (
                <RoundKey key={label}
                    cx={186 + i * 48} cy={408}
                    label={label}
                    r={18}
                    pressed={isPressed(label)}
                />
            ))}
            {/* Large Enter */}
            <WideKey
                x={618} y={406} w={86} h={34}
                label="↵ ENTER"
                pressed={isPressed('Enter')}
                fontSize={9}
            />
            {/* Left Shift */}
            <WideKey
                x={126} y={406} w={52} h={34}
                label="⇧ SHF"
                pressed={isPressed('Shift')}
                fontSize={8}
            />

            {/* ZXCV ROW (y=452, offset +50) */}
            {ROW_ZXCV.map((label, i) => (
                <RoundKey key={label + i}
                    cx={198 + i * 48} cy={452}
                    label={label}
                    r={16}
                    pressed={isPressed(label)}
                    fontSize={10}
                />
            ))}
            {/* Right Shift */}
            <WideKey
                x={646} y={450} w={62} h={30}
                label="⇧ SHIFT"
                pressed={isPressed('Shift')}
                fontSize={8}
            />
            {/* Left control area */}
            <WideKey
                x={126} y={450} w={58} h={30}
                label="CTRL"
                pressed={false}
                fontSize={8}
            />

            {/* SPACE BAR ROW — grey/cream wide bar */}
            {(() => {
                const pressed = isPressed(' ')
                const dy = pressed ? 4 : 0
                return (
                    <g className={pressed ? 'key-tap' : ''} style={{ transformOrigin: '412px 502px' }}>
                        {/* Front face */}
                        <rect x="254" y={488 + 16} width="316" height={pressed ? 14 : 18} rx="4"
                            fill="#b0b0a0" />
                        {/* Top surface */}
                        <rect x="254" y={488 + dy} width="316" height="30" rx="7"
                            fill="#dcdac8" stroke="rgba(0,0,0,0.1)" strokeWidth="0.8" />
                        <rect x="260" y={490 + dy} width="304" height="11" rx="5"
                            fill="rgba(255,255,255,0.24)" />
                    </g>
                )
            })()}

            {/* ══ CORNER SCREWS ══ */}
            {[[138, 158], [686, 158], [138, 308], [686, 308]].map(([cx, cy], i) => (
                <g key={i}>
                    <circle cx={cx} cy={cy} r="8" fill="url(#chrome)" />
                    <circle cx={cx} cy={cy} r="5" fill="#9098a8" />
                    <line x1={cx - 3} y1={cy} x2={cx + 3} y2={cy} stroke="rgba(0,0,0,0.4)" strokeWidth="1.5" />
                    <line x1={cx} y1={cy - 3} x2={cx} y2={cy + 3} stroke="rgba(0,0,0,0.4)" strokeWidth="1.5" />
                </g>
            ))}

            {/* ══ BASE FEET ══ */}
            {[152, 240, 584, 672].map(cx => (
                <g key={cx}>
                    <ellipse cx={cx} cy={476} rx="26" ry="9" fill="rgba(0,0,0,0.4)" />
                    <polygon points={`${cx - 18},460 ${cx + 18},460 ${cx + 18},470 ${cx - 18},470`} fill="#323238" />
                    <rect x={cx - 18} y={452} width="36" height="10" rx="5" fill="url(#chrome)" />
                </g>
            ))}
        </svg>
    )
}
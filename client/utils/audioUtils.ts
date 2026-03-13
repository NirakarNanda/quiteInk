// ── Typewriter sound synthesizer (Web Audio API) ──
export function createTypewriterSound(ctx: AudioContext, type: 'key' | 'return' | 'ding') {
  const now = ctx.currentTime

  if (type === 'key') {
    // Sharp mechanical clack
    const bufferSize = ctx.sampleRate * 0.06
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate)
    const data = buffer.getChannelData(0)
    for (let i = 0; i < bufferSize; i++) {
        const t = i / ctx.sampleRate
        data[i] = (Math.random() * 2 - 1) * Math.exp(-t * 120) * 0.7
        data[i] += Math.sin(2 * Math.PI * 800 * t) * Math.exp(-t * 200) * 0.15
        data[i] += Math.sin(2 * Math.PI * 1600 * t) * Math.exp(-t * 300) * 0.08
    }
    const src = ctx.createBufferSource()
    src.buffer = buffer
    const gain = ctx.createGain()
    gain.gain.setValueAtTime(0.55, now)
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.06)
    const filter = ctx.createBiquadFilter()
    filter.type = 'bandpass'
    filter.frequency.value = 1200
    filter.Q.value = 0.8
    src.connect(filter)
    filter.connect(gain)
    gain.connect(ctx.destination)
    src.start(now)

  } else if (type === 'return') {
    const bufferSize = ctx.sampleRate * 0.18
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate)
    const data = buffer.getChannelData(0)
    for (let i = 0; i < bufferSize; i++) {
        const t = i / ctx.sampleRate
        data[i] = (Math.random() * 2 - 1) * Math.exp(-t * 18) * 0.9
        data[i] += Math.sin(2 * Math.PI * 180 * t) * Math.exp(-t * 25) * 0.4
        data[i] += Math.sin(2 * Math.PI * 320 * t) * Math.exp(-t * 40) * 0.2
    }
    const src = ctx.createBufferSource()
    src.buffer = buffer
    const gain = ctx.createGain()
    gain.gain.setValueAtTime(0.7, now)
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.2)
    src.connect(gain)
    gain.connect(ctx.destination)
    src.start(now)

  } else if (type === 'ding') {
    const osc = ctx.createOscillator()
    osc.type = 'sine'
    osc.frequency.setValueAtTime(2200, now)
    osc.frequency.exponentialRampToValueAtTime(1800, now + 0.15)
    const gain = ctx.createGain()
    gain.gain.setValueAtTime(0.0, now)
    gain.gain.linearRampToValueAtTime(0.35, now + 0.005)
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.6)
    osc.connect(gain)
    gain.connect(ctx.destination)
    osc.start(now)
    osc.stop(now + 0.65)
  }
}

export const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December']

export const FALLBACKS = [
  "There's something real in what you've written. Stay with it a moment longer.",
  "The words you chose aren't accidental — something in you knew what needed saying.",
  "Even unfinished thoughts carry weight. You've named something true tonight.",
  "Writing is its own kind of breathing. You've exhaled something that needed to leave.",
  "Whatever brought you here tonight — it was worth listening to.",
  "These words will mean something different to you in the morning. That's not a bad thing.",
]

export function getDateStamp() {
  const d = new Date()
  return `${MONTHS[d.getMonth()]} ${d.getDate()}, ${d.getFullYear()}`
}

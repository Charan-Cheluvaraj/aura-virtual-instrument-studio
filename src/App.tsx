import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { InstrumentSelector, type InstrumentType } from './components/InstrumentSelector'
import { MasterVolume } from './components/MasterVolume'
import { PianoKeyboard } from './components/PianoKeyboard'
import { initAudioEngine, setMasterVolume } from './audio/audioEngine'
import { Activity, Cpu, Sparkles, Volume2, Power, Loader2, Music, CheckCircle2, Waves, Sliders } from 'lucide-react'

export function App() {
  const [activeInstrument, setActiveInstrument] = useState<InstrumentType>('Violin')
  const [masterVol, setMasterVol] = useState<number>(80)
  const [isAudioReady, setIsAudioReady] = useState<boolean>(false)
  const [isInitializing, setIsInitializing] = useState<boolean>(false)
  const [initError, setInitError] = useState<string | null>(null)

  // Global Instrument Hotkeys [1, 2, 3, 4]
  useEffect(() => {
    const handleHotkey = (e: KeyboardEvent) => {
      if (e.repeat) return
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return

      switch (e.key) {
        case '1':
          setActiveInstrument('Trumpet')
          break
        case '2':
          setActiveInstrument('Harmonium')
          break
        case '3':
          setActiveInstrument('Flute')
          break
        case '4':
          setActiveInstrument('Violin')
          break
        default:
          break
      }
    }

    window.addEventListener('keydown', handleHotkey)
    return () => {
      window.removeEventListener('keydown', handleHotkey)
    }
  }, [])

  const handlePowerOn = async () => {
    setIsInitializing(true)
    setInitError(null)
    try {
      // 1. Initialize Tone AudioContext, synthesize reverb impulse, and connect mastering chain
      await initAudioEngine()
      // 2. Sync initial master volume to Tone.Destination
      setMasterVolume(masterVol, false)
      setIsAudioReady(true)
    } catch (err: unknown) {
      console.error('Audio Context Initialization failed:', err)
      setInitError('Failed to initialize audio engine. Please try again.')
    } finally {
      setIsInitializing(false)
    }
  }

  return (
    <div className="relative min-h-screen w-full bg-[#0c0b0a] text-stone-200 flex flex-col justify-between selection:bg-amber-600/30 selection:text-amber-200 overflow-x-hidden font-sans">
      
      {/* Warm Acoustic Stage Spotlight Radial Atmosphere */}
      <div className="absolute top-0 inset-x-0 h-[650px] stage-spotlight pointer-events-none z-0" />
      <div className="absolute inset-0 opacity-[0.02] pointer-events-none bg-[radial-gradient(#d97706_1px,transparent_1px)] [background-size:24px_24px]" />

      {/* Top Header & Studio Navigation Bar */}
      <header className="relative z-10 w-full border-b border-amber-900/20 bg-[#121110]/85 backdrop-blur-xl">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-3 flex flex-wrap items-center justify-between gap-4">
          
          {/* Studio Brand: Calligraphic Aura Logo */}
          <div className="flex items-center gap-3.5">
            <div className="relative flex items-center justify-center w-11 h-11 rounded-2xl bg-gradient-to-br from-[#261f18] to-[#14110e] border border-amber-700/30 shadow-[0_4px_14px_rgba(0,0,0,0.6)]">
              <Sparkles size={18} className="text-amber-400" />
              <div 
                className={`absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full border-2 border-[#121110] ${
                  isAudioReady ? 'bg-amber-400 shadow-[0_0_8px_rgba(245,158,11,0.8)]' : 'bg-stone-600'
                }`} 
              />
            </div>

            <div className="flex flex-col">
              <div className="flex items-baseline gap-2.5">
                <span className="font-calligraphy text-4xl text-amber-500 font-normal tracking-normal lowercase leading-none select-none">
                  Aura
                </span>
                <span className={`text-[9px] font-mono font-medium px-1.5 py-0.5 rounded border leading-none ${
                  isAudioReady 
                    ? 'bg-amber-500/10 text-amber-300 border-amber-500/30' 
                    : 'bg-stone-800 text-stone-400 border-stone-700'
                }`}>
                  {isAudioReady ? 'MASTERING ON' : 'STANDBY'}
                </span>
              </div>
              <p className="text-[11px] text-stone-400 font-mono tracking-tight flex items-center gap-2 mt-0.5">
                <span className="text-amber-200/60 uppercase tracking-widest text-[10px]">Acoustic Instrument Studio</span>
                <span className="text-stone-600">•</span>
                <span className={`flex items-center gap-1 ${isAudioReady ? 'text-amber-400' : 'text-stone-500'}`}>
                  <Activity size={10} /> {isAudioReady ? 'EQ3 → COMP → REVERB' : 'AUDIO LOCKED'}
                </span>
              </p>
            </div>
          </div>

          {/* Master Volume Controller */}
          <div className="flex items-center gap-3">
            <MasterVolume 
              initialVolume={masterVol} 
              onVolumeChange={(val) => setMasterVol(val)} 
            />
          </div>
        </div>
      </header>

      {/* Main Studio Workstation Console */}
      <main className="relative z-10 flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 py-8 flex flex-col gap-6 justify-center">
        
        {/* Top Control Bar: Instrument Selector & Signal Chain Badges */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-3.5 rounded-2xl bg-[#141210]/60 border border-amber-900/25 backdrop-blur-md">
          <InstrumentSelector 
            currentInstrument={activeInstrument} 
            onSelect={setActiveInstrument} 
          />

          <div className="hidden sm:flex items-center gap-4 text-[10px] font-mono text-stone-400 pr-2">
            <div className="flex items-center gap-1.5">
              <Volume2 size={12} className="text-amber-400" />
              <span>ACTIVE: <strong className="text-amber-200 font-medium">{activeInstrument.toUpperCase()}</strong></span>
            </div>
            <div className="flex items-center gap-1.5">
              <Sliders size={12} className="text-orange-400" />
              <span>CHAIN: EQ3 • COMP (-16dB)</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Waves size={12} className="text-amber-500" />
              <span>REVERB: 3.5s / 25%</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Cpu size={12} className={isAudioReady ? 'text-amber-400' : 'text-stone-500'} />
              <span>{isAudioReady ? 'DSP 24-BIT' : 'UNLOADED'}</span>
            </div>
          </div>
        </div>

        {/* Centerpiece 2-Octave Grand Piano Keyboard */}
        <div className="flex flex-col gap-3">
          <div className="flex items-center justify-between px-2 text-[11px] font-mono text-stone-400">
            <span className="tracking-widest uppercase flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.6)]" />
              PRIMARY KEYBED SURFACE [{activeInstrument.toUpperCase()}]
            </span>
            <span className="text-amber-400/70 font-mono">Aged Ivory & Ebony • 24 Keys</span>
          </div>

          <PianoKeyboard activeInstrument={activeInstrument} />
        </div>

        {/* Studio Guide & Keymap Overlay Panel */}
        <section className="rounded-xl p-4 bg-[#141210]/70 border border-amber-900/20 backdrop-blur-md flex flex-col md:flex-row items-center justify-between gap-3 text-xs text-stone-400">
          <div className="flex flex-wrap items-center gap-2 text-[11px] font-mono">
            <span className="text-amber-200 font-semibold flex items-center gap-1">⌨ KEYMAP:</span>
            <span className="px-2 py-0.5 rounded bg-[#181614] border border-amber-900/30 text-stone-300">
              Octave 3: [Z–M] / Acc: [Q, R, I, O, P]
            </span>
            <span className="px-2 py-0.5 rounded bg-[#181614] border border-amber-900/30 text-stone-300">
              Octave 4: [A–J] / Acc: [W, E, T, Y, U]
            </span>
            <span className="px-2 py-0.5 rounded bg-[#1c1712] border border-amber-600/40 text-amber-300">
              Hotkeys: [1] Trumpet, [2] Harmonium, [3] Flute, [4] Violin
            </span>
          </div>

          <div className="text-[11px] font-mono text-amber-400/90 tracking-wide text-right font-medium">
            ACOUSTIC MASTERING STRIP ACTIVE
          </div>
        </section>
      </main>

      {/* Studio Footer Status Rail */}
      <footer className="relative z-10 w-full border-t border-amber-900/20 bg-[#0e0d0c] text-[11px] font-mono text-stone-400 py-2.5 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-3">
            <span className="text-stone-400">SYS_REV: 0.4.5-mastering</span>
            <span className="text-stone-600">•</span>
            <span className={isAudioReady ? 'text-amber-400' : 'text-stone-500'}>
              SIGNAL_CHAIN: {isAudioReady ? 'Samplers → EQ3 → Compressor → Reverb → Destination' : 'LOCKED'}
            </span>
          </div>

          <div className="flex items-center gap-4">
            <span className="text-amber-400/80">REVERB IR: 3.5s / 25% WET</span>
            <span className="text-stone-400 font-calligraphy text-base lowercase tracking-normal text-amber-500/80">Aura Studio</span>
          </div>
        </div>
      </footer>

      {/* Full-Screen Glassmorphic Power On / Audio Unlock Overlay */}
      <AnimatePresence>
        {!isAudioReady && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, transition: { duration: 0.45 } }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-2xl"
          >
            {/* Warm copper glow orb behind modal */}
            <div className="absolute w-96 h-96 rounded-full bg-amber-600/10 blur-3xl pointer-events-none" />

            <motion.div
              initial={{ scale: 0.94, opacity: 0, y: 16 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.96, opacity: 0, y: -10 }}
              transition={{ type: 'spring', stiffness: 400, damping: 30 }}
              className="relative w-full max-w-md rounded-3xl p-6 sm:p-8 bg-[#141210]/95 border border-amber-900/40 shadow-[0_25px_60px_rgba(0,0,0,0.95),inset_0_1px_1px_rgba(245,158,11,0.15)] flex flex-col items-center text-center"
            >
              {/* Hardware Status Dot */}
              <div className="flex items-center gap-2 mb-6 px-3 py-1 rounded-full bg-[#1b1815] border border-amber-900/30">
                <span className="w-2 h-2 rounded-full bg-amber-500 animate-ping" />
                <span className="text-[10px] font-mono tracking-widest text-amber-300/80 uppercase">
                  Acoustic Audio Context Standby
                </span>
              </div>

              {/* Main Icon */}
              <div className="relative mb-4 flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-[#2a221a] to-[#14110e] border border-amber-600/30 shadow-[0_12px_28px_rgba(0,0,0,0.7)]">
                <Music size={36} className="text-amber-400" />
                <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-[#1b1815] border border-amber-700/40 flex items-center justify-center">
                  <Power size={13} className="text-amber-400" />
                </div>
              </div>

              {/* Calligraphy Aura Brand */}
              <div className="font-calligraphy text-5xl text-amber-500 font-normal tracking-normal lowercase mb-1 select-none">
                Aura
              </div>

              <h2 className="text-lg font-bold tracking-tight text-amber-100 mb-2">
                Initialize Studio & Mastering Chain
              </h2>
              <p className="text-xs text-stone-400 max-w-xs leading-relaxed mb-6 font-sans">
                Web browsers require user gesture authorization before starting WebAudio.
                Click below to power on Tone.js and calibrate the mastering channel strip.
              </p>

              {/* Mastering Chain & Sampler Pre-flight Badges */}
              <div className="w-full grid grid-cols-2 gap-2 mb-6 text-left">
                {[
                  { name: 'Master EQ3', format: '+2dB Low / +3dB Sparkle' },
                  { name: 'Compressor', format: '-16dB / Ratio 3:1' },
                  { name: 'Master Reverb', format: '3.5s Spatial Decay' },
                  { name: 'Samplers', format: '4 Acoustic Presets' },
                ].map((item) => (
                  <div
                    key={item.name}
                    className="flex items-center gap-2 p-2 rounded-lg bg-[#1a1714] border border-amber-900/30"
                  >
                    <CheckCircle2 size={13} className="text-amber-400 shrink-0" />
                    <div className="leading-none">
                      <div className="text-[11px] font-semibold text-stone-200">{item.name}</div>
                      <div className="text-[9px] font-mono text-amber-200/50">{item.format}</div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Power On Trigger Button with Technical Loading State */}
              <motion.button
                type="button"
                onClick={handlePowerOn}
                disabled={isInitializing}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className={`w-full py-3.5 px-6 rounded-xl font-semibold text-sm flex items-center justify-center gap-2.5 transition-all shadow-[0_12px_28px_rgba(217,119,6,0.3)] cursor-pointer ${
                  isInitializing
                    ? 'bg-stone-900 text-stone-500 cursor-not-allowed border border-stone-800'
                    : 'bg-gradient-to-r from-amber-600 via-amber-500 to-amber-600 hover:from-amber-500 hover:to-amber-400 text-stone-950 border border-amber-400/40'
                }`}
              >
                {isInitializing ? (
                  <>
                    <Loader2 size={16} className="animate-spin text-amber-400" />
                    <span className="font-mono text-xs">Buffering Audio Context & Reverb Impulse...</span>
                  </>
                ) : (
                  <>
                    <Power size={16} className="text-stone-950" />
                    <span>Power On Studio</span>
                  </>
                )}
              </motion.button>

              {initError && (
                <p className="mt-3 text-xs text-rose-400 font-mono">{initError}</p>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default App

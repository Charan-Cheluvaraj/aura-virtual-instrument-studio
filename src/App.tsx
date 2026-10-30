import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { InstrumentSelector, type InstrumentType } from './components/InstrumentSelector'
import { MasterVolume } from './components/MasterVolume'
import { PianoKeyboard } from './components/PianoKeyboard'
import { initAudioEngine, setMasterVolume } from './audio/audioEngine'
import { Activity, Sparkles, Power, Loader2, Music, CheckCircle2 } from 'lucide-react'

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
      // Initialize Tone AudioContext, compute spatial reverb impulse, and load multi-samples
      await initAudioEngine()
      // Synchronize master volume level
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
    <div className="relative min-h-screen w-full bg-[#f7f6f3] text-stone-800 flex flex-col justify-between selection:bg-[#b87a41]/20 selection:text-stone-900 overflow-x-hidden font-sans">
      
      {/* Subtle organic warm stage vignette */}
      <div className="absolute top-0 inset-x-0 h-[500px] stage-spotlight pointer-events-none z-0" />

      {/* Top Header & Studio Navigation Bar */}
      <header className="relative z-10 w-full border-b border-stone-200/80 bg-white/80 backdrop-blur-md shadow-[0_1px_3px_rgba(0,0,0,0.02)]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-3 flex flex-wrap items-center justify-between gap-4">
          
          {/* Studio Brand: Clean Calligraphic Melodify Logo */}
          <div className="flex items-center gap-3.5">
            <div className="relative flex items-center justify-center w-10 h-10 rounded-2xl bg-stone-100 border border-stone-200/90 shadow-xs">
              <Sparkles size={17} className="text-[#b87a41]" />
              <div 
                className={`absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full border-2 border-white ${
                  isAudioReady ? 'bg-[#b87a41]' : 'bg-stone-300'
                }`} 
              />
            </div>

            <div className="flex flex-col">
              <div className="flex items-baseline gap-2.5">
                <span className="font-calligraphy text-4xl text-[#b87a41] font-normal tracking-normal leading-none select-none">
                  Melodify
                </span>
                <span className={`text-[9px] font-mono font-medium px-1.5 py-0.5 rounded border leading-none ${
                  isAudioReady 
                    ? 'bg-stone-100 text-stone-800 border-stone-300' 
                    : 'bg-stone-100 text-stone-400 border-stone-200'
                }`}>
                  {isAudioReady ? 'DSP ACTIVE' : 'DSP STANDBY'}
                </span>
              </div>
              <p className="text-[11px] text-stone-500 font-mono tracking-tight flex items-center gap-2 mt-0.5">
                <span className="text-stone-500 uppercase tracking-widest text-[10px]">Acoustic Instrument Studio</span>
                <span className="text-stone-300">•</span>
                <span className={`flex items-center gap-1 ${isAudioReady ? 'text-[#b87a41]' : 'text-stone-400'}`}>
                  <Activity size={10} /> {isAudioReady ? 'EQ3 → COMP → DELAY → REVERB' : 'AUDIO LOCKED'}
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
        
        {/* Top Control Bar: Clean Instrument Selector */}
        <div className="flex items-center justify-center sm:justify-start p-3.5 rounded-2xl bg-white border border-stone-200/80 shadow-[0_2px_12px_rgba(0,0,0,0.02)] backdrop-blur-md">
          <InstrumentSelector 
            currentInstrument={activeInstrument} 
            onSelect={setActiveInstrument} 
          />
        </div>

        {/* Centerpiece 2-Octave Grand Piano Keyboard */}
        <PianoKeyboard activeInstrument={activeInstrument} />
      </main>

      {/* Studio Footer Status Rail */}
      <footer className="relative z-10 w-full border-t border-stone-200/80 bg-white text-[11px] font-mono text-stone-400 py-2.5 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-3">
            <span className="text-stone-500">SYS_REV: 0.5.0-clean</span>
            <span className="text-stone-300">•</span>
            <span className={isAudioReady ? 'text-stone-700 font-medium' : 'text-stone-400'}>
              SIGNAL_CHAIN: {isAudioReady ? 'Multi-Samplers → EQ3 → Compressor → FeedbackDelay → Reverb → Destination' : 'STANDBY'}
            </span>
          </div>

          <div className="flex items-center gap-4">
            <span className="text-stone-500">DELAY: 8n • REVERB: 4s</span>
            <span className="font-calligraphy text-base tracking-normal text-[#b87a41]">Melodify Studio</span>
          </div>
        </div>
      </footer>

      {/* Clean Frosted Glass Power-On Overlay Modal */}
      <AnimatePresence>
        {!isAudioReady && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, transition: { duration: 0.45 } }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/30 backdrop-blur-md"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 14 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.96, opacity: 0, y: -10 }}
              transition={{ type: 'spring', stiffness: 400, damping: 30 }}
              className="relative w-full max-w-md rounded-3xl p-6 sm:p-8 bg-white/95 border border-stone-200/80 shadow-[0_25px_60px_rgba(0,0,0,0.12)] backdrop-blur-xl flex flex-col items-center text-center"
            >
              {/* Status Dot */}
              <div className="flex items-center gap-2 mb-6 px-3 py-1 rounded-full bg-stone-100 border border-stone-200/70">
                <span className="w-2 h-2 rounded-full bg-[#b87a41] animate-ping" />
                <span className="text-[10px] font-mono tracking-widest text-stone-500 uppercase font-medium">
                  Audio Context Standby
                </span>
              </div>

              {/* Main Icon */}
              <div className="relative mb-3 flex items-center justify-center w-18 h-18 rounded-2xl bg-stone-100 border border-stone-200/80 shadow-xs">
                <Music size={32} className="text-[#b87a41]" />
                <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-white border border-stone-200 flex items-center justify-center shadow-xs">
                  <Power size={12} className="text-stone-600" />
                </div>
              </div>

              {/* Calligraphy Melodify Brand */}
              <div className="font-calligraphy text-5xl text-[#b87a41] font-normal tracking-normal mb-1 select-none">
                Melodify
              </div>

              <h2 className="text-lg font-bold tracking-tight text-stone-900 mb-1.5 font-sans">
                Initialize Acoustic Studio
              </h2>
              <p className="text-xs text-stone-500 max-w-xs leading-relaxed mb-6 font-sans">
                Web browsers require user gesture authorization before starting WebAudio.
                Click below to power on Tone.js and calibrate the multi-sample FX chain.
              </p>

              {/* Pre-flight Specs Cards */}
              <div className="w-full grid grid-cols-2 gap-2 mb-6 text-left">
                {[
                  { name: 'Multi-Sampling', format: '9 Sample Chromatic Set' },
                  { name: 'Compressor', format: 'Transparent Peak Control' },
                  { name: 'Feedback Delay', format: '8n Spatial Echo' },
                  { name: 'Convolution Reverb', format: '4.0s Acoustic Decay' },
                ].map((item) => (
                  <div
                    key={item.name}
                    className="flex items-center gap-2 p-2 rounded-xl bg-stone-50 border border-stone-200/70"
                  >
                    <CheckCircle2 size={13} className="text-[#b87a41] shrink-0" />
                    <div className="leading-none">
                      <div className="text-[11px] font-semibold text-stone-800">{item.name}</div>
                      <div className="text-[9px] font-mono text-stone-400">{item.format}</div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Sleek Matte Dark-Charcoal Pill Button */}
              <motion.button
                type="button"
                onClick={handlePowerOn}
                disabled={isInitializing}
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.98 }}
                className={`w-full py-3.5 px-6 rounded-full font-semibold text-sm flex items-center justify-center gap-2.5 transition-all shadow-md cursor-pointer ${
                  isInitializing
                    ? 'bg-stone-200 text-stone-500 cursor-not-allowed border border-stone-300'
                    : 'bg-[#2c2c2c] hover:bg-[#1a1a1a] text-white border border-stone-800'
                }`}
              >
                {isInitializing ? (
                  <>
                    <Loader2 size={16} className="animate-spin text-[#b87a41]" />
                    <span className="font-mono text-xs">Buffering Audio Context & Reverb Impulse...</span>
                  </>
                ) : (
                  <>
                    <Power size={15} className="text-white" />
                    <span>Power On Studio</span>
                  </>
                )}
              </motion.button>

              {initError && (
                <p className="mt-3 text-xs text-rose-500 font-mono">{initError}</p>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default App
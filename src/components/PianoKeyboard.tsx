import { useState, useEffect, useCallback } from 'react'
import { motion } from 'motion/react'
import { playNote, stopNote } from '../audio/audioEngine'

interface PianoKeyInfo {
  note: string
  label: string
  keyTrigger?: string
  isBlack: boolean
}

// 2 Octaves: C3 to B4 (14 white keys: C3-B3, C4-B4)
const WHITE_KEYS: PianoKeyInfo[] = [
  // Octave 3
  { note: 'C3', label: 'C3', keyTrigger: 'Z', isBlack: false },
  { note: 'D3', label: 'D3', keyTrigger: 'X', isBlack: false },
  { note: 'E3', label: 'E3', keyTrigger: 'C', isBlack: false },
  { note: 'F3', label: 'F3', keyTrigger: 'V', isBlack: false },
  { note: 'G3', label: 'G3', keyTrigger: 'B', isBlack: false },
  { note: 'A3', label: 'A3', keyTrigger: 'N', isBlack: false },
  { note: 'B3', label: 'B3', keyTrigger: 'M', isBlack: false },

  // Octave 4
  { note: 'C4', label: 'C4', keyTrigger: 'A', isBlack: false },
  { note: 'D4', label: 'D4', keyTrigger: 'S', isBlack: false },
  { note: 'E4', label: 'E4', keyTrigger: 'D', isBlack: false },
  { note: 'F4', label: 'F4', keyTrigger: 'F', isBlack: false },
  { note: 'G4', label: 'G4', keyTrigger: 'G', isBlack: false },
  { note: 'A4', label: 'A4', keyTrigger: 'H', isBlack: false },
  { note: 'B4', label: 'B4', keyTrigger: 'J', isBlack: false },
]

interface BlackKeyPosition extends PianoKeyInfo {
  leftPercent: number
}

// 10 Black keys across 2 octaves
const BLACK_KEYS: BlackKeyPosition[] = [
  // Octave 3 (C#3, D#3, F#3, G#3, A#3) - mapped to Q, R, I, O, P
  { note: 'C#3', label: 'C#3', keyTrigger: 'Q', isBlack: true, leftPercent: 5.2 },
  { note: 'D#3', label: 'D#3', keyTrigger: 'R', isBlack: true, leftPercent: 12.4 },
  { note: 'F#3', label: 'F#3', keyTrigger: 'I', isBlack: true, leftPercent: 26.6 },
  { note: 'G#3', label: 'G#3', keyTrigger: 'O', isBlack: true, leftPercent: 33.8 },
  { note: 'A#3', label: 'A#3', keyTrigger: 'P', isBlack: true, leftPercent: 41.0 },

  // Octave 4 (C#4, D#4, F#4, G#4, A#4) - mapped to W, E, T, Y, U
  { note: 'C#4', label: 'C#4', keyTrigger: 'W', isBlack: true, leftPercent: 55.2 },
  { note: 'D#4', label: 'D#4', keyTrigger: 'E', isBlack: true, leftPercent: 62.4 },
  { note: 'F#4', label: 'F#4', keyTrigger: 'T', isBlack: true, leftPercent: 76.6 },
  { note: 'G#4', label: 'G#4', keyTrigger: 'Y', isBlack: true, leftPercent: 83.8 },
  { note: 'A#4', label: 'A#4', keyTrigger: 'U', isBlack: true, leftPercent: 91.0 },
]

const KEY_TO_NOTE: Record<string, string> = {
  z: 'C3', x: 'D3', c: 'E3', v: 'F3', b: 'G3', n: 'A3', m: 'B3',
  q: 'C#3', r: 'D#3', i: 'F#3', o: 'G#3', p: 'A#3',
  a: 'C4', s: 'D4', d: 'E4', f: 'F4', g: 'G4', h: 'A4', j: 'B4',
  w: 'C#4', e: 'D#4', t: 'F#4', y: 'G#4', u: 'A#4',
}

interface PianoKeyboardProps {
  activeInstrument?: string
}

export const PianoKeyboard = ({ activeInstrument = 'Violin' }: PianoKeyboardProps) => {
  const [activeNotes, setActiveNotes] = useState<Set<string>>(new Set())

  const handleKeyDown = useCallback(
    (note: string) => {
      setActiveNotes((prev) => {
        if (prev.has(note)) return prev
        playNote(activeInstrument, note)
        const next = new Set(prev)
        next.add(note)
        return next
      })
    },
    [activeInstrument]
  )

  const handleKeyUp = useCallback(
    (note: string) => {
      setActiveNotes((prev) => {
        if (!prev.has(note)) return prev
        stopNote(activeInstrument, note)
        const next = new Set(prev)
        next.delete(note)
        return next
      })
    },
    [activeInstrument]
  )

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.repeat) return
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return

      const key = e.key.toLowerCase()
      const mappedNote = KEY_TO_NOTE[key]
      if (mappedNote) {
        e.preventDefault()
        handleKeyDown(mappedNote)
      }
    }

    const onKeyUp = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return

      const key = e.key.toLowerCase()
      const mappedNote = KEY_TO_NOTE[key]
      if (mappedNote) {
        e.preventDefault()
        handleKeyUp(mappedNote)
      }
    }

    window.addEventListener('keydown', onKeyDown)
    window.addEventListener('keyup', onKeyUp)

    return () => {
      window.removeEventListener('keydown', onKeyDown)
      window.removeEventListener('keyup', onKeyUp)
    }
  }, [handleKeyDown, handleKeyUp])

  return (
    <div className="relative w-full max-w-5xl mx-auto select-none">
      {/* Keyboard Case & Felt Bed in Minimalist Light Styling */}
      <div className="relative rounded-2xl p-4 sm:p-6 bg-white border border-stone-200/90 shadow-[0_12px_36px_rgba(0,0,0,0.04)] overflow-hidden">
        
        {/* Header strip with soft markings and octave info */}
        <div className="flex items-center justify-between pb-3 mb-2 border-b border-stone-200/80">
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-stone-300" />
            <span className="text-[11px] font-mono tracking-widest text-stone-500 uppercase font-medium">
              Grand Keybed // 2 Full Octaves (C3–B4)
            </span>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-[10px] font-mono text-stone-500 px-2 py-0.5 rounded bg-stone-100 border border-stone-200/70">
              14 NATURALS • 10 ACCIDENTALS
            </span>
            <span className="text-[10px] font-mono text-stone-700 px-2 py-0.5 rounded bg-stone-100 border border-stone-200/70 uppercase font-medium">
              PRESET: {activeInstrument}
            </span>
            <span className="w-1.5 h-1.5 rounded-full bg-stone-300" />
          </div>
        </div>

        {/* Vintage acoustic damper felt strip */}
        <div className="h-2 w-full rounded-t-sm bg-gradient-to-r from-[#6b1f1f] via-[#852828] to-[#6b1f1f] shadow-inner mb-0.5" />

        {/* Keys Rack Container */}
        <div className="relative h-60 sm:h-72 flex justify-between bg-stone-100 rounded-b-xl p-1 shadow-[inset_0_2px_4px_rgba(0,0,0,0.04)] overflow-x-auto overflow-y-hidden">
          
          {/* 14 Pure Matte Ivory White Keys */}
          <div className="relative w-full min-w-[700px] h-full flex gap-1">
            {WHITE_KEYS.map((key) => {
              const isPressed = activeNotes.has(key.note)
              const isOctaveMarker = key.note.startsWith('C')

              return (
                <motion.button
                  key={key.note}
                  type="button"
                  onMouseDown={() => handleKeyDown(key.note)}
                  onMouseUp={() => handleKeyUp(key.note)}
                  onMouseLeave={() => handleKeyUp(key.note)}
                  onTouchStart={(e) => {
                    e.preventDefault()
                    handleKeyDown(key.note)
                  }}
                  onTouchEnd={(e) => {
                    e.preventDefault()
                    handleKeyUp(key.note)
                  }}
                  animate={{ y: isPressed ? 3 : 0 }}
                  transition={{ type: 'spring', stiffness: 600, damping: 25 }}
                  className={`relative flex-1 h-full rounded-b-xl flex flex-col justify-end items-center pb-3 transition-colors cursor-pointer select-none ${
                    isPressed
                      ? 'bg-gradient-to-b from-[#f2efea] to-[#e8e4dc] border border-[#d3cdc3] shadow-[inset_0_3px_6px_rgba(0,0,0,0.08),0_1px_2px_rgba(0,0,0,0.04)]'
                      : 'key-white'
                  }`}
                >
                  <div className="flex flex-col items-center gap-1.5 pointer-events-none">
                    <span
                      className={`text-xs font-bold font-mono tracking-tighter ${
                        isPressed
                          ? 'text-stone-900 font-extrabold'
                          : isOctaveMarker
                          ? 'text-stone-900 font-bold'
                          : 'text-stone-600'
                      }`}
                    >
                      {key.note}
                    </span>
                    {key.keyTrigger && (
                      <span
                        className={`w-5 h-5 rounded flex items-center justify-center text-[10px] font-mono font-medium transition-all ${
                          isPressed
                            ? 'bg-stone-300 text-stone-900 font-semibold'
                            : 'bg-stone-100 border border-stone-200/90 text-stone-500 shadow-sm'
                        }`}
                      >
                        {key.keyTrigger}
                      </span>
                    )}
                  </div>

                  <div className="absolute bottom-0 inset-x-0 h-1.5 rounded-b-xl bg-white/60 pointer-events-none" />
                </motion.button>
              )
            })}

            {/* 10 Matte Charcoal Black Keys Layer */}
            <div className="absolute inset-x-0 top-0 h-36 sm:h-44 pointer-events-none">
              {BLACK_KEYS.map((key) => {
                const isPressed = activeNotes.has(key.note)
                return (
                  <motion.button
                    key={key.note}
                    type="button"
                    style={{
                      left: `${key.leftPercent}%`,
                      width: '4.6%',
                    }}
                    onMouseDown={() => handleKeyDown(key.note)}
                    onMouseUp={() => handleKeyUp(key.note)}
                    onMouseLeave={() => handleKeyUp(key.note)}
                    onTouchStart={(e) => {
                      e.preventDefault()
                      handleKeyDown(key.note)
                    }}
                    onTouchEnd={(e) => {
                      e.preventDefault()
                      handleKeyUp(key.note)
                    }}
                    animate={{ y: isPressed ? 2.5 : 0 }}
                    transition={{ type: 'spring', stiffness: 600, damping: 25 }}
                    className={`absolute top-0 h-full rounded-b-md flex flex-col justify-end items-center pb-2.5 pointer-events-auto transition-colors cursor-pointer z-20 select-none ${
                      isPressed
                        ? 'bg-gradient-to-b from-[#242424] to-[#181818] border border-black shadow-[inset_0_2px_4px_rgba(0,0,0,0.5),0_1px_2px_rgba(0,0,0,0.3)]'
                        : 'key-black'
                    }`}
                  >
                    <div className="flex flex-col items-center gap-1 pointer-events-none">
                      <span
                        className={`text-[9px] sm:text-[10px] font-bold font-mono transition-colors ${
                          isPressed ? 'text-white' : 'text-stone-300'
                        }`}
                      >
                        {key.note}
                      </span>
                      {key.keyTrigger && (
                        <span
                          className={`w-3.5 h-3.5 sm:w-4 sm:h-4 rounded flex items-center justify-center text-[8px] sm:text-[9px] font-mono font-medium transition-all ${
                            isPressed
                              ? 'bg-stone-600 text-white font-bold'
                              : 'bg-[#262626] border border-[#3e3e3e] text-stone-300'
                          }`}
                        >
                          {key.keyTrigger}
                        </span>
                      )}
                    </div>

                    <div className="absolute bottom-0 inset-x-0.5 h-1 rounded-b-sm bg-white/5 pointer-events-none" />
                  </motion.button>
                )
              })}
            </div>
          </div>
        </div>

        {/* Bottom chassis lip */}
        <div className="mt-3.5 flex items-center justify-between px-2 text-[10px] font-mono text-stone-400">
          <span className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-[#b87a41]" />
            HIGH-FIDELITY MULTI-SAMPLER // {activeInstrument.toUpperCase()}
          </span>
          <span className="tracking-wide text-stone-500 font-medium">
            CHROMATIC SAMPLING & MASTERING CHAIN
          </span>
        </div>
      </div>
    </div>
  )
}

export default PianoKeyboard

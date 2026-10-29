import { motion } from 'motion/react'
import { Disc3, Wind, Music2, Sparkles } from 'lucide-react'

export type InstrumentType = 'Trumpet' | 'Harmonium' | 'Flute' | 'Violin'

interface InstrumentSelectorProps {
  currentInstrument?: InstrumentType
  onSelect?: (instrument: InstrumentType) => void
}

interface InstrumentOption {
  id: InstrumentType
  name: string
  subtitle: string
  icon: typeof Music2
  keyHint: string
}

const INSTRUMENTS: InstrumentOption[] = [
  {
    id: 'Trumpet',
    name: 'Trumpet',
    subtitle: 'Brass Solo',
    icon: Disc3,
    keyHint: '1',
  },
  {
    id: 'Harmonium',
    name: 'Harmonium',
    subtitle: 'Acoustic Reed',
    icon: Music2,
    keyHint: '2',
  },
  {
    id: 'Flute',
    name: 'Flute',
    subtitle: 'Woodwind Air',
    icon: Wind,
    keyHint: '3',
  },
  {
    id: 'Violin',
    name: 'Violin',
    subtitle: 'Solo Strings',
    icon: Sparkles,
    keyHint: '4',
  },
]

export const InstrumentSelector = ({
  currentInstrument = 'Violin',
  onSelect,
}: InstrumentSelectorProps) => {
  return (
    <div className="flex flex-col items-center sm:items-start gap-1.5">
      <div className="flex items-center justify-between w-full px-1">
        <span className="text-[10px] font-mono tracking-widest text-amber-500/70 uppercase">
          Active Instrument Engine
        </span>
        <span className="text-[10px] font-mono text-amber-400/80 uppercase">
          Hotkeys [1–4]
        </span>
      </div>

      {/* Pill-shaped segment control */}
      <div className="relative inline-flex p-1 rounded-full bg-[#141210]/90 border border-amber-900/30 shadow-[inset_0_2px_4px_rgba(0,0,0,0.7),0_8px_20px_rgba(0,0,0,0.4)] backdrop-blur-xl">
        {INSTRUMENTS.map((inst) => {
          const isSelected = currentInstrument === inst.id
          const Icon = inst.icon

          return (
            <button
              key={inst.id}
              onClick={() => onSelect?.(inst.id)}
              type="button"
              className={`relative z-10 flex items-center gap-2.5 px-3.5 sm:px-4 py-2 rounded-full text-xs font-medium transition-colors duration-200 cursor-pointer select-none ${
                isSelected
                  ? 'text-amber-100 font-semibold'
                  : 'text-stone-400 hover:text-stone-200'
              }`}
            >
              {isSelected && (
                <motion.div
                  layoutId="active-instrument-pill"
                  transition={{ type: 'spring', stiffness: 450, damping: 35 }}
                  className="absolute inset-0 rounded-full bg-gradient-to-b from-[#3a2e22] to-[#251d15] border border-amber-500/30 shadow-[0_4px_14px_rgba(0,0,0,0.6),inset_0_1px_0_rgba(251,191,36,0.3)]"
                />
              )}

              <span className="relative z-10 flex items-center justify-center">
                <Icon
                  size={14}
                  className={isSelected ? 'text-amber-400' : 'text-stone-500'}
                />
              </span>

              <span className="relative z-10 flex flex-col items-start leading-none text-left">
                <span className="tracking-wide text-xs">{inst.name}</span>
                <span className="text-[9px] font-mono opacity-50 hidden md:inline text-amber-200/60">
                  {inst.subtitle}
                </span>
              </span>

              <span
                className={`relative z-10 ml-0.5 text-[9px] font-mono px-1.5 py-0.5 rounded border transition-colors ${
                  isSelected
                    ? 'border-amber-500/40 text-amber-300 bg-amber-500/15'
                    : 'border-stone-800 text-stone-500 bg-stone-900/60'
                }`}
              >
                {inst.keyHint}
              </span>
            </button>
          )
        })}
      </div>
    </div>
  )
}

export default InstrumentSelector

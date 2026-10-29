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
    subtitle: 'Brass',
    icon: Disc3,
    keyHint: '1',
  },
  {
    id: 'Harmonium',
    name: 'Harmonium',
    subtitle: 'Reed',
    icon: Music2,
    keyHint: '2',
  },
  {
    id: 'Flute',
    name: 'Flute',
    subtitle: 'Woodwind',
    icon: Wind,
    keyHint: '3',
  },
  {
    id: 'Violin',
    name: 'Violin',
    subtitle: 'Strings',
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
        <span className="text-[10px] font-mono tracking-widest text-stone-400 uppercase font-medium">
          Instrument Engine
        </span>
        <span className="text-[10px] font-mono text-stone-400 uppercase">
          Keys [1–4]
        </span>
      </div>

      {/* Clean Apple-like segmented pill */}
      <div className="relative inline-flex p-1 rounded-full bg-stone-200/50 border border-stone-200/80 shadow-[inset_0_1px_2px_rgba(0,0,0,0.03)] backdrop-blur-md">
        {INSTRUMENTS.map((inst) => {
          const isSelected = currentInstrument === inst.id
          const Icon = inst.icon

          return (
            <button
              key={inst.id}
              onClick={() => onSelect?.(inst.id)}
              type="button"
              className={`relative z-10 flex items-center gap-2 px-3.5 sm:px-4 py-1.5 rounded-full text-xs font-medium transition-colors duration-200 cursor-pointer select-none ${
                isSelected
                  ? 'text-stone-900 font-semibold'
                  : 'text-stone-500 hover:text-stone-800'
              }`}
            >
              {isSelected && (
                <motion.div
                  layoutId="active-instrument-pill"
                  transition={{ type: 'spring', stiffness: 450, damping: 35 }}
                  className="absolute inset-0 rounded-full bg-white border border-stone-200/80 shadow-[0_2px_8px_rgba(0,0,0,0.06),0_1px_2px_rgba(0,0,0,0.04)]"
                />
              )}

              <span className="relative z-10 flex items-center justify-center">
                <Icon
                  size={13}
                  className={isSelected ? 'text-[#b87a41]' : 'text-stone-400'}
                />
              </span>

              <span className="relative z-10 flex flex-col items-start leading-none text-left">
                <span className="tracking-wide text-xs">{inst.name}</span>
                <span className="text-[9px] font-mono opacity-50 hidden md:inline text-stone-500">
                  {inst.subtitle}
                </span>
              </span>

              <span
                className={`relative z-10 ml-0.5 text-[9px] font-mono px-1.5 py-0.5 rounded border transition-colors ${
                  isSelected
                    ? 'border-stone-200 text-stone-700 bg-stone-50'
                    : 'border-transparent text-stone-400 bg-stone-200/40'
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

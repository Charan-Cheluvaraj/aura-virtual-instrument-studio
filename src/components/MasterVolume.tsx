import { useState } from 'react'
import { Volume2, VolumeX } from 'lucide-react'
import { setMasterVolume as applyMasterVolume } from '../audio/audioEngine'

interface MasterVolumeProps {
  initialVolume?: number
  onVolumeChange?: (volume: number, isMuted: boolean) => void
}

export const MasterVolume = ({ initialVolume = 80, onVolumeChange }: MasterVolumeProps) => {
  const [volume, setVolume] = useState<number>(initialVolume)
  const [isMuted, setIsMuted] = useState<boolean>(false)

  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = Number(e.target.value)
    setVolume(val)
    const nextMute = isMuted && val > 0 ? false : isMuted
    if (isMuted && val > 0) {
      setIsMuted(false)
    }
    applyMasterVolume(val, nextMute)
    onVolumeChange?.(val, nextMute)
  }

  const toggleMute = () => {
    const nextMute = !isMuted
    setIsMuted(nextMute)
    applyMasterVolume(volume, nextMute)
    onVolumeChange?.(volume, nextMute)
  }

  // Calculate dB equivalent (-60 to 0 dB)
  const calculatedDb = isMuted || volume === 0 
    ? '-inf' 
    : `${(-60 + (volume / 100) * 60).toFixed(1)} dB`

  const effectiveLevel = isMuted ? 0 : volume

  return (
    <div className="flex flex-col gap-1.5 min-w-[200px]">
      <div className="flex items-center justify-between px-1">
        <span className="text-[10px] font-mono tracking-widest text-stone-400 uppercase font-medium">Master Output</span>
        <span className="text-[10px] font-mono text-stone-600 font-medium tracking-tight">{calculatedDb}</span>
      </div>

      <div className="flex items-center gap-3 px-3 py-2 rounded-2xl bg-white border border-stone-200/80 shadow-[0_2px_8px_rgba(0,0,0,0.03)] backdrop-blur-md">
        <button
          onClick={toggleMute}
          title={isMuted ? 'Unmute' : 'Mute'}
          type="button"
          className={`p-1.5 rounded-lg border transition-all cursor-pointer ${
            isMuted
              ? 'bg-stone-200 text-stone-800 border-stone-300 shadow-sm'
              : 'bg-stone-100 text-stone-600 border-stone-200/70 hover:text-stone-900 hover:bg-stone-200/60'
          }`}
        >
          {isMuted ? <VolumeX size={14} /> : <Volume2 size={14} />}
        </button>

        <div className="flex-1 flex flex-col gap-1">
          <input
            type="range"
            min="0"
            max="100"
            value={isMuted ? 0 : volume}
            onChange={handleSliderChange}
            className="w-full h-1.5 bg-stone-200 rounded-lg appearance-none cursor-pointer accent-[#2c2c2c] focus:outline-none"
            style={{
              background: `linear-gradient(to right, #44403c 0%, #292524 ${effectiveLevel}%, #e7e5e4 ${effectiveLevel}%, #e7e5e4 100%)`,
            }}
          />

          {/* Clean minimal stereo VU meter */}
          <div className="flex items-center justify-between gap-0.5 h-1">
            {Array.from({ length: 16 }).map((_, idx) => {
              const threshold = (idx / 16) * 100
              const isActive = effectiveLevel >= threshold
              const isPeak = idx >= 13

              let color = 'bg-stone-200'
              if (isActive) {
                color = isPeak ? 'bg-[#b87a41]' : 'bg-stone-600'
              }

              return <div key={idx} className={`flex-1 h-full rounded-[0.5px] transition-colors duration-100 ${color}`} />
            })}
          </div>
        </div>

        <div className="text-[11px] font-mono text-stone-500 w-7 text-right">{effectiveLevel}%</div>
      </div>
    </div>
  )
}

export default MasterVolume

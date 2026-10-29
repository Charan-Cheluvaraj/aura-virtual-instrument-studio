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
    // Wire directly to Tone.js Audio Engine
    applyMasterVolume(val, nextMute)
    onVolumeChange?.(val, nextMute)
  }

  const toggleMute = () => {
    const nextMute = !isMuted
    setIsMuted(nextMute)
    // Wire directly to Tone.js Audio Engine
    applyMasterVolume(volume, nextMute)
    onVolumeChange?.(volume, nextMute)
  }

  // Calculate dB equivalent (-60 to 0 dB)
  const calculatedDb = isMuted || volume === 0 
    ? '-inf' 
    : `${(-60 + (volume / 100) * 60).toFixed(1)} dB`

  const effectiveLevel = isMuted ? 0 : volume

  return (
    <div className="flex flex-col gap-1.5 min-w-[210px]">
      <div className="flex items-center justify-between px-1">
        <span className="text-[10px] font-mono tracking-widest text-amber-500/70 uppercase">Master Out</span>
        <span className="text-[10px] font-mono text-amber-400 font-semibold tracking-tight">{calculatedDb}</span>
      </div>

      <div className="flex items-center gap-3 px-3 py-2 rounded-2xl bg-[#141210]/90 border border-amber-900/30 shadow-[inset_0_2px_4px_rgba(0,0,0,0.7),0_8px_20px_rgba(0,0,0,0.4)] backdrop-blur-xl">
        <button
          onClick={toggleMute}
          title={isMuted ? 'Unmute' : 'Mute'}
          type="button"
          className={`p-1.5 rounded-lg border transition-all cursor-pointer ${
            isMuted
              ? 'bg-orange-950/40 text-orange-400 border-orange-800/40 shadow-[0_0_12px_rgba(234,88,12,0.3)]'
              : 'bg-stone-900/80 text-amber-200/80 border-amber-900/30 hover:text-amber-100 hover:bg-stone-800/90'
          }`}
        >
          {isMuted ? <VolumeX size={15} /> : <Volume2 size={15} />}
        </button>

        <div className="flex-1 flex flex-col gap-1">
          <input
            type="range"
            min="0"
            max="100"
            value={isMuted ? 0 : volume}
            onChange={handleSliderChange}
            className="w-full h-1.5 bg-stone-900 rounded-lg appearance-none cursor-pointer accent-amber-500 focus:outline-none"
            style={{
              background: `linear-gradient(to right, #b45309 0%, #f59e0b ${effectiveLevel}%, #262320 ${effectiveLevel}%, #262320 100%)`,
            }}
          />

          {/* Warm Amber / Gold Stereo VU Meter */}
          <div className="flex items-center justify-between gap-0.5 h-1">
            {Array.from({ length: 16 }).map((_, idx) => {
              const threshold = (idx / 16) * 100
              const isActive = effectiveLevel >= threshold
              const isPeak = idx >= 13
              const isMid = idx >= 9 && idx < 13

              let color = 'bg-stone-900'
              if (isActive) {
                if (isPeak) color = 'bg-orange-500 shadow-[0_0_6px_rgba(249,115,22,0.7)]'
                else if (isMid) color = 'bg-amber-400 shadow-[0_0_5px_rgba(251,191,36,0.5)]'
                else color = 'bg-amber-600/80 shadow-[0_0_3px_rgba(217,119,6,0.4)]'
              }

              return <div key={idx} className={`flex-1 h-full rounded-[0.5px] transition-colors duration-100 ${color}`} />
            })}
          </div>
        </div>

        <div className="text-[11px] font-mono text-amber-200/60 w-7 text-right">{effectiveLevel}%</div>
      </div>
    </div>
  )
}

export default MasterVolume

import * as Tone from 'tone'

export type InstrumentId = 'Trumpet' | 'Harmonium' | 'Flute' | 'Violin'

// Step 2: The Audio Mastering Chain
// EQ (warm lows, sparkling highs) -> Compressor (glue & dynamics control) -> Spatial Reverb -> Master Destination
export const masterEQ = new Tone.EQ3({
  low: 2,
  mid: -1,
  high: 3,
})

export const masterCompressor = new Tone.Compressor({
  threshold: -16,
  ratio: 3,
  attack: 0.02,
  release: 0.1,
})

export const masterReverb = new Tone.Reverb({
  decay: 3.5,
  wet: 0.25,
})

// Complete mastering signal chain
masterEQ.chain(masterCompressor, masterReverb, Tone.Destination)

// Persistent Samplers routed directly into the Master EQ
export const samplers: Record<InstrumentId, Tone.Sampler> = {
  Trumpet: new Tone.Sampler({
    urls: {
      A3: 'A3.mp3',
      A4: 'A4.mp3',
      A5: 'A5.mp3',
    },
    baseUrl: '/sounds/trumpet/',
  }).connect(masterEQ),

  Flute: new Tone.Sampler({
    urls: {
      A4: 'A4.mp3',
      A5: 'A5.mp3',
      A6: 'A6.mp3',
    },
    baseUrl: '/sounds/flute/',
  }).connect(masterEQ),

  Violin: new Tone.Sampler({
    urls: {
      A3: 'A3.mp3',
      A4: 'A4.mp3',
      A5: 'A5.mp3',
    },
    baseUrl: '/sounds/violin/',
  }).connect(masterEQ),

  Harmonium: new Tone.Sampler({
    urls: {
      G2: 'G2.wav',
    },
    baseUrl: '/sounds/harmonium/',
  }).connect(masterEQ),
}

/**
 * Trigger attack for an instrument note
 */
export const playNote = (instrument: string, note: string) => {
  const sampler = samplers[instrument as InstrumentId]
  if (sampler && sampler.loaded) {
    try {
      sampler.triggerAttack(note)
    } catch (err) {
      console.warn(`[AudioEngine] Error triggering ${instrument} ${note}:`, err)
    }
  }
}

/**
 * Trigger release for an instrument note
 */
export const stopNote = (instrument: string, note: string) => {
  const sampler = samplers[instrument as InstrumentId]
  if (sampler && sampler.loaded) {
    try {
      sampler.triggerRelease(note)
    } catch (err) {
      console.warn(`[AudioEngine] Error releasing ${instrument} ${note}:`, err)
    }
  }
}

/**
 * Maps 0-100 percentage to a decibel scale (-60 dB to 0 dB) for master output.
 * If muted or at 0%, sets Tone.Destination.mute = true.
 */
export const setMasterVolume = (volumePercentage: number, isMuted: boolean) => {
  if (isMuted || volumePercentage <= 0) {
    Tone.Destination.mute = true
    return
  }

  Tone.Destination.mute = false

  // Map 0 -> -60 dB, 100 -> 0 dB linearly
  const minDb = -60
  const maxDb = 0
  const calculatedDb = minDb + (volumePercentage / 100) * (maxDb - minDb)

  Tone.Destination.volume.value = Math.max(-60, Math.min(0, calculatedDb))
}

/**
 * Unlock AudioContext, generate impulse response for spatial reverb, and verify all samplers
 */
export const initAudioEngine = async (): Promise<void> => {
  await Tone.start()
  await masterReverb.generate()
  await Tone.loaded()
}

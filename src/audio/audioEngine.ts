import * as Tone from 'tone'

export type InstrumentId = 'Trumpet' | 'Harmonium' | 'Flute' | 'Violin'

// Step 2: High-Fidelity Audio Mastering Chain
// EQ3 (subtle low warmth, airy sparkle)
export const masterEQ = new Tone.EQ3({
  low: 1,
  mid: 0,
  high: 2,
})

// Studio Compressor (glue & transparent peak limiting)
export const masterCompressor = new Tone.Compressor({
  threshold: -16,
  ratio: 3,
  attack: 0.02,
  release: 0.1,
})

// Feedback Delay (subtle rhythmic acoustic depth)
export const masterDelay = new Tone.FeedbackDelay({
  delayTime: '8n',
  feedback: 0.2,
  wet: 0.15,
})

// Convolution/Algorithmic Spatial Reverb
export const masterReverb = new Tone.Reverb({
  decay: 4,
  wet: 0.3,
})

// Complete mastering chain: EQ -> Compressor -> Delay -> Reverb -> Destination
masterEQ.chain(masterCompressor, masterDelay, masterReverb, Tone.Destination)

// High-fidelity multi-sample sets for chromatic acoustic authenticity
const MULTI_SAMPLE_URLS = {
  A3: 'A3.mp3',
  C4: 'C4.mp3',
  E4: 'E4.mp3',
  G4: 'G4.mp3',
  A4: 'A4.mp3',
  C5: 'C5.mp3',
  E5: 'E5.mp3',
  G5: 'G5.mp3',
  A5: 'A5.mp3',
}

// Envelope configuration: fast instant trigger without clicking, smooth sustain, and lingering release
const samplerEnvelopeConfig = {
  attack: 0.005, // Fast, instant trigger with zero clicking
  release: 1.8, // Let the sound ring out slightly longer after key release
  envelope: {
    attack: 0.005, // Fast, instant trigger with zero clicking
    decay: 3.0,
    sustain: 0.85, // Holds note volume smoothly during longer press
    release: 1.8, // Let the sound ring out slightly longer after key release
  },
}

export const samplers: Record<InstrumentId, Tone.Sampler> = {
  Trumpet: new Tone.Sampler({
    urls: MULTI_SAMPLE_URLS,
    baseUrl: '/sounds/trumpet/',
    ...samplerEnvelopeConfig,
  } as any).connect(masterEQ),

  Flute: new Tone.Sampler({
    urls: MULTI_SAMPLE_URLS,
    baseUrl: '/sounds/flute/',
    ...samplerEnvelopeConfig,
  } as any).connect(masterEQ),

  Violin: new Tone.Sampler({
    urls: MULTI_SAMPLE_URLS,
    baseUrl: '/sounds/violin/',
    ...samplerEnvelopeConfig,
  } as any).connect(masterEQ),

  Harmonium: new Tone.Sampler({
    urls: {
      G2: 'G2.wav',
    },
    baseUrl: '/sounds/harmonium/',
    ...samplerEnvelopeConfig,
  } as any).connect(masterEQ),
}

/**
 * Trigger attack for an instrument note with immediate scheduling (zero perceived latency)
 */
export const playNote = (instrument: string, note: string) => {
  const sampler = samplers[instrument as InstrumentId]
  if (sampler && sampler.loaded) {
    try {
      sampler.triggerAttack(note, Tone.now())
    } catch (err) {
      console.warn(`[AudioEngine] Error triggering ${instrument} ${note}:`, err)
    }
  }
}

/**
 * Trigger release for an instrument note with smooth release envelope
 */
export const stopNote = (instrument: string, note: string) => {
  const sampler = samplers[instrument as InstrumentId]
  if (sampler && sampler.loaded) {
    try {
      sampler.triggerRelease(note, Tone.now())
    } catch (err) {
      console.warn(`[AudioEngine] Error releasing ${instrument} ${note}:`, err)
    }
  }
}

/**
 * Maps 0-100 percentage linearly to a decibel scale (-60 dB to 0 dB) for master output.
 * If muted or at 0%, sets Tone.Destination.mute = true.
 */
export const setMasterVolume = (volumePercentage: number, isMuted: boolean) => {
  if (isMuted || volumePercentage <= 0) {
    Tone.Destination.mute = true
    return
  }

  Tone.Destination.mute = false

  const minDb = -60
  const maxDb = 0
  const calculatedDb = minDb + (volumePercentage / 100) * (maxDb - minDb)

  Tone.Destination.volume.value = Math.max(-60, Math.min(0, calculatedDb))
}

/**
 * Unlock AudioContext, compute reverb impulse, and ensure all multi-samples are buffered.
 */
export const initAudioEngine = async (): Promise<void> => {
  await Tone.start()
  await masterReverb.generate()
  await Tone.loaded()
}

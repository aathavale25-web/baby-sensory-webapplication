import { useCallback, useRef, useEffect, useState } from 'react'
import { Howl } from 'howler'
import { musicalNotes } from '../data/sensoryContent'

// Audio context for generating tones
let audioContext = null

function getAudioContext() {
  if (!audioContext) {
    audioContext = new (window.AudioContext || window.webkitAudioContext)()
  }
  return audioContext
}

// Generate a gentle tone
function playTone(frequency, duration = 0.3, volume = 0.3) {
  try {
    const ctx = getAudioContext()

    // Resume context if suspended (required for autoplay policies)
    if (ctx.state === 'suspended') {
      ctx.resume()
    }

    const oscillator = ctx.createOscillator()
    const gainNode = ctx.createGain()

    oscillator.connect(gainNode)
    gainNode.connect(ctx.destination)

    oscillator.type = 'sine'
    oscillator.frequency.setValueAtTime(frequency, ctx.currentTime)

    // Gentle envelope
    gainNode.gain.setValueAtTime(0, ctx.currentTime)
    gainNode.gain.linearRampToValueAtTime(volume, ctx.currentTime + 0.05)
    gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration)

    oscillator.start(ctx.currentTime)
    oscillator.stop(ctx.currentTime + duration)
  } catch (e) {
    console.warn('Audio playback failed:', e)
  }
}

// Play a chord (multiple notes)
function playChord(frequencies, duration = 0.5, volume = 0.2) {
  frequencies.forEach((freq, i) => {
    setTimeout(() => playTone(freq, duration, volume), i * 50)
  })
}

// Pre-generated sound effects using Web Audio API
const soundEffects = {
  pop: () => {
    const ctx = getAudioContext()
    if (ctx.state === 'suspended') ctx.resume()

    const osc = ctx.createOscillator()
    const gain = ctx.createGain()
    osc.connect(gain)
    gain.connect(ctx.destination)

    osc.frequency.setValueAtTime(400, ctx.currentTime)
    osc.frequency.exponentialRampToValueAtTime(100, ctx.currentTime + 0.1)
    gain.gain.setValueAtTime(0.3, ctx.currentTime)
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.1)

    osc.start()
    osc.stop(ctx.currentTime + 0.1)
  },

  chime: () => {
    playChord([523.25, 659.25, 783.99], 0.8, 0.15)
  },

  bubbles: () => {
    const freqs = [600, 800, 1000]
    freqs.forEach((f, i) => {
      setTimeout(() => playTone(f, 0.15, 0.1), i * 80)
    })
  },

  twinkle: () => {
    const freqs = [880, 1100, 880, 660]
    freqs.forEach((f, i) => {
      setTimeout(() => playTone(f, 0.2, 0.1), i * 100)
    })
  },

  whoosh: () => {
    const ctx = getAudioContext()
    if (ctx.state === 'suspended') ctx.resume()

    const osc = ctx.createOscillator()
    const gain = ctx.createGain()
    const filter = ctx.createBiquadFilter()

    osc.connect(filter)
    filter.connect(gain)
    gain.connect(ctx.destination)

    osc.type = 'sawtooth'
    filter.type = 'lowpass'
    filter.frequency.setValueAtTime(1000, ctx.currentTime)
    filter.frequency.exponentialRampToValueAtTime(100, ctx.currentTime + 0.3)

    osc.frequency.setValueAtTime(200, ctx.currentTime)
    gain.gain.setValueAtTime(0.1, ctx.currentTime)
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.3)

    osc.start()
    osc.stop(ctx.currentTime + 0.3)
  },

  ding: () => {
    playTone(880, 0.5, 0.2)
  },

  boing: () => {
    const ctx = getAudioContext()
    if (ctx.state === 'suspended') ctx.resume()

    const osc = ctx.createOscillator()
    const gain = ctx.createGain()
    osc.connect(gain)
    gain.connect(ctx.destination)

    osc.frequency.setValueAtTime(150, ctx.currentTime)
    osc.frequency.exponentialRampToValueAtTime(400, ctx.currentTime + 0.1)
    osc.frequency.exponentialRampToValueAtTime(200, ctx.currentTime + 0.3)

    gain.gain.setValueAtTime(0.3, ctx.currentTime)
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.3)

    osc.start()
    osc.stop(ctx.currentTime + 0.3)
  },

  bells: () => {
    const notes = [523.25, 587.33, 659.25, 783.99]
    notes.forEach((f, i) => {
      setTimeout(() => playTone(f, 0.4, 0.1), i * 150)
    })
  },

  water: () => {
    for (let i = 0; i < 5; i++) {
      setTimeout(() => {
        playTone(300 + Math.random() * 200, 0.2, 0.08)
      }, i * 100)
    }
  },

  birds: () => {
    const freqs = [1200, 1400, 1200, 1000, 1200]
    freqs.forEach((f, i) => {
      setTimeout(() => playTone(f, 0.1, 0.08), i * 80)
    })
  },

  wind: () => {
    const ctx = getAudioContext()
    if (ctx.state === 'suspended') ctx.resume()

    const bufferSize = ctx.sampleRate * 0.5
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate)
    const data = buffer.getChannelData(0)

    for (let i = 0; i < bufferSize; i++) {
      data[i] = (Math.random() * 2 - 1) * 0.1
    }

    const source = ctx.createBufferSource()
    const filter = ctx.createBiquadFilter()
    const gain = ctx.createGain()

    source.buffer = buffer
    filter.type = 'lowpass'
    filter.frequency.value = 500

    source.connect(filter)
    filter.connect(gain)
    gain.connect(ctx.destination)

    gain.gain.setValueAtTime(0, ctx.currentTime)
    gain.gain.linearRampToValueAtTime(0.1, ctx.currentTime + 0.1)
    gain.gain.linearRampToValueAtTime(0, ctx.currentTime + 0.5)

    source.start()
  },

  rain: () => {
    for (let i = 0; i < 8; i++) {
      setTimeout(() => {
        playTone(2000 + Math.random() * 1000, 0.05, 0.03)
      }, i * 50)
    }
  },

  harp: () => {
    const notes = [261.63, 329.63, 392.00, 523.25]
    notes.forEach((f, i) => {
      setTimeout(() => playTone(f, 0.6, 0.12), i * 100)
    })
  },

  meow: () => {
    const ctx = getAudioContext()
    if (ctx.state === 'suspended') ctx.resume()

    const osc = ctx.createOscillator()
    const gain = ctx.createGain()
    osc.connect(gain)
    gain.connect(ctx.destination)

    osc.frequency.setValueAtTime(700, ctx.currentTime)
    osc.frequency.linearRampToValueAtTime(500, ctx.currentTime + 0.3)

    gain.gain.setValueAtTime(0.15, ctx.currentTime)
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.3)

    osc.start()
    osc.stop(ctx.currentTime + 0.3)
  },

  woof: () => {
    const ctx = getAudioContext()
    if (ctx.state === 'suspended') ctx.resume()

    const osc = ctx.createOscillator()
    const gain = ctx.createGain()
    osc.connect(gain)
    gain.connect(ctx.destination)

    osc.frequency.setValueAtTime(200, ctx.currentTime)
    osc.frequency.linearRampToValueAtTime(150, ctx.currentTime + 0.15)

    gain.gain.setValueAtTime(0.2, ctx.currentTime)
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.15)

    osc.start()
    osc.stop(ctx.currentTime + 0.15)
  },

  moo: () => {
    const ctx = getAudioContext()
    if (ctx.state === 'suspended') ctx.resume()

    const osc = ctx.createOscillator()
    const gain = ctx.createGain()
    osc.connect(gain)
    gain.connect(ctx.destination)

    osc.frequency.setValueAtTime(150, ctx.currentTime)
    osc.frequency.linearRampToValueAtTime(120, ctx.currentTime + 0.5)

    gain.gain.setValueAtTime(0.15, ctx.currentTime)
    gain.gain.linearRampToValueAtTime(0.15, ctx.currentTime + 0.3)
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.5)

    osc.start()
    osc.stop(ctx.currentTime + 0.5)
  },

  whale: () => {
    const ctx = getAudioContext()
    if (ctx.state === 'suspended') ctx.resume()

    const osc = ctx.createOscillator()
    const gain = ctx.createGain()
    osc.connect(gain)
    gain.connect(ctx.destination)

    osc.frequency.setValueAtTime(100, ctx.currentTime)
    osc.frequency.linearRampToValueAtTime(200, ctx.currentTime + 0.5)
    osc.frequency.linearRampToValueAtTime(80, ctx.currentTime + 1)

    gain.gain.setValueAtTime(0.1, ctx.currentTime)
    gain.gain.linearRampToValueAtTime(0.1, ctx.currentTime + 0.7)
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 1)

    osc.start()
    osc.stop(ctx.currentTime + 1)
  },

  thunder: () => {
    const ctx = getAudioContext()
    if (ctx.state === 'suspended') ctx.resume()

    const bufferSize = ctx.sampleRate * 0.8
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate)
    const data = buffer.getChannelData(0)

    for (let i = 0; i < bufferSize; i++) {
      data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (ctx.sampleRate * 0.3))
    }

    const source = ctx.createBufferSource()
    const filter = ctx.createBiquadFilter()
    const gain = ctx.createGain()

    source.buffer = buffer
    filter.type = 'lowpass'
    filter.frequency.value = 200

    source.connect(filter)
    filter.connect(gain)
    gain.connect(ctx.destination)

    gain.gain.setValueAtTime(0.2, ctx.currentTime)

    source.start()
  },
}

export function useAudio() {
  const [volume, setVolume] = useState(0.5)
  const [muted, setMuted] = useState(false)
  const lastPlayTime = useRef(0)

  // Initialize audio context on first user interaction
  const initAudio = useCallback(() => {
    const ctx = getAudioContext()
    if (ctx.state === 'suspended') {
      ctx.resume()
    }
  }, [])

  // Play a sound effect
  const playSound = useCallback((soundName) => {
    if (muted) return

    // Debounce rapid sounds
    const now = Date.now()
    if (now - lastPlayTime.current < 50) return
    lastPlayTime.current = now

    const effect = soundEffects[soundName]
    if (effect) {
      effect()
    }
  }, [muted])

  // Play a musical note
  const playNote = useCallback((note, duration = 0.3) => {
    if (muted) return

    const frequency = musicalNotes[note]
    if (frequency) {
      playTone(frequency, duration, volume * 0.5)
    }
  }, [muted, volume])

  // Play a random pleasant sound
  const playRandomSound = useCallback((sounds) => {
    if (muted || !sounds || sounds.length === 0) return

    const randomSound = sounds[Math.floor(Math.random() * sounds.length)]
    playSound(randomSound)
  }, [muted, playSound])

  // Toggle mute
  const toggleMute = useCallback(() => {
    setMuted(prev => !prev)
  }, [])

  return {
    playSound,
    playNote,
    playRandomSound,
    initAudio,
    volume,
    setVolume,
    muted,
    toggleMute,
  }
}

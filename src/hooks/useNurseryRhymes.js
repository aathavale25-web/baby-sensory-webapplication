import { useState, useCallback, useRef, useEffect } from 'react'
import { nurseryRhymes } from '../data/nurseryRhymes'

// Audio context for generating tones (shared with useAudio)
let audioContext = null

function getAudioContext() {
  if (!audioContext) {
    audioContext = new (window.AudioContext || window.webkitAudioContext)()
  }
  return audioContext
}

// Play a musical note with a pleasant, baby-friendly timbre
function playMelodyNote(frequency, duration, volume = 0.25) {
  if (frequency === 0) return // Rest note

  try {
    const ctx = getAudioContext()

    // Resume context if suspended (required for autoplay policies)
    if (ctx.state === 'suspended') {
      ctx.resume()
    }

    // Create oscillators for a richer sound (fundamental + harmonics)
    const oscillator1 = ctx.createOscillator()
    const oscillator2 = ctx.createOscillator()
    const gainNode = ctx.createGain()
    const filterNode = ctx.createBiquadFilter()

    // Mix oscillators
    oscillator1.connect(filterNode)
    oscillator2.connect(filterNode)
    filterNode.connect(gainNode)
    gainNode.connect(ctx.destination)

    // Set wave types for a soft, pleasant sound
    oscillator1.type = 'sine'
    oscillator2.type = 'triangle'

    // Set frequencies (second oscillator slightly detuned for warmth)
    oscillator1.frequency.setValueAtTime(frequency, ctx.currentTime)
    oscillator2.frequency.setValueAtTime(frequency * 2, ctx.currentTime) // Octave higher, softer

    // Low-pass filter for warmth
    filterNode.type = 'lowpass'
    filterNode.frequency.setValueAtTime(2000, ctx.currentTime)
    filterNode.Q.setValueAtTime(1, ctx.currentTime)

    // Gentle envelope for baby-friendly sound
    const attackTime = 0.02
    const releaseTime = duration * 0.3

    gainNode.gain.setValueAtTime(0, ctx.currentTime)
    gainNode.gain.linearRampToValueAtTime(volume, ctx.currentTime + attackTime)
    gainNode.gain.setValueAtTime(volume, ctx.currentTime + duration - releaseTime)
    gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration)

    // Second oscillator quieter
    const gain2 = ctx.createGain()
    gain2.gain.setValueAtTime(volume * 0.15, ctx.currentTime)

    oscillator1.start(ctx.currentTime)
    oscillator2.start(ctx.currentTime)
    oscillator1.stop(ctx.currentTime + duration)
    oscillator2.stop(ctx.currentTime + duration)

    return { oscillator1, oscillator2, gainNode }
  } catch (e) {
    console.warn('Melody note playback failed:', e)
    return null
  }
}

export function useNurseryRhymes() {
  const [currentRhymeIndex, setCurrentRhymeIndex] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [isLooping, setIsLooping] = useState(true)
  const [volume, setVolume] = useState(0.3)

  // Refs for managing playback
  const playbackTimeoutsRef = useRef([])
  const isPlayingRef = useRef(false)
  const loopTimeoutRef = useRef(null)

  // Current rhyme data
  const currentRhyme = nurseryRhymes[currentRhymeIndex]

  // Stop all currently playing notes
  const stopPlayback = useCallback(() => {
    isPlayingRef.current = false
    setIsPlaying(false)

    // Clear all scheduled notes
    playbackTimeoutsRef.current.forEach(timeout => clearTimeout(timeout))
    playbackTimeoutsRef.current = []

    // Clear loop timeout
    if (loopTimeoutRef.current) {
      clearTimeout(loopTimeoutRef.current)
      loopTimeoutRef.current = null
    }
  }, [])

  // Play a single rhyme
  const playRhyme = useCallback((rhyme, shouldLoop = true) => {
    // Clear any existing playback
    stopPlayback()

    isPlayingRef.current = true
    setIsPlaying(true)

    const tempoMultiplier = 60 / rhyme.tempo // seconds per beat
    let currentTime = 0

    // Schedule all notes
    rhyme.notes.forEach((noteData, index) => {
      const noteDuration = noteData.duration * tempoMultiplier
      const noteStartTime = currentTime

      const timeout = setTimeout(() => {
        if (isPlayingRef.current) {
          playMelodyNote(noteData.frequency, noteDuration * 0.9, volume)
        }
      }, noteStartTime * 1000)

      playbackTimeoutsRef.current.push(timeout)
      currentTime += noteDuration
    })

    // Calculate total duration
    const totalDuration = currentTime * 1000

    // Schedule loop or stop
    if (shouldLoop && isPlayingRef.current) {
      loopTimeoutRef.current = setTimeout(() => {
        if (isPlayingRef.current && isLooping) {
          playRhyme(rhyme, true)
        }
      }, totalDuration + 500) // Small pause between loops
    } else {
      loopTimeoutRef.current = setTimeout(() => {
        if (isPlayingRef.current) {
          setIsPlaying(false)
          isPlayingRef.current = false
        }
      }, totalDuration)
    }

    return totalDuration
  }, [volume, isLooping, stopPlayback])

  // Start playing current rhyme
  const play = useCallback(() => {
    const ctx = getAudioContext()
    if (ctx.state === 'suspended') {
      ctx.resume()
    }
    playRhyme(currentRhyme, isLooping)
  }, [currentRhyme, isLooping, playRhyme])

  // Pause playback
  const pause = useCallback(() => {
    stopPlayback()
  }, [stopPlayback])

  // Toggle play/pause
  const togglePlayPause = useCallback(() => {
    if (isPlaying) {
      pause()
    } else {
      play()
    }
  }, [isPlaying, play, pause])

  // Go to next rhyme
  const nextRhyme = useCallback(() => {
    const wasPlaying = isPlayingRef.current
    stopPlayback()

    setCurrentRhymeIndex(prev => {
      const nextIndex = (prev + 1) % nurseryRhymes.length
      return nextIndex
    })

    // If was playing, start the new rhyme after a brief delay
    if (wasPlaying) {
      setTimeout(() => {
        const nextIndex = (currentRhymeIndex + 1) % nurseryRhymes.length
        playRhyme(nurseryRhymes[nextIndex], isLooping)
      }, 100)
    }
  }, [currentRhymeIndex, isLooping, playRhyme, stopPlayback])

  // Go to previous rhyme
  const previousRhyme = useCallback(() => {
    const wasPlaying = isPlayingRef.current
    stopPlayback()

    setCurrentRhymeIndex(prev => {
      const prevIndex = prev === 0 ? nurseryRhymes.length - 1 : prev - 1
      return prevIndex
    })

    // If was playing, start the new rhyme after a brief delay
    if (wasPlaying) {
      setTimeout(() => {
        const prevIndex = currentRhymeIndex === 0 ? nurseryRhymes.length - 1 : currentRhymeIndex - 1
        playRhyme(nurseryRhymes[prevIndex], isLooping)
      }, 100)
    }
  }, [currentRhymeIndex, isLooping, playRhyme, stopPlayback])

  // Select a specific rhyme by index
  const selectRhyme = useCallback((index) => {
    const wasPlaying = isPlayingRef.current
    stopPlayback()

    if (index >= 0 && index < nurseryRhymes.length) {
      setCurrentRhymeIndex(index)

      if (wasPlaying) {
        setTimeout(() => {
          playRhyme(nurseryRhymes[index], isLooping)
        }, 100)
      }
    }
  }, [isLooping, playRhyme, stopPlayback])

  // Toggle loop mode
  const toggleLoop = useCallback(() => {
    setIsLooping(prev => !prev)
  }, [])

  // Initialize audio context on interaction
  const initAudio = useCallback(() => {
    const ctx = getAudioContext()
    if (ctx.state === 'suspended') {
      ctx.resume()
    }
  }, [])

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopPlayback()
    }
  }, [stopPlayback])

  // Update playback when loop setting changes while playing
  useEffect(() => {
    // This effect just ensures the loop ref stays in sync
  }, [isLooping])

  return {
    // State
    currentRhyme,
    currentRhymeIndex,
    isPlaying,
    isLooping,
    volume,
    allRhymes: nurseryRhymes,

    // Actions
    play,
    pause,
    togglePlayPause,
    nextRhyme,
    previousRhyme,
    selectRhyme,
    toggleLoop,
    setVolume,
    initAudio,
    stopPlayback,
  }
}

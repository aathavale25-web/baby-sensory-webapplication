import { useMemo } from 'react'
import { dailyThemes } from '../data/sensoryContent'

// Seeded random number generator for consistent daily content
function seededRandom(seed) {
  const x = Math.sin(seed) * 10000
  return x - Math.floor(x)
}

// Get a consistent seed based on the date
function getDateSeed(date = new Date()) {
  const dateString = `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`
  let hash = 0
  for (let i = 0; i < dateString.length; i++) {
    const char = dateString.charCodeAt(i)
    hash = ((hash << 5) - hash) + char
    hash = hash & hash
  }
  return Math.abs(hash)
}

// Shuffle array with seed
function shuffleWithSeed(array, seed) {
  const shuffled = [...array]
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(seededRandom(seed + i) * (i + 1))
    ;[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
  }
  return shuffled
}

export function useDailyContent(customDate = null) {
  const content = useMemo(() => {
    const date = customDate || new Date()
    const seed = getDateSeed(date)

    // Get day index (0-6) based on days since epoch modulo 7
    const daysSinceEpoch = Math.floor(date.getTime() / (1000 * 60 * 60 * 24))
    const themeIndex = daysSinceEpoch % dailyThemes.length

    const theme = dailyThemes[themeIndex]

    // Shuffle colors and animations for variety within the theme
    const shuffledColors = shuffleWithSeed(theme.colors, seed)
    const shuffledAnimations = shuffleWithSeed(theme.animations, seed)
    const shuffledSounds = shuffleWithSeed(theme.sounds, seed)

    return {
      theme,
      themeIndex,
      colors: shuffledColors,
      animations: shuffledAnimations,
      sounds: shuffledSounds,
      seed,
      dateString: date.toLocaleDateString('en-US', {
        weekday: 'long',
        month: 'long',
        day: 'numeric'
      }),
    }
  }, [customDate])

  return content
}

// Get a random item from array using daily seed
export function getDailyRandom(array, seed, offset = 0) {
  const index = Math.floor(seededRandom(seed + offset) * array.length)
  return array[index]
}

// Generate random positions for animations
export function generatePositions(count, seed, bounds = { width: 100, height: 100 }) {
  const positions = []
  for (let i = 0; i < count; i++) {
    positions.push({
      x: seededRandom(seed + i * 2) * bounds.width,
      y: seededRandom(seed + i * 2 + 1) * bounds.height,
      scale: 0.5 + seededRandom(seed + i * 3) * 1,
      delay: seededRandom(seed + i * 4) * 2,
    })
  }
  return positions
}

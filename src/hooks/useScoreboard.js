import { useState, useCallback, useRef } from 'react'

// Milestones that trigger celebrations
const MILESTONES = [10, 25, 50, 100, 150, 200, 250, 300, 400, 500]

// Map theme IDs to object types for tracking
const THEME_TO_OBJECT_TYPE = {
  ocean: 'bubble',
  space: 'star',
  garden: 'flower',
  rainbow: 'sparkle',
  animals: 'animal',
  shapes: 'shape',
  clouds: 'cloud',
}

// Emoji icons for each object type
export const OBJECT_TYPE_EMOJIS = {
  bubble: '🫧',
  star: '⭐',
  flower: '🌸',
  sparkle: '✨',
  animal: '🐱',
  shape: '🔷',
  cloud: '☁️',
  unknown: '👆',
}

// Color name mapping for display
export const COLOR_NAMES = {
  '#FF0000': 'Red',
  '#FF4444': 'Red',
  '#FF8800': 'Orange',
  '#FF8844': 'Orange',
  '#FFFF00': 'Yellow',
  '#FFDD44': 'Yellow',
  '#FFDD00': 'Yellow',
  '#00FF00': 'Green',
  '#44FF44': 'Green',
  '#88FF44': 'Green',
  '#0088FF': 'Blue',
  '#0066FF': 'Blue',
  '#00CCFF': 'Cyan',
  '#44DDFF': 'Cyan',
  '#00FFFF': 'Cyan',
  '#8800FF': 'Purple',
  '#AA44FF': 'Purple',
  '#FF00FF': 'Magenta',
  '#FF44FF': 'Magenta',
  '#FF4488': 'Pink',
  '#FF88CC': 'Pink',
  '#FFAACC': 'Pink',
  '#FFFFFF': 'White',
  '#AADDFF': 'Light Blue',
  '#FFCCEE': 'Light Pink',
  '#DDFFDD': 'Light Green',
  '#FFEEDD': 'Cream',
  '#004488': 'Dark Blue',
  '#00FF88': 'Mint',
  '#333333': 'Dark Gray',
  '#AA7744': 'Brown',
  '#DDAA66': 'Tan',
}

function getColorName(hex) {
  return COLOR_NAMES[hex.toUpperCase()] || 'Colorful'
}

export function useScoreboard() {
  const [totalTouches, setTotalTouches] = useState(0)
  const [objectCounts, setObjectCounts] = useState({})
  const [colorCounts, setColorCounts] = useState({})
  const [currentStreak, setCurrentStreak] = useState(0)
  const [bestStreak, setBestStreak] = useState(0)
  const [lastObjectType, setLastObjectType] = useState(null)
  const [milestone, setMilestone] = useState(null)
  const [isTracking, setIsTracking] = useState(false)

  // Use ref to track if we should update best streak
  const streakRef = useRef(0)

  // Track a touch interaction
  const trackTouch = useCallback((themeId, color) => {
    if (!isTracking) return

    const objectType = THEME_TO_OBJECT_TYPE[themeId] || 'unknown'
    const colorName = getColorName(color)

    // Update total touches
    setTotalTouches(prev => {
      const newTotal = prev + 1
      // Check for milestone
      if (MILESTONES.includes(newTotal)) {
        setMilestone(newTotal)
        // Clear milestone after animation
        setTimeout(() => setMilestone(null), 3000)
      }
      return newTotal
    })

    // Update object type counts
    setObjectCounts(prev => ({
      ...prev,
      [objectType]: (prev[objectType] || 0) + 1,
    }))

    // Update color counts
    setColorCounts(prev => ({
      ...prev,
      [colorName]: (prev[colorName] || 0) + 1,
    }))

    // Update streak
    setCurrentStreak(prev => {
      let newStreak
      if (objectType === lastObjectType) {
        newStreak = prev + 1
      } else {
        newStreak = 1
      }

      // Update best streak if needed
      if (newStreak > streakRef.current) {
        streakRef.current = newStreak
        setBestStreak(newStreak)
      }

      return newStreak
    })

    setLastObjectType(objectType)
  }, [isTracking, lastObjectType])

  // Reset the scoreboard
  const resetScoreboard = useCallback(() => {
    setTotalTouches(0)
    setObjectCounts({})
    setColorCounts({})
    setCurrentStreak(0)
    setBestStreak(0)
    setLastObjectType(null)
    setMilestone(null)
    streakRef.current = 0
  }, [])

  // Start tracking
  const startTracking = useCallback(() => {
    setIsTracking(true)
  }, [])

  // Stop tracking
  const stopTracking = useCallback(() => {
    setIsTracking(false)
  }, [])

  // Get session summary for end of session
  const getSessionSummary = useCallback(() => {
    // Find most touched object type
    let mostTouchedType = null
    let maxObjectCount = 0
    Object.entries(objectCounts).forEach(([type, count]) => {
      if (count > maxObjectCount) {
        maxObjectCount = count
        mostTouchedType = type
      }
    })

    // Find most touched color
    let mostTouchedColor = null
    let maxColorCount = 0
    Object.entries(colorCounts).forEach(([color, count]) => {
      if (count > maxColorCount) {
        maxColorCount = count
        mostTouchedColor = color
      }
    })

    return {
      totalTouches,
      objectCounts,
      colorCounts,
      bestStreak,
      mostTouchedType,
      mostTouchedColor,
    }
  }, [totalTouches, objectCounts, colorCounts, bestStreak])

  return {
    // State
    totalTouches,
    objectCounts,
    colorCounts,
    currentStreak,
    bestStreak,
    milestone,
    isTracking,
    // Actions
    trackTouch,
    resetScoreboard,
    startTracking,
    stopTracking,
    getSessionSummary,
  }
}

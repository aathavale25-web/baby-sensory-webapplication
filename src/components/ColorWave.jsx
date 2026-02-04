import { motion } from 'framer-motion'
import { useMemo } from 'react'

export default function ColorWave({ colors, seed = 0, ageProfile = null }) {
  const waves = useMemo(() => {
    // For 4-6 months, ColorWave is too complex - return empty array
    const ageMonths = ageProfile?.ageRange?.[0] || 12
    if (ageMonths >= 4 && ageMonths <= 6) {
      return []
    }

    // Filter colors by age profile palette
    const availableColors = ageProfile?.colorPalette ?
      colors.filter(color => ageProfile.colorPalette.includes(color.toUpperCase())) :
      colors
    const finalColors = availableColors.length > 0 ? availableColors : colors

    return finalColors.slice(0, 5).map((color, i) => ({
      id: i,
      color,
      delay: i * 0.3,
      yOffset: i * 15,
    }))
  }, [colors, ageProfile])

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {waves.map((wave) => (
        <motion.div
          key={wave.id}
          className="absolute w-[200%] h-40"
          style={{
            bottom: wave.yOffset,
            left: '-50%',
            background: `linear-gradient(90deg, transparent, ${wave.color}88, transparent)`,
            borderRadius: '50%',
          }}
          animate={{
            x: ['-25%', '25%', '-25%'],
            scaleY: [1, 1.2, 1],
          }}
          transition={{
            duration: 4 + wave.id,
            delay: wave.delay,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
      ))}
    </div>
  )
}

// Sparkle effect overlay
export function SparkleAnimation({ colors, count = 20, seed = 0, ageProfile = null }) {
  const sparkles = useMemo(() => {
    const items = []

    // For 4-6 months, sparkles are too complex - return empty array
    const ageMonths = ageProfile?.ageRange?.[0] || 12
    if (ageMonths >= 4 && ageMonths <= 6) {
      return []
    }

    const speedMultiplier = ageProfile?.animationSpeed || 1

    // Filter colors by age profile palette
    const availableColors = ageProfile?.colorPalette ?
      colors.filter(color => ageProfile.colorPalette.includes(color.toUpperCase())) :
      colors
    const finalColors = availableColors.length > 0 ? availableColors : colors

    for (let i = 0; i < count; i++) {
      const pseudoRandom = (n) => {
        const x = Math.sin(seed + n) * 10000
        return x - Math.floor(x)
      }

      items.push({
        id: i,
        x: pseudoRandom(i * 4) * 100,
        y: pseudoRandom(i * 4 + 1) * 100,
        size: 10 + pseudoRandom(i * 4 + 2) * 20,
        color: finalColors[Math.floor(pseudoRandom(i * 4 + 3) * finalColors.length)],
        duration: (1 + pseudoRandom(i * 4 + 4) * 2) / speedMultiplier,
        delay: pseudoRandom(i * 4 + 5) * 3,
      })
    }
    return items
  }, [colors, count, seed, ageProfile])

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {sparkles.map((sparkle) => (
        <motion.div
          key={sparkle.id}
          className="absolute"
          style={{
            left: `${sparkle.x}%`,
            top: `${sparkle.y}%`,
          }}
          initial={{ scale: 0, opacity: 0 }}
          animate={{
            scale: [0, 1, 0],
            opacity: [0, 1, 0],
            rotate: [0, 180],
          }}
          transition={{
            duration: sparkle.duration,
            delay: sparkle.delay,
            repeat: Infinity,
          }}
        >
          <svg width={sparkle.size} height={sparkle.size} viewBox="0 0 24 24">
            <path
              d="M12 0L14 10L24 12L14 14L12 24L10 14L0 12L10 10Z"
              fill={sparkle.color}
              style={{ filter: `drop-shadow(0 0 4px ${sparkle.color})` }}
            />
          </svg>
        </motion.div>
      ))}
    </div>
  )
}

// Cloud animation
export function CloudAnimation({ count = 6, seed = 0, ageProfile = null }) {
  const clouds = useMemo(() => {
    const items = []

    // For 4-6 months, clouds are too complex - return empty array
    const ageMonths = ageProfile?.ageRange?.[0] || 12
    if (ageMonths >= 4 && ageMonths <= 6) {
      return []
    }

    const speedMultiplier = ageProfile?.animationSpeed || 1

    for (let i = 0; i < count; i++) {
      const pseudoRandom = (n) => {
        const x = Math.sin(seed + n) * 10000
        return x - Math.floor(x)
      }

      items.push({
        id: i,
        y: pseudoRandom(i * 4) * 60 + 10,
        size: 80 + pseudoRandom(i * 4 + 1) * 80,
        duration: (20 + pseudoRandom(i * 4 + 2) * 20) / speedMultiplier,
        delay: pseudoRandom(i * 4 + 3) * 10,
        opacity: 0.6 + pseudoRandom(i * 4 + 4) * 0.4,
      })
    }
    return items
  }, [count, seed, ageProfile])

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {clouds.map((cloud) => (
        <motion.div
          key={cloud.id}
          className="absolute text-white"
          style={{
            top: `${cloud.y}%`,
            fontSize: cloud.size,
            opacity: cloud.opacity,
            filter: 'blur(2px)',
          }}
          initial={{ x: '-20vw' }}
          animate={{ x: '120vw' }}
          transition={{
            duration: cloud.duration,
            delay: cloud.delay,
            repeat: Infinity,
            ease: 'linear',
          }}
        >
          ☁️
        </motion.div>
      ))}
    </div>
  )
}

// Star field animation
export function StarField({ count = 30, seed = 0, colors, ageProfile = null }) {
  const stars = useMemo(() => {
    const items = []
    const starEmojis = ['⭐', '🌟', '✨', '💫']

    // For 4-6 months, star fields are too complex - return empty array
    const ageMonths = ageProfile?.ageRange?.[0] || 12
    if (ageMonths >= 4 && ageMonths <= 6) {
      return []
    }

    const speedMultiplier = ageProfile?.animationSpeed || 1

    for (let i = 0; i < count; i++) {
      const pseudoRandom = (n) => {
        const x = Math.sin(seed + n) * 10000
        return x - Math.floor(x)
      }

      items.push({
        id: i,
        emoji: starEmojis[Math.floor(pseudoRandom(i * 5) * starEmojis.length)],
        x: pseudoRandom(i * 5 + 1) * 100,
        y: pseudoRandom(i * 5 + 2) * 100,
        size: 15 + pseudoRandom(i * 5 + 3) * 25,
        duration: (2 + pseudoRandom(i * 5 + 4) * 3) / speedMultiplier,
        delay: pseudoRandom(i * 5 + 5) * 2,
      })
    }
    return items
  }, [count, seed, ageProfile])

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {stars.map((star) => (
        <motion.div
          key={star.id}
          className="absolute"
          style={{
            left: `${star.x}%`,
            top: `${star.y}%`,
            fontSize: star.size,
          }}
          animate={{
            scale: [1, 1.5, 1],
            opacity: [0.5, 1, 0.5],
            rotate: [0, 180, 360],
          }}
          transition={{
            duration: star.duration,
            delay: star.delay,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        >
          {star.emoji}
        </motion.div>
      ))}
    </div>
  )
}

// Planet animation for space theme
export function PlanetAnimation({ count = 5, seed = 0, ageProfile = null }) {
  const planets = useMemo(() => {
    const items = []
    const planetEmojis = ['🌍', '🌙', '🪐', '☀️', '🌕', '🌑', '🔴', '🟠', '🟡']

    // For 4-6 months, planets are too complex - return empty array
    const ageMonths = ageProfile?.ageRange?.[0] || 12
    if (ageMonths >= 4 && ageMonths <= 6) {
      return []
    }

    const speedMultiplier = ageProfile?.animationSpeed || 1

    for (let i = 0; i < count; i++) {
      const pseudoRandom = (n) => {
        const x = Math.sin(seed + n) * 10000
        return x - Math.floor(x)
      }

      items.push({
        id: i,
        emoji: planetEmojis[Math.floor(pseudoRandom(i * 5) * planetEmojis.length)],
        x: pseudoRandom(i * 5 + 1) * 80 + 10,
        y: pseudoRandom(i * 5 + 2) * 80 + 10,
        size: 40 + pseudoRandom(i * 5 + 3) * 60,
        duration: (10 + pseudoRandom(i * 5 + 4) * 10) / speedMultiplier,
        delay: pseudoRandom(i * 5 + 5) * 3,
      })
    }
    return items
  }, [count, seed, ageProfile])

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {planets.map((planet) => (
        <motion.div
          key={planet.id}
          className="absolute"
          style={{
            left: `${planet.x}%`,
            top: `${planet.y}%`,
            fontSize: planet.size,
          }}
          animate={{
            rotate: [0, 360],
            scale: [1, 1.1, 1],
          }}
          transition={{
            rotate: {
              duration: planet.duration,
              repeat: Infinity,
              ease: 'linear',
            },
            scale: {
              duration: planet.duration / 2,
              repeat: Infinity,
              ease: 'easeInOut',
            },
          }}
        >
          {planet.emoji}
        </motion.div>
      ))}
    </div>
  )
}

// Flower animation for garden theme
export function FlowerAnimation({ count = 10, seed = 0, ageProfile = null }) {
  const flowers = useMemo(() => {
    const items = []
    const flowerEmojis = ['🌸', '🌺', '🌻', '🌼', '🌷', '🌹', '💐', '🪻', '🪷']

    // For 4-6 months, flowers are too complex - return empty array
    const ageMonths = ageProfile?.ageRange?.[0] || 12
    if (ageMonths >= 4 && ageMonths <= 6) {
      return []
    }

    const speedMultiplier = ageProfile?.animationSpeed || 1

    for (let i = 0; i < count; i++) {
      const pseudoRandom = (n) => {
        const x = Math.sin(seed + n) * 10000
        return x - Math.floor(x)
      }

      items.push({
        id: i,
        emoji: flowerEmojis[Math.floor(pseudoRandom(i * 5) * flowerEmojis.length)],
        x: pseudoRandom(i * 5 + 1) * 90 + 5,
        y: 50 + pseudoRandom(i * 5 + 2) * 40,
        size: 30 + pseudoRandom(i * 5 + 3) * 40,
        duration: (3 + pseudoRandom(i * 5 + 4) * 2 + 4) / speedMultiplier,
        delay: pseudoRandom(i * 5 + 5) * 2,
      })
    }
    return items
  }, [count, seed, ageProfile])

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {flowers.map((flower) => (
        <motion.div
          key={flower.id}
          className="absolute"
          style={{
            left: `${flower.x}%`,
            top: `${flower.y}%`,
            fontSize: flower.size,
          }}
          initial={{ scale: 0, rotate: -20 }}
          animate={{
            scale: [0, 1, 1, 1, 0],
            rotate: [-20, 0, 20, 0, -20],
          }}
          transition={{
            duration: flower.duration + 4,
            delay: flower.delay,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        >
          {flower.emoji}
        </motion.div>
      ))}
    </div>
  )
}

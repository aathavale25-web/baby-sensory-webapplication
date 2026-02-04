import { motion } from 'framer-motion'
import { useMemo } from 'react'

export default function BubbleAnimation({ colors, count = 15, seed = 0, ageProfile = null }) {
  const bubbles = useMemo(() => {
    const items = []

    // Apply age profile adaptations
    const sizeMultiplier = ageProfile?.objectSize ?
      (ageProfile.objectSize.min + ageProfile.objectSize.max) / 2 / 10 : 1
    const speedMultiplier = ageProfile?.animationSpeed || 1
    const allowRotation = ageProfile?.allowRotation !== false
    const movementPattern = ageProfile?.movementPattern || 'organic'

    // Filter colors by age profile palette
    const availableColors = ageProfile?.colorPalette ?
      colors.filter(color => ageProfile.colorPalette.includes(color.toUpperCase())) :
      colors

    // Use default colors if filtered list is empty
    const finalColors = availableColors.length > 0 ? availableColors : colors

    for (let i = 0; i < count; i++) {
      const pseudoRandom = (n) => {
        const x = Math.sin(seed + n) * 10000
        return x - Math.floor(x)
      }

      const baseSize = 30 + pseudoRandom(i * 3 + 1) * 80

      items.push({
        id: i,
        x: pseudoRandom(i * 3) * 100,
        size: baseSize * sizeMultiplier,
        color: finalColors[Math.floor(pseudoRandom(i * 3 + 2) * finalColors.length)],
        duration: (4 + pseudoRandom(i * 3 + 3) * 4) / speedMultiplier,
        delay: pseudoRandom(i * 3 + 4) * 3,
        allowRotation,
        movementPattern,
      })
    }
    return items
  }, [colors, count, seed, ageProfile])

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {bubbles.map((bubble) => {
        // Determine movement pattern based on age profile
        let xMovement = [0, 20, -20, 0]
        if (bubble.movementPattern === 'linear') {
          xMovement = [0, 0, 0, 0] // No horizontal movement for youngest
        } else if (bubble.movementPattern === 'curved') {
          xMovement = [0, 10, -10, 0] // Gentle curves
        }

        // Build animation object
        const animateProps = {
          y: '-20vh',
          opacity: [0, 1, 1, 0],
          scale: [0.8, 1, 1.1, 1],
          x: xMovement,
        }

        // Add rotation only if allowed
        if (bubble.allowRotation) {
          animateProps.rotate = [0, 360]
        }

        return (
          <motion.div
            key={bubble.id}
            className="absolute rounded-full"
            style={{
              left: `${bubble.x}%`,
              width: bubble.size,
              height: bubble.size,
              background: `radial-gradient(circle at 30% 30%, white, ${bubble.color})`,
              boxShadow: `0 0 ${bubble.size / 3}px ${bubble.color}40`,
            }}
            initial={{ y: '110vh', opacity: 0 }}
            animate={animateProps}
            transition={{
              duration: bubble.duration,
              delay: bubble.delay,
              repeat: Infinity,
              ease: 'linear',
            }}
          />
        )
      })}
    </div>
  )
}

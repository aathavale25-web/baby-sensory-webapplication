import { useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

function Particle({ x, y, color, angle, id, size }) {
  const distance = 80 + Math.random() * 80 // Larger burst radius
  const endX = x + Math.cos(angle) * distance
  const endY = y + Math.sin(angle) * distance

  return (
    <motion.div
      className="absolute rounded-full pointer-events-none"
      style={{
        left: x,
        top: y,
        width: size,
        height: size,
        background: color,
        boxShadow: `0 0 20px ${color}, 0 0 40px ${color}`, // More intense glow
      }}
      initial={{ scale: 1, opacity: 1, x: 0, y: 0 }}
      animate={{
        scale: 0,
        opacity: 0,
        x: endX - x,
        y: endY - y,
      }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.8, ease: 'easeOut' }}
    />
  )
}

function Ripple({ x, y, color }) {
  return (
    <motion.div
      className="absolute rounded-full border-4 pointer-events-none"
      style={{
        left: x,
        top: y,
        borderColor: color,
        transform: 'translate(-50%, -50%)',
        boxShadow: `0 0 30px ${color}`, // Add glow to ripple
      }}
      initial={{ width: 0, height: 0, opacity: 1 }}
      animate={{ width: 250, height: 250, opacity: 0 }} // Larger ripple
      exit={{ opacity: 0 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
    />
  )
}

function Emoji({ x, y, emoji }) {
  return (
    <motion.div
      className="absolute text-5xl pointer-events-none"
      style={{
        left: x,
        top: y,
        transform: 'translate(-50%, -50%)',
      }}
      initial={{ scale: 0, opacity: 1 }}
      animate={{ scale: [0, 1.5, 1], y: -100, opacity: 0 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.8, ease: 'easeOut' }}
    >
      {emoji}
    </motion.div>
  )
}

export default function TouchFeedback({ colors, onTouch, themeEmoji = '⭐', themeId, onTrackTouch }) {
  const [effects, setEffects] = useState([])

  const handleInteraction = useCallback((e) => {
    e.preventDefault()

    const rect = e.currentTarget.getBoundingClientRect()
    const touches = e.touches || [{ clientX: e.clientX, clientY: e.clientY }]

    const newEffects = []

    Array.from(touches).forEach((touch, touchIndex) => {
      const x = touch.clientX - rect.left
      const y = touch.clientY - rect.top
      const id = Date.now() + touchIndex
      const color = colors[Math.floor(Math.random() * colors.length)]

      // Add firework particles - more dramatic burst
      const particleCount = 16 // More particles for firework effect
      for (let i = 0; i < particleCount; i++) {
        const angle = (i / particleCount) * Math.PI * 2
        const size = 4 + Math.random() * 8 // Varied particle sizes
        newEffects.push({
          type: 'particle',
          id: `${id}-particle-${i}`,
          x,
          y,
          color,
          angle,
          size,
        })
      }

      // Add secondary burst for extra firework effect
      const secondaryCount = 8
      for (let i = 0; i < secondaryCount; i++) {
        const angle = ((i + 0.5) / secondaryCount) * Math.PI * 2 // Offset angles
        const size = 3 + Math.random() * 5
        newEffects.push({
          type: 'particle',
          id: `${id}-particle-secondary-${i}`,
          x,
          y,
          color: color,
          angle,
          size,
        })
      }

      // Add ripple
      newEffects.push({
        type: 'ripple',
        id: `${id}-ripple`,
        x,
        y,
        color,
      })

      // Add emoji
      newEffects.push({
        type: 'emoji',
        id: `${id}-emoji`,
        x,
        y,
        emoji: themeEmoji,
      })

      // Track touch for scoreboard
      if (onTrackTouch && themeId) {
        onTrackTouch(themeId, color)
      }
    })

    setEffects(prev => [...prev, ...newEffects])

    // Trigger sound callback
    if (onTouch) {
      onTouch()
    }

    // Clean up effects after animation
    setTimeout(() => {
      setEffects(prev => prev.filter(effect =>
        !newEffects.some(ne => ne.id === effect.id)
      ))
    }, 1000) // Longer cleanup time for firework effect
  }, [colors, onTouch, themeEmoji, themeId, onTrackTouch])

  return (
    <div
      className="absolute inset-0 z-50"
      onTouchStart={handleInteraction}
      onMouseDown={handleInteraction}
    >
      <AnimatePresence>
        {effects.map((effect) => {
          switch (effect.type) {
            case 'particle':
              return <Particle key={effect.id} {...effect} />
            case 'ripple':
              return <Ripple key={effect.id} {...effect} />
            case 'emoji':
              return <Emoji key={effect.id} {...effect} />
            default:
              return null
          }
        })}
      </AnimatePresence>
    </div>
  )
}

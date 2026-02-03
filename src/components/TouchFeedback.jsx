import { useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

function Particle({ x, y, color, angle, id }) {
  const distance = 50 + Math.random() * 50
  const endX = x + Math.cos(angle) * distance
  const endY = y + Math.sin(angle) * distance

  return (
    <motion.div
      className="absolute w-4 h-4 rounded-full pointer-events-none"
      style={{
        left: x,
        top: y,
        background: color,
        boxShadow: `0 0 10px ${color}`,
      }}
      initial={{ scale: 1, opacity: 1, x: 0, y: 0 }}
      animate={{
        scale: 0,
        opacity: 0,
        x: endX - x,
        y: endY - y,
      }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
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
      }}
      initial={{ width: 0, height: 0, opacity: 1 }}
      animate={{ width: 200, height: 200, opacity: 0 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
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

export default function TouchFeedback({ colors, onTouch, themeEmoji = '⭐' }) {
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

      // Add particles
      const particleCount = 8
      for (let i = 0; i < particleCount; i++) {
        const angle = (i / particleCount) * Math.PI * 2
        newEffects.push({
          type: 'particle',
          id: `${id}-particle-${i}`,
          x,
          y,
          color,
          angle,
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
    }, 800)
  }, [colors, onTouch, themeEmoji])

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

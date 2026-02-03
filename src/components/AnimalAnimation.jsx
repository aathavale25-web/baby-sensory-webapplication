import { motion } from 'framer-motion'
import { useMemo } from 'react'
import { animalShapes } from '../data/sensoryContent'

function Animal({ emoji, x, y, size, delay, duration, bounceHeight = 30 }) {
  return (
    <motion.div
      className="absolute flex items-center justify-center"
      style={{
        left: `${x}%`,
        top: `${y}%`,
        fontSize: size,
        filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.3))',
      }}
      initial={{ scale: 0, y: 0 }}
      animate={{
        scale: [0, 1.2, 1, 1, 1.2, 0],
        y: [0, -bounceHeight, 0, -bounceHeight / 2, 0, 0],
        rotate: [0, -10, 10, -5, 5, 0],
      }}
      transition={{
        duration,
        delay,
        repeat: Infinity,
        ease: 'easeInOut',
      }}
    >
      {emoji}
    </motion.div>
  )
}

export default function AnimalAnimation({ count = 8, seed = 0, themeId = 'animals' }) {
  const animals = useMemo(() => {
    const animalList = Object.values(animalShapes)
    const items = []

    for (let i = 0; i < count; i++) {
      const pseudoRandom = (n) => {
        const x = Math.sin(seed + n) * 10000
        return x - Math.floor(x)
      }

      const animal = animalList[Math.floor(pseudoRandom(i * 6) * animalList.length)]

      items.push({
        id: i,
        emoji: animal.emoji,
        x: pseudoRandom(i * 6 + 1) * 80 + 10,
        y: pseudoRandom(i * 6 + 2) * 60 + 20,
        size: 40 + pseudoRandom(i * 6 + 3) * 40,
        duration: 4 + pseudoRandom(i * 6 + 4) * 4,
        delay: pseudoRandom(i * 6 + 5) * 5,
        bounceHeight: 20 + pseudoRandom(i * 6 + 6) * 30,
      })
    }
    return items
  }, [count, seed])

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {animals.map((animal) => (
        <Animal key={animal.id} {...animal} />
      ))}
    </div>
  )
}

// Specialized animal animations for different themes
export function FishAnimation({ count = 10, seed = 0, colors }) {
  const fish = useMemo(() => {
    const items = []
    const fishEmojis = ['🐠', '🐟', '🐡', '🦈', '🐳', '🐬', '🦑', '🦀', '🦞', '🐙']

    for (let i = 0; i < count; i++) {
      const pseudoRandom = (n) => {
        const x = Math.sin(seed + n) * 10000
        return x - Math.floor(x)
      }

      items.push({
        id: i,
        emoji: fishEmojis[Math.floor(pseudoRandom(i * 5) * fishEmojis.length)],
        y: pseudoRandom(i * 5 + 1) * 70 + 15,
        size: 30 + pseudoRandom(i * 5 + 2) * 40,
        duration: 6 + pseudoRandom(i * 5 + 3) * 6,
        delay: pseudoRandom(i * 5 + 4) * 4,
        direction: pseudoRandom(i * 5 + 5) > 0.5 ? 1 : -1,
      })
    }
    return items
  }, [count, seed])

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {fish.map((f) => (
        <motion.div
          key={f.id}
          className="absolute"
          style={{
            top: `${f.y}%`,
            fontSize: f.size,
            transform: f.direction === -1 ? 'scaleX(-1)' : 'none',
          }}
          initial={{ x: f.direction === 1 ? '-20vw' : '120vw' }}
          animate={{
            x: f.direction === 1 ? '120vw' : '-20vw',
            y: [0, -20, 0, 20, 0],
          }}
          transition={{
            duration: f.duration,
            delay: f.delay,
            repeat: Infinity,
            ease: 'linear',
          }}
        >
          {f.emoji}
        </motion.div>
      ))}
    </div>
  )
}

export function ButterflyAnimation({ count = 8, seed = 0 }) {
  const butterflies = useMemo(() => {
    const items = []
    const bugEmojis = ['🦋', '🐝', '🐞', '🪲', '🦗']

    for (let i = 0; i < count; i++) {
      const pseudoRandom = (n) => {
        const x = Math.sin(seed + n) * 10000
        return x - Math.floor(x)
      }

      items.push({
        id: i,
        emoji: bugEmojis[Math.floor(pseudoRandom(i * 6) * bugEmojis.length)],
        startX: pseudoRandom(i * 6 + 1) * 80 + 10,
        startY: pseudoRandom(i * 6 + 2) * 80 + 10,
        size: 30 + pseudoRandom(i * 6 + 3) * 30,
        duration: 8 + pseudoRandom(i * 6 + 4) * 8,
        delay: pseudoRandom(i * 6 + 5) * 4,
      })
    }
    return items
  }, [count, seed])

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {butterflies.map((b) => (
        <motion.div
          key={b.id}
          className="absolute"
          style={{
            left: `${b.startX}%`,
            top: `${b.startY}%`,
            fontSize: b.size,
          }}
          animate={{
            x: [0, 50, -30, 80, 0],
            y: [0, -40, 20, -60, 0],
            rotate: [0, 10, -10, 15, 0],
          }}
          transition={{
            duration: b.duration,
            delay: b.delay,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        >
          {b.emoji}
        </motion.div>
      ))}
    </div>
  )
}

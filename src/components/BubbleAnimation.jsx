import { motion } from 'framer-motion'
import { useMemo } from 'react'

export default function BubbleAnimation({ colors, count = 15, seed = 0 }) {
  const bubbles = useMemo(() => {
    const items = []
    for (let i = 0; i < count; i++) {
      const pseudoRandom = (n) => {
        const x = Math.sin(seed + n) * 10000
        return x - Math.floor(x)
      }

      items.push({
        id: i,
        x: pseudoRandom(i * 3) * 100,
        size: 30 + pseudoRandom(i * 3 + 1) * 80,
        color: colors[Math.floor(pseudoRandom(i * 3 + 2) * colors.length)],
        duration: 4 + pseudoRandom(i * 3 + 3) * 4,
        delay: pseudoRandom(i * 3 + 4) * 3,
      })
    }
    return items
  }, [colors, count, seed])

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {bubbles.map((bubble) => (
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
          animate={{
            y: '-20vh',
            opacity: [0, 1, 1, 0],
            scale: [0.8, 1, 1.1, 1],
            x: [0, 20, -20, 0],
          }}
          transition={{
            duration: bubble.duration,
            delay: bubble.delay,
            repeat: Infinity,
            ease: 'linear',
          }}
        />
      ))}
    </div>
  )
}

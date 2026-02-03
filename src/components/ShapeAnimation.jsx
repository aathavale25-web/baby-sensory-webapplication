import { motion } from 'framer-motion'
import { useMemo } from 'react'
import { geometricShapes } from '../data/sensoryContent'

// Generate SVG path for polygon shapes
function getShapePath(sides, size, star = false) {
  if (sides === 0) return null // Circle

  const points = []
  const angleOffset = -Math.PI / 2

  for (let i = 0; i < sides; i++) {
    const angle = (i * 2 * Math.PI) / sides + angleOffset
    const radius = star && i % 2 === 1 ? size * 0.5 : size
    const x = Math.cos(angle) * radius + size
    const y = Math.sin(angle) * radius + size
    points.push(`${x},${y}`)
  }

  if (star) {
    const starPoints = []
    for (let i = 0; i < sides * 2; i++) {
      const angle = (i * Math.PI) / sides + angleOffset
      const radius = i % 2 === 0 ? size : size * 0.4
      const x = Math.cos(angle) * radius + size
      const y = Math.sin(angle) * radius + size
      starPoints.push(`${x},${y}`)
    }
    return `M ${starPoints.join(' L ')} Z`
  }

  return `M ${points.join(' L ')} Z`
}

function Shape({ type, size, color, x, y, delay, duration }) {
  const shapeConfig = geometricShapes.find(s => s.type === type) || geometricShapes[0]
  const path = getShapePath(shapeConfig.sides, size / 2, shapeConfig.star)

  return (
    <motion.div
      className="absolute"
      style={{
        left: `${x}%`,
        top: `${y}%`,
        width: size,
        height: size,
      }}
      initial={{ scale: 0, rotate: 0, opacity: 0 }}
      animate={{
        scale: [0, 1, 1, 0],
        rotate: [0, 180, 360],
        opacity: [0, 1, 1, 0],
      }}
      transition={{
        duration,
        delay,
        repeat: Infinity,
        ease: 'easeInOut',
      }}
    >
      {shapeConfig.sides === 0 ? (
        <div
          className="w-full h-full rounded-full"
          style={{
            background: `radial-gradient(circle, ${color}, ${color}88)`,
            boxShadow: `0 0 ${size / 2}px ${color}66`,
          }}
        />
      ) : (
        <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
          <path
            d={path}
            fill={color}
            style={{
              filter: `drop-shadow(0 0 ${size / 4}px ${color}66)`,
            }}
          />
        </svg>
      )}
    </motion.div>
  )
}

export default function ShapeAnimation({ colors, count = 12, seed = 0 }) {
  const shapes = useMemo(() => {
    const items = []
    const shapeTypes = geometricShapes.map(s => s.type)

    for (let i = 0; i < count; i++) {
      const pseudoRandom = (n) => {
        const x = Math.sin(seed + n) * 10000
        return x - Math.floor(x)
      }

      items.push({
        id: i,
        type: shapeTypes[Math.floor(pseudoRandom(i * 5) * shapeTypes.length)],
        x: pseudoRandom(i * 5 + 1) * 80 + 10,
        y: pseudoRandom(i * 5 + 2) * 80 + 10,
        size: 40 + pseudoRandom(i * 5 + 3) * 60,
        color: colors[Math.floor(pseudoRandom(i * 5 + 4) * colors.length)],
        duration: 5 + pseudoRandom(i * 5 + 5) * 5,
        delay: pseudoRandom(i * 5 + 6) * 4,
      })
    }
    return items
  }, [colors, count, seed])

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {shapes.map((shape) => (
        <Shape key={shape.id} {...shape} />
      ))}
    </div>
  )
}

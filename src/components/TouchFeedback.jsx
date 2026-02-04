import { useState, useCallback, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useBabyProfile } from '../contexts/BabyProfileContext'
import { useAudio } from '../hooks/useAudio'

// Celebration message component
function CelebrationMessage({ x, y, babyName }) {
  return (
    <motion.div
      className="absolute text-4xl font-bold pointer-events-none z-50"
      style={{
        left: x,
        top: y,
        transform: 'translate(-50%, -50%)',
        textShadow: '0 0 20px rgba(255, 255, 255, 0.8), 0 0 40px rgba(255, 255, 255, 0.6)',
        color: '#FFD700',
      }}
      initial={{ scale: 0, opacity: 0, y: 0 }}
      animate={{
        scale: [0, 1.2, 1],
        opacity: [0, 1, 1, 0],
        y: [0, -60]
      }}
      exit={{ opacity: 0 }}
      transition={{ duration: 1.5, ease: 'easeOut' }}
    >
      Yay {babyName}! 🌟
    </motion.div>
  )
}

// Interactive object component with celebration behavior
function TouchableObject({
  id,
  x,
  y,
  size,
  color,
  onCelebrate,
  touchBehavior,
  babyName
}) {
  const [celebrationPhase, setCelebrationPhase] = useState('idle') // idle, celebrating, persisting, fadeOut
  const [showMessage, setShowMessage] = useState(false)
  const celebrationRef = useRef(false)
  const { playSound } = useAudio()

  const handleTouch = useCallback((e) => {
    e.stopPropagation()

    // Prevent multi-touch on same object
    if (celebrationRef.current) return

    celebrationRef.current = true
    setShowMessage(true)

    // Play celebration sound
    playSound('chime')

    // Notify parent to track touch
    if (onCelebrate) {
      onCelebrate(id, color)
    }

    // Phase 1: Celebration (grow + pulse)
    setCelebrationPhase('celebrating')

    // Phase 2: Persist (stay enlarged)
    setTimeout(() => {
      setCelebrationPhase('persisting')
    }, touchBehavior.celebrationDuration)

    // Phase 3: Fade out
    setTimeout(() => {
      setCelebrationPhase('fadeOut')
    }, touchBehavior.celebrationDuration + touchBehavior.persistDuration)

  }, [id, color, onCelebrate, playSound, touchBehavior])

  // Calculate hitbox size
  const hitboxSize = size * touchBehavior.hitboxMultiplier
  const hitboxOffset = (hitboxSize - size) / 2

  // Animation values based on phase
  const getAnimationProps = () => {
    switch (celebrationPhase) {
      case 'celebrating':
        return {
          scale: [
            1,
            touchBehavior.growScale, // Immediate growth
            touchBehavior.growScale * 0.95, // Pulse 1
            touchBehavior.growScale * 1.05, // Pulse 2
            touchBehavior.growScale * 0.95, // Pulse 3
            touchBehavior.growScale, // Hold
          ],
          opacity: 1,
          filter: [
            'brightness(1) drop-shadow(0 0 0px rgba(255, 255, 255, 0))',
            'brightness(1.5) drop-shadow(0 0 30px rgba(255, 255, 255, 0.8))',
            'brightness(1.3) drop-shadow(0 0 25px rgba(255, 255, 255, 0.6))',
            'brightness(1.4) drop-shadow(0 0 28px rgba(255, 255, 255, 0.7))',
            'brightness(1.3) drop-shadow(0 0 25px rgba(255, 255, 255, 0.6))',
            'brightness(1.5) drop-shadow(0 0 30px rgba(255, 255, 255, 0.8))',
          ],
          transition: {
            duration: touchBehavior.celebrationDuration / 1000,
            ease: 'easeInOut',
          }
        }
      case 'persisting':
        return {
          scale: touchBehavior.growScale,
          opacity: 1,
          filter: 'brightness(1.5) drop-shadow(0 0 30px rgba(255, 255, 255, 0.8))',
          transition: {
            duration: touchBehavior.persistDuration / 1000,
          }
        }
      case 'fadeOut':
        return {
          scale: touchBehavior.growScale * 1.2,
          opacity: 0,
          filter: 'brightness(2) drop-shadow(0 0 40px rgba(255, 255, 255, 1))',
          transition: {
            duration: 1,
            ease: 'easeOut',
          }
        }
      default: // idle
        return {
          scale: 1,
          opacity: 1,
          filter: 'brightness(1) drop-shadow(0 0 0px rgba(255, 255, 255, 0))',
        }
    }
  }

  return (
    <>
      {/* Hitbox (invisible, larger touch area) */}
      <motion.div
        className="absolute cursor-pointer"
        style={{
          left: `${x}%`,
          top: `${y}%`,
          width: hitboxSize,
          height: hitboxSize,
          marginLeft: -hitboxOffset,
          marginTop: -hitboxOffset,
        }}
        onTouchStart={handleTouch}
        onMouseDown={handleTouch}
      >
        {/* Visible object */}
        <motion.div
          className="absolute rounded-full"
          style={{
            left: hitboxOffset,
            top: hitboxOffset,
            width: size,
            height: size,
            background: `radial-gradient(circle at 30% 30%, ${color}ff, ${color}cc)`,
            boxShadow: `0 0 ${size / 3}px ${color}66`,
          }}
          animate={getAnimationProps()}
        />
      </motion.div>

      {/* Celebration message */}
      <AnimatePresence>
        {showMessage && (
          <CelebrationMessage
            x={`${x}%`}
            y={`${y}%`}
            babyName={babyName}
          />
        )}
      </AnimatePresence>
    </>
  )
}

export default function TouchFeedback({ colors, onTouch, themeEmoji = '⭐', themeId, onTrackTouch }) {
  const [objects, setObjects] = useState([])
  const { profile, ageProfile } = useBabyProfile()
  const nextIdRef = useRef(0)

  // Get touch behavior from age profile, with fallback defaults
  const touchBehavior = ageProfile?.touchBehavior || {
    celebrationDuration: 1000,
    persistDuration: 3000,
    removeOnTouch: false,
    growScale: 2.0,
    hitboxMultiplier: 1.5,
  }

  const babyName = profile?.name || 'Baby'

  // Spawn objects based on age profile
  useEffect(() => {
    if (!ageProfile) return

    const spawnObject = () => {
      const currentCount = objects.length

      // Check if we can spawn more objects
      if (currentCount >= ageProfile.maxSimultaneousObjects) {
        return
      }

      const objectsToSpawn = Math.min(
        Math.floor(Math.random() * (ageProfile.objectCount.max - ageProfile.objectCount.min + 1)) + ageProfile.objectCount.min,
        ageProfile.maxSimultaneousObjects - currentCount
      )

      const newObjects = []
      for (let i = 0; i < objectsToSpawn; i++) {
        const size = (ageProfile.objectSize.min + Math.random() * (ageProfile.objectSize.max - ageProfile.objectSize.min)) * (window.innerWidth / 100)

        newObjects.push({
          id: nextIdRef.current++,
          x: 10 + Math.random() * 80, // Keep away from edges
          y: 10 + Math.random() * 80,
          size,
          color: colors[Math.floor(Math.random() * colors.length)],
          spawnTime: Date.now(),
        })
      }

      setObjects(prev => [...prev, ...newObjects])
    }

    // Initial spawn
    spawnObject()

    // Set up spawn interval
    const interval = setInterval(spawnObject, ageProfile.spawnDelay)

    return () => clearInterval(interval)
  }, [ageProfile, colors, objects.length])

  // Handle object celebration
  const handleCelebrate = useCallback((objectId, color) => {
    // Track touch for scoreboard
    if (onTrackTouch && themeId) {
      onTrackTouch(themeId, color)
    }

    // Trigger sound callback
    if (onTouch) {
      onTouch()
    }

    // Remove object after celebration completes
    const totalDuration = touchBehavior.celebrationDuration + touchBehavior.persistDuration + 1000 // Add fade duration
    setTimeout(() => {
      setObjects(prev => prev.filter(obj => obj.id !== objectId))
    }, totalDuration)
  }, [onTouch, onTrackTouch, themeId, touchBehavior])

  // Auto-remove objects that have been on screen too long (30 seconds)
  useEffect(() => {
    const cleanup = setInterval(() => {
      const now = Date.now()
      setObjects(prev => prev.filter(obj => now - obj.spawnTime < 30000))
    }, 5000)

    return () => clearInterval(cleanup)
  }, [])

  return (
    <div className="absolute inset-0 z-50">
      <AnimatePresence>
        {objects.map((object) => (
          <TouchableObject
            key={object.id}
            {...object}
            onCelebrate={handleCelebrate}
            touchBehavior={touchBehavior}
            babyName={babyName}
          />
        ))}
      </AnimatePresence>
    </div>
  )
}

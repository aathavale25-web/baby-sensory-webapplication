import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import SensoryCanvas from './components/SensoryCanvas'

function LoadingScreen() {
  return (
    <motion.div
      className="fixed inset-0 bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex flex-col items-center justify-center"
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      <motion.div
        className="text-8xl mb-8"
        animate={{
          scale: [1, 1.2, 1],
          rotate: [0, 10, -10, 0],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      >
        🌟
      </motion.div>

      <h1 className="text-4xl font-bold text-white mb-4">
        Baby Sensory World
      </h1>

      <div className="flex gap-3 mt-4">
        {['🔴', '🟡', '🟢', '🔵', '🟣'].map((dot, i) => (
          <motion.div
            key={i}
            className="text-3xl loading-dot"
            style={{ animationDelay: `${i * 0.2}s` }}
          >
            {dot}
          </motion.div>
        ))}
      </div>

      <motion.p
        className="text-white/70 mt-8 text-lg"
        animate={{ opacity: [0.5, 1, 0.5] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        Loading magical experiences...
      </motion.p>
    </motion.div>
  )
}

function WelcomeScreen({ onStart }) {
  return (
    <motion.div
      className="fixed inset-0 bg-gradient-to-br from-pink-500 via-purple-500 to-indigo-600 flex flex-col items-center justify-center p-8"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 1.1 }}
      transition={{ duration: 0.5 }}
    >
      <motion.div
        className="text-9xl mb-6"
        animate={{
          y: [0, -20, 0],
          rotate: [0, 5, -5, 0],
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      >
        👶
      </motion.div>

      <h1 className="text-4xl md:text-5xl font-bold text-white text-center mb-4">
        Baby Sensory World
      </h1>

      <p className="text-xl text-white/90 text-center mb-8 max-w-md">
        Colorful animations and gentle sounds for your little one to explore!
      </p>

      <div className="flex flex-wrap justify-center gap-4 mb-8">
        {['🌈', '🦋', '🐠', '⭐', '🎵', '💫'].map((emoji, i) => (
          <motion.span
            key={i}
            className="text-4xl"
            animate={{
              y: [0, -10, 0],
              rotate: [0, 10, -10, 0],
            }}
            transition={{
              duration: 2,
              delay: i * 0.2,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          >
            {emoji}
          </motion.span>
        ))}
      </div>

      <motion.button
        onClick={onStart}
        className="px-12 py-6 bg-white rounded-full text-2xl font-bold text-purple-600 shadow-2xl"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        animate={{
          boxShadow: [
            '0 0 20px rgba(255,255,255,0.5)',
            '0 0 40px rgba(255,255,255,0.8)',
            '0 0 20px rgba(255,255,255,0.5)',
          ],
        }}
        transition={{
          boxShadow: {
            duration: 2,
            repeat: Infinity,
          },
        }}
      >
        ▶️ Start Playing!
      </motion.button>

      <div className="mt-8 text-white/70 text-center text-sm">
        <p>🔊 Sound works best with volume on</p>
        <p>📱 Tap anywhere to create magic!</p>
        <p>⬛ Go fullscreen for the best experience</p>
      </div>
    </motion.div>
  )
}

export default function App() {
  const [isLoading, setIsLoading] = useState(true)
  const [showWelcome, setShowWelcome] = useState(true)

  useEffect(() => {
    // Simulate loading time for assets
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 2000)

    return () => clearTimeout(timer)
  }, [])

  const handleStart = () => {
    setShowWelcome(false)
  }

  return (
    <div className="w-full h-full">
      <AnimatePresence mode="wait">
        {isLoading ? (
          <LoadingScreen key="loading" />
        ) : showWelcome ? (
          <WelcomeScreen key="welcome" onStart={handleStart} />
        ) : (
          <motion.div
            key="canvas"
            className="w-full h-full"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <SensoryCanvas />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

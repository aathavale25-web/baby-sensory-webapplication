import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { OBJECT_TYPE_EMOJIS } from '../hooks/useScoreboard'

// Confetti particle for celebrations
function Confetti({ delay }) {
  const colors = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7', '#DDA0DD', '#98D8C8']
  const color = colors[Math.floor(Math.random() * colors.length)]
  const startX = Math.random() * 100
  const endX = startX + (Math.random() - 0.5) * 40

  return (
    <motion.div
      className="absolute w-3 h-3 rounded-full"
      style={{ backgroundColor: color, left: `${startX}%` }}
      initial={{ y: -20, opacity: 1, scale: 1, rotate: 0 }}
      animate={{
        y: 400,
        opacity: 0,
        scale: 0.5,
        rotate: 360,
        x: `${endX - startX}%`,
      }}
      transition={{
        duration: 2,
        delay,
        ease: 'easeOut',
      }}
    />
  )
}

// Milestone celebration overlay
function MilestoneCelebration({ milestone, onComplete }) {
  useEffect(() => {
    const timer = setTimeout(onComplete, 3000)
    return () => clearTimeout(timer)
  }, [onComplete])

  return (
    <motion.div
      className="fixed inset-0 z-[100] flex items-center justify-center pointer-events-none"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      {/* Confetti */}
      <div className="absolute inset-0 overflow-hidden">
        {Array.from({ length: 30 }).map((_, i) => (
          <Confetti key={i} delay={i * 0.05} />
        ))}
      </div>

      {/* Milestone badge */}
      <motion.div
        className="bg-gradient-to-br from-yellow-400 via-orange-400 to-pink-500 rounded-3xl p-8 shadow-2xl text-center"
        initial={{ scale: 0, rotate: -180 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ type: 'spring', damping: 10, stiffness: 100 }}
      >
        <motion.div
          className="text-6xl mb-2"
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ repeat: 3, duration: 0.5 }}
        >
          🎉
        </motion.div>
        <motion.div
          className="text-5xl font-bold text-white drop-shadow-lg"
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ repeat: 3, duration: 0.5, delay: 0.1 }}
        >
          {milestone}
        </motion.div>
        <div className="text-white text-xl font-semibold mt-2">
          Touches!
        </div>
      </motion.div>
    </motion.div>
  )
}

// Color swatch component
function ColorSwatch({ color, count }) {
  const colorStyles = {
    Red: '#FF4444',
    Orange: '#FF8844',
    Yellow: '#FFDD44',
    Green: '#44FF44',
    Blue: '#4488FF',
    Cyan: '#44DDFF',
    Purple: '#AA44FF',
    Magenta: '#FF44FF',
    Pink: '#FF88CC',
    White: '#FFFFFF',
    'Light Blue': '#AADDFF',
    'Light Pink': '#FFCCEE',
    'Light Green': '#DDFFDD',
    Cream: '#FFEEDD',
    'Dark Blue': '#004488',
    Mint: '#00FF88',
    'Dark Gray': '#666666',
    Brown: '#AA7744',
    Tan: '#DDAA66',
    Colorful: 'linear-gradient(45deg, #FF6B6B, #4ECDC4, #45B7D1)',
  }

  const bgStyle = colorStyles[color] || colorStyles.Colorful

  return (
    <motion.div
      className="flex items-center gap-2 bg-white/20 rounded-full px-3 py-1.5"
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      whileHover={{ scale: 1.05 }}
    >
      <div
        className="w-5 h-5 rounded-full border-2 border-white/50 shadow-sm"
        style={{
          background: bgStyle,
        }}
      />
      <span className="text-white text-sm font-medium">{count}</span>
    </motion.div>
  )
}

// Object type badge component
function ObjectBadge({ type, count, isNew }) {
  const emoji = OBJECT_TYPE_EMOJIS[type] || '👆'

  return (
    <motion.div
      className="flex flex-col items-center bg-white/20 rounded-xl p-3 min-w-[70px]"
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      whileHover={{ scale: 1.05 }}
    >
      <motion.span
        className="text-3xl"
        animate={isNew ? { scale: [1, 1.3, 1] } : {}}
        transition={{ duration: 0.3 }}
      >
        {emoji}
      </motion.span>
      <motion.span
        className="text-white text-lg font-bold mt-1"
        key={count}
        initial={{ scale: 1.5 }}
        animate={{ scale: 1 }}
      >
        {count}
      </motion.span>
    </motion.div>
  )
}

// Session summary component
function SessionSummary({ summary, onClose }) {
  const { totalTouches, objectCounts, colorCounts, bestStreak, mostTouchedType, mostTouchedColor } = summary

  return (
    <motion.div
      className="fixed inset-0 z-[90] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.div
        className="bg-gradient-to-br from-purple-500 via-pink-500 to-orange-400 rounded-3xl p-6 max-w-md w-full shadow-2xl"
        initial={{ scale: 0.8, y: 50 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.8, y: 50 }}
        onClick={e => e.stopPropagation()}
      >
        <div className="text-center mb-6">
          <motion.div
            className="text-6xl mb-2"
            animate={{ rotate: [0, 10, -10, 0] }}
            transition={{ repeat: Infinity, duration: 2 }}
          >
            🏆
          </motion.div>
          <h2 className="text-3xl font-bold text-white">Session Complete!</h2>
        </div>

        {/* Total touches */}
        <div className="bg-white/20 rounded-2xl p-4 mb-4 text-center">
          <div className="text-white/80 text-sm uppercase tracking-wide">Total Touches</div>
          <motion.div
            className="text-5xl font-bold text-white"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', delay: 0.2 }}
          >
            {totalTouches}
          </motion.div>
        </div>

        {/* Stats grid */}
        <div className="grid grid-cols-2 gap-3 mb-4">
          <div className="bg-white/20 rounded-xl p-3 text-center">
            <div className="text-white/80 text-xs uppercase">Best Streak</div>
            <div className="text-2xl font-bold text-white flex items-center justify-center gap-1">
              <span>🔥</span> {bestStreak}
            </div>
          </div>
          <div className="bg-white/20 rounded-xl p-3 text-center">
            <div className="text-white/80 text-xs uppercase">Favorite</div>
            <div className="text-2xl">
              {OBJECT_TYPE_EMOJIS[mostTouchedType] || '👆'}
            </div>
          </div>
        </div>

        {/* Favorite color */}
        {mostTouchedColor && (
          <div className="bg-white/20 rounded-xl p-3 text-center mb-4">
            <div className="text-white/80 text-xs uppercase mb-1">Favorite Color</div>
            <div className="text-xl text-white font-semibold">{mostTouchedColor}</div>
          </div>
        )}

        {/* Close button */}
        <button
          onClick={onClose}
          className="w-full bg-white/30 hover:bg-white/40 text-white font-bold py-3 px-6 rounded-full transition-colors text-lg"
        >
          Great Job! 👏
        </button>
      </motion.div>
    </motion.div>
  )
}

// Main Scoreboard component
export default function Scoreboard({
  isOpen,
  onClose,
  totalTouches,
  objectCounts,
  colorCounts,
  currentStreak,
  bestStreak,
  milestone,
  showSummary,
  sessionSummary,
  onCloseSummary,
}) {
  const [prevTotal, setPrevTotal] = useState(totalTouches)
  const [isAnimating, setIsAnimating] = useState(false)

  // Animate when total changes
  useEffect(() => {
    if (totalTouches > prevTotal) {
      setIsAnimating(true)
      const timer = setTimeout(() => setIsAnimating(false), 300)
      setPrevTotal(totalTouches)
      return () => clearTimeout(timer)
    }
  }, [totalTouches, prevTotal])

  return (
    <>
      {/* Milestone celebration */}
      <AnimatePresence>
        {milestone && (
          <MilestoneCelebration
            milestone={milestone}
            onComplete={() => {}}
          />
        )}
      </AnimatePresence>

      {/* Session summary */}
      <AnimatePresence>
        {showSummary && sessionSummary && (
          <SessionSummary summary={sessionSummary} onClose={onCloseSummary} />
        )}
      </AnimatePresence>

      {/* Scoreboard modal */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="fixed inset-0 z-[80] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          >
            <motion.div
              className="bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 rounded-3xl p-6 max-w-sm w-full shadow-2xl max-h-[80vh] overflow-y-auto"
              initial={{ scale: 0.8, y: 50 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.8, y: 50 }}
              onClick={e => e.stopPropagation()}
            >
              {/* Header */}
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                  <span>📊</span> Scoreboard
                </h2>
                <button
                  onClick={onClose}
                  className="w-8 h-8 rounded-full bg-white/20 text-white text-xl flex items-center justify-center hover:bg-white/30 transition-colors"
                >
                  ×
                </button>
              </div>

              {/* Total touches - big number */}
              <motion.div
                className="bg-white/20 rounded-2xl p-6 mb-6 text-center"
                animate={isAnimating ? { scale: [1, 1.05, 1] } : {}}
              >
                <div className="text-white/80 text-sm uppercase tracking-wide mb-1">
                  Total Touches
                </div>
                <motion.div
                  className="text-6xl font-bold text-white"
                  key={totalTouches}
                  initial={{ scale: 1.2 }}
                  animate={{ scale: 1 }}
                >
                  {totalTouches}
                </motion.div>
              </motion.div>

              {/* Streak section */}
              <div className="grid grid-cols-2 gap-3 mb-6">
                <div className="bg-white/20 rounded-xl p-3 text-center">
                  <div className="text-white/80 text-xs uppercase tracking-wide">
                    Current Streak
                  </div>
                  <div className="text-3xl font-bold text-white flex items-center justify-center gap-1">
                    <span>⚡</span>
                    <motion.span
                      key={currentStreak}
                      initial={{ scale: 1.3 }}
                      animate={{ scale: 1 }}
                    >
                      {currentStreak}
                    </motion.span>
                  </div>
                </div>
                <div className="bg-white/20 rounded-xl p-3 text-center">
                  <div className="text-white/80 text-xs uppercase tracking-wide">
                    Best Streak
                  </div>
                  <div className="text-3xl font-bold text-white flex items-center justify-center gap-1">
                    <span>🔥</span> {bestStreak}
                  </div>
                </div>
              </div>

              {/* Object types */}
              {Object.keys(objectCounts).length > 0 && (
                <div className="mb-6">
                  <div className="text-white/80 text-sm uppercase tracking-wide mb-3">
                    By Object Type
                  </div>
                  <div className="flex flex-wrap gap-2 justify-center">
                    {Object.entries(objectCounts).map(([type, count]) => (
                      <ObjectBadge key={type} type={type} count={count} />
                    ))}
                  </div>
                </div>
              )}

              {/* Colors */}
              {Object.keys(colorCounts).length > 0 && (
                <div>
                  <div className="text-white/80 text-sm uppercase tracking-wide mb-3">
                    By Color
                  </div>
                  <div className="flex flex-wrap gap-2 justify-center">
                    {Object.entries(colorCounts).map(([color, count]) => (
                      <ColorSwatch key={color} color={color} count={count} />
                    ))}
                  </div>
                </div>
              )}

              {/* Empty state */}
              {totalTouches === 0 && (
                <div className="text-center text-white/60 py-8">
                  <div className="text-4xl mb-2">👆</div>
                  <p>Start tapping to see your stats!</p>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

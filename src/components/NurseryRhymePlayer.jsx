import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useNurseryRhymes } from '../hooks/useNurseryRhymes'

// Baby-friendly color palette for the player
const playerColors = {
  background: 'rgba(255, 255, 255, 0.95)',
  primary: '#FF6B9D',
  secondary: '#9B6BFF',
  accent: '#6BFFB8',
  text: '#4A4A6A',
  buttonBg: '#FFE4EC',
  buttonActive: '#FF6B9D',
}

// Animated music note decoration
function MusicNote({ delay = 0, x = 0, color = '#FF6B9D' }) {
  return (
    <motion.div
      className="absolute text-2xl pointer-events-none"
      style={{ left: x, color }}
      initial={{ opacity: 0, y: 0 }}
      animate={{
        opacity: [0, 1, 1, 0],
        y: [-20, -40, -60, -80],
        x: [0, 10, -5, 15],
        rotate: [0, 10, -10, 20],
      }}
      transition={{
        duration: 2,
        delay,
        repeat: Infinity,
        ease: 'easeOut',
      }}
    >
      ♪
    </motion.div>
  )
}

// Song selector item
function SongItem({ rhyme, isActive, onClick }) {
  return (
    <motion.button
      onClick={onClick}
      className={`w-full p-3 rounded-xl flex items-center gap-3 transition-colors ${
        isActive ? 'bg-pink-200' : 'bg-white hover:bg-pink-50'
      }`}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      <span
        className="text-3xl w-12 h-12 flex items-center justify-center rounded-full"
        style={{ backgroundColor: rhyme.color + '30' }}
      >
        {rhyme.emoji}
      </span>
      <span
        className={`text-left font-medium ${isActive ? 'text-pink-700' : 'text-gray-700'}`}
      >
        {rhyme.name}
      </span>
      {isActive && (
        <motion.div
          className="ml-auto text-pink-500"
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ duration: 0.5, repeat: Infinity }}
        >
          ♪
        </motion.div>
      )}
    </motion.button>
  )
}

// Main player component
export default function NurseryRhymePlayer({ isOpen, onClose }) {
  const {
    currentRhyme,
    currentRhymeIndex,
    isPlaying,
    isLooping,
    allRhymes,
    togglePlayPause,
    nextRhyme,
    previousRhyme,
    selectRhyme,
    toggleLoop,
    initAudio,
  } = useNurseryRhymes()

  const [showSongList, setShowSongList] = useState(false)

  const handlePlay = () => {
    initAudio()
    togglePlayPause()
  }

  const handleSelectSong = (index) => {
    initAudio()
    selectRhyme(index)
    setShowSongList(false)
  }

  if (!isOpen) return null

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-50 flex items-center justify-center p-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        {/* Backdrop */}
        <motion.div
          className="absolute inset-0 bg-black/40 backdrop-blur-sm"
          onClick={onClose}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        />

        {/* Player card */}
        <motion.div
          className="relative w-full max-w-sm rounded-3xl shadow-2xl overflow-hidden"
          style={{ backgroundColor: playerColors.background }}
          initial={{ scale: 0.8, y: 50 }}
          animate={{ scale: 1, y: 0 }}
          exit={{ scale: 0.8, y: 50 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
        >
          {/* Decorative header with gradient */}
          <div
            className="relative h-32 flex items-center justify-center overflow-hidden"
            style={{
              background: `linear-gradient(135deg, ${playerColors.primary} 0%, ${playerColors.secondary} 100%)`,
            }}
          >
            {/* Animated music notes in header */}
            {isPlaying && (
              <>
                <MusicNote delay={0} x={30} color="#FFE4EC" />
                <MusicNote delay={0.5} x={100} color="#E4ECFF" />
                <MusicNote delay={1} x={200} color="#E4FFE8" />
                <MusicNote delay={1.5} x={280} color="#FFE4F8" />
              </>
            )}

            {/* Close button */}
            <button
              onClick={onClose}
              className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/30 text-white text-xl flex items-center justify-center hover:bg-white/50 transition-colors"
            >
              x
            </button>

            {/* Current song display */}
            <motion.div
              className="text-center z-10"
              key={currentRhyme.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <motion.div
                className="text-6xl mb-2"
                animate={isPlaying ? {
                  scale: [1, 1.1, 1],
                  rotate: [0, 5, -5, 0],
                } : {}}
                transition={{
                  duration: 0.5,
                  repeat: isPlaying ? Infinity : 0,
                  ease: 'easeInOut',
                }}
              >
                {currentRhyme.emoji}
              </motion.div>
              <h2 className="text-white font-bold text-lg drop-shadow-md px-4">
                {currentRhyme.name}
              </h2>
            </motion.div>
          </div>

          {/* Main controls */}
          <div className="p-6">
            {/* Large control buttons */}
            <div className="flex items-center justify-center gap-4 mb-6">
              {/* Previous button */}
              <motion.button
                onClick={() => { initAudio(); previousRhyme(); }}
                className="w-14 h-14 rounded-full flex items-center justify-center text-2xl"
                style={{ backgroundColor: playerColors.buttonBg, color: playerColors.primary }}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                ⏮️
              </motion.button>

              {/* Play/Pause button - largest */}
              <motion.button
                onClick={handlePlay}
                className="w-20 h-20 rounded-full flex items-center justify-center text-4xl shadow-lg"
                style={{
                  backgroundColor: playerColors.primary,
                  color: 'white',
                }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                animate={isPlaying ? {
                  boxShadow: [
                    '0 0 0 0 rgba(255, 107, 157, 0.4)',
                    '0 0 0 15px rgba(255, 107, 157, 0)',
                    '0 0 0 0 rgba(255, 107, 157, 0.4)',
                  ],
                } : {}}
                transition={{
                  duration: 1.5,
                  repeat: isPlaying ? Infinity : 0,
                }}
              >
                {isPlaying ? '⏸️' : '▶️'}
              </motion.button>

              {/* Next button */}
              <motion.button
                onClick={() => { initAudio(); nextRhyme(); }}
                className="w-14 h-14 rounded-full flex items-center justify-center text-2xl"
                style={{ backgroundColor: playerColors.buttonBg, color: playerColors.primary }}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                ⏭️
              </motion.button>
            </div>

            {/* Secondary controls */}
            <div className="flex items-center justify-center gap-4 mb-4">
              {/* Loop toggle */}
              <motion.button
                onClick={toggleLoop}
                className={`px-4 py-2 rounded-full flex items-center gap-2 text-sm font-medium transition-colors ${
                  isLooping
                    ? 'bg-pink-500 text-white'
                    : 'bg-pink-100 text-pink-500'
                }`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                🔁 {isLooping ? 'Loop On' : 'Loop Off'}
              </motion.button>

              {/* Song list toggle */}
              <motion.button
                onClick={() => setShowSongList(!showSongList)}
                className="px-4 py-2 rounded-full bg-purple-100 text-purple-500 flex items-center gap-2 text-sm font-medium"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                🎵 Songs
              </motion.button>
            </div>

            {/* Song list */}
            <AnimatePresence>
              {showSongList && (
                <motion.div
                  className="space-y-2 max-h-60 overflow-y-auto"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  {allRhymes.map((rhyme, index) => (
                    <SongItem
                      key={rhyme.id}
                      rhyme={rhyme}
                      isActive={index === currentRhymeIndex}
                      onClick={() => handleSelectSong(index)}
                    />
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Playing indicator bar */}
          {isPlaying && (
            <motion.div
              className="h-1"
              style={{ backgroundColor: playerColors.primary }}
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: 'linear',
              }}
            />
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}

// Music button component to open the player
export function MusicButton({ onClick, isActive }) {
  return (
    <motion.button
      onClick={onClick}
      className={`w-12 h-12 rounded-full flex items-center justify-center text-2xl shadow-lg active:scale-95 transition-transform ${
        isActive ? 'bg-pink-400' : 'bg-white/70'
      }`}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.95 }}
      animate={isActive ? {
        boxShadow: [
          '0 0 0 0 rgba(255, 107, 157, 0.4)',
          '0 0 0 10px rgba(255, 107, 157, 0)',
        ],
      } : {}}
      transition={isActive ? {
        duration: 1,
        repeat: Infinity,
      } : {}}
    >
      🎵
    </motion.button>
  )
}

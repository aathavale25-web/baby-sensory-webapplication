import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import BubbleAnimation from './BubbleAnimation'
import ShapeAnimation from './ShapeAnimation'
import AnimalAnimation, { FishAnimation, ButterflyAnimation } from './AnimalAnimation'
import ColorWave, {
  SparkleAnimation,
  CloudAnimation,
  StarField,
  PlanetAnimation,
  FlowerAnimation,
} from './ColorWave'
import TouchFeedback from './TouchFeedback'
import ThemeSelector from './ThemeSelector'
import NurseryRhymePlayer, { MusicButton } from './NurseryRhymePlayer'
import Scoreboard from './Scoreboard'
import { useDailyContent } from '../hooks/useDailyContent'
import { useAudio } from '../hooks/useAudio'
import { useNurseryRhymes } from '../hooks/useNurseryRhymes'
import { useScoreboard } from '../hooks/useScoreboard'

// Session duration in milliseconds (20 minutes)
const SESSION_DURATION = 20 * 60 * 1000

// Animation change interval in milliseconds (30 seconds)
const ANIMATION_CHANGE_INTERVAL = 30 * 1000

function getAnimationsForTheme(themeId, colors, seed) {
  switch (themeId) {
    case 'ocean':
      return [
        <BubbleAnimation key={`${themeId}-bubbles`} colors={colors} count={20} seed={seed} />,
        <FishAnimation key={`${themeId}-fish`} count={12} seed={seed} colors={colors} />,
        <ColorWave key={`${themeId}-waves`} colors={colors} seed={seed} />,
      ]
    case 'space':
      return [
        <StarField key={`${themeId}-stars`} count={40} seed={seed} colors={colors} />,
        <PlanetAnimation key={`${themeId}-planets`} count={6} seed={seed} />,
        <SparkleAnimation key={`${themeId}-sparkles`} colors={colors} count={25} seed={seed} />,
      ]
    case 'garden':
      return [
        <FlowerAnimation key={`${themeId}-flowers`} count={12} seed={seed} />,
        <ButterflyAnimation key={`${themeId}-butterflies`} count={10} seed={seed} />,
        <SparkleAnimation key={`${themeId}-sparkles`} colors={colors} count={15} seed={seed} />,
      ]
    case 'rainbow':
      return [
        <ColorWave key={`${themeId}-waves`} colors={colors} seed={seed} />,
        <SparkleAnimation key={`${themeId}-sparkles`} colors={colors} count={30} seed={seed} />,
        <ShapeAnimation key={`${themeId}-shapes`} colors={colors} count={10} seed={seed} />,
      ]
    case 'animals':
      return [
        <AnimalAnimation key={`${themeId}-animals`} count={10} seed={seed} />,
        <SparkleAnimation key={`${themeId}-sparkles`} colors={colors} count={15} seed={seed} />,
        <BubbleAnimation key={`${themeId}-bubbles`} colors={colors} count={10} seed={seed} />,
      ]
    case 'shapes':
      return [
        <ShapeAnimation key={`${themeId}-shapes`} colors={colors} count={15} seed={seed} />,
        <SparkleAnimation key={`${themeId}-sparkles`} colors={colors} count={20} seed={seed} />,
        <BubbleAnimation key={`${themeId}-bubbles`} colors={colors} count={8} seed={seed} />,
      ]
    case 'clouds':
      return [
        <CloudAnimation key={`${themeId}-clouds`} count={8} seed={seed} />,
        <SparkleAnimation key={`${themeId}-sparkles`} colors={colors} count={15} seed={seed} />,
        <BubbleAnimation key={`${themeId}-bubbles`} colors={colors} count={10} seed={seed} />,
      ]
    default:
      return [
        <BubbleAnimation key={`${themeId}-bubbles`} colors={colors} count={15} seed={seed} />,
        <ShapeAnimation key={`${themeId}-shapes`} colors={colors} count={10} seed={seed} />,
      ]
  }
}

export default function SensoryCanvas() {
  const [selectedTheme, setSelectedTheme] = useState(null)
  const [showThemeSelector, setShowThemeSelector] = useState(false)
  const [showMusicPlayer, setShowMusicPlayer] = useState(false)
  const [showScoreboard, setShowScoreboard] = useState(false)
  const [showSessionSummary, setShowSessionSummary] = useState(false)
  const [sessionSummary, setSessionSummary] = useState(null)
  const { theme, colors, sounds, seed, dateString, isOverridden } = useDailyContent(null, selectedTheme)
  const { playRandomSound, initAudio, muted, toggleMute } = useAudio()
  const { isPlaying: isMusicPlaying } = useNurseryRhymes()
  const {
    totalTouches,
    objectCounts,
    colorCounts,
    currentStreak,
    bestStreak,
    milestone,
    trackTouch,
    resetScoreboard,
    startTracking,
    stopTracking,
    getSessionSummary,
  } = useScoreboard()

  const [isFullscreen, setIsFullscreen] = useState(false)
  const [sessionTime, setSessionTime] = useState(0)
  const [isSessionActive, setIsSessionActive] = useState(false)
  const [showControls, setShowControls] = useState(true)
  const [animationSeed, setAnimationSeed] = useState(seed)
  const [showInfo, setShowInfo] = useState(true)

  // Update animation seed when theme changes to force animation refresh
  useEffect(() => {
    setAnimationSeed(prev => prev + 1)
  }, [theme.id])

  // Get current animations based on theme
  const animations = getAnimationsForTheme(theme.id, colors, animationSeed)

  // Session timer
  useEffect(() => {
    if (!isSessionActive) return

    const interval = setInterval(() => {
      setSessionTime(prev => {
        if (prev >= SESSION_DURATION) {
          setIsSessionActive(false)
          stopTracking()
          // Show session summary
          const summary = getSessionSummary()
          setSessionSummary(summary)
          setShowSessionSummary(true)
          return 0
        }
        return prev + 1000
      })
    }, 1000)

    return () => clearInterval(interval)
  }, [isSessionActive, stopTracking, getSessionSummary])

  // Animation variation during session
  useEffect(() => {
    if (!isSessionActive) return

    const interval = setInterval(() => {
      setAnimationSeed(prev => prev + 1)
    }, ANIMATION_CHANGE_INTERVAL)

    return () => clearInterval(interval)
  }, [isSessionActive])

  // Hide controls after inactivity
  useEffect(() => {
    if (!showControls) return

    const timeout = setTimeout(() => {
      if (isSessionActive) {
        setShowControls(false)
      }
    }, 5000)

    return () => clearTimeout(timeout)
  }, [showControls, isSessionActive])

  // Hide info banner after a while
  useEffect(() => {
    const timeout = setTimeout(() => {
      setShowInfo(false)
    }, 8000)

    return () => clearTimeout(timeout)
  }, [])

  const handleTouch = useCallback(() => {
    playRandomSound(sounds)
    setShowControls(true)
  }, [playRandomSound, sounds])

  const toggleFullscreen = useCallback(async () => {
    try {
      if (!document.fullscreenElement) {
        await document.documentElement.requestFullscreen()
        setIsFullscreen(true)
      } else {
        await document.exitFullscreen()
        setIsFullscreen(false)
      }
    } catch (err) {
      console.warn('Fullscreen not supported:', err)
    }
  }, [])

  const startSession = useCallback(() => {
    initAudio()
    setIsSessionActive(true)
    setSessionTime(0)
    setShowInfo(false)
    // Reset and start scoreboard tracking
    resetScoreboard()
    startTracking()
  }, [initAudio, resetScoreboard, startTracking])

  const pauseSession = useCallback(() => {
    setIsSessionActive(false)
    stopTracking()
  }, [stopTracking])

  const formatTime = (ms) => {
    const minutes = Math.floor(ms / 60000)
    const seconds = Math.floor((ms % 60000) / 1000)
    return `${minutes}:${seconds.toString().padStart(2, '0')}`
  }

  const progressPercent = (sessionTime / SESSION_DURATION) * 100

  return (
    <div
      className="relative w-full h-full overflow-hidden"
      style={{ background: theme.background }}
      onClick={() => setShowControls(true)}
    >
      {/* Theme info banner */}
      <AnimatePresence>
        {showInfo && (
          <motion.div
            className="absolute top-4 left-1/2 transform -translate-x-1/2 z-40 bg-black/30 backdrop-blur-sm rounded-full px-6 py-3 text-white text-center"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <div className="text-2xl mb-1">{theme.emoji}</div>
            <div className="text-lg font-bold">{theme.name}</div>
            <div className="text-sm opacity-80">
              {isOverridden ? 'Custom Theme' : dateString}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Animations layer */}
      <div className="absolute inset-0">
        <AnimatePresence mode="sync">
          {animations.map((animation, i) => (
            <motion.div
              key={`${theme.id}-${animationSeed}-${i}`}
              className="absolute inset-0"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1 }}
            >
              {animation}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Touch feedback layer */}
      <TouchFeedback
        colors={colors}
        onTouch={handleTouch}
        themeEmoji={theme.emoji}
        themeId={theme.id}
        onTrackTouch={trackTouch}
      />

      {/* Controls */}
      <AnimatePresence>
        {showControls && (
          <motion.div
            className="absolute bottom-0 left-0 right-0 z-50 p-4 bg-gradient-to-t from-black/50 to-transparent"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
          >
            {/* Session progress bar */}
            {isSessionActive && (
              <div className="mb-4">
                <div className="h-2 bg-white/20 rounded-full overflow-hidden">
                  <motion.div
                    className="h-full bg-white/80 rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: `${progressPercent}%` }}
                    transition={{ duration: 0.5 }}
                  />
                </div>
                <div className="text-white/80 text-sm mt-1 text-center">
                  {formatTime(sessionTime)} / {formatTime(SESSION_DURATION)}
                </div>
              </div>
            )}

            {/* Control buttons */}
            <div className="flex justify-center items-center gap-4">
              {/* Theme selector button */}
              <button
                onClick={() => setShowThemeSelector(true)}
                className="w-12 h-12 rounded-full bg-gradient-to-r from-purple-400 to-pink-400 text-2xl flex items-center justify-center shadow-lg active:scale-95 transition-transform border-2 border-white/50"
                title="Change Theme"
              >
                🎨
              </button>

              {/* Music/Nursery Rhymes button */}
              <MusicButton
                onClick={() => setShowMusicPlayer(true)}
                isActive={isMusicPlaying}
              />

              {/* Scoreboard button */}
              <button
                onClick={() => setShowScoreboard(true)}
                className="w-12 h-12 rounded-full bg-gradient-to-r from-yellow-400 to-orange-400 text-2xl flex items-center justify-center shadow-lg active:scale-95 transition-transform border-2 border-white/50"
                title="View Scoreboard"
              >
                🏆
              </button>

              {/* Play/Pause button */}
              <button
                onClick={isSessionActive ? pauseSession : startSession}
                className="w-16 h-16 rounded-full bg-white/90 text-3xl flex items-center justify-center shadow-lg active:scale-95 transition-transform"
              >
                {isSessionActive ? '⏸️' : '▶️'}
              </button>

              {/* Mute button */}
              <button
                onClick={() => {
                  initAudio()
                  toggleMute()
                }}
                className="w-12 h-12 rounded-full bg-white/70 text-2xl flex items-center justify-center shadow-lg active:scale-95 transition-transform"
              >
                {muted ? '🔇' : '🔊'}
              </button>

              {/* Fullscreen button */}
              <button
                onClick={toggleFullscreen}
                className="w-12 h-12 rounded-full bg-white/70 text-2xl flex items-center justify-center shadow-lg active:scale-95 transition-transform"
              >
                {isFullscreen ? '⬜' : '⬛'}
              </button>
            </div>

            {/* Start prompt */}
            {!isSessionActive && (
              <div className="text-white text-center mt-4 text-lg">
                Tap anywhere to play! Tap ▶️ for 20-minute session
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Tap to show controls hint */}
      {!showControls && (
        <motion.div
          className="absolute bottom-4 left-1/2 transform -translate-x-1/2 text-white/50 text-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2 }}
        >
          Tap for controls
        </motion.div>
      )}

      {/* Theme Selector Modal */}
      <ThemeSelector
        isOpen={showThemeSelector}
        onClose={() => setShowThemeSelector(false)}
        onSelectTheme={setSelectedTheme}
        currentThemeId={theme.id}
      />

      {/* Nursery Rhyme Player Modal */}
      <NurseryRhymePlayer
        isOpen={showMusicPlayer}
        onClose={() => setShowMusicPlayer(false)}
      />

      {/* Scoreboard Modal */}
      <Scoreboard
        isOpen={showScoreboard}
        onClose={() => setShowScoreboard(false)}
        totalTouches={totalTouches}
        objectCounts={objectCounts}
        colorCounts={colorCounts}
        currentStreak={currentStreak}
        bestStreak={bestStreak}
        milestone={milestone}
        showSummary={showSessionSummary}
        sessionSummary={sessionSummary}
        onCloseSummary={() => setShowSessionSummary(false)}
      />
    </div>
  )
}

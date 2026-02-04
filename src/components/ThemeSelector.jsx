import { motion, AnimatePresence } from 'framer-motion'
import { dailyThemes } from '../data/sensoryContent'
import { useMemo } from 'react'

export default function ThemeSelector({ isOpen, onClose, onSelectTheme, currentThemeId, ageProfile }) {
  // Filter themes based on age profile
  const availableThemes = useMemo(() => {
    if (!ageProfile?.enabledThemes) {
      return dailyThemes
    }
    return dailyThemes.filter(theme => ageProfile.enabledThemes.includes(theme.id))
  }, [ageProfile])

  if (!isOpen) return null

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-[100] flex items-center justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          {/* Backdrop */}
          <motion.div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={onClose}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />

          {/* Modal Content */}
          <motion.div
            className="relative z-10 w-[90%] max-w-lg max-h-[85vh] overflow-y-auto rounded-3xl bg-gradient-to-b from-purple-100 to-pink-100 p-6 shadow-2xl"
            initial={{ scale: 0.8, opacity: 0, y: 50 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.8, opacity: 0, y: 50 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          >
            {/* Header */}
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold text-purple-800 mb-2">
                Choose a Theme
              </h2>
              <p className="text-purple-600 text-sm">
                {ageProfile?.name ? `Perfect for ${ageProfile.name}` : 'Pick your favorite adventure!'}
              </p>
            </div>

            {/* Theme Grid */}
            <div className="grid grid-cols-2 gap-4">
              {availableThemes.map((theme, index) => {
                const isSelected = theme.id === currentThemeId
                return (
                  <motion.button
                    key={theme.id}
                    onClick={() => {
                      onSelectTheme(theme)
                      onClose()
                    }}
                    className={`
                      relative p-4 rounded-2xl border-4 transition-all
                      ${isSelected
                        ? 'border-yellow-400 shadow-lg shadow-yellow-200'
                        : 'border-transparent hover:border-purple-300'
                      }
                    `}
                    style={{ background: theme.background }}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    {/* Selected indicator */}
                    {isSelected && (
                      <motion.div
                        className="absolute -top-2 -right-2 w-8 h-8 bg-yellow-400 rounded-full flex items-center justify-center text-lg shadow-md"
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: 'spring', damping: 15 }}
                      >
                        ✓
                      </motion.div>
                    )}

                    {/* Theme emoji */}
                    <div className="text-5xl mb-2 drop-shadow-lg">
                      {theme.emoji}
                    </div>

                    {/* Theme name */}
                    <div className={`
                      font-bold text-sm rounded-full px-3 py-1 inline-block
                      ${theme.id === 'space' || theme.id === 'ocean' || theme.id === 'contrast'
                        ? 'bg-white/90 text-gray-800'
                        : 'bg-black/20 text-white drop-shadow-md'
                      }
                    `}>
                      {theme.name.replace(' Day', '')}
                    </div>

                    {/* Age recommendation badge for Contrast World */}
                    {theme.id === 'contrast' && (
                      <div className="mt-1 text-xs bg-blue-500 text-white rounded-full px-2 py-0.5 inline-block">
                        4-6 months
                      </div>
                    )}

                    {/* Color preview dots */}
                    <div className="flex justify-center gap-1 mt-2">
                      {theme.colors.slice(0, 4).map((color, i) => (
                        <div
                          key={i}
                          className="w-3 h-3 rounded-full border border-white/50"
                          style={{ backgroundColor: color }}
                        />
                      ))}
                    </div>
                  </motion.button>
                )
              })}
            </div>

            {/* Close button */}
            <motion.button
              onClick={onClose}
              className="mt-6 w-full py-4 rounded-2xl bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold text-lg shadow-lg active:scale-95 transition-transform"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              Close
            </motion.button>

            {/* Decorative elements */}
            <div className="absolute top-2 left-4 text-2xl opacity-50 pointer-events-none">
              ✨
            </div>
            <div className="absolute top-2 right-4 text-2xl opacity-50 pointer-events-none">
              🌟
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

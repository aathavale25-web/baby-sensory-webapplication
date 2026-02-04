import React, { useState } from 'react'
import { motion } from 'framer-motion'

export default function BabyProfileScreen({ onComplete }) {
  const [name, setName] = useState('')
  const [ageMonths, setAgeMonths] = useState(6)
  const [isSubmitted, setIsSubmitted] = useState(false)

  const handleSubmit = (e) => {
    e.preventDefault()
    if (name.trim()) {
      setIsSubmitted(true)
      setTimeout(() => {
        onComplete(name.trim(), ageMonths)
      }, 1500)
    }
  }

  if (isSubmitted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-400 via-pink-400 to-yellow-300">
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="text-center"
        >
          <div className="text-8xl mb-6">👶</div>
          <motion.h1
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-6xl font-bold text-white mb-4"
          >
            Hi {name}!
          </motion.h1>
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: [0, 1.2, 1] }}
            transition={{ delay: 0.6, duration: 0.5 }}
            className="text-4xl"
          >
            🌟
          </motion.div>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-400 via-purple-400 to-pink-400 p-4">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="bg-white rounded-3xl shadow-2xl p-8 md:p-12 max-w-md w-full"
      >
        <div className="text-center mb-8">
          <motion.div
            animate={{
              rotate: [0, 10, -10, 10, 0],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              repeatDelay: 1,
            }}
            className="text-7xl mb-4"
          >
            👶
          </motion.div>
          <h1 className="text-4xl font-bold text-gray-800 mb-2">
            Baby's Profile
          </h1>
          <p className="text-gray-600 text-lg">
            Tell us about your little one
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label
              htmlFor="name"
              className="block text-xl font-semibold text-gray-700 mb-2"
            >
              Baby's Name
            </label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-3 text-xl border-2 border-gray-300 rounded-xl focus:outline-none focus:border-purple-500 transition-colors"
              placeholder="Emma"
              required
              autoFocus
            />
          </div>

          <div>
            <label
              htmlFor="age"
              className="block text-xl font-semibold text-gray-700 mb-2"
            >
              Age: {ageMonths} months
            </label>
            <input
              type="range"
              id="age"
              min="4"
              max="12"
              value={ageMonths}
              onChange={(e) => setAgeMonths(parseInt(e.target.value))}
              className="w-full h-3 bg-gradient-to-r from-blue-300 via-purple-300 to-pink-300 rounded-lg appearance-none cursor-pointer slider"
              style={{
                WebkitAppearance: 'none',
              }}
            />
            <div className="flex justify-between text-sm text-gray-500 mt-1">
              <span>4 mo</span>
              <span>12 mo</span>
            </div>
          </div>

          <div className="bg-blue-50 rounded-xl p-4 text-sm text-gray-700">
            <p className="font-semibold mb-1">Age Profile:</p>
            {ageMonths >= 4 && ageMonths <= 6 && (
              <p>
                🍼 <strong>4-6 months:</strong> High contrast, large objects,
                slow movement
              </p>
            )}
            {ageMonths >= 7 && ageMonths <= 9 && (
              <p>
                🧸 <strong>7-9 months:</strong> More colors, medium complexity,
                gentle interactions
              </p>
            )}
            {ageMonths >= 10 && ageMonths <= 12 && (
              <p>
                🎨 <strong>10-12 months:</strong> Full palette, engaging
                animations, interactive fun
              </p>
            )}
          </div>

          <motion.button
            type="submit"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white text-2xl font-bold py-4 rounded-xl shadow-lg hover:shadow-xl transition-all"
          >
            Let's Play! 🎉
          </motion.button>
        </form>

        <style jsx>{`
          .slider::-webkit-slider-thumb {
            appearance: none;
            width: 24px;
            height: 24px;
            border-radius: 50%;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            cursor: pointer;
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
          }

          .slider::-moz-range-thumb {
            width: 24px;
            height: 24px;
            border-radius: 50%;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            cursor: pointer;
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
            border: none;
          }
        `}</style>
      </motion.div>
    </div>
  )
}

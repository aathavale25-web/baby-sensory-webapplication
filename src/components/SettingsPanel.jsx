import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useBabyProfile } from '../contexts/BabyProfileContext'
import { AGE_PROFILES } from '../config/ageProfiles'

export function SettingsButton({ onClick }) {
  return (
    <motion.button
      onClick={onClick}
      className="w-12 h-12 rounded-full bg-gradient-to-r from-blue-400 to-indigo-400 text-2xl flex items-center justify-center shadow-lg active:scale-95 transition-transform border-2 border-white/50"
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      title="Settings"
    >
      ⚙️
    </motion.button>
  )
}

export default function SettingsPanel({ isOpen, onClose }) {
  const { profile, ageProfile, updateBabyProfile, clearProfile } = useBabyProfile()

  const [name, setName] = useState('')
  const [ageMonths, setAgeMonths] = useState(6)
  const [ageOverride, setAgeOverride] = useState(null)
  const [isSaving, setIsSaving] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)
  const [showResetConfirm, setShowResetConfirm] = useState(false)
  const [errors, setErrors] = useState({})

  // Initialize form with current profile data
  useEffect(() => {
    if (profile) {
      setName(profile.name || '')
      setAgeMonths(profile.age_months || 6)
    }
  }, [profile, isOpen])

  // Clear success message after delay
  useEffect(() => {
    if (showSuccess) {
      const timer = setTimeout(() => setShowSuccess(false), 3000)
      return () => clearTimeout(timer)
    }
  }, [showSuccess])

  const validateForm = () => {
    const newErrors = {}

    if (!name.trim()) {
      newErrors.name = 'Name is required'
    }

    if (ageMonths < 4 || ageMonths > 12) {
      newErrors.age = 'Age must be between 4 and 12 months'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSave = async () => {
    if (!validateForm()) return

    setIsSaving(true)
    try {
      await updateBabyProfile({
        name: name.trim(),
        age_months: ageMonths,
      })
      setShowSuccess(true)
      setAgeOverride(null) // Clear override when saving
    } catch (error) {
      console.error('Error updating profile:', error)
      setErrors({ general: 'Failed to save changes. Please try again.' })
    } finally {
      setIsSaving(false)
    }
  }

  const handleReset = () => {
    clearProfile()
    setShowResetConfirm(false)
    onClose()
    // Reload the page to restart the app
    window.location.reload()
  }

  const getAgeProfileKey = (age) => {
    if (age >= 4 && age <= 6) return '4-6'
    if (age >= 7 && age <= 9) return '7-9'
    if (age >= 10 && age <= 12) return '10-12'
    return '10-12'
  }

  const currentProfileKey = ageOverride || getAgeProfileKey(ageMonths)
  const currentProfile = AGE_PROFILES[currentProfileKey]

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
          className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        />

        {/* Settings Panel */}
        <motion.div
          className="relative bg-gradient-to-br from-white to-purple-50 rounded-3xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto"
          initial={{ scale: 0.9, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 20 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
        >
          {/* Header */}
          <div className="sticky top-0 bg-gradient-to-r from-purple-500 to-pink-500 text-white p-6 rounded-t-3xl">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="text-4xl">⚙️</span>
                <h2 className="text-3xl font-bold">Settings</h2>
              </div>
              <button
                onClick={onClose}
                className="w-10 h-10 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center text-2xl transition-colors"
              >
                ✕
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="p-6 space-y-6">
            {/* Success Message */}
            <AnimatePresence>
              {showSuccess && (
                <motion.div
                  className="bg-green-100 border-2 border-green-400 rounded-xl p-4 flex items-center gap-3"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                >
                  <span className="text-3xl">✅</span>
                  <span className="text-green-800 font-semibold">
                    Settings saved successfully!
                  </span>
                </motion.div>
              )}
            </AnimatePresence>

            {/* General Error */}
            {errors.general && (
              <div className="bg-red-100 border-2 border-red-400 rounded-xl p-4 flex items-center gap-3">
                <span className="text-3xl">⚠️</span>
                <span className="text-red-800 font-semibold">{errors.general}</span>
              </div>
            )}

            {/* Baby Profile Section */}
            <div className="bg-white rounded-2xl p-6 shadow-md">
              <h3 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                <span>👶</span>
                Baby Profile
              </h3>

              {/* Name Input */}
              <div className="mb-4">
                <label
                  htmlFor="baby-name"
                  className="block text-lg font-semibold text-gray-700 mb-2"
                >
                  Baby's Name
                </label>
                <input
                  type="text"
                  id="baby-name"
                  value={name}
                  onChange={(e) => {
                    setName(e.target.value)
                    setErrors({ ...errors, name: null })
                  }}
                  className={`w-full px-4 py-3 text-lg border-2 rounded-xl focus:outline-none focus:border-purple-500 transition-colors ${
                    errors.name ? 'border-red-400 bg-red-50' : 'border-gray-300'
                  }`}
                  placeholder="Enter baby's name"
                />
                {errors.name && (
                  <p className="text-red-600 text-sm mt-1">{errors.name}</p>
                )}
              </div>

              {/* Age Slider */}
              <div className="mb-4">
                <label
                  htmlFor="baby-age"
                  className="block text-lg font-semibold text-gray-700 mb-2"
                >
                  Age: {ageMonths} months
                </label>
                <input
                  type="range"
                  id="baby-age"
                  min="4"
                  max="12"
                  value={ageMonths}
                  onChange={(e) => {
                    setAgeMonths(parseInt(e.target.value))
                    setErrors({ ...errors, age: null })
                    setAgeOverride(null) // Clear override when changing age
                  }}
                  className={`w-full h-3 bg-gradient-to-r from-blue-300 via-purple-300 to-pink-300 rounded-lg appearance-none cursor-pointer slider ${
                    errors.age ? 'opacity-50' : ''
                  }`}
                />
                <div className="flex justify-between text-sm text-gray-500 mt-1">
                  <span>4 mo</span>
                  <span>12 mo</span>
                </div>
                {errors.age && (
                  <p className="text-red-600 text-sm mt-1">{errors.age}</p>
                )}
              </div>

              {/* Save Button */}
              <motion.button
                onClick={handleSave}
                disabled={isSaving}
                className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white text-xl font-bold py-3 rounded-xl shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                whileHover={{ scale: isSaving ? 1 : 1.02 }}
                whileTap={{ scale: isSaving ? 1 : 0.98 }}
              >
                {isSaving ? 'Saving...' : 'Save Changes'}
              </motion.button>
            </div>

            {/* Current Age Profile Display */}
            <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl p-6 shadow-md">
              <h3 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                <span>📊</span>
                Current Age Profile
              </h3>

              <div className="bg-white rounded-xl p-4 mb-4">
                <div className="text-center mb-3">
                  <div className="text-5xl mb-2">
                    {currentProfileKey === '4-6' ? '🍼' : currentProfileKey === '7-9' ? '🧸' : '🎨'}
                  </div>
                  <div className="text-2xl font-bold text-purple-700">
                    {currentProfile.name}
                  </div>
                  {ageOverride && (
                    <div className="text-sm text-orange-600 font-semibold mt-1">
                      (Testing Override Active)
                    </div>
                  )}
                </div>

                <div className="space-y-2 text-sm text-gray-700">
                  <div className="flex justify-between">
                    <span className="font-semibold">Objects:</span>
                    <span>{currentProfile.objectCount.min}-{currentProfile.objectCount.max} at once</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-semibold">Colors:</span>
                    <span>{currentProfile.colorPalette.length} colors</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-semibold">Speed:</span>
                    <span>{Math.round(currentProfile.animationSpeed * 100)}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-semibold">Themes:</span>
                    <span>{currentProfile.enabledThemes.length} available</span>
                  </div>
                </div>
              </div>

              {/* Age Profile Override for Testing */}
              <div className="bg-yellow-50 border-2 border-yellow-300 rounded-xl p-4">
                <h4 className="text-lg font-bold text-gray-800 mb-2 flex items-center gap-2">
                  <span>🔬</span>
                  Testing Mode
                </h4>
                <p className="text-sm text-gray-600 mb-3">
                  Temporarily override the age profile to test different configurations.
                </p>
                <div className="grid grid-cols-3 gap-2">
                  {Object.keys(AGE_PROFILES).map((key) => (
                    <motion.button
                      key={key}
                      onClick={() => setAgeOverride(ageOverride === key ? null : key)}
                      className={`py-2 px-3 rounded-lg font-semibold text-sm transition-all ${
                        ageOverride === key
                          ? 'bg-orange-500 text-white shadow-lg'
                          : currentProfileKey === key && !ageOverride
                          ? 'bg-purple-200 text-purple-800'
                          : 'bg-white text-gray-700 hover:bg-gray-100'
                      }`}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      {AGE_PROFILES[key].name}
                    </motion.button>
                  ))}
                </div>
                {ageOverride && (
                  <p className="text-xs text-orange-700 mt-2 font-semibold">
                    Save changes to clear override and use actual age profile.
                  </p>
                )}
              </div>
            </div>

            {/* Reset Profile Section */}
            <div className="bg-red-50 rounded-2xl p-6 shadow-md border-2 border-red-200">
              <h3 className="text-2xl font-bold text-gray-800 mb-2 flex items-center gap-2">
                <span>🔄</span>
                Reset Profile
              </h3>
              <p className="text-gray-600 mb-4">
                Clear all profile data and start over. This action cannot be undone.
              </p>

              {!showResetConfirm ? (
                <button
                  onClick={() => setShowResetConfirm(true)}
                  className="w-full bg-red-500 hover:bg-red-600 text-white font-bold py-3 rounded-xl transition-colors"
                >
                  Reset Profile
                </button>
              ) : (
                <div className="space-y-3">
                  <p className="text-red-700 font-semibold text-center">
                    Are you sure? This will delete all data!
                  </p>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      onClick={() => setShowResetConfirm(false)}
                      className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-3 rounded-xl transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleReset}
                      className="bg-red-600 hover:bg-red-700 text-white font-bold py-3 rounded-xl transition-colors"
                    >
                      Confirm Reset
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Footer */}
          <div className="bg-gray-100 p-4 rounded-b-3xl text-center text-sm text-gray-600">
            <p>Changes are saved locally and synchronized to the cloud.</p>
          </div>
        </motion.div>

        {/* Custom slider styles */}
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
    </AnimatePresence>
  )
}

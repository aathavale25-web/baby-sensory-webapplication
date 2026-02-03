/**
 * Session logger utility
 *
 * This module provides multi-layer session persistence:
 * 1. IndexedDB (primary local storage)
 * 2. localStorage (backup/fallback)
 * 3. Supabase (cloud storage for analytics MCP server)
 */

import { saveSessionToSupabase } from '../lib/supabase.js'

const DB_NAME = 'BabySensoryDB'
const STORE_NAME = 'sessions'
const DB_VERSION = 1

// File path where sessions will be saved for MCP server access
const SESSIONS_FILE_PATH = '~/.baby-sensory-sessions.json'

// Initialize IndexedDB
function openDatabase() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION)

    request.onerror = () => reject(request.error)
    request.onsuccess = () => resolve(request.result)

    request.onupgradeneeded = (event) => {
      const db = event.target.result
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        const objectStore = db.createObjectStore(STORE_NAME, { keyPath: 'id' })
        objectStore.createIndex('timestamp', 'timestamp', { unique: false })
        objectStore.createIndex('theme', 'theme', { unique: false })
      }
    }
  })
}

// Generate UUID
function generateId() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0
    const v = c === 'x' ? r : (r & 0x3 | 0x8)
    return v.toString(16)
  })
}

// Convert color names back to hex values for storage
const COLOR_NAME_TO_HEX = {
  'Red': '#FF0000',
  'Orange': '#FF8800',
  'Yellow': '#FFDD00',
  'Green': '#00FF00',
  'Blue': '#0088FF',
  'Cyan': '#00CCFF',
  'Purple': '#8800FF',
  'Magenta': '#FF00FF',
  'Pink': '#FF4488',
  'White': '#FFFFFF',
  'Light Blue': '#AADDFF',
  'Light Pink': '#FFCCEE',
  'Light Green': '#DDFFDD',
  'Cream': '#FFEEDD',
  'Dark Blue': '#004488',
  'Mint': '#00FF88',
  'Dark Gray': '#333333',
  'Brown': '#AA7744',
  'Tan': '#DDAA66',
  'Colorful': '#FFFFFF',
}

// Convert object type names to emojis
const OBJECT_TYPE_TO_EMOJI = {
  'bubble': '🫧',
  'star': '⭐',
  'flower': '🌸',
  'sparkle': '✨',
  'animal': '🐱',
  'shape': '🔷',
  'cloud': '☁️',
  'fish': '🐟',
  'wave': '🌊',
  'planet': '🪐',
  'butterfly': '🦋',
  'unknown': '👆',
}

/**
 * Log a session to IndexedDB
 */
export async function logSession(sessionData) {
  try {
    const db = await openDatabase()

    // Convert color names to hex values
    const colorCounts = {}
    Object.entries(sessionData.colorCounts || {}).forEach(([colorName, count]) => {
      const hexColor = COLOR_NAME_TO_HEX[colorName] || '#FFFFFF'
      colorCounts[hexColor] = count
    })

    // Convert object type names to emojis
    const objectCounts = {}
    Object.entries(sessionData.objectCounts || {}).forEach(([typeName, count]) => {
      const emoji = OBJECT_TYPE_TO_EMOJI[typeName] || '👆'
      objectCounts[emoji] = count
    })

    const session = {
      id: generateId(),
      timestamp: Date.now(),
      theme: sessionData.theme,
      duration: sessionData.duration,
      touches: sessionData.touches,
      colorCounts,
      objectCounts,
      nurseryRhymesPlayed: sessionData.nurseryRhymesPlayed || [],
      streaks: sessionData.streaks || 0,
      milestones: sessionData.milestones || [],
      completedFull: sessionData.completedFull || false,
    }

    return new Promise((resolve, reject) => {
      const transaction = db.transaction([STORE_NAME], 'readwrite')
      const objectStore = transaction.objectStore(STORE_NAME)
      const request = objectStore.add(session)

      request.onsuccess = async () => {
        console.log('Session logged successfully:', session.id)
        // Also save to localStorage as backup
        saveToLocalStorage(session)
        // Save to Supabase for cloud analytics
        await saveSessionToSupabase(session)
        resolve(session)
      }

      request.onerror = async () => {
        console.error('Failed to log session:', request.error)
        // Fallback to localStorage
        saveToLocalStorage(session)
        // Still try to save to Supabase
        await saveSessionToSupabase(session)
        reject(request.error)
      }
    })
  } catch (error) {
    console.error('Error opening database:', error)
    // Fallback to localStorage and Supabase
    const session = {
      id: generateId(),
      timestamp: Date.now(),
      ...sessionData,
    }
    saveToLocalStorage(session)
    await saveSessionToSupabase(session)
    return session
  }
}

/**
 * Save to localStorage as fallback and for MCP server access
 */
function saveToLocalStorage(session) {
  try {
    const existingSessions = JSON.parse(localStorage.getItem('baby-sensory-sessions') || '[]')
    existingSessions.push(session)
    localStorage.setItem('baby-sensory-sessions', JSON.stringify(existingSessions))
    console.log('Session saved to localStorage')
  } catch (error) {
    console.error('Failed to save to localStorage:', error)
  }
}

/**
 * Get all sessions from IndexedDB
 */
export async function getAllSessions() {
  try {
    const db = await openDatabase()

    return new Promise((resolve, reject) => {
      const transaction = db.transaction([STORE_NAME], 'readonly')
      const objectStore = transaction.objectStore(STORE_NAME)
      const request = objectStore.getAll()

      request.onsuccess = () => {
        const sessions = request.result.sort((a, b) => b.timestamp - a.timestamp)
        resolve(sessions)
      }

      request.onerror = () => reject(request.error)
    })
  } catch (error) {
    console.error('Error getting sessions:', error)
    // Fallback to localStorage
    try {
      return JSON.parse(localStorage.getItem('baby-sensory-sessions') || '[]')
    } catch (err) {
      return []
    }
  }
}

/**
 * Get recent sessions (last N days)
 */
export async function getRecentSessions(days = 7) {
  const sessions = await getAllSessions()
  const cutoffTime = Date.now() - (days * 24 * 60 * 60 * 1000)
  return sessions.filter(s => s.timestamp >= cutoffTime)
}

/**
 * Clear all sessions
 */
export async function clearAllSessions() {
  try {
    const db = await openDatabase()

    return new Promise((resolve, reject) => {
      const transaction = db.transaction([STORE_NAME], 'readwrite')
      const objectStore = transaction.objectStore(STORE_NAME)
      const request = objectStore.clear()

      request.onsuccess = () => {
        localStorage.removeItem('baby-sensory-sessions')
        console.log('All sessions cleared')
        resolve()
      }

      request.onerror = () => reject(request.error)
    })
  } catch (error) {
    console.error('Error clearing sessions:', error)
    localStorage.removeItem('baby-sensory-sessions')
  }
}

/**
 * Export all sessions as JSON
 */
export async function exportSessions() {
  const sessions = await getAllSessions()
  const exportData = {
    exportDate: new Date().toISOString(),
    totalSessions: sessions.length,
    sessions,
  }
  return JSON.stringify(exportData, null, 2)
}

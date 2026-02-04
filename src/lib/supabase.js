/**
 * Supabase client for Baby Sensory World
 * Provides cloud storage for session analytics
 */

import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://lljqyvtudhjvoalmnouv.supabase.co'
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxsanF5dnR1ZGhqdm9hbG1ub3V2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzAxNDM5MjUsImV4cCI6MjA4NTcxOTkyNX0.xe8eFsnPEczLClNqfT70Jixcpm8HhC9PrEQhXepoKWo'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

/**
 * Save a session to Supabase
 * Converts camelCase to snake_case for database compatibility
 */
export async function saveSessionToSupabase(session) {
  console.log('🔵 saveSessionToSupabase called with session:', session.id)

  try {
    const payload = {
      id: session.id,
      timestamp: session.timestamp,
      theme: session.theme,
      duration: session.duration,
      touches: session.touches,
      color_counts: session.colorCounts,
      object_counts: session.objectCounts,
      nursery_rhymes_played: session.nurseryRhymesPlayed,
      streaks: session.streaks,
      milestones: session.milestones,
      completed_full: session.completedFull,
    }

    console.log('🔵 Inserting to Supabase with payload:', payload)

    const { data, error } = await supabase
      .from('sessions')
      .insert(payload)
      .select()
      .single()

    if (error) {
      console.error('❌ Supabase insert error:', error)
      console.error('❌ Error details:', JSON.stringify(error, null, 2))
      throw error
    }

    console.log('✅ Session saved to Supabase:', session.id)
    console.log('✅ Supabase response:', data)
    return data
  } catch (error) {
    console.error('❌ Failed to save session to Supabase:', error.message)
    console.error('❌ Full error:', error)
    // Don't throw - we still want local storage to succeed
    return null
  }
}

/**
 * Get all sessions from Supabase
 */
export async function getSessionsFromSupabase() {
  try {
    const { data, error } = await supabase
      .from('sessions')
      .select('*')
      .order('timestamp', { ascending: false })

    if (error) {
      console.error('Error fetching from Supabase:', error)
      return []
    }

    // Convert snake_case back to camelCase
    return data.map(row => ({
      id: row.id,
      timestamp: row.timestamp,
      theme: row.theme,
      duration: row.duration,
      touches: row.touches,
      colorCounts: row.color_counts,
      objectCounts: row.object_counts,
      nurseryRhymesPlayed: row.nursery_rhymes_played,
      streaks: row.streaks,
      milestones: row.milestones,
      completedFull: row.completed_full,
    }))
  } catch (error) {
    console.error('Failed to fetch sessions from Supabase:', error)
    return []
  }
}

/**
 * Baby Profile Functions
 */

/**
 * Create a new baby profile
 * @param {string} name - Baby's name
 * @param {number} ageMonths - Baby's age in months (4-12)
 * @returns {object|null} Created profile or null on error
 */
export async function createProfile(name, ageMonths) {
  try {
    const { data, error } = await supabase
      .from('baby_profiles')
      .insert({
        name,
        age_months: ageMonths,
      })
      .select()
      .single()

    if (error) {
      console.error('Error creating baby profile:', error)
      return null
    }

    console.log('✅ Baby profile created:', data)
    return data
  } catch (error) {
    console.error('Failed to create baby profile:', error)
    return null
  }
}

/**
 * Update an existing baby profile
 * @param {string} id - Profile ID
 * @param {object} updates - Fields to update (name, age_months)
 * @returns {object|null} Updated profile or null on error
 */
export async function updateProfile(id, updates) {
  try {
    const payload = {
      ...updates,
      updated_at: new Date().toISOString(),
    }

    const { data, error } = await supabase
      .from('baby_profiles')
      .update(payload)
      .eq('id', id)
      .select()
      .single()

    if (error) {
      console.error('Error updating baby profile:', error)
      return null
    }

    console.log('✅ Baby profile updated:', data)
    return data
  } catch (error) {
    console.error('Failed to update baby profile:', error)
    return null
  }
}

/**
 * Get a baby profile by ID
 * @param {string} id - Profile ID
 * @returns {object|null} Profile or null if not found
 */
export async function getProfile(id) {
  try {
    const { data, error } = await supabase
      .from('baby_profiles')
      .select('*')
      .eq('id', id)
      .single()

    if (error) {
      console.error('Error fetching baby profile:', error)
      return null
    }

    return data
  } catch (error) {
    console.error('Failed to fetch baby profile:', error)
    return null
  }
}

/**
 * Log a session for a baby profile
 * @param {string} babyProfileId - Baby profile ID
 * @param {object} sessionData - Session data
 * @returns {object|null} Created session or null on error
 */
export async function logSession(babyProfileId, sessionData) {
  try {
    const payload = {
      baby_profile_id: babyProfileId,
      theme_used: sessionData.theme,
      duration_seconds: sessionData.duration,
      touches: sessionData.touches,
      objects_touched: sessionData.objectCounts || {},
      colors_touched: sessionData.colorCounts || {},
    }

    const { data, error } = await supabase
      .from('sessions')
      .insert(payload)
      .select()
      .single()

    if (error) {
      console.error('Error logging session:', error)
      return null
    }

    // Also update last_session_date on profile
    await supabase
      .from('baby_profiles')
      .update({ last_session_date: new Date().toISOString() })
      .eq('id', babyProfileId)

    console.log('✅ Session logged for baby profile:', babyProfileId)
    return data
  } catch (error) {
    console.error('Failed to log session:', error)
    return null
  }
}

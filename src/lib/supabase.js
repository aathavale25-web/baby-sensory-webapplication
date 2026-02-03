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
  try {
    const { data, error } = await supabase
      .from('sessions')
      .insert({
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
      })
      .select()
      .single()

    if (error) {
      console.error('Error saving to Supabase:', error)
      throw error
    }

    console.log('✅ Session saved to Supabase:', session.id)
    return data
  } catch (error) {
    console.error('Failed to save session to Supabase:', error.message)
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

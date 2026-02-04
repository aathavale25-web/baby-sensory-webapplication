import React, { createContext, useContext, useState, useEffect } from 'react'
import { getAgeProfile } from '../config/ageProfiles'
import {
  createProfile,
  updateProfile,
  getProfile,
  logSession,
} from '../lib/supabase'

const BabyProfileContext = createContext()

export function useBabyProfile() {
  const context = useContext(BabyProfileContext)
  if (!context) {
    throw new Error('useBabyProfile must be used within BabyProfileProvider')
  }
  return context
}

export function BabyProfileProvider({ children }) {
  const [profile, setProfile] = useState(null)
  const [ageProfile, setAgeProfile] = useState(null)
  const [loading, setLoading] = useState(true)

  // Load profile from localStorage on mount
  useEffect(() => {
    const loadProfile = async () => {
      const storedProfile = localStorage.getItem('babyProfile')
      if (storedProfile) {
        try {
          const parsed = JSON.parse(storedProfile)
          setProfile(parsed)
          setAgeProfile(getAgeProfile(parsed.age_months))
        } catch (error) {
          console.error('Error parsing stored profile:', error)
          localStorage.removeItem('babyProfile')
        }
      }
      setLoading(false)
    }

    loadProfile()
  }, [])

  // Update ageProfile when profile changes
  useEffect(() => {
    if (profile) {
      setAgeProfile(getAgeProfile(profile.age_months))
    }
  }, [profile])

  const createBabyProfile = async (name, ageMonths) => {
    try {
      // Create in Supabase
      const supabaseProfile = await createProfile(name, ageMonths)

      const newProfile = {
        id: supabaseProfile?.id || crypto.randomUUID(),
        name,
        age_months: ageMonths,
        created_at: new Date().toISOString(),
      }

      // Save to localStorage
      localStorage.setItem('babyProfile', JSON.stringify(newProfile))
      setProfile(newProfile)
      setAgeProfile(getAgeProfile(ageMonths))

      return newProfile
    } catch (error) {
      console.error('Error creating baby profile:', error)
      throw error
    }
  }

  const updateBabyProfile = async (updates) => {
    if (!profile) return

    try {
      const updatedProfile = {
        ...profile,
        ...updates,
        updated_at: new Date().toISOString(),
      }

      // Update in Supabase if we have an ID
      if (profile.id) {
        const supabaseUpdates = {}
        if (updates.name) supabaseUpdates.name = updates.name
        if (updates.age_months) supabaseUpdates.age_months = updates.age_months

        await updateProfile(profile.id, supabaseUpdates)
      }

      // Update localStorage
      localStorage.setItem('babyProfile', JSON.stringify(updatedProfile))
      setProfile(updatedProfile)

      if (updates.age_months) {
        setAgeProfile(getAgeProfile(updates.age_months))
      }

      return updatedProfile
    } catch (error) {
      console.error('Error updating baby profile:', error)
      throw error
    }
  }

  const clearProfile = () => {
    localStorage.removeItem('babyProfile')
    setProfile(null)
    setAgeProfile(null)
  }

  const saveSession = async (sessionData) => {
    if (!profile?.id) {
      console.warn('No profile ID, skipping session log')
      return
    }

    try {
      await logSession(profile.id, sessionData)
    } catch (error) {
      console.error('Error saving session:', error)
    }
  }

  const value = {
    profile,
    ageProfile,
    loading,
    createBabyProfile,
    updateBabyProfile,
    clearProfile,
    saveSession,
  }

  return (
    <BabyProfileContext.Provider value={value}>
      {children}
    </BabyProfileContext.Provider>
  )
}

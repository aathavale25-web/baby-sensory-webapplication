-- Baby Sensory App - Supabase Database Schema
-- Run this in your Supabase SQL Editor

-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Baby Profiles Table
CREATE TABLE IF NOT EXISTS baby_profiles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  age_months INTEGER NOT NULL CHECK (age_months >= 4 AND age_months <= 12),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  last_session_date TIMESTAMP WITH TIME ZONE
);

-- Sessions Table (Updated schema for baby profiles)
-- Note: This modifies the existing sessions table to add baby_profile_id
ALTER TABLE sessions
  ADD COLUMN IF NOT EXISTS baby_profile_id UUID REFERENCES baby_profiles(id) ON DELETE CASCADE,
  ADD COLUMN IF NOT EXISTS theme_used TEXT,
  ADD COLUMN IF NOT EXISTS duration_seconds INTEGER,
  ADD COLUMN IF NOT EXISTS objects_touched JSONB,
  ADD COLUMN IF NOT EXISTS colors_touched JSONB;

-- Create indexes for faster queries
CREATE INDEX IF NOT EXISTS idx_sessions_baby_profile ON sessions(baby_profile_id);
CREATE INDEX IF NOT EXISTS idx_sessions_date ON sessions(session_date);
CREATE INDEX IF NOT EXISTS idx_baby_profiles_created ON baby_profiles(created_at);

-- Enable Row Level Security (RLS)
ALTER TABLE baby_profiles ENABLE ROW LEVEL SECURITY;

-- Create policy to allow all operations (since this is a baby app with no auth)
CREATE POLICY "Allow all operations on baby_profiles" ON baby_profiles
  FOR ALL
  USING (true)
  WITH CHECK (true);

-- Update sessions table RLS policy if needed
CREATE POLICY IF NOT EXISTS "Allow all operations on sessions" ON sessions
  FOR ALL
  USING (true)
  WITH CHECK (true);

-- Optional: View to get profiles with session counts
CREATE OR REPLACE VIEW baby_profiles_with_stats AS
SELECT
  bp.*,
  COUNT(s.id) as total_sessions,
  SUM(s.duration_seconds) as total_playtime_seconds
FROM baby_profiles bp
LEFT JOIN sessions s ON bp.id = s.baby_profile_id
GROUP BY bp.id;

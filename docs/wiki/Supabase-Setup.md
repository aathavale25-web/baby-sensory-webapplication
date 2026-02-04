# Supabase Setup Guide

This guide walks you through setting up Supabase for cloud storage of baby profiles and play sessions.

## Why Supabase?

Supabase provides:
- ✅ **Cloud Storage**: Profiles persist across devices
- ✅ **Session Tracking**: Analytics and progress over time
- ✅ **Real-time Sync**: Updates across multiple devices
- ✅ **Free Tier**: Generous limits for personal use

## Step-by-Step Setup

### 1. Create Supabase Account

1. Go to [supabase.com](https://supabase.com)
2. Click **"Start your project"**
3. Sign up with GitHub, Google, or email
4. Verify your email address

### 2. Create a New Project

1. Click **"New Project"**
2. Choose your organization (or create one)
3. Fill in project details:
   - **Name**: `baby-sensory-app` (or your choice)
   - **Database Password**: Generate a strong password (save it!)
   - **Region**: Choose closest to your location
   - **Pricing Plan**: Free tier is sufficient
4. Click **"Create new project"**
5. Wait 2-3 minutes for project setup

### 3. Get Project Credentials

1. In your project dashboard, click **"Settings"** (gear icon)
2. Navigate to **"API"** section
3. Copy these values:
   - **Project URL**: `https://xxxxx.supabase.co`
   - **anon public key**: `eyJhbGc...` (long string)

### 4. Configure Environment Variables

1. In your project root, create `.env` file:

```bash
# In baby-sensory-webapplication/
touch .env
```

2. Add your credentials:

```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your_anon_public_key_here
```

3. Ensure `.env` is in `.gitignore`:

```bash
# Check .gitignore contains:
.env
.env.local
.env.production
```

### 5. Create Database Tables

1. In Supabase dashboard, go to **"SQL Editor"**
2. Click **"New query"**
3. Copy and paste the schema from `supabase-schema.sql`:

```sql
-- Enable UUID extension
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

-- Sessions Table
CREATE TABLE IF NOT EXISTS sessions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  baby_profile_id UUID REFERENCES baby_profiles(id) ON DELETE CASCADE,
  theme_used TEXT,
  duration_seconds INTEGER,
  touches INTEGER,
  objects_touched JSONB,
  colors_touched JSONB,
  session_date TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_sessions_baby_profile ON sessions(baby_profile_id);
CREATE INDEX IF NOT EXISTS idx_sessions_date ON sessions(session_date);
CREATE INDEX IF NOT EXISTS idx_baby_profiles_created ON baby_profiles(created_at);

-- Enable Row Level Security
ALTER TABLE baby_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE sessions ENABLE ROW LEVEL SECURITY;

-- Create policies (allow all for now - baby app)
CREATE POLICY "Allow all operations on baby_profiles" ON baby_profiles
  FOR ALL
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Allow all operations on sessions" ON sessions
  FOR ALL
  USING (true)
  WITH CHECK (true);
```

4. Click **"Run"** (or press Ctrl/Cmd + Enter)
5. Verify success message: **"Success. No rows returned"**

### 6. Verify Tables Created

1. Go to **"Table Editor"** in Supabase
2. You should see:
   - `baby_profiles` table
   - `sessions` table
3. Click each table to verify columns

### 7. Test the Connection

1. Restart your dev server:

```bash
npm run dev
```

2. Open the app in browser
3. Create a baby profile
4. In Supabase, go to **"Table Editor"** → **"baby_profiles"**
5. You should see the new profile entry!

## Database Schema Details

### baby_profiles Table

| Column | Type | Description |
|--------|------|-------------|
| `id` | UUID | Unique identifier (auto-generated) |
| `name` | TEXT | Baby's name |
| `age_months` | INTEGER | Age in months (4-12) |
| `created_at` | TIMESTAMP | Profile creation date |
| `updated_at` | TIMESTAMP | Last update date |
| `last_session_date` | TIMESTAMP | Most recent play session |

### sessions Table

| Column | Type | Description |
|--------|------|-------------|
| `id` | UUID | Unique session identifier |
| `baby_profile_id` | UUID | Reference to baby profile |
| `theme_used` | TEXT | Theme played (Ocean, Space, etc.) |
| `duration_seconds` | INTEGER | Session length in seconds |
| `touches` | INTEGER | Total touches in session |
| `objects_touched` | JSONB | Touch counts by object type |
| `colors_touched` | JSONB | Touch counts by color |
| `session_date` | TIMESTAMP | When session occurred |

## Viewing Analytics

### Recent Sessions

```sql
SELECT
  bp.name,
  s.theme_used,
  s.duration_seconds,
  s.touches,
  s.session_date
FROM sessions s
JOIN baby_profiles bp ON s.baby_profile_id = bp.id
ORDER BY s.session_date DESC
LIMIT 10;
```

### Baby Statistics

```sql
SELECT
  name,
  age_months,
  COUNT(s.id) as total_sessions,
  SUM(s.duration_seconds) as total_playtime_seconds,
  AVG(s.touches) as avg_touches_per_session
FROM baby_profiles bp
LEFT JOIN sessions s ON bp.id = s.baby_profile_id
GROUP BY bp.id, bp.name, bp.age_months;
```

## Security Considerations

### For Production

The current setup uses permissive RLS policies (`true` for all). For production:

1. **Add Authentication** (if multi-user):

```sql
-- Example: User-specific access
CREATE POLICY "Users can only see their own profiles"
ON baby_profiles FOR SELECT
USING (auth.uid() = user_id);
```

2. **Restrict API Keys**: Use environment variables
3. **Enable MFA**: In Supabase dashboard
4. **Monitor Usage**: Check Supabase dashboard regularly

### For Personal/Family Use

The current setup is appropriate for single-family use.

## Troubleshooting

### "Invalid API key" Error

- Verify `.env` file has correct credentials
- Restart dev server after changing `.env`
- Check for extra spaces in `.env` values

### Tables Not Created

- Run SQL in correct order (UUID extension first)
- Check for error messages in SQL editor
- Verify you're in the right project

### Profile Not Saving

- Check browser console for errors
- Verify Supabase URL is accessible
- Check RLS policies are allowing operations

### Session Not Logging

- Verify `baby_profile_id` exists
- Check foreign key constraints
- Review browser console errors

## Free Tier Limits

Supabase free tier includes:

- ✅ 500 MB database space
- ✅ 1 GB file storage
- ✅ 2 GB bandwidth
- ✅ 50,000 monthly active users
- ✅ Unlimited API requests

This is more than sufficient for personal/family use!

## Alternative: Local Storage Only

If you don't want to use Supabase:

1. **Skip this setup** - app works without it
2. **Data stored locally** in browser's localStorage
3. **Limitation**: Profiles don't sync across devices
4. **Good for**: Single device, testing

The app automatically falls back to localStorage if Supabase fails.

## Next Steps

- [Quick Start Guide](Quick-Start-Guide) - Start using the app
- [Architecture Overview](Architecture-Overview) - Learn how it works
- [API Reference](API-Reference) - Supabase function details

## Support

If you encounter issues:

1. Check [Supabase Documentation](https://supabase.com/docs)
2. Join [Supabase Discord](https://discord.supabase.com)
3. [Create an issue](https://github.com/aathavale25-web/baby-sensory-webapplication/issues)

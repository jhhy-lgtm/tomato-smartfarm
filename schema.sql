-- =========================================================================
-- Tomato Smart Farm Pro - Supabase Database Schema (Seoul ap-northeast-2)
-- Project: Tomato-Farm (lnnufqbftvourvjoqxpv)
-- Date: 2026-09-01
-- =========================================================================

-- 1. Farm Settings Table
CREATE TABLE IF NOT EXISTS public.farm_settings (
  id TEXT PRIMARY KEY DEFAULT 'default',
  farm_name TEXT DEFAULT '토마토 농장',
  bed_count INTEGER DEFAULT 24,
  target_supply_ec NUMERIC DEFAULT 2.4,
  target_supply_ph NUMERIC DEFAULT 5.8,
  target_drain_min NUMERIC DEFAULT 20,
  target_drain_max NUMERIC DEFAULT 30,
  weather_region TEXT DEFAULT 'buyeo',
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
ALTER TABLE public.farm_settings ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Allow public all on farm_settings" ON public.farm_settings;
CREATE POLICY "Allow public all on farm_settings" ON public.farm_settings FOR ALL USING (true) WITH CHECK (true);

-- 2. Growth Profile Table
CREATE TABLE IF NOT EXISTS public.growth_profile (
  id TEXT PRIMARY KEY DEFAULT 'default',
  planting_date DATE DEFAULT '2026-08-25',
  crop_type TEXT DEFAULT 'long_term',
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
ALTER TABLE public.growth_profile ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Allow public all on growth_profile" ON public.growth_profile;
CREATE POLICY "Allow public all on growth_profile" ON public.growth_profile FOR ALL USING (true) WITH CHECK (true);

-- 3. Stage Checklist Table
CREATE TABLE IF NOT EXISTS public.stage_checklist (
  key TEXT PRIMARY KEY,
  is_checked BOOLEAN DEFAULT FALSE,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
ALTER TABLE public.stage_checklist ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Allow public all on stage_checklist" ON public.stage_checklist;
CREATE POLICY "Allow public all on stage_checklist" ON public.stage_checklist FOR ALL USING (true) WITH CHECK (true);

-- 4. Routines Table
CREATE TABLE IF NOT EXISTS public.routines (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  category TEXT NOT NULL,
  interval_days INTEGER DEFAULT 1,
  guide TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
ALTER TABLE public.routines ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Allow public all on routines" ON public.routines;
CREATE POLICY "Allow public all on routines" ON public.routines FOR ALL USING (true) WITH CHECK (true);

-- 5. Routine Logs Table
CREATE TABLE IF NOT EXISTS public.routine_logs (
  id TEXT PRIMARY KEY,
  log_date DATE NOT NULL,
  routine_id TEXT NOT NULL,
  is_completed BOOLEAN DEFAULT TRUE,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
ALTER TABLE public.routine_logs ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Allow public all on routine_logs" ON public.routine_logs;
CREATE POLICY "Allow public all on routine_logs" ON public.routine_logs FOR ALL USING (true) WITH CHECK (true);

-- 6. Bed Status Table
CREATE TABLE IF NOT EXISTS public.bed_status (
  id TEXT PRIMARY KEY,
  task_type TEXT NOT NULL,
  bed_number INTEGER NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending',
  completed_date DATE,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
ALTER TABLE public.bed_status ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Allow public all on bed_status" ON public.bed_status;
CREATE POLICY "Allow public all on bed_status" ON public.bed_status FOR ALL USING (true) WITH CHECK (true);

-- 7. Daily Logs Table
CREATE TABLE IF NOT EXISTS public.daily_logs (
  log_date DATE PRIMARY KEY,
  supply_ec NUMERIC,
  drain_ec NUMERIC,
  supply_ph NUMERIC,
  drain_ph NUMERIC,
  supply_volume NUMERIC,
  drain_volume NUMERIC,
  harvest_grade_a NUMERIC DEFAULT 0,
  harvest_grade_b NUMERIC DEFAULT 0,
  harvest_grade_c NUMERIC DEFAULT 0,
  temp_high NUMERIC,
  temp_low NUMERIC,
  humidity NUMERIC,
  solar_radiation NUMERIC,
  memo TEXT,
  photo TEXT,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
ALTER TABLE public.daily_logs ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Allow public all on daily_logs" ON public.daily_logs;
CREATE POLICY "Allow public all on daily_logs" ON public.daily_logs FOR ALL USING (true) WITH CHECK (true);
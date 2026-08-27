-- ==========================================================
-- SQL MIGRATION: Create client_job_posts table
-- ----------------------------------------------------------
-- Stores job postings submitted by clients/employers via Client Portal.
-- ==========================================================

CREATE TABLE IF NOT EXISTS public.client_job_posts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMPTZ DEFAULT now(),
  title TEXT NOT NULL,
  department TEXT,
  company_name TEXT NOT NULL,
  contact_name TEXT,
  contact_email TEXT NOT NULL,
  contact_phone TEXT,
  job_type TEXT,
  workplace_type TEXT,
  experience_level TEXT,
  location TEXT,
  salary_range TEXT,
  urgency TEXT,
  skills JSONB DEFAULT '[]'::jsonb,
  description TEXT,
  status TEXT DEFAULT 'New',
  admin_notes TEXT,
  assigned_candidates JSONB DEFAULT '[]'::jsonb
);

-- Enable RLS
ALTER TABLE public.client_job_posts ENABLE ROW LEVEL SECURITY;

-- Allow public insert to client_job_posts
CREATE POLICY "Allow public insert to client_job_posts" 
  ON public.client_job_posts
  FOR INSERT 
  WITH CHECK (true);

-- Allow authenticated users / admins full access
CREATE POLICY "Allow full access to client_job_posts" 
  ON public.client_job_posts
  FOR ALL 
  USING (true);

GRANT ALL ON public.client_job_posts TO anon, authenticated;

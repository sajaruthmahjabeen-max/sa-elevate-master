-- ==========================================================
-- SQL MIGRATION: Create career_service_requests table
-- ----------------------------------------------------------
-- Stores candidate submissions for Resume Services (Basic, Professional, Executive).
-- ==========================================================

CREATE TABLE IF NOT EXISTS public.career_service_requests (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMPTZ DEFAULT now(),
  service_plan TEXT NOT NULL,
  candidate_name TEXT NOT NULL,
  candidate_email TEXT NOT NULL,
  candidate_phone TEXT NOT NULL,
  target_position TEXT NOT NULL,
  resume_file_name TEXT,
  resume_file_url TEXT,
  job_description_file_name TEXT,
  job_description_file_url TEXT,
  job_description_text TEXT,
  status TEXT DEFAULT 'pending_review',
  final_price TEXT,
  admin_notes TEXT
);

-- Enable RLS
ALTER TABLE public.career_service_requests ENABLE ROW LEVEL SECURITY;

-- Allow anyone to submit a request
CREATE POLICY "Allow public insert to career_service_requests" 
  ON public.career_service_requests
  FOR INSERT 
  WITH CHECK (true);

-- Allow authenticated users / admins full access
CREATE POLICY "Allow full access to career_service_requests" 
  ON public.career_service_requests
  FOR ALL 
  USING (true);

GRANT ALL ON public.career_service_requests TO anon, authenticated;

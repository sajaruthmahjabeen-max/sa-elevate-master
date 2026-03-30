-- Create profiles table
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  name TEXT,
  email TEXT,
  role TEXT DEFAULT 'user' CHECK (role IN ('admin', 'user')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS on profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Profiles Policies
CREATE POLICY "Public profiles are viewable by everyone" ON public.profiles
  FOR SELECT USING (true);

CREATE POLICY "Users can insert their own profile" ON public.profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = id);

-- Create reviews table
CREATE TABLE IF NOT EXISTS public.reviews (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  message TEXT NOT NULL,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS on reviews
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;

-- Reviews Policies
CREATE POLICY "Approved reviews are viewable by everyone" ON public.reviews
  FOR SELECT USING (status = 'approved');

CREATE POLICY "Users can insert their own reviews" ON public.reviews
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view their own reviews" ON public.reviews
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Admin can view all reviews" ON public.reviews
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
    )
  );

CREATE POLICY "Admin can update all reviews" ON public.reviews
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
    )
  );

CREATE POLICY "Admin can delete reviews" ON public.reviews
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
    )
  );

-- Update the signup trigger to automatically make this email an admin
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, name, email, role)
  VALUES (
    new.id, 
    new.raw_user_meta_data->>'name', 
    new.email, 
    CASE WHEN new.email = 'safadreamcraftdiaries@gmail.com' THEN 'admin' ELSE 'user' END
  );
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger for new user signup
CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Create site settings table
CREATE TABLE IF NOT EXISTS public.settings (
  id TEXT PRIMARY KEY,
  value TEXT NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS on settings
ALTER TABLE public.settings ENABLE ROW LEVEL SECURITY;

-- Settings Policies
CREATE POLICY "Public settings are viewable by everyone" ON public.settings
  FOR SELECT USING (true);

CREATE POLICY "Admins can update settings" ON public.settings
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
    )
  );

-- Initialize site settings
INSERT INTO public.settings (id, value) VALUES 
  ('contact_address', 'New Jersey, USA'),
  ('contact_email', 'mahjabeensajaruth@gmail.com'),
  ('contact_phone', '+1 (609) 313-9192, 9384797751'),
  ('whatsapp_number', '9384797751')
ON CONFLICT (id) DO UPDATE SET value = EXCLUDED.value;

-- Create projects table for portfolio
CREATE TABLE IF NOT EXISTS public.projects (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  category TEXT NOT NULL,
  description TEXT NOT NULL,
  content TEXT, -- Detailed case study/markdown content
  image_url TEXT,
  color_gradient TEXT NOT NULL, -- e.g. "from-[hsl(270,70%,60%)] to-[hsl(220,90%,56%)]"
  client TEXT,
  completion_date TEXT,
  link TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS on projects
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;

-- Projects Policies
CREATE POLICY "Projects are viewable by everyone" ON public.projects
  FOR SELECT USING (true);

CREATE POLICY "Admins can manage projects" ON public.projects
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
    )
  );

-- Seed initial projects
INSERT INTO public.projects (title, category, description, color_gradient, client, completion_date) VALUES
  ('E-Commerce Platform', 'Web Development', 'A high-performance e-commerce solution with advanced features.', 'from-[hsl(270,70%,60%)] to-[hsl(220,90%,56%)]', 'Global Retail Inc.', '2023-12'),
  ('Brand Strategy Campaign', 'Marketing', 'Comprehensive branding and marketing strategy for a luxury startup.', 'from-[hsl(220,90%,56%)] to-[hsl(330,80%,60%)]', 'Luxe Modern', '2024-01'),
  ('Enterprise Staffing', 'Staffing', 'Custom recruitment and HR management system for large enterprises.', 'from-[hsl(330,80%,60%)] to-[hsl(270,70%,60%)]', 'TechCorp Solutions', '2023-11'),
  ('Social Media Content', 'Content', 'Engaging social media content strategy and production.', 'from-[hsl(43,96%,56%)] to-[hsl(270,70%,60%)]', 'Trendify', '2024-02'),
  ('SaaS Dashboard', 'Web Development', 'Modern analytics dashboard for a B2B SaaS platform.', 'from-[hsl(270,70%,60%)] to-[hsl(43,96%,56%)]', 'DataPulse', '2024-01'),
  ('Healthcare Recruitment', 'Staffing', 'Specialized staffing solution for the healthcare sector.', 'from-[hsl(220,90%,56%)] to-[hsl(43,96%,56%)]', 'MediCare Group', '2023-10');

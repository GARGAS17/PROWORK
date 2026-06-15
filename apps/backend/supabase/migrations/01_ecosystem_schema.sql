-- ========================================================
-- MIGRACIÓN 01: ECOSISTEMA PROWORK
-- Ejecuta este script completo en el SQL Editor de Supabase
-- ========================================================

-- 1. Tabla 'profiles' (Extiende a tu tabla 'users' actual)
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES public.users(id) ON DELETE CASCADE,
  full_name TEXT NOT NULL,
  bio TEXT,
  avatar_url TEXT,
  hourly_rate DECIMAL(10, 2), -- Útil para freelancers
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Tabla 'skills' (Catálogo Maestro de Habilidades)
CREATE TABLE IF NOT EXISTS public.skills (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  category TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. Tabla Pivote 'freelancer_skills' (Relación Muchos a Muchos)
CREATE TABLE IF NOT EXISTS public.freelancer_skills (
  profile_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  skill_id UUID REFERENCES public.skills(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  PRIMARY KEY (profile_id, skill_id)
);

-- 4. Tabla 'projects' (Ofertas publicadas por Empresas)
CREATE TABLE IF NOT EXISTS public.projects (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  company_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  budget_min DECIMAL(12, 2),
  budget_max DECIMAL(12, 2),
  duration_days INTEGER,
  -- status: 'draft', 'pending_approval', 'open', 'in_progress', 'completed', 'cancelled'
  status TEXT DEFAULT 'pending_approval' NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 5. Tabla 'applications' (Postulaciones de Freelancers a Proyectos)
CREATE TABLE IF NOT EXISTS public.applications (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  project_id UUID REFERENCES public.projects(id) ON DELETE CASCADE NOT NULL,
  freelancer_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
  cover_letter TEXT NOT NULL,
  bid_amount DECIMAL(12, 2) NOT NULL,
  estimated_days INTEGER,
  -- status: 'pending', 'interviewing', 'accepted', 'rejected', 'withdrawn'
  status TEXT DEFAULT 'pending' NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Habilitar Row Level Security (RLS) como medida estándar.
-- Nota: Tu backend Node.js seguirá teniendo acceso total ya que usa la 'service_role' key.
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.skills ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.freelancer_skills ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.applications ENABLE ROW LEVEL SECURITY;

-- Insertar algunas Habilidades (Skills) por defecto para que podamos hacer pruebas después
INSERT INTO public.skills (name, category) VALUES 
  ('React', 'Frontend'),
  ('Node.js', 'Backend'),
  ('Figma', 'Design'),
  ('SEO', 'Marketing'),
  ('Copywriting', 'Marketing')
ON CONFLICT (name) DO NOTHING;

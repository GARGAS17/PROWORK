-- ========================================================
-- MIGRACIÓN 04: ESPACIO DE TRABAJO (ENTREGABLES)
-- Ejecuta este script en el SQL Editor de Supabase
-- ========================================================

-- Crear tipo enum para los estados del entregable
CREATE TYPE deliverable_status AS ENUM ('pending_review', 'approved', 'rejected');

-- Crear tabla de Entregables (Deliverables)
CREATE TABLE IF NOT EXISTS public.deliverables (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  project_id UUID REFERENCES public.projects(id) ON DELETE CASCADE NOT NULL,
  freelancer_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
  file_url TEXT NOT NULL,
  message TEXT,
  status deliverable_status DEFAULT 'pending_review' NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Habilitar RLS (Row Level Security)
ALTER TABLE public.deliverables ENABLE ROW LEVEL SECURITY;

-- ========================================================
-- CONFIGURACIÓN DE STORAGE: BUCKET PARA ENTREGABLES
-- ========================================================
-- Crear el bucket 'deliverables' si no existe
INSERT INTO storage.buckets (id, name, public) 
VALUES ('deliverables', 'deliverables', true)
ON CONFLICT (id) DO NOTHING;

-- Nota: Como el backend opera con la clave service_role,
-- no necesitamos políticas complejas de RLS para subir los archivos
-- desde el controlador Node.js.

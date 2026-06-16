-- ========================================================
-- MIGRACIÓN 08: FIX APPLICATIONS SCHEMA
-- Ejecuta este script en el SQL Editor de Supabase
-- ========================================================

-- Añadir la columna bid_amount si por alguna razón no se creó en la migración inicial
ALTER TABLE public.applications 
  ADD COLUMN IF NOT EXISTS bid_amount DECIMAL(12, 2) NOT NULL DEFAULT 0;

-- Forzar la recarga de la caché del esquema de Supabase (PostgREST)
NOTIFY pgrst, 'reload schema';

-- ========================================================
-- MIGRACIÓN 09: SOLICITUDES DE ASESORÍA
-- Ejecuta este script en el SQL Editor de Supabase
-- ========================================================

CREATE TABLE IF NOT EXISTS public.consulting_requests (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  company_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
  -- status: 'pending' (en espera), 'completed' (asesoría realizada)
  status TEXT DEFAULT 'pending' NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Habilitar Row Level Security
ALTER TABLE public.consulting_requests ENABLE ROW LEVEL SECURITY;

-- Políticas de seguridad: Un usuario (empresa) puede ver sus propias solicitudes
CREATE POLICY "Users can view their own consulting requests" 
  ON public.consulting_requests 
  FOR SELECT 
  USING (auth.uid() = company_id);

-- Recargar cache de PostgREST
NOTIFY pgrst, 'reload schema';

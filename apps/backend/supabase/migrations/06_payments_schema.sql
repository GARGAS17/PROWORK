-- ========================================================
-- MIGRACIÓN 06: SISTEMA DE PAGOS (ESCROW)
-- Ejecuta este script en el SQL Editor de Supabase
-- ========================================================

CREATE TABLE IF NOT EXISTS public.payments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  project_id UUID REFERENCES public.projects(id) ON DELETE CASCADE NOT NULL,
  company_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
  freelancer_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
  amount DECIMAL(12, 2) NOT NULL,
  -- status: 'escrow' (retenido al contratar), 'released' (liberado al finalizar), 'refunded' (devuelto)
  status TEXT DEFAULT 'escrow' NOT NULL,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Habilitar Row Level Security
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;

-- Políticas de seguridad: Un usuario puede ver sus propios pagos ya sea como empresa o freelancer
CREATE POLICY "Users can view their own payments" 
  ON public.payments 
  FOR SELECT 
  USING (auth.uid() = company_id OR auth.uid() = freelancer_id);

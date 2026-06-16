-- ========================================================
-- MIGRACIÓN 07: COMISIONES Y GESTIÓN DE PAGOS
-- Ejecuta este script en el SQL Editor de Supabase
-- ========================================================

ALTER TABLE public.payments 
  ADD COLUMN IF NOT EXISTS commission_amount DECIMAL(12, 2) DEFAULT 0,
  ADD COLUMN IF NOT EXISTS freelancer_amount DECIMAL(12, 2) DEFAULT 0;

-- Nota: El estado 'pending_admin' se usará ahora a nivel aplicación para indicar
-- que el proyecto ha sido cerrado por la empresa, pero el pago aún no se desembolsa.

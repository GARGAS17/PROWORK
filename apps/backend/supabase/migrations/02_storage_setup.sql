-- ========================================================
-- MIGRACIÓN 02: CONFIGURACIÓN DE ALMACENAMIENTO (STORAGE)
-- Ejecuta este script en el SQL Editor de Supabase
-- ========================================================

-- 1. Crear el bucket 'avatars' si no existe
INSERT INTO storage.buckets (id, name, public)
VALUES ('avatars', 'avatars', true)
ON CONFLICT (id) DO NOTHING;

-- 2. Habilitar RLS en la tabla de objetos de storage (si no está habilitado)
-- Nota: En Supabase moderno esto suele estar habilitado por defecto y está protegido por el sistema.
-- ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;

-- 3. Crear política: Cualquiera puede ver los avatares (Public Read)
-- Solo se aplica al bucket 'avatars'
CREATE POLICY "Public Access to Avatars"
ON storage.objects FOR SELECT
USING ( bucket_id = 'avatars' );

-- 4. Crear política: Solo usuarios autenticados pueden subir su propio avatar
-- Verifica que el bucket sea 'avatars' y que el usuario esté logueado
CREATE POLICY "Users can upload their own avatar"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'avatars' 
  AND auth.uid() IS NOT NULL
);

-- 5. Crear política: Solo el dueño puede actualizar su avatar
CREATE POLICY "Users can update their own avatar"
ON storage.objects FOR UPDATE
USING (
  bucket_id = 'avatars' 
  AND auth.uid() IS NOT NULL
);

-- 6. Crear política: Solo el dueño puede borrar su avatar
CREATE POLICY "Users can delete their own avatar"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'avatars' 
  AND auth.uid() IS NOT NULL
);

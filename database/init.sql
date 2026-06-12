-- 1. Crear el tipo ENUM para los roles de usuario
CREATE TYPE user_role AS ENUM ('empresa', 'freelancer', 'admin');

-- 2. Crear la tabla de usuarios
CREATE TABLE IF NOT EXISTS public.users (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    role user_role NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. (Opcional) Configurar la seguridad de nivel de fila (Row Level Security - RLS)
-- Si estás accediendo desde tu backend Node.js (que se asume actúa como servidor confiable), 
-- asegúrate de usar la 'Service Role Key' en el .env si habilitas RLS para que el backend pueda saltarse las reglas,
-- O si usas la 'Anon Key', deshabilita RLS en la tabla o crea políticas que permitan acceso.
-- Por defecto en Supabase RLS está inactivo hasta que lo activas manualmente.
-- ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

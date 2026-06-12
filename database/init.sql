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

-- 3. Crear el tipo ENUM para el estado de los proyectos
CREATE TYPE project_status AS ENUM ('abierto', 'en_progreso', 'cerrado');

-- 4. Crear la tabla de proyectos
CREATE TABLE IF NOT EXISTS public.projects (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    company_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    estimated_budget NUMERIC(10, 2) NOT NULL,
    technologies TEXT[] NOT NULL DEFAULT '{}',
    status project_status NOT NULL DEFAULT 'abierto',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 5. Crear un índice GIN para búsquedas eficientes en el arreglo de tecnologías
CREATE INDEX IF NOT EXISTS idx_projects_technologies ON public.projects USING GIN (technologies);

-- 6. Crear un índice para optimizar la búsqueda en el muro público
CREATE INDEX IF NOT EXISTS idx_projects_status ON public.projects (status);

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
CREATE TYPE project_status AS ENUM ('abierto', 'en_progreso', 'asignado', 'cerrado');

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

-- 7. Crear el tipo ENUM para el estado de las postulaciones
CREATE TYPE application_status AS ENUM ('pendiente', 'seleccionado', 'rechazado');

-- 8. Crear la tabla de postulaciones (applications)
CREATE TABLE IF NOT EXISTS public.applications (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    project_id UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
    freelancer_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    resume_pdf_url TEXT NOT NULL,
    proposal_text TEXT NOT NULL,
    status application_status NOT NULL DEFAULT 'pendiente',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    UNIQUE(project_id, freelancer_id) -- Un freelancer solo puede postularse una vez por proyecto
);

-- 9. Función RPC para realizar la transacción segura (seleccionar ganador)
CREATE OR REPLACE FUNCTION public.select_winner(p_application_id UUID, p_project_id UUID)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER -- Se ejecuta con privilegios elevados para garantizar atomicidad
AS $$
BEGIN
    -- 1. Cambiar la postulación ganadora a 'seleccionado'
    UPDATE public.applications
    SET status = 'seleccionado', updated_at = NOW()
    WHERE id = p_application_id AND project_id = p_project_id;

    -- 2. Cambiar las demás postulaciones de este proyecto a 'rechazado'
    UPDATE public.applications
    SET status = 'rechazado', updated_at = NOW()
    WHERE project_id = p_project_id AND id != p_application_id;

    -- 3. Cambiar el estado del proyecto a 'asignado'
    UPDATE public.projects
    SET status = 'asignado', updated_at = NOW()
    WHERE id = p_project_id;
END;
$$;

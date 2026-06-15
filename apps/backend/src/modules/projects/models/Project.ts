export enum ProjectStatus {
  ABIERTO = 'abierto',
  EN_PROGRESO = 'en_progreso',
  ASIGNADO = 'asignado',
  CERRADO = 'cerrado',
}

export interface Project {
  id?: string;
  company_id: string;
  title: string;
  description: string;
  estimated_budget: number;
  currency: string;
  technologies: string[];
  status: ProjectStatus;
  created_at?: Date;
  updated_at?: Date;
}

export enum ProjectStatus {
  ABIERTO = 'abierto',
  EN_PROGRESO = 'en_progreso',
  CERRADO = 'cerrado',
}

export interface Project {
  id?: string;
  company_id: string;
  title: string;
  description: string;
  estimated_budget: number;
  technologies: string[];
  status: ProjectStatus;
  created_at?: Date;
  updated_at?: Date;
}

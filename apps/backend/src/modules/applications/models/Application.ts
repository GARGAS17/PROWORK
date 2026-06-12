export enum ApplicationStatus {
  PENDIENTE = 'pendiente',
  SELECCIONADO = 'seleccionado',
  RECHAZADO = 'rechazado',
}

export interface Application {
  id?: string;
  project_id: string;
  freelancer_id: string;
  resume_pdf_url: string;
  proposal_text: string;
  status: ApplicationStatus;
  created_at?: Date;
  updated_at?: Date;
}

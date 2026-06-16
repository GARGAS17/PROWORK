export enum DeliverableStatus {
  PENDING_REVIEW = 'pending_review',
  APPROVED = 'approved',
  REJECTED = 'rejected',
}

export interface Deliverable {
  id?: string;
  project_id: string;
  freelancer_id: string;
  file_url: string;
  message?: string;
  feedback?: string;
  status: DeliverableStatus;
  created_at?: Date;
  updated_at?: Date;
}

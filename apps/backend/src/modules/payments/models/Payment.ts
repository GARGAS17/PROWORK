export type PaymentStatus = 'escrow' | 'released' | 'refunded';

export interface Payment {
  id: string;
  project_id: string;
  company_id: string;
  freelancer_id: string;
  amount: number;
  status: PaymentStatus;
  description?: string;
  created_at: Date;
  updated_at: Date;
}

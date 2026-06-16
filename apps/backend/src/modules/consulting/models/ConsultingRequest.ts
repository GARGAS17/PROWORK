export interface ConsultingRequest {
  id?: string;
  company_id: string;
  status: 'pending' | 'completed';
  created_at?: Date;
  updated_at?: Date;
}

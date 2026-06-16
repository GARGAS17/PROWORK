import { supabase } from '../../../config/supabase';
import { ConsultingRequest } from '../models/ConsultingRequest';

export interface IConsultingRepository {
  createRequest(companyId: string): Promise<ConsultingRequest>;
  findPendingAdmin(): Promise<any[]>;
  updateStatus(id: string, status: string): Promise<void>;
}

export class SupabaseConsultingRepository implements IConsultingRepository {
  private tableName = 'consulting_requests';

  async createRequest(companyId: string): Promise<ConsultingRequest> {
    // Verificar si ya tiene una pendiente
    const { data: existing } = await supabase
      .from(this.tableName)
      .select('*')
      .eq('company_id', companyId)
      .eq('status', 'pending')
      .single();

    if (existing) {
      throw new Error('Ya tienes una asesoría pendiente de realizar.');
    }

    const { data, error } = await supabase
      .from(this.tableName)
      .insert([{ company_id: companyId, status: 'pending' }])
      .select()
      .single();

    if (error) throw new Error(`Error al solicitar asesoría: ${error.message}`);
    return data;
  }

  async findPendingAdmin(): Promise<any[]> {
    const { data, error } = await supabase
      .from(this.tableName)
      .select(`
        *,
        companies:users!company_id (profiles(full_name))
      `)
      .order('created_at', { ascending: false });

    if (error) throw new Error(`Error al obtener solicitudes de asesoría: ${error.message}`);
    return data || [];
  }

  async updateStatus(id: string, status: string): Promise<void> {
    const { error } = await supabase
      .from(this.tableName)
      .update({ status, updated_at: new Date().toISOString() })
      .eq('id', id);

    if (error) throw new Error(`Error al actualizar asesoría: ${error.message}`);
  }
}

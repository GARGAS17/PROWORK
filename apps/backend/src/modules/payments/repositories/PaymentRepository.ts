import { supabase } from '../../../config/supabase';
import { Payment } from '../models/Payment';

export interface IPaymentRepository {
  createPayment(data: Omit<Payment, 'id' | 'created_at' | 'updated_at'>): Promise<Payment>;
  updateStatus(id: string, status: string): Promise<void>;
  findByCompany(companyId: string): Promise<Payment[]>;
  findByFreelancer(freelancerId: string): Promise<Payment[]>;
  findByProject(projectId: string): Promise<Payment[]>;
}

export class SupabasePaymentRepository implements IPaymentRepository {
  private tableName = 'payments';

  async createPayment(data: Omit<Payment, 'id' | 'created_at' | 'updated_at'>): Promise<Payment> {
    const { data: payment, error } = await supabase
      .from(this.tableName)
      .insert([data])
      .select()
      .single();

    if (error) throw new Error(`Error al crear el pago: ${error.message}`);
    return payment;
  }

  async updateStatus(id: string, status: string): Promise<void> {
    const { error } = await supabase
      .from(this.tableName)
      .update({ status, updated_at: new Date().toISOString() })
      .eq('id', id);

    if (error) throw new Error(`Error al actualizar estado del pago: ${error.message}`);
  }

  async findByCompany(companyId: string): Promise<Payment[]> {
    const { data, error } = await supabase
      .from(this.tableName)
      .select(`
        *,
        projects (title),
        freelancers:users!freelancer_id (profiles(full_name))
      `)
      .eq('company_id', companyId)
      .order('created_at', { ascending: false });

    if (error) throw new Error(`Error al obtener pagos de la empresa: ${error.message}`);
    return data || [];
  }

  async findByFreelancer(freelancerId: string): Promise<Payment[]> {
    const { data, error } = await supabase
      .from(this.tableName)
      .select(`
        *,
        projects (title),
        companies:users!company_id (profiles(full_name))
      `)
      .eq('freelancer_id', freelancerId)
      .order('created_at', { ascending: false });

    if (error) throw new Error(`Error al obtener pagos del freelancer: ${error.message}`);
    return data || [];
  }

  async findByProject(projectId: string): Promise<Payment[]> {
    const { data, error } = await supabase
      .from(this.tableName)
      .select('*')
      .eq('project_id', projectId);
    
    if (error) throw new Error(`Error al obtener pagos del proyecto: ${error.message}`);
    return data || [];
  }
}

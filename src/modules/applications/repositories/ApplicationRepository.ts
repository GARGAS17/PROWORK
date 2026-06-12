import { supabase } from '../../../config/supabase';
import { Application } from '../models/Application';

export interface IApplicationRepository {
  create(application: Omit<Application, 'id' | 'created_at' | 'updated_at'>): Promise<Application>;
  findByFreelancer(freelancerId: string): Promise<any[]>;
  selectWinnerTransaction(applicationId: string, projectId: string): Promise<void>;
}

export class SupabaseApplicationRepository implements IApplicationRepository {
  private readonly tableName = 'applications';

  async create(application: Omit<Application, 'id' | 'created_at' | 'updated_at'>): Promise<Application> {
    const { data, error } = await supabase
      .from(this.tableName)
      .insert([application])
      .select()
      .single();

    if (error) {
      if (error.code === '23505') { // Unique violation
        throw new Error('Ya te has postulado a este proyecto.');
      }
      throw new Error(`Error en base de datos al crear postulación: ${error.message}`);
    }
    return data as Application;
  }

  async findByFreelancer(freelancerId: string): Promise<any[]> {
    const { data, error } = await supabase
      .from(this.tableName)
      .select(`
        *,
        projects (
          title,
          status,
          estimated_budget
        )
      `)
      .eq('freelancer_id', freelancerId)
      .order('created_at', { ascending: false });

    if (error) {
      throw new Error(`Error al obtener postulaciones: ${error.message}`);
    }
    return data || [];
  }

  async selectWinnerTransaction(applicationId: string, projectId: string): Promise<void> {
    // Llama al Remote Procedure Call (Función Postgres) para atomicidad garantizada
    const { error } = await supabase.rpc('select_winner', {
      p_application_id: applicationId,
      p_project_id: projectId
    });

    if (error) {
      throw new Error(`Error al ejecutar transacción de selección: ${error.message}`);
    }
  }
}

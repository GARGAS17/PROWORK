import { supabase } from '../../../config/supabase';
import { Deliverable } from '../models/Deliverable';

export interface IDeliverableRepository {
  create(deliverable: Omit<Deliverable, 'id' | 'created_at' | 'updated_at'>): Promise<Deliverable>;
  findByFreelancer(freelancerId: string): Promise<any[]>;
  findByProjectId(projectId: string): Promise<any[]>;
  updateStatus(deliverableId: string, status: string, feedback?: string): Promise<void>;
}

export class SupabaseDeliverableRepository implements IDeliverableRepository {
  private readonly tableName = 'deliverables';

  async create(deliverable: Omit<Deliverable, 'id' | 'created_at' | 'updated_at'>): Promise<Deliverable> {
    const { data, error } = await supabase
      .from(this.tableName)
      .insert([deliverable])
      .select()
      .single();

    if (error) {
      throw new Error(`Error al crear entregable: ${error.message}`);
    }
    return data as Deliverable;
  }

  async findByProjectId(projectId: string): Promise<any[]> {
    const { data, error } = await supabase
      .from(this.tableName)
      .select(`
        *,
        users (
          email,
          profiles ( full_name, avatar_url )
        )
      `)
      .eq('project_id', projectId)
      .order('created_at', { ascending: false });

    if (error) {
      throw new Error(`Error al obtener entregables: ${error.message}`);
    }
    return data || [];
  }

  async updateStatus(id: string, status: string, feedback?: string): Promise<void> {
    const updateData: any = { status };
    if (feedback !== undefined) {
      updateData.feedback = feedback;
    }

    const { error } = await supabase
      .from(this.tableName)
      .update(updateData)
      .eq('id', id);

    if (error) {
      throw new Error(`Error al actualizar el estado del entregable: ${error.message}`);
    }
  }
}

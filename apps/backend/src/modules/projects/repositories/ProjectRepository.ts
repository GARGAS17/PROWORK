import { supabase } from '../../../config/supabase';
import { Project, ProjectStatus } from '../models/Project';

export interface IProjectRepository {
  create(project: Omit<Project, 'id' | 'created_at' | 'updated_at'>): Promise<Project>;
  findPublicFeed(limit: number, offset: number): Promise<Project[]>;
  findByCompanyId(companyId: string): Promise<Project[]>;
  findById(projectId: string): Promise<Project | null>;
  updateStatus(projectId: string, status: ProjectStatus): Promise<void>;
}

export class SupabaseProjectRepository implements IProjectRepository {
  private readonly tableName = 'projects';

  async create(project: Omit<Project, 'id' | 'created_at' | 'updated_at'>): Promise<Project> {
    const { data, error } = await supabase
      .from(this.tableName)
      .insert([project])
      .select()
      .single();

    if (error) {
      throw new Error(`Error al crear el proyecto en BD: ${error.message}`);
    }
    return data as Project;
  }

  async findPublicFeed(limit: number, offset: number): Promise<Project[]> {
    const { data, error } = await supabase
      .from(this.tableName)
      .select('*')
      .eq('status', ProjectStatus.ABIERTO)
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    if (error) {
      throw new Error(`Error al obtener feed: ${error.message}`);
    }
    return data as Project[];
  }

  async findByCompanyId(companyId: string): Promise<Project[]> {
    const { data, error } = await supabase
      .from(this.tableName)
      .select('*')
      .eq('company_id', companyId)
      .order('created_at', { ascending: false });

    if (error) {
      throw new Error(`Error al obtener proyectos de la empresa: ${error.message}`);
    }
    return data as Project[];
  }

  async findById(projectId: string): Promise<Project | null> {
    const { data, error } = await supabase
      .from(this.tableName)
      .select('*')
      .eq('id', projectId)
      .single();
    if (error) return null;
    return data as Project;
  }

  async updateStatus(projectId: string, status: ProjectStatus): Promise<void> {
    const { error } = await supabase
      .from(this.tableName)
      .update({ status })
      .eq('id', projectId);

    if (error) {
      throw new Error(`Error al actualizar estado del proyecto: ${error.message}`);
    }
  }
}

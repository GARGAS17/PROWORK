import { supabase } from '../../../config/supabase';
import { Profile } from '../models/Profile';

export interface IProfileRepository {
  findById(id: string): Promise<Profile | null>;
  upsert(profile: Partial<Profile> & { id: string }): Promise<Profile>;
}

export class SupabaseProfileRepository implements IProfileRepository {
  private readonly tableName = 'profiles';

  async findById(id: string): Promise<Profile | null> {
    const { data, error } = await supabase
      .from(this.tableName)
      .select('*')
      .eq('id', id)
      .single();

    if (error && error.code !== 'PGRST116') { // PGRST116 = no rows found
      throw new Error(`Error al obtener perfil: ${error.message}`);
    }
    
    return data as Profile | null;
  }

  async upsert(profile: Partial<Profile> & { id: string }): Promise<Profile> {
    const { data, error } = await supabase
      .from(this.tableName)
      .upsert(profile, { onConflict: 'id' })
      .select()
      .single();

    if (error) {
      throw new Error(`Error al guardar perfil: ${error.message}`);
    }

    return data as Profile;
  }
}

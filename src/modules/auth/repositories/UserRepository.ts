import { supabase } from '../../../config/supabase';
import { User } from '../models/User';

export interface IUserRepository {
  findByEmail(email: string): Promise<User | null>;
  create(user: User): Promise<User>;
}

export class SupabaseUserRepository implements IUserRepository {
  private readonly tableName = 'users';

  async findByEmail(email: string): Promise<User | null> {
    const { data, error } = await supabase
      .from(this.tableName)
      .select('*')
      .eq('email', email)
      .single();

    if (error && error.code !== 'PGRST116') { // PGRST116 = No rows found
      throw new Error(`Error en la base de datos al buscar usuario: ${error.message}`);
    }

    return data ? (data as User) : null;
  }

  async create(user: User): Promise<User> {
    const { data, error } = await supabase
      .from(this.tableName)
      .insert([
        {
          email: user.email,
          password_hash: user.password_hash,
          role: user.role,
        },
      ])
      .select()
      .single();

    if (error) {
      throw new Error(`Error en la base de datos al crear usuario: ${error.message}`);
    }

    return data as User;
  }
}

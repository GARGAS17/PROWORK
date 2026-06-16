import { supabase } from '../../../config/supabase';

export interface ISkillRepository {
  findSkillsByProfile(profileId: string): Promise<string[]>;
  updateProfileSkills(profileId: string, skills: string[]): Promise<void>;
}

export class SupabaseSkillRepository implements ISkillRepository {
  async findSkillsByProfile(profileId: string): Promise<string[]> {
    const { data, error } = await supabase
      .from('freelancer_skills')
      .select(`
        skills (
          name
        )
      `)
      .eq('profile_id', profileId);

    if (error) throw new Error(`Error al cargar habilidades: ${error.message}`);
    
    // Extract names from the joined result
    return (data || []).map((row: any) => row.skills.name);
  }

  async updateProfileSkills(profileId: string, skills: string[]): Promise<void> {
    // 1. Get or create skills in the `skills` table to get their IDs
    const skillIds: string[] = [];
    
    for (const skillName of skills) {
      // Intentar insertar la habilidad (si existe, falla por UNIQUE constraint y hacemos select)
      let { data: skillData, error: insertError } = await supabase
        .from('skills')
        .insert({ name: skillName, category: 'General' })
        .select('id')
        .single();
        
      if (insertError && insertError.code === '23505') {
        // Ya existe, la buscamos
        const { data: existingSkill } = await supabase
          .from('skills')
          .select('id')
          .eq('name', skillName)
          .single();
        if (existingSkill) skillIds.push(existingSkill.id);
      } else if (skillData) {
        skillIds.push(skillData.id);
      }
    }

    // 2. Clear old skills for this profile
    await supabase.from('freelancer_skills').delete().eq('profile_id', profileId);

    // 3. Insert new skills
    if (skillIds.length > 0) {
      const pivots = skillIds.map(skillId => ({
        profile_id: profileId,
        skill_id: skillId
      }));
      
      const { error: pivotError } = await supabase.from('freelancer_skills').insert(pivots);
      if (pivotError) throw new Error(`Error al asociar habilidades: ${pivotError.message}`);
    }
  }
}

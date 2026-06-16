import { IProfileRepository } from '../repositories/ProfileRepository';
import { ISkillRepository } from '../repositories/SkillRepository';

export class ProfileService {
  constructor(
    private readonly profileRepository: IProfileRepository,
    private readonly skillRepository: ISkillRepository
  ) {}

  async obtenerMiPerfil(userId: string): Promise<any> {
    const profile = await this.profileRepository.findById(userId);
    const skills = await this.skillRepository.findSkillsByProfile(userId);

    if (!profile) {
      // Retornamos un perfil vacío por defecto si aún no lo ha creado
      return {
        id: userId,
        full_name: '',
        bio: '',
        avatar_url: '',
        hourly_rate: 0,
        skills: []
      };
    }

    return { ...profile, skills };
  }

  async actualizarMiPerfil(
    userId: string,
    data: { full_name: string; bio?: string; avatar_url?: string; hourly_rate?: number; skills?: string[] }
  ): Promise<any> {
    // 1. Guardar datos principales del perfil
    const updatedProfile = await this.profileRepository.upsert({
      id: userId,
      full_name: data.full_name,
      bio: data.bio,
      avatar_url: data.avatar_url,
      hourly_rate: data.hourly_rate
    });

    // 2. Sincronizar habilidades si se proporcionaron
    if (data.skills) {
      await this.skillRepository.updateProfileSkills(userId, data.skills);
    }

    // 3. Retornar el perfil consolidado
    const updatedSkills = await this.skillRepository.findSkillsByProfile(userId);
    return { ...updatedProfile, skills: updatedSkills };
  }

  async actualizarAvatar(userId: string, avatarUrl: string): Promise<any> {
    const existingProfile = await this.profileRepository.findById(userId);
    
    // Si no existe, usamos valores por defecto
    const profile = await this.profileRepository.upsert({
      id: userId,
      full_name: existingProfile?.full_name || 'Usuario',
      bio: existingProfile?.bio,
      hourly_rate: existingProfile?.hourly_rate,
      avatar_url: avatarUrl
    });

    const skills = await this.skillRepository.findSkillsByProfile(userId);
    return { ...profile, skills };
  }
}

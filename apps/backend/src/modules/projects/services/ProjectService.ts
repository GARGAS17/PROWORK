import { IProjectRepository } from '../repositories/ProjectRepository';
import { Project, ProjectStatus } from '../models/Project';

export class ProjectService {
  constructor(private readonly projectRepository: IProjectRepository) {}

  async crearProyecto(
    companyId: string,
    title: string,
    description: string,
    estimatedBudget: number,
    technologies: string[]
  ): Promise<Project> {
    // Forzamos el estado a ABIERTO inicialmente
    const newProject = {
      company_id: companyId,
      title,
      description,
      estimated_budget: estimatedBudget,
      technologies,
      status: ProjectStatus.ABIERTO,
    };

    return await this.projectRepository.create(newProject);
  }

  async obtenerMuroPublico(page: number, limit: number): Promise<Project[]> {
    const offset = (page - 1) * limit;
    return await this.projectRepository.findPublicFeed(limit, offset);
  }

  async obtenerProyectosPorEmpresa(companyId: string): Promise<Project[]> {
    return await this.projectRepository.findByCompanyId(companyId);
  }
}

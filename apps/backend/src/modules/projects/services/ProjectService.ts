import { IProjectRepository } from '../repositories/ProjectRepository';
import { Project, ProjectStatus } from '../models/Project';

export class ProjectService {
  constructor(private readonly projectRepository: IProjectRepository) {}

  async crearProyecto(
    companyId: string,
    title: string,
    description: string,
    estimatedBudget: number,
    currency: string,
    technologies: string[]
  ): Promise<Project> {
    // Forzamos el estado a ABIERTO inicialmente
    const newProject = {
      company_id: companyId,
      title,
      description,
      estimated_budget: estimatedBudget,
      currency,
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

  async obtenerProyecto(projectId: string): Promise<Project | null> {
    return await this.projectRepository.findById(projectId);
  }

  async finalizarProyecto(companyId: string, projectId: string): Promise<void> {
    const project = await this.projectRepository.findById(projectId);
    if (!project) throw new Error('Proyecto no encontrado');
    if (project.company_id !== companyId) throw new Error('No tienes permiso para modificar este proyecto');

    await this.projectRepository.updateStatus(projectId, ProjectStatus.CERRADO);
  }
}

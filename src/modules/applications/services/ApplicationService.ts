import { IApplicationRepository } from '../repositories/ApplicationRepository';
import { Application, ApplicationStatus } from '../models/Application';

export class ApplicationService {
  constructor(private readonly applicationRepository: IApplicationRepository) {}

  async aplicarAProyecto(
    freelancerId: string,
    projectId: string,
    resumePdfUrl: string,
    proposalText: string
  ): Promise<Application> {
    const newApplication = {
      project_id: projectId,
      freelancer_id: freelancerId,
      resume_pdf_url: resumePdfUrl,
      proposal_text: proposalText,
      status: ApplicationStatus.PENDIENTE,
    };

    return await this.applicationRepository.create(newApplication);
  }

  async obtenerMisPostulaciones(freelancerId: string): Promise<any[]> {
    return await this.applicationRepository.findByFreelancer(freelancerId);
  }

  async seleccionarGanador(applicationId: string, projectId: string): Promise<void> {
    // Aquí el servicio orquesta la transacción llamando al repositorio
    await this.applicationRepository.selectWinnerTransaction(applicationId, projectId);
  }
}

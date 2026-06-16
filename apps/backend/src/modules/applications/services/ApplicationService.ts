import { IApplicationRepository } from '../repositories/ApplicationRepository';
import { Application, ApplicationStatus } from '../models/Application';

export class ApplicationService {
  constructor(private readonly applicationRepository: IApplicationRepository) {}

  async aplicarAProyecto(
    freelancerId: string,
    projectId: string,
    resumePdfUrl: string,
    proposalText: string,
    bidAmount: number
  ): Promise<Application> {
    const newApplication = {
      project_id: projectId,
      freelancer_id: freelancerId,
      resume_pdf_url: resumePdfUrl,
      proposal_text: proposalText,
      bid_amount: bidAmount,
      status: ApplicationStatus.PENDIENTE,
    };

    return await this.applicationRepository.create(newApplication);
  }

  async obtenerMisPostulaciones(freelancerId: string): Promise<any[]> {
    return await this.applicationRepository.findByFreelancer(freelancerId);
  }

  async obtenerPostulacion(applicationId: string): Promise<any> {
    return await this.applicationRepository.findById(applicationId);
  }

  async obtenerPostulantesPorProyecto(_companyId: string, projectId: string): Promise<any[]> {
    // Idealmente aquí verificaríamos que el projectId pertenece al companyId
    return await this.applicationRepository.findByProjectId(projectId);
  }

  async seleccionarGanador(applicationId: string, projectId: string): Promise<void> {
    // Aquí el servicio orquesta la transacción llamando al repositorio
    await this.applicationRepository.selectWinnerTransaction(applicationId, projectId);
  }

  async solicitarContratacion(_companyId: string, applicationId: string): Promise<void> {
    // Idealmente verificaríamos que la postulación pertenece a un proyecto de esta company
    await this.applicationRepository.updateStatus(applicationId, 'pending_contract');
  }
}

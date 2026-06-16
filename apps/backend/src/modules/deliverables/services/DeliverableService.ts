import { IDeliverableRepository } from '../repositories/DeliverableRepository';
import { Deliverable, DeliverableStatus } from '../models/Deliverable';

export class DeliverableService {
  constructor(private readonly deliverableRepository: IDeliverableRepository) {}

  async crearEntregable(
    projectId: string,
    freelancerId: string,
    fileUrl: string,
    message: string
  ): Promise<Deliverable> {
    
    // Verificamos si el freelancer está contratado en este proyecto
    // (Podríamos consultar a la tabla de aplicaciones para ver si está en 'accepted',
    // pero por ahora confiaremos en la verificación del controlador)

    return await this.deliverableRepository.create({
      project_id: projectId,
      freelancer_id: freelancerId,
      file_url: fileUrl,
      message,
      status: DeliverableStatus.PENDING_REVIEW
    });
  }

  async obtenerEntregables(projectId: string): Promise<any[]> {
    return await this.deliverableRepository.findByProjectId(projectId);
  }

  async revisarEntregable(
    deliverableId: string,
    status: DeliverableStatus,
    _companyId: string,
    feedback?: string
  ): Promise<void> {
    // Aquí verificaríamos que el proyecto le pertenece a companyId (Empresa)
    await this.deliverableRepository.updateStatus(deliverableId, status, feedback);
    
    if (status === DeliverableStatus.APPROVED) {
      // Si se aprueba el entregable final, idealmente se marca el proyecto como completado
      // y se libera el pago. Por ahora, solo actualizamos el entregable.
    }
  }
}

import { IConsultingRepository } from '../repositories/ConsultingRepository';
import { ConsultingRequest } from '../models/ConsultingRequest';

export class ConsultingService {
  constructor(private consultingRepository: IConsultingRepository) {}

  async requestConsulting(companyId: string): Promise<ConsultingRequest> {
    return await this.consultingRepository.createRequest(companyId);
  }

  async getAdminRequests(): Promise<any[]> {
    return await this.consultingRepository.findPendingAdmin();
  }

  async markAsCompleted(id: string): Promise<void> {
    await this.consultingRepository.updateStatus(id, 'completed');
  }
}

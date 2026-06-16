import { IPaymentRepository } from '../repositories/PaymentRepository';
import { Payment } from '../models/Payment';

export class PaymentService {
  constructor(private readonly paymentRepository: IPaymentRepository) {}

  async fundEscrow(projectId: string, companyId: string, freelancerId: string, amount: number, description?: string): Promise<Payment> {
    // Al contratar, la empresa sube los fondos a Prowork
    return await this.paymentRepository.createPayment({
      project_id: projectId,
      company_id: companyId,
      freelancer_id: freelancerId,
      amount,
      status: 'escrow',
      description: description || 'Fondos en garantía (Escrow) para el proyecto'
    });
  }

  async releaseFunds(projectId: string): Promise<void> {
    // Buscar el pago en escrow para este proyecto
    const payments = await this.paymentRepository.findByProject(projectId);
    const escrowPayment = payments.find(p => p.status === 'escrow');
    
    if (!escrowPayment) {
      throw new Error('No se encontró un pago en garantía para este proyecto');
    }

    // Liberar fondos
    await this.paymentRepository.updateStatus(escrowPayment.id, 'released');
  }

  async getCompanyPayments(companyId: string): Promise<any[]> {
    return await this.paymentRepository.findByCompany(companyId);
  }

  async getFreelancerPayments(freelancerId: string): Promise<any[]> {
    return await this.paymentRepository.findByFreelancer(freelancerId);
  }
}

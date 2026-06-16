import { Request, Response } from 'express';
import { PaymentService } from '../services/PaymentService';
import { UserRole } from '../../auth/models/User';

export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}

  obtenerMisPagos = async (req: Request, res: Response): Promise<void> => {
    try {
      const user = req.user!;
      let payments = [];

      if (user.role === UserRole.EMPRESA) {
        payments = await this.paymentService.getCompanyPayments(user.id);
      } else if (user.role === UserRole.FREELANCER) {
        payments = await this.paymentService.getFreelancerPayments(user.id);
      }

      res.status(200).json({ data: payments });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  };

  obtenerPagosPendientes = async (_req: Request, res: Response): Promise<void> => {
    try {
      const payments = await this.paymentService.getPendingAdminPayments();
      res.status(200).json({ data: payments });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  };

  aprobarDesembolso = async (req: Request, res: Response): Promise<void> => {
    try {
      const { paymentId } = req.params;
      // Porcentaje fijo por ahora, se podría pasar desde req.body si se quiere editar
      const commissionPercent = 10; 

      await this.paymentService.releaseAdminPayment(paymentId, commissionPercent);
      res.status(200).json({ message: 'Pago desembolsado exitosamente' });
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  };

  obtenerEstadisticasAdmin = async (_req: Request, res: Response): Promise<void> => {
    try {
      const stats = await this.paymentService.getAdminStats();
      res.status(200).json({ data: stats });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  };
}

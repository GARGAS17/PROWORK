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
}

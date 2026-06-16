import { Router } from 'express';
import { PaymentController } from './controllers/PaymentController';
import { PaymentService } from './services/PaymentService';
import { SupabasePaymentRepository } from './repositories/PaymentRepository';
import { requireAuth } from '../../middlewares/authMiddleware';

const router = Router();

const paymentRepository = new SupabasePaymentRepository();
const paymentService = new PaymentService(paymentRepository);
const paymentController = new PaymentController(paymentService);

// Obtener la billetera del usuario (Empresa o Freelancer)
router.get(
  '/mis-pagos',
  requireAuth,
  paymentController.obtenerMisPagos
);

export default router;

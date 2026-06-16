import { Router } from 'express';
import { PaymentController } from './controllers/PaymentController';
import { PaymentService } from './services/PaymentService';
import { SupabasePaymentRepository } from './repositories/PaymentRepository';
import { requireAuth, requireRole } from '../../middlewares/authMiddleware';
import { UserRole } from '../auth/models/User';

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

// ==========================================
// RUTAS DE ADMINISTRADOR
// ==========================================
router.get(
  '/pendientes',
  requireAuth,
  requireRole([UserRole.ADMIN]),
  paymentController.obtenerPagosPendientes
);

router.get(
  '/stats',
  requireAuth,
  requireRole([UserRole.ADMIN]),
  paymentController.obtenerEstadisticasAdmin
);

router.post(
  '/:paymentId/release',
  requireAuth,
  requireRole([UserRole.ADMIN]),
  paymentController.aprobarDesembolso
);

export default router;

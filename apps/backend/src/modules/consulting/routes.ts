import { Router } from 'express';
import { requireAuth, requireRole } from '../../middlewares/authMiddleware';
import { UserRole } from '../auth/models/User';
import { SupabaseConsultingRepository } from './repositories/ConsultingRepository';
import { ConsultingService } from './services/ConsultingService';
import { ConsultingController } from './controllers/ConsultingController';

const router = Router();

const consultingRepository = new SupabaseConsultingRepository();
const consultingService = new ConsultingService(consultingRepository);
const consultingController = new ConsultingController(consultingService);

// ==========================================
// RUTAS DE EMPRESA
// ==========================================
router.post(
  '/request',
  requireAuth,
  requireRole([UserRole.EMPRESA]),
  consultingController.solicitarAsesoria
);

// ==========================================
// RUTAS DE ADMINISTRADOR
// ==========================================
router.get(
  '/admin/pending',
  requireAuth,
  requireRole([UserRole.ADMIN]),
  consultingController.obtenerPendientes
);

router.post(
  '/admin/:id/complete',
  requireAuth,
  requireRole([UserRole.ADMIN]),
  consultingController.marcarCompletada
);

export default router;

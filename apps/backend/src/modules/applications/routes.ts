import { Router } from 'express';
import { ApplicationController } from './controllers/ApplicationController';
import { ApplicationService } from './services/ApplicationService';
import { SupabaseApplicationRepository } from './repositories/ApplicationRepository';
import { PaymentService } from '../payments/services/PaymentService';
import { SupabasePaymentRepository } from '../payments/repositories/PaymentRepository';
import { requireAuth, requireRole } from '../../middlewares/authMiddleware';
import { UserRole } from '../auth/models/User';

const router = Router();

const applicationRepository = new SupabaseApplicationRepository();
const applicationService = new ApplicationService(applicationRepository);

const paymentRepository = new SupabasePaymentRepository();
const paymentService = new PaymentService(paymentRepository);

const applicationController = new ApplicationController(applicationService, paymentService);

// Todas las rutas de postulaciones requieren estar autenticado
router.use(requireAuth);

// ==========================================
// RUTAS PARA FREELANCERS
// ==========================================
// Aplicar a un proyecto
router.post(
  '/',
  requireRole([UserRole.FREELANCER]),
  applicationController.aplicar
);

// Ver el historial de postulaciones propias
router.get(
  '/mis-postulaciones',
  requireRole([UserRole.FREELANCER]),
  applicationController.obtenerMisPostulaciones
);

// ==========================================
// RUTAS PARA EMPRESAS
// ==========================================
// Ver postulantes de un proyecto específico
router.get(
  '/proyecto/:projectId',
  requireRole([UserRole.EMPRESA]),
  applicationController.obtenerPostulantesPorProyecto
);

// Solicitar contratación
router.put(
  '/:applicationId/request-contract',
  requireRole([UserRole.EMPRESA]),
  applicationController.solicitarContratacion
);

// ==========================================
// RUTAS DE ADMINISTRADOR (CURADURÍA)
// ==========================================
// Seleccionar ganador
router.post(
  '/seleccionar-ganador',
  requireRole([UserRole.ADMIN]), // Protección crítica: Solo admin puede ejecutar esto
  applicationController.seleccionarGanador
);

export default router;

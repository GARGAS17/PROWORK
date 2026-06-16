import { Router } from 'express';
import { ProjectController } from './controllers/ProjectController';
import { ProjectService } from './services/ProjectService';
import { SupabaseProjectRepository } from './repositories/ProjectRepository';
import { PaymentService } from '../payments/services/PaymentService';
import { SupabasePaymentRepository } from '../payments/repositories/PaymentRepository';
import { requireAuth, requireRole } from '../../middlewares/authMiddleware';
import { UserRole } from '../auth/models/User';

const router = Router();

const projectRepository = new SupabaseProjectRepository();
const projectService = new ProjectService(projectRepository);

const paymentRepository = new SupabasePaymentRepository();
const paymentService = new PaymentService(paymentRepository);

const projectController = new ProjectController(projectService, paymentService);

// Rutas base (para visitantes o Freelancers)
router.get('/feed', projectController.obtenerMuroPublico);

// ==========================================
// RUTAS PROTEGIDAS (Solo Empresas)
// ==========================================
// Crear proyecto
router.post(
  '/',
  requireAuth,
  requireRole([UserRole.EMPRESA]),
  projectController.crearProyecto
);

// Obtener los proyectos publicados por la empresa autenticada
router.get(
  '/mis-proyectos',
  requireAuth,
  requireRole([UserRole.EMPRESA]),
  projectController.obtenerMisProyectos
);

// Finalizar proyecto
router.put(
  '/:id/finalizar',
  requireAuth,
  requireRole([UserRole.EMPRESA]),
  projectController.finalizarProyecto
);

// Obtener info del proyecto (Debe ir al final para no hacer conflicto con otras rutas)
router.get('/:id', projectController.obtenerProyecto);

export default router;

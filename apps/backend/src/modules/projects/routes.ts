import { Router } from 'express';
import { ProjectController } from './controllers/ProjectController';
import { ProjectService } from './services/ProjectService';
import { SupabaseProjectRepository } from './repositories/ProjectRepository';
import { requireAuth, requireRole } from '../../middlewares/authMiddleware';
import { UserRole } from '../auth/models/User';

const router = Router();

const projectRepository = new SupabaseProjectRepository();
const projectService = new ProjectService(projectRepository);
const projectController = new ProjectController(projectService);

// Todas las rutas de proyectos requieren autenticación mínima
router.use(requireAuth);

// Rutas exclusivas para Empresas
router.post(
  '/',
  requireRole([UserRole.EMPRESA]),
  projectController.crearProyecto
);

router.get(
  '/mis-proyectos',
  requireRole([UserRole.EMPRESA]),
  projectController.obtenerMisProyectos
);

// Rutas para Freelancers (Muro Público)
router.get(
  '/feed',
  requireRole([UserRole.FREELANCER, UserRole.ADMIN]), // Permitir admin también para monitoreo
  projectController.obtenerMuroPublico
);

export default router;

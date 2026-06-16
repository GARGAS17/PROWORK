import { Router } from 'express';
import multer from 'multer';
import { DeliverableController } from './controllers/DeliverableController';
import { DeliverableService } from './services/DeliverableService';
import { SupabaseDeliverableRepository } from './repositories/DeliverableRepository';
import { requireAuth, requireRole } from '../../middlewares/authMiddleware';
import { UserRole } from '../auth/models/User';

const router = Router();

// Configuración de multer (memoria) para subir archivos
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 50 * 1024 * 1024 }, // 50MB max (puede ser un zip pesado)
});

const repository = new SupabaseDeliverableRepository();
const service = new DeliverableService(repository);
const controller = new DeliverableController(service);

router.use(requireAuth);

// ==========================================
// RUTAS FREELANCER
// ==========================================
// Subir un entregable
router.post(
  '/',
  requireRole([UserRole.FREELANCER]),
  upload.single('file'), // 'file' es el nombre del campo en el FormData
  controller.subirEntregable
);

// ==========================================
// RUTAS EMPRESA
// ==========================================
// Ver entregables de un proyecto
router.get(
  '/proyecto/:projectId',
  requireRole([UserRole.EMPRESA, UserRole.FREELANCER]), // Ambos pueden verlos
  controller.obtenerEntregables
);

// Aprobar o rechazar un entregable
router.put(
  '/:deliverableId/review',
  requireRole([UserRole.EMPRESA]),
  controller.revisarEntregable
);

export default router;

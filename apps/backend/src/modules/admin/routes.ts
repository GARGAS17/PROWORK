import { Router } from 'express';
import { AdminController } from './controllers/AdminController';
import { requireAuth, requireRole } from '../../middlewares/authMiddleware';
import { UserRole } from '../auth/models/User';

const router = Router();
const adminController = new AdminController();

// Proteger todas las rutas de este módulo solo para el rol ADMIN
router.use(requireAuth);
router.use(requireRole([UserRole.ADMIN]));

router.get('/match-requests', adminController.obtenerSolicitudesDeEmparejamiento);
router.post('/match', adminController.ejecutarEmparejamiento);

export default router;

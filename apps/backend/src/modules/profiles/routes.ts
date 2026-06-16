import { Router } from 'express';
import multer from 'multer';
import { ProfileController } from './controllers/ProfileController';
import { ProfileService } from './services/ProfileService';
import { SupabaseProfileRepository } from './repositories/ProfileRepository';
import { SupabaseSkillRepository } from './repositories/SkillRepository';
import { requireAuth } from '../../middlewares/authMiddleware';

const router = Router();

// Configurar multer para almacenar en memoria
const upload = multer({ 
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 } // límite 5MB
});

const profileRepository = new SupabaseProfileRepository();
const skillRepository = new SupabaseSkillRepository();
const profileService = new ProfileService(profileRepository, skillRepository);
const profileController = new ProfileController(profileService);

// Todas las rutas de perfil requieren estar autenticado
router.use(requireAuth);

router.get('/me', profileController.obtenerMiPerfil);
router.put('/me', profileController.actualizarMiPerfil);
router.post('/avatar', upload.single('avatar'), profileController.subirAvatar);

export default router;

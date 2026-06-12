import { Router } from 'express';
import { AuthController } from './controllers/AuthController';
import { AuthService } from './services/AuthService';
import { SupabaseUserRepository } from './repositories/UserRepository';

const router = Router();

// Inyección de dependencias manual según Clean Architecture
const userRepository = new SupabaseUserRepository();
const authService = new AuthService(userRepository);
const authController = new AuthController(authService);

router.post('/register', authController.registrarUsuario);
router.post('/login', authController.iniciarSesion);

export default router;

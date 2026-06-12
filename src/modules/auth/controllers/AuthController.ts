import { Request, Response } from 'express';
import { z } from 'zod';
import { AuthService } from '../services/AuthService';
import { UserRole } from '../models/User';

// Esquemas de validación con Zod
const registerSchema = z.object({
  email: z.string().email('Debe ser un correo electrónico válido.'),
  password: z.string().min(8, 'La contraseña debe tener al menos 8 caracteres.'),
  role: z.nativeEnum(UserRole, {
    errorMap: () => ({ message: 'El rol debe ser empresa, freelancer o admin.' })
  }),
});

const loginSchema = z.object({
  email: z.string().email('Debe ser un correo electrónico válido.'),
  password: z.string().min(1, 'La contraseña es requerida.'),
});

export class AuthController {
  constructor(private readonly authService: AuthService) {}

  registrarUsuario = async (req: Request, res: Response): Promise<void> => {
    try {
      // 1. Validación estricta de entrada
      const validatedData = registerSchema.parse(req.body);

      // 2. Lógica de negocio
      const result = await this.authService.registrarUsuario(
        validatedData.email,
        validatedData.password,
        validatedData.role
      );

      // 3. Respuesta
      res.status(201).json({
        message: 'Usuario registrado exitosamente.',
        data: result,
      });
    } catch (error: any) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ errors: error.errors });
        return;
      }
      res.status(400).json({ error: error.message });
    }
  };

  iniciarSesion = async (req: Request, res: Response): Promise<void> => {
    try {
      // 1. Validación estricta de entrada
      const validatedData = loginSchema.parse(req.body);

      // 2. Lógica de negocio
      const result = await this.authService.iniciarSesion(
        validatedData.email,
        validatedData.password
      );

      // 3. Respuesta
      res.status(200).json({
        message: 'Inicio de sesión exitoso.',
        data: result,
      });
    } catch (error: any) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ errors: error.errors });
        return;
      }
      res.status(401).json({ error: error.message });
    }
  };
}

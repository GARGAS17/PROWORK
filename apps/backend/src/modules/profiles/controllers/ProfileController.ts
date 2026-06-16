import { Request, Response } from 'express';
import { z } from 'zod';
import { ProfileService } from '../services/ProfileService';
import { supabase } from '../../../config/supabase';

const updateProfileSchema = z.object({
  full_name: z.string().min(2, 'El nombre debe tener al menos 2 caracteres.'),
  bio: z.string().optional(),
  avatar_url: z.string().url('Debe ser una URL válida.').optional().or(z.literal('')),
  hourly_rate: z.number().min(0, 'La tarifa no puede ser negativa.').optional(),
  skills: z.array(z.string()).optional()
});

export class ProfileController {
  constructor(private readonly profileService: ProfileService) {}

  obtenerMiPerfil = async (req: Request, res: Response): Promise<void> => {
    try {
      const userId = req.user!.id; // Extraído del JWT
      const profile = await this.profileService.obtenerMiPerfil(userId);
      res.status(200).json({ data: profile });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  };

  actualizarMiPerfil = async (req: Request, res: Response): Promise<void> => {
    try {
      const userId = req.user!.id;
      const validatedData = updateProfileSchema.parse(req.body);

      // Limpiar URL vacía para avatar_url si viene vacía
      if (validatedData.avatar_url === '') {
        validatedData.avatar_url = undefined;
      }

      const updatedProfile = await this.profileService.actualizarMiPerfil(userId, validatedData);
      
      res.status(200).json({
        message: 'Perfil actualizado exitosamente',
        data: updatedProfile
      });
    } catch (error: any) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ errors: error.format() });
        return;
      }
      res.status(400).json({ error: error.message });
    }
  };

  subirAvatar = async (req: Request, res: Response): Promise<void> => {
    try {
      const userId = req.user!.id;
      const file = req.file;

      if (!file) {
        res.status(400).json({ error: 'No se recibió ningún archivo de imagen' });
        return;
      }

      // Validar tipo de archivo
      if (!file.mimetype.startsWith('image/')) {
        res.status(400).json({ error: 'El archivo debe ser una imagen' });
        return;
      }

      // Supabase storage bucket name es 'avatars'
      const ext = file.originalname.split('.').pop();
      const fileName = `${userId}-${Date.now()}.${ext}`;

      // Usamos el cliente supabase para subir el buffer a Storage
      // Como estamos en el backend usando service_role, no saltarán problemas de RLS de subida
      const { data, error } = await supabase.storage
        .from('avatars')
        .upload(fileName, file.buffer, {
          contentType: file.mimetype,
          upsert: true
        });

      if (error) {
        throw new Error(`Error subiendo a Supabase Storage: ${error.message}`);
      }

      // Obtener la URL pública
      const { data: publicData } = supabase.storage
        .from('avatars')
        .getPublicUrl(data.path);

      const avatarUrl = publicData.publicUrl;

      // Actualizar el perfil en la base de datos con la nueva URL
      await this.profileService.actualizarAvatar(userId, avatarUrl);

      res.status(200).json({
        message: 'Avatar actualizado exitosamente',
        data: { avatar_url: avatarUrl }
      });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  };
}

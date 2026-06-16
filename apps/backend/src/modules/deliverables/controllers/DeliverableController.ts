import { Request, Response } from 'express';
import { z } from 'zod';
import { DeliverableService } from '../services/DeliverableService';
import { DeliverableStatus } from '../models/Deliverable';
import { supabase } from '../../../config/supabase';
import crypto from 'crypto';

const reviewDeliverableSchema = z.object({
  status: z.nativeEnum(DeliverableStatus),
  feedback: z.string().optional()
});

export class DeliverableController {
  constructor(private readonly deliverableService: DeliverableService) {}

  subirEntregable = async (req: Request, res: Response): Promise<void> => {
    try {
      const freelancerId = req.user!.id;
      const projectId = req.body.project_id;
      const message = req.body.message || '';

      if (!projectId) {
        res.status(400).json({ error: 'Falta project_id' });
        return;
      }

      if (!req.file) {
        res.status(400).json({ error: 'Debes subir un archivo entregable.' });
        return;
      }

      const file = req.file;
      const fileExt = file.originalname.split('.').pop();
      const fileName = `${projectId}/${freelancerId}-${crypto.randomUUID()}.${fileExt}`;

      // Subir archivo al bucket 'deliverables'
      const { data, error } = await supabase.storage
        .from('deliverables')
        .upload(fileName, file.buffer, {
          contentType: file.mimetype,
          upsert: true
        });

      if (error) {
        throw new Error(`Error al subir archivo: ${error.message}`);
      }

      // Obtener URL pública
      const { data: publicData } = supabase.storage
        .from('deliverables')
        .getPublicUrl(data.path);

      // Crear el registro en la base de datos
      const deliverable = await this.deliverableService.crearEntregable(
        projectId,
        freelancerId,
        publicData.publicUrl,
        message
      );

      res.status(201).json({
        message: 'Entregable subido exitosamente.',
        data: deliverable
      });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  };

  obtenerEntregables = async (req: Request, res: Response): Promise<void> => {
    try {
      const projectId = req.params.projectId;
      const deliverables = await this.deliverableService.obtenerEntregables(projectId);
      res.status(200).json({ data: deliverables });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  };

  revisarEntregable = async (req: Request, res: Response): Promise<void> => {
    try {
      const companyId = req.user!.id;
      const deliverableId = req.params.deliverableId;
      const validatedData = reviewDeliverableSchema.parse(req.body);

      await this.deliverableService.revisarEntregable(
        deliverableId,
        validatedData.status,
        companyId,
        validatedData.feedback
      );

      res.status(200).json({
        message: 'Estado del entregable actualizado.'
      });
    } catch (error: any) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ errors: error.format() });
        return;
      }
      res.status(400).json({ error: error.message });
    }
  };
}

import { Request, Response } from 'express';
import { z } from 'zod';
import { ApplicationService } from '../services/ApplicationService';

import { PaymentService } from '../../payments/services/PaymentService';

const createApplicationSchema = z.object({
  project_id: z.string().uuid('Debe ser un UUID válido.'),
  resume_pdf_url: z.string().url('Debe ser una URL válida hacia el PDF.'),
  proposal_text: z.string().min(50, 'La propuesta debe tener al menos 50 caracteres para ser considerada.'),
  bid_amount: z.number().positive('La oferta económica debe ser un valor positivo.'),
});

const selectWinnerSchema = z.object({
  application_id: z.string().uuid('El ID de postulación debe ser UUID.'),
  project_id: z.string().uuid('El ID de proyecto debe ser UUID.'),
});

export class ApplicationController {
  constructor(
    private readonly applicationService: ApplicationService,
    private readonly paymentService: PaymentService
  ) {}

  aplicar = async (req: Request, res: Response): Promise<void> => {
    try {
      const freelancerId = req.user!.id; // Seguridad estricta: Extraído del token
      const validatedData = createApplicationSchema.parse(req.body);

      const application = await this.applicationService.aplicarAProyecto(
        freelancerId,
        validatedData.project_id,
        validatedData.resume_pdf_url,
        validatedData.proposal_text,
        validatedData.bid_amount
      );

      res.status(201).json({
        message: 'Postulación enviada exitosamente.',
        data: application,
      });
    } catch (error: any) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ errors: error.format() });
        return;
      }
      res.status(400).json({ error: error.message });
    }
  };

  obtenerMisPostulaciones = async (req: Request, res: Response): Promise<void> => {
    try {
      const freelancerId = req.user!.id; // Aislamiento: El freelancer solo ve las suyas
      const applications = await this.applicationService.obtenerMisPostulaciones(freelancerId);

      res.status(200).json({
        data: applications,
        count: applications.length
      });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  };

  obtenerPostulantesPorProyecto = async (req: Request, res: Response): Promise<void> => {
    try {
      const companyId = req.user!.id; 
      const projectId = req.params.projectId;

      const applications = await this.applicationService.obtenerPostulantesPorProyecto(companyId, projectId);

      res.status(200).json({
        data: applications,
        count: applications.length
      });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  };

  seleccionarGanador = async (req: Request, res: Response): Promise<void> => {
    try {
      const validatedData = selectWinnerSchema.parse(req.body);

      await this.applicationService.seleccionarGanador(
        validatedData.application_id,
        validatedData.project_id
      );

      res.status(200).json({
        message: 'Ganador seleccionado correctamente. Las demás postulaciones fueron rechazadas y el proyecto fue marcado como asignado.'
      });
    } catch (error: any) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ errors: error.format() });
        return;
      }
      res.status(400).json({ error: error.message });
    }
  };

  solicitarContratacion = async (req: Request, res: Response): Promise<void> => {
    try {
      const companyId = req.user!.id; // Seguridad
      const applicationId = req.params.applicationId;

      // 1. Obtener los detalles de la aplicación
      const application = await this.applicationService.obtenerPostulacion(applicationId);
      if (!application) throw new Error('Postulación no encontrada');

      // 2. FONDOS A ESCROW
      // Aquí estamos simulando que la empresa sube los fondos a Prowork
      await this.paymentService.fundEscrow(
        application.project_id,
        companyId,
        application.freelancer_id,
        application.bid_amount || 0
      );

      // 3. Cambiar estado a pending_contract
      await this.applicationService.solicitarContratacion(companyId, applicationId);

      res.status(200).json({
        message: 'Fondos depositados en Escrow y contratación solicitada correctamente.'
      });
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  };
}

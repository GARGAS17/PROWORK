import { Request, Response } from 'express';
import { z } from 'zod';
import { ProjectService } from '../services/ProjectService';
import { PaymentService } from '../../payments/services/PaymentService';
import { CreateProjectDTO } from '../models/Project';

const createProjectSchema = z.object({
  title: z.string().min(5, 'El título debe tener al menos 5 caracteres.'),
  description: z.string().min(20, 'La descripción debe tener al menos 20 caracteres.'),
  estimated_budget: z.number().positive('El presupuesto debe ser un número positivo.'),
  currency: z.string().default('USD'),
  technologies: z.array(z.string()).min(1, 'Debe incluir al menos una tecnología.'),
});

export class ProjectController {
  constructor(
    private readonly projectService: ProjectService,
    private readonly paymentService: PaymentService
  ) {}

  crearProyecto = async (req: Request, res: Response): Promise<void> => {
    try {
      const companyId = req.user!.id; // Extraído por el middleware
      const validatedData = createProjectSchema.parse(req.body);

      const project = await this.projectService.crearProyecto(
        companyId,
        validatedData.title,
        validatedData.description,
        validatedData.estimated_budget,
        validatedData.currency,
        validatedData.technologies
      );

      res.status(201).json({
        message: 'Proyecto creado exitosamente.',
        data: project,
      });
    } catch (error: any) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ errors: error.format() });
        return;
      }
      res.status(400).json({ error: error.message });
    }
  };

  obtenerMuroPublico = async (req: Request, res: Response): Promise<void> => {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;

      const projects = await this.projectService.obtenerMuroPublico(page, limit);

      res.status(200).json({
        data: projects,
        meta: { page, limit, count: projects.length }
      });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  };

  obtenerMisProyectos = async (req: Request, res: Response): Promise<void> => {
    try {
      const companyId = req.user!.id;
      const projects = await this.projectService.obtenerProyectosPorEmpresa(companyId);

      res.status(200).json({
        data: projects,
        count: projects.length
      });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  };

  obtenerProyecto = async (req: Request, res: Response): Promise<void> => {
    try {
      const projectId = req.params.id;
      const project = await this.projectService.obtenerProyecto(projectId);
      if (!project) {
        res.status(404).json({ error: 'Proyecto no encontrado' });
        return;
      }
      res.status(200).json({ data: project });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  };

  finalizarProyecto = async (req: Request, res: Response): Promise<void> => {
    try {
      const companyId = req.user!.id;
      const projectId = req.params.id;
      
      // 1. Cerrar el proyecto en BD
      await this.projectService.finalizarProyecto(companyId, projectId);
      
      // 2. Liberar los fondos al freelancer
      await this.paymentService.releaseFunds(projectId);

      res.status(200).json({ message: 'Proyecto cerrado y fondos liberados exitosamente' });
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  };
}

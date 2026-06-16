import { Request, Response } from 'express';
import { ConsultingService } from '../services/ConsultingService';

export class ConsultingController {
  constructor(private consultingService: ConsultingService) {}

  solicitarAsesoria = async (req: Request, res: Response): Promise<void> => {
    try {
      const companyId = req.user?.id;
      if (!companyId) {
        res.status(401).json({ error: 'No autorizado' });
        return;
      }
      const request = await this.consultingService.requestConsulting(companyId);
      res.status(201).json({ data: request, message: 'Asesoría solicitada exitosamente' });
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  };

  obtenerPendientes = async (_req: Request, res: Response): Promise<void> => {
    try {
      const requests = await this.consultingService.getAdminRequests();
      res.status(200).json({ data: requests });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  };

  marcarCompletada = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      await this.consultingService.markAsCompleted(id);
      res.status(200).json({ message: 'Asesoría marcada como realizada' });
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  };
}

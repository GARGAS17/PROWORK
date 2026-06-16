import { Request, Response } from 'express';
import { supabase } from '../../../config/supabase';
import { SupabaseApplicationRepository } from '../../applications/repositories/ApplicationRepository';

export class AdminController {
  private readonly applicationRepository = new SupabaseApplicationRepository();

  obtenerSolicitudesDeEmparejamiento = async (_req: Request, res: Response): Promise<void> => {
    try {
      // Buscar postulaciones en estado 'pending_contract'
      const { data, error } = await supabase
        .from('applications')
        .select(`
          *,
          projects (
            title,
            company_id,
            users ( email )
          ),
          users (
            email,
            profiles ( full_name )
          )
        `)
        .eq('status', 'pending_contract')
        .order('updated_at', { ascending: false });

      if (error) {
        throw new Error(error.message);
      }

      res.status(200).json({ data });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  };

  ejecutarEmparejamiento = async (req: Request, res: Response): Promise<void> => {
    try {
      const { applicationId, projectId } = req.body;

      if (!applicationId || !projectId) {
        res.status(400).json({ error: 'Faltan parámetros requeridos' });
        return;
      }

      // Ejecutar la transacción que acepta este candidato y rechaza al resto
      await this.applicationRepository.selectWinnerTransaction(applicationId, projectId);

      res.status(200).json({ message: 'Emparejamiento ejecutado correctamente' });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  };
}

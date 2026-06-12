import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import authRoutes from './modules/auth/routes';
import projectRoutes from './modules/projects/routes';

const app: Application = express();

// Middlewares globales
app.use(helmet());
app.use(cors());
app.use(express.json());

// Rutas de la API
app.use('/api/auth', authRoutes);
app.use('/api/projects', projectRoutes);

// Ruta de estado / healthcheck
app.get('/health', (req: Request, res: Response) => {
  res.status(200).json({ status: 'ok', message: 'Servidor funcionando correctamente' });
});

export default app;

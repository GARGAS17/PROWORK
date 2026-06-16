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

import applicationRoutes from './modules/applications/routes';
import profileRoutes from './modules/profiles/routes';
import adminRoutes from './modules/admin/routes';
import deliverableRoutes from './modules/deliverables/routes';
import paymentRoutes from './modules/payments/routes';

// Rutas de la API
app.use('/api/auth', authRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/applications', applicationRoutes);
app.use('/api/profiles', profileRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/deliverables', deliverableRoutes);
app.use('/api/payments', paymentRoutes);

// Ruta de estado / healthcheck
app.get('/health', (_req: Request, res: Response) => {
  res.status(200).json({ status: 'ok', message: 'Servidor funcionando correctamente' });
});

export default app;

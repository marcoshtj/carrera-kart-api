import { Router } from 'express';
import userRoutes from './userRoutes';
import classificationRoutes from './classificationRoutes';
import { operatingHourRoutes } from './operatingHourRoutes';

const router = Router();

// Definir todas as rotas da API
router.use('/users', userRoutes);
router.use('/classifications', classificationRoutes);
router.use('/operating-hours', operatingHourRoutes);

// Rota de status/health check
router.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'API Carrera Kart funcionando',
    timestamp: new Date().toISOString()
  });
});

export default router;

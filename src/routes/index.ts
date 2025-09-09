import { Router } from 'express';
import mongoose from 'mongoose';
import userRoutes from './userRoutes';
import classificationRoutes from './classificationRoutes';
import { operatingHourRoutes } from './operatingHourRoutes';

const router = Router();

// Definir todas as rotas da API
router.use('/users', userRoutes);
router.use('/classifications', classificationRoutes);
router.use('/operating-hours', operatingHourRoutes);

// Rota de status/health check com informações do banco
router.get('/health', (req, res) => {
  const readyState = mongoose.connection.readyState as number;
  
  // Estados do MongoDB: 0 = disconnected, 1 = connected, 2 = connecting, 3 = disconnecting
  const connectionStates: { [key: number]: string } = {
    0: 'Disconnected',
    1: 'Connected',
    2: 'Connecting',
    3: 'Disconnecting'
  };

  const dbStatus = {
    status: connectionStates[readyState] || 'Unknown',
    readyState,
    host: mongoose.connection.host || 'N/A',
    name: mongoose.connection.name || 'N/A',
    collections: mongoose.connection.db ? Object.keys(mongoose.connection.db.collection).length : 0
  };

  const isHealthy = readyState === 1; // Conectado

  res.status(isHealthy ? 200 : 503).json({
    success: isHealthy,
    message: isHealthy ? 'API Carrera Kart funcionando' : 'API funcionando mas banco desconectado',
    timestamp: new Date().toISOString(),
    api: {
      status: 'Running',
      version: '1.0.0',
      environment: process.env.NODE_ENV || 'development'
    },
    database: dbStatus,
    uptime: process.uptime()
  });
});

export default router;

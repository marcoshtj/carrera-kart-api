import { Request, Response, NextFunction } from 'express';
import mongoose from 'mongoose';
import { connectDB } from '../config/database';

/**
 * Middleware para garantir conexão MongoDB em ambiente serverless
 */
export const ensureDBConnection = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    // Verificar se já está conectado (1 = connected)
    const readyState = mongoose.connection.readyState as number;
    if (readyState === 1) {
      return next();
    }

    // Se não está conectado, tentar conectar
    console.log('Database not connected, attempting to connect...');
    await connectDB();
    
    // Aguardar um pouco para a conexão se estabelecer
    await new Promise(resolve => setTimeout(resolve, 100));
    
    // Verificar novamente se a conexão foi estabelecida
    const newReadyState = mongoose.connection.readyState as number;
    if (newReadyState !== 1) {
      throw new Error('Failed to establish database connection');
    }

    next();
  } catch (error) {
    console.error('Database connection middleware error:', error);
    res.status(500).json({
      success: false,
      message: 'Erro de conexão com banco de dados',
      error: process.env.NODE_ENV === 'development' 
        ? (error instanceof Error ? error.message : 'Unknown error')
        : 'Database connection failed'
    });
  }
};

/**
 * Middleware específico para operações que podem demorar mais
 */
export const ensureDBConnectionWithRetry = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const maxRetries = 3;
  let attempt = 0;

  while (attempt < maxRetries) {
    try {
      // Verificar conexão
      const readyState = mongoose.connection.readyState as number;
      if (readyState === 1) {
        return next();
      }

      console.log(`Database connection attempt ${attempt + 1}/${maxRetries}...`);
      await connectDB();
      
      // Aguardar um pouco para a conexão se estabelecer
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const newReadyState = mongoose.connection.readyState as number;
      if (newReadyState === 1) {
        return next();
      }

      attempt++;
      if (attempt < maxRetries) {
        // Aguardar antes de tentar novamente
        await new Promise(resolve => setTimeout(resolve, 1000 * attempt));
      }
    } catch (error) {
      console.error(`Database connection attempt ${attempt + 1} failed:`, error);
      attempt++;
      
      if (attempt < maxRetries) {
        await new Promise(resolve => setTimeout(resolve, 1000 * attempt));
      }
    }
  }

  // Todas as tentativas falharam
  res.status(500).json({
    success: false,
    message: 'Erro de conexão com banco de dados após várias tentativas',
    error: 'Database connection failed after retries'
  });
};

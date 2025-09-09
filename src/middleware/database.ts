import { Request, Response, NextFunction } from 'express';
import mongoose from 'mongoose';
import { connectDB } from '../config/database';

/**
 * Middleware simples para garantir conexão MongoDB
 */
export const ensureDBConnection = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    // Verificar se já está conectado
    const readyState = mongoose.connection.readyState as number;
    if (readyState === 1) {
      return next();
    }

    // Tentar conectar uma única vez
    console.log('Database not connected, attempting to connect...');
    await connectDB();
    
    next();
  } catch (error) {
    console.error('Database connection error:', error);
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
 * Middleware mais simples sem retry - para evitar timeouts
 */
export const ensureDBConnectionWithRetry = ensureDBConnection;

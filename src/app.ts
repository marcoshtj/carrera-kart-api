import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import mongoose from 'mongoose';

import { config } from './config/config';
import routes from './routes';
import { errorHandler, notFound } from './middleware/errorHandler';
import { connectDB } from './config/database';

const app = express();

// Security middleware
app.use(helmet());

// CORS configuration
const allowedOrigins = [
  'http://localhost:4200',           // Angular dev server
  'https://carrerakart.netlify.app', // Site em produção
  'http://localhost:3000',           // Para testes locais
  'http://localhost:3001',           // Para testes locais
  'http://localhost:5173',           // Vite dev server (caso use)
  process.env.FRONTEND_URL           // URL personalizada do frontend
].filter(Boolean) as string[];

app.use(cors({
  origin: (origin, callback) => {
    // Permitir requisições sem origin (mobile apps, Postman, etc.)
    if (!origin) return callback(null, true);
    
    // Verificar se a origin está na lista ou é do Vercel
    if (allowedOrigins.includes(origin) || /https:\/\/.*\.vercel\.app$/.test(origin)) {
      return callback(null, true);
    }
    
    return callback(new Error('Não permitido pelo CORS'), false);
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: config.rateLimit.windowMs,
  max: config.rateLimit.maxRequests,
  message: {
    success: false,
    message: 'Muitas requisições. Tente novamente mais tarde.'
  }
});

app.use(limiter);

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Compression middleware
app.use(compression());

// Logging middleware
if (config.nodeEnv !== 'test') {
  app.use(morgan('combined'));
}

// Middleware simples para verificar conexão DB em produção
if (process.env.NODE_ENV === 'production') {
  app.use('/api/v1', async (req, res, next) => {
    try {
      const readyState = mongoose.connection.readyState as number;
      if (readyState !== 1) {
        console.log('Database not connected, attempting to connect...');
        await connectDB();
      }
      next();
    } catch (error) {
      console.error('Database connection error:', error);
      res.status(500).json({
        success: false,
        message: 'Erro de conexão com banco de dados',
        error: 'Database unavailable'
      });
    }
  });
}

// API routes
app.use('/api/v1', routes);

// Root endpoint
app.get('/', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Bem-vindo à API Carrera Kart',
    version: '1.0.0rc01',
    documentation: '/api/v1/health'
  });
});

// 404 handler
app.use(notFound);

// Error handler
app.use(errorHandler);

export default app;

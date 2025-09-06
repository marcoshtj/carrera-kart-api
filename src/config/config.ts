import dotenv from 'dotenv';

dotenv.config();

export const config = {
  port: process.env.PORT || 3000,
  nodeEnv: process.env.NODE_ENV || 'development',
  mongodbUri: process.env.MONGODB_URI || 'mongodb://localhost:27017/carrera-kart',
  jwt: {
    secret: process.env.JWT_SECRET || 'your-super-secret-jwt-key',
    expire: process.env.JWT_EXPIRE || '7d'
  },
  admin: {
    name: process.env.ADMIN_NAME || 'Admin Carrera Kart',
    email: process.env.ADMIN_EMAIL || 'admincarrerakart@carrerakart.com.br',
    password: process.env.ADMIN_PASSWORD || '12345678'
  },
  rateLimit: {
    windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '900000'), // 15 minutes
    maxRequests: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || '100')
  }
};

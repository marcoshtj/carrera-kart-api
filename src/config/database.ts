import mongoose from 'mongoose';
import { config } from './config';

// Configuração otimizada para serverless (mais agressiva)
const mongooseOptions = {
  bufferCommands: false, // Disable mongoose buffering
  serverSelectionTimeoutMS: 2000, // Reduzido para 2 segundos
  socketTimeoutMS: 15000, // Reduzido para 15 segundos
  connectTimeoutMS: 5000, // Timeout de conexão de 5 segundos
  maxPoolSize: 3, // Reduzido para 3 conexões
  maxIdleTimeMS: 5000, // Reduzido para 5 segundos de inatividade
  family: 4, // Use IPv4
  retryWrites: false, // Desabilitar retry de writes
  retryReads: false // Desabilitar retry de reads
};

// Cache da conexão para reutilizar em funções serverless
let cachedConnection: typeof mongoose | null = null;

export const connectDB = async (): Promise<typeof mongoose> => {
  try {
    // Verificar se já está conectado
    const readyState = mongoose.connection.readyState as number;
    if (readyState === 1) {
      console.log('Using existing MongoDB connection');
      return mongoose;
    }

    console.log('Creating new MongoDB connection...');
    
    const conn = await mongoose.connect(config.mongodbUri, mongooseOptions);
    
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
    
    // Armazenar a conexão no cache
    cachedConnection = conn;
    
    return conn;
  } catch (error) {
    console.error('❌ Error connecting to MongoDB:', error);
    throw new Error(`Database connection failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
};

// Event listeners para monitoramento
mongoose.connection.on('connected', () => {
  console.log('Mongoose connected to MongoDB');
});

mongoose.connection.on('error', (err) => {
  console.error('Mongoose connection error:', err);
});

mongoose.connection.on('disconnected', () => {
  console.log('Mongoose disconnected from MongoDB');
});

// Graceful shutdown apenas em desenvolvimento
if (process.env.NODE_ENV !== 'production') {
  process.on('SIGINT', async () => {
    await mongoose.connection.close();
    console.log('MongoDB disconnected on app termination');
    process.exit(0);
  });
}

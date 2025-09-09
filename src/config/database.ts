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
    console.log(`Current MongoDB readyState: ${readyState}`);
    
    if (readyState === 1) {
      console.log('Using existing MongoDB connection');
      return mongoose;
    }

    console.log('Creating new MongoDB connection...');
    console.log('MongoDB URI configured:', config.mongodbUri ? 'Yes' : 'No');
    console.log('Environment:', process.env.NODE_ENV);
    
    // Log detalhado das variáveis de ambiente
    console.log('🔍 MONGODB_URI from process.env:', process.env.MONGODB_URI ? 'Present' : 'Missing');
    console.log('🔍 MONGODB_URI length:', process.env.MONGODB_URI ? process.env.MONGODB_URI.length : 0);
    console.log('🔍 Config mongodbUri:', config.mongodbUri ? 'Present' : 'Missing');
    console.log('🔍 Config mongodbUri length:', config.mongodbUri ? config.mongodbUri.length : 0);
    console.log('🔍 URI starts with mongodb+srv:', config.mongodbUri ? config.mongodbUri.startsWith('mongodb+srv://') : false);
    
    if (!config.mongodbUri) {
      throw new Error('MONGODB_URI is not configured');
    }
    
    const conn = await mongoose.connect(config.mongodbUri, mongooseOptions);
    
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
    console.log(`Database name: ${conn.connection.name}`);
    
    // Armazenar a conexão no cache
    cachedConnection = conn;
    
    return conn;
  } catch (error) {
    console.error('❌ Error connecting to MongoDB:');
    console.error('Error type:', error instanceof Error ? error.constructor.name : typeof error);
    console.error('Error message:', error instanceof Error ? error.message : String(error));
    console.error('Full error:', error);
    
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

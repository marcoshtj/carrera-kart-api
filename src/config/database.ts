import mongoose from 'mongoose';
import { config } from './config';

// Configuração otimizada para serverless
const mongooseOptions = {
  bufferCommands: false, // Disable mongoose buffering
  serverSelectionTimeoutMS: 3000, // Reduzido para 3 segundos
  socketTimeoutMS: 20000, // Reduzido para 20 segundos
  connectTimeoutMS: 10000, // Timeout de conexão de 10 segundos
  maxPoolSize: 5, // Reduzido para 5 conexões
  maxIdleTimeMS: 10000, // Reduzido para 10 segundos de inatividade
  family: 4, // Use IPv4, skip trying IPv6
  retryWrites: true,
  retryReads: true
};

// Cache da conexão para reutilizar em funções serverless
let cachedConnection: typeof mongoose | null = null;

export const connectDB = async (): Promise<typeof mongoose> => {
  // Reutilizar conexão existente se estiver conectada
  const readyState = mongoose.connection.readyState as number;
  if (cachedConnection && readyState === 1) {
    console.log('Using cached MongoDB connection');
    return cachedConnection;
  }

  // Se está tentando conectar, aguardar um pouco
  if (readyState === 2) {
    console.log('MongoDB connection in progress, waiting...');
    let attempts = 0;
    while (attempts < 20 && mongoose.connection.readyState === 2) {
      await new Promise(resolve => setTimeout(resolve, 100));
      attempts++;
    }
    
    const finalState = mongoose.connection.readyState as number;
    if (finalState === 1) {
      console.log('MongoDB connection established during wait');
      return mongoose;
    }
  }

  try {
    console.log('Creating new MongoDB connection...');
    
    // Fechar conexão existente se estiver em estado inválido
    if (mongoose.connection.readyState !== 0) {
      await mongoose.disconnect();
    }
    
    const conn = await mongoose.connect(config.mongodbUri, mongooseOptions);
    
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
    
    // Armazenar a conexão no cache
    cachedConnection = conn;
    
    return conn;
  } catch (error) {
    console.error('❌ Error connecting to MongoDB:', error);
    
    // Em ambiente serverless, não sair do processo
    if (process.env.NODE_ENV === 'production') {
      throw error;
    }
    
    process.exit(1);
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

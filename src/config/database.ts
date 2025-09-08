import mongoose from 'mongoose';
import { config } from './config';

// Configuração otimizada para serverless
const mongooseOptions = {
  bufferCommands: false, // Disable mongoose buffering
  bufferMaxEntries: 0, // Disable mongoose buffering
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverSelectionTimeoutMS: 5000, // Keep trying to send operations for 5 seconds
  socketTimeoutMS: 45000, // Close sockets after 45 seconds of inactivity
  maxPoolSize: 10, // Maintain up to 10 socket connections
  maxIdleTimeMS: 30000, // Close connections after 30 seconds of inactivity
  family: 4 // Use IPv4, skip trying IPv6
};

// Cache da conexão para reutilizar em funções serverless
let cachedConnection: typeof mongoose | null = null;

export const connectDB = async (): Promise<typeof mongoose> => {
  // Reutilizar conexão existente
  if (cachedConnection && mongoose.connection.readyState === 1) {
    console.log('Using cached MongoDB connection');
    return cachedConnection;
  }

  try {
    console.log('Creating new MongoDB connection...');
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

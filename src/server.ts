import app from './app';
import { connectDB } from './config/database';
import { config } from './config/config';
import { UserService } from './services/UserService';

const initializeApp = async (): Promise<void> => {
  try {
    // Conectar ao banco de dados com retry
    await connectDB();
    console.log('✅ Banco de dados conectado');

    // Criar usuário admin se não existir (apenas uma vez)
    const userService = new UserService();
    const adminCreated = await userService.createAdminUser({
      name: config.admin.name,
      email: config.admin.email,
      password: config.admin.password
    });

    if (adminCreated) {
      console.log('✅ Usuário admin criado:', config.admin.email);
    } else {
      console.log('ℹ️  Usuário admin já existe');
    }
  } catch (error) {
    console.error('❌ Erro ao inicializar aplicação:', error);
    // Em production, vamos tentar continuar mesmo com erro de admin
    if (process.env.NODE_ENV !== 'production') {
      throw error;
    }
  }
};

const startServer = async (): Promise<void> => {
  try {
    await initializeApp();

    // Iniciar servidor apenas em desenvolvimento
    if (process.env.NODE_ENV !== 'production') {
      const server = app.listen(config.port, () => {
        console.log(`🚀 Servidor rodando na porta ${config.port}`);
        console.log(`📱 Ambiente: ${config.nodeEnv}`);
        console.log(`🌐 URL: http://localhost:${config.port}`);
        console.log(`📋 Health Check: http://localhost:${config.port}/api/v1/health`);
      });

      // Graceful shutdown
      const gracefulShutdown = (signal: string) => {
        console.log(`\n${signal} recebido. Iniciando encerramento gracioso...`);
        
        server.close((err) => {
          if (err) {
            console.error('Erro ao fechar servidor:', err);
            process.exit(1);
          }
          
          console.log('✅ Servidor fechado com sucesso');
          process.exit(0);
        });
      };

      // Listen for termination signals
      process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
      process.on('SIGINT', () => gracefulShutdown('SIGINT'));
    }

  } catch (error) {
    console.error('❌ Erro ao iniciar servidor:', error);
    process.exit(1);
  }
};

// Inicializar conectando ao DB em produção
if (process.env.NODE_ENV === 'production') {
  // Em produção, conectar ao DB na inicialização
  connectDB().then(() => {
    console.log('Production: Database connected on startup');
  }).catch(error => {
    console.error('Production: Database connection failed on startup:', error);
  });
} else {
  // Iniciar servidor em desenvolvimento
  startServer();
}

// Exportar para Vercel
export default app;

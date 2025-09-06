import mongoose from 'mongoose';
import { config } from '../config/config';
import { OperatingHour } from '../models/OperatingHour';

const seedOperatingHours = async () => {
  try {
    // Conectar ao MongoDB
    await mongoose.connect(config.mongodbUri);
    console.log('✅ Conectado ao MongoDB');

    // Limpar dados existentes e recriar coleção
    await OperatingHour.collection.drop().catch(() => console.log('Coleção não existia'));
    console.log('🗑️  Coleção de horários removida e recriada');

    // Dados do grupo header (2 slots fixos)
    const headerData = [
      {
        group: 'header',
        slot: 1,
        label: 'Terça - Sexta: 15:30 às 23:00',
        visible: true
      },
      {
        group: 'header',
        slot: 2,
        label: 'Sábados, Domingos e Feriados: 10:00 às 22:00',
        visible: true
      }
    ];

    // Dados do grupo footer (7 slots fixos)
    const footerData = [
      {
        group: 'footer',
        slot: 3,
        label: 'Terça à Sexta<br>15:30 às 23:00',
        visible: true
      },
      {
        group: 'footer',
        slot: 4,
        label: 'Sábados<br>10:00h às 22:00h',
        visible: true
      },
      {
        group: 'footer',
        slot: 5,
        label: 'Domingos e Feriados<br>10:00h às 22:00h',
        visible: true
      },
      {
        group: 'footer',
        slot: 6,
        label: 'Terça à Sexta<br>15:30 às 17h',
        visible: true
      },
      {
        group: 'footer',
        slot: 7,
        label: 'Sábados, Domingos e Feriados<br>10:00 às 14:30',
        visible: true
      },
      {
        group: 'footer',
        slot: 8,
        label: 'Terça à Sexta<br>17:30h às 22h',
        visible: true
      },
      {
        group: 'footer',
        slot: 9,
        label: 'Sábados, Domingos e Feriados<br>15h às 20:30',
        visible: true
      }
    ];

    // Inserir dados do header
    await OperatingHour.insertMany(headerData);
    console.log('📋 Horários do header inseridos com sucesso');

    // Inserir dados do footer
    await OperatingHour.insertMany(footerData);
    console.log('📋 Horários do footer inseridos com sucesso');

    console.log('🎉 Seed de horários de funcionamento concluído com sucesso!');
    console.log(`📊 Total de registros criados: ${headerData.length + footerData.length}`);

  } catch (error) {
    console.error('❌ Erro ao executar seed:', error);
  } finally {
    // Fechar conexão
    await mongoose.connection.close();
    console.log('🔌 Conexão com MongoDB fechada');
    process.exit(0);
  }
};

// Executar seed se o arquivo for executado diretamente
if (require.main === module) {
  seedOperatingHours();
}

export { seedOperatingHours };

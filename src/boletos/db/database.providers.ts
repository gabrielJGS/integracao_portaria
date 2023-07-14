import { Sequelize } from 'sequelize-typescript';
import { Boleto } from '../entities/boleto.entity';
import { DePara } from '../entities/depara.entity';
import { Lote } from '../entities/lote.entity';

export const databaseProviders = [
  {
    provide: 'SEQUELIZE',
    useFactory: async () => {
      const sequelize = new Sequelize(process.env.DB_STRING || '');
      sequelize.addModels([Boleto, Lote, DePara]);
      await sequelize.sync();
      return sequelize;
    },
  },
];

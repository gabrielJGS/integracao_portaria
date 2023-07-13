import { Sequelize } from 'sequelize-typescript';
import { Boleto } from '../entities/boleto.entity';

export const databaseProviders = [
  {
    provide: 'SEQUELIZE',
    useFactory: async () => {
      const sequelize = new Sequelize(process.env.DB_STRING || '');
      sequelize.addModels([Boleto]);
      await sequelize.sync();
      return sequelize;
    },
  },
];

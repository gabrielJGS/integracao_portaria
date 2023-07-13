import { Boleto } from './boleto.entity';

export const BoletosProviders = [
  {
    provide: 'BOLETOS_REPOSITORY',
    useValue: Boleto,
  },
];

import { Lote } from './lote.entity';

export const LotesProviders = [
  {
    provide: 'LOTES_REPOSITORY',
    useValue: Lote,
  },
];

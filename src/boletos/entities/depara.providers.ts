import { DePara } from './depara.entity';

export const DeParaProviders = [
  {
    provide: 'DEPARA_REPOSITORY',
    useValue: DePara,
  },
];

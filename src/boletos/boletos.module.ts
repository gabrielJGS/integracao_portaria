import { Module } from '@nestjs/common';
import { BoletosService } from './boletos.service';
import { BoletosController } from './boletos.controller';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from './db/database.module';
import { BoletosProviders } from './entities/boleto.providers';
import { LotesProviders } from './entities/lote.providers';
import { DeParaProviders } from './entities/depara.providers';

@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true }), DatabaseModule],
  controllers: [BoletosController],
  providers: [
    BoletosService,
    ...BoletosProviders,
    ...LotesProviders,
    ...DeParaProviders,
  ],
})
export class BoletosModule {}

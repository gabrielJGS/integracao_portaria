import { Module } from '@nestjs/common';
import { BoletosService } from './boletos.service';
import { BoletosController } from './boletos.controller';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from './db/database.module';
import { BoletosProviders } from './entities/boleto.providers';

@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true }), DatabaseModule],
  controllers: [BoletosController],
  providers: [BoletosService, ...BoletosProviders],
})
export class BoletosModule {}

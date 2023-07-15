import { NestFactory } from '@nestjs/core';
import { AppModule } from './App/app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const config = new DocumentBuilder()
    .setTitle('API Green Acesso')
    .setDescription(
      'Este endpoint tem finalidade para o teste de Backend para a Green Acesso',
    )
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('/docs', app, document);
  await app.listen(3000);
}
bootstrap();

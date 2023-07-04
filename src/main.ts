import { NestFactory } from '@nestjs/core';
import { ValidationPipe, VersioningType } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AppModule } from './modules/app/app.module';
import { SwaggerModule } from '@nestjs/swagger';
import { swaggerDocConfig } from './common/config/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  app.useGlobalPipes(new ValidationPipe());

  app.enableCors();

  app.setGlobalPrefix('api');

  app.enableVersioning({
    defaultVersion: '1',
    type: VersioningType.URI,
  });

  const swaggerDocument = SwaggerModule.createDocument(app, swaggerDocConfig, {
    include: [],
  });

  SwaggerModule.setup('swagger', app, swaggerDocument);
  await app.listen(configService.get('port'));
}
bootstrap();

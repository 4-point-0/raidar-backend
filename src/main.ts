import { NestFactory } from '@nestjs/core';
import { ValidationPipe, VersioningType } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AppModule } from './modules/app/app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

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

  const swaggerConfig = new DocumentBuilder()
    .addBearerAuth()
    .setTitle('Raidar API')
    .setDescription('API for raidar project')
    .setVersion('1.0')
    .build();

  const swaggerDocument = SwaggerModule.createDocument(app, swaggerConfig, {
    include: [],
  });

  SwaggerModule.setup('swagger', app, swaggerDocument);
  await app.listen(configService.get('port'));
}
bootstrap();

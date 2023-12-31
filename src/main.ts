import { NestFactory } from '@nestjs/core';
import { ValidationPipe, VersioningType } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AppModule } from './modules/app/app.module';
import { SwaggerModule } from '@nestjs/swagger';
import {
  swaggerDocConfig,
  swaggerDocConfigAdmin,
} from './common/config/swagger';
import { AuthModule } from './modules/auth/auth.module';
import { UserModule } from './modules/user/user.module';
import { SongModule } from './modules/song/song.module';
import { AlbumModule } from './modules/album/album.module';
import { FileModule } from './modules/file/file.module';
import { TasksModule } from './modules/task/task.module';
import { CoingeckoModule } from './modules/coingecko/coingecko.module';
import { MarketplaceModule } from './modules/marketplace/marketplace.module';
import { ContractModule } from './modules/contract/contract.module';
import { StripeModule } from './modules/stripe/stripe.module';
import { NestExpressApplication } from '@nestjs/platform-express';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    rawBody: true,
  });
  const configService = app.get(ConfigService);
  app.useGlobalPipes(new ValidationPipe());

  app.enableCors();

  app.setGlobalPrefix('api');

  app.enableVersioning({
    defaultVersion: '1',
    type: VersioningType.URI,
  });

  const swaggerDocument = SwaggerModule.createDocument(app, swaggerDocConfig, {
    include: [
      AuthModule,
      UserModule,
      AlbumModule,
      SongModule,
      FileModule,
      MarketplaceModule,
      ContractModule,
      StripeModule,
    ],
  });

  SwaggerModule.setup('swagger', app, swaggerDocument);

  const swaggerAdmindDocument = SwaggerModule.createDocument(
    app,
    swaggerDocConfigAdmin,
    {
      include: [TasksModule, CoingeckoModule],
    },
  );
  SwaggerModule.setup('swagger-admin', app, swaggerAdmindDocument);
  await app.listen(configService.get('port'));
}
bootstrap();

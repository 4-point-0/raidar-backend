import { Module, Scope } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import * as dotenv from 'dotenv';
import { existsSync } from 'fs';
import { ConfigModule } from '@nestjs/config';
import { envValidationSchema } from '../../common/config/validation';
import { TypeOrmModule } from '@nestjs/typeorm';
import { typeOrmConfigAsync } from '../../common/config/db/typeorm.config';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { PassportJwtDuplicationFixInterceptor } from '../auth/interceptors/passport-fix.interceptor';
import { configuration } from '../../common/config/configuration';
import { AuthModule } from '../auth/auth.module';
import { UserModule } from '../user/user.module';
import { SongModule } from '../song/song.module';

dotenv.config({
  path: existsSync(`.env.${process.env.MODE}`)
    ? `.env.${process.env.MODE}`
    : '.env',
});

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: `.env.${process.env.MODE}`,
      isGlobal: true,
      load: [configuration],
      validationSchema: envValidationSchema,
    }),
    TypeOrmModule.forRootAsync(typeOrmConfigAsync),
    AuthModule,
    UserModule,
    SongModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_INTERCEPTOR,
      scope: Scope.REQUEST,
      useClass: PassportJwtDuplicationFixInterceptor,
    },
  ],
})
export class AppModule {}

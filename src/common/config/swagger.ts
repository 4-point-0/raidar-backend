import { DocumentBuilder } from '@nestjs/swagger';

export const swaggerDocConfig = new DocumentBuilder()
  .addBearerAuth()
  .setTitle('Raidar API')
  .setDescription('API for raidar')
  .setVersion('1.0')
  .build();

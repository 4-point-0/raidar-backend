import { DocumentBuilder } from '@nestjs/swagger';

export const swaggerDocConfig = new DocumentBuilder()
  .addBearerAuth()
  .setTitle('Raidar API')
  .setDescription('API for raidar')
  .setVersion('1.0')
  .build();

export const swaggerDocConfigAdmin = new DocumentBuilder()
  .addBearerAuth()
  .setTitle('Raidar Admin API')
  .setDescription('Admin API for raidar')
  .setVersion('1.0')
  .build();

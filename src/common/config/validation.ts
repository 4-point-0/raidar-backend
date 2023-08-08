import * as Joi from 'joi';

export const envValidationSchema = Joi.object({
  MODE: Joi.string().valid('dev', 'staging', 'production'),
  PORT: Joi.number(),
  DATABASE_HOST: Joi.string().required(),
  DATABASE_PORT: Joi.number().required(),
  DATABASE_NAME: Joi.string().required(),
  DATABASE_USER: Joi.string().required(),
  DATABASE_PASSWORD: Joi.string().required(),
  JWT_SECRET: Joi.string().required(),
  JWT_EXPIRES_IN: Joi.string().required(),
  GOOGLE_CLIENT_ID: Joi.string().required(),
  GOOGLE_SECRET: Joi.string().required(),
  GOOGLE_CALLBACK_URL: Joi.string().required(),
  AWS_ACCESS_KEY: Joi.string().required(),
  AWS_SECRET_KEY: Joi.string().required(),
  AWS_BUCKET_NAME: Joi.string().required(),
  AWS_REGION: Joi.string().required(),
  SENDGRID_API_KEY: Joi.string().required(),
  SENDGRID_EMAIL: Joi.string().required(),
  ALGOLIA_API_KEY: Joi.string().required(),
  ALGOLIA_APPLICATION_ID: Joi.string().required(),
});

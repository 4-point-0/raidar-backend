import * as dotenv from 'dotenv';
import { existsSync } from 'fs';

dotenv.config({
  path: existsSync(`.env.${process.env.MODE}`)
    ? `.env.${process.env.MODE}`
    : '.env',
});

export const configuration = () => ({
  mode: process.env.MODE,
  port: process.env.PORT || 3001,
  db: {
    host: process.env.DATABASE_HOST,
    port: process.env.DATABASE_PORT,
    name: process.env.DATABASE_NAME,
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
  },
  jwt: {
    secret: process.env.JWT_SECRET,
    expires_in: process.env.JWT_EXPIRES_IN,
  },
  google: {
    client_id: process.env.GOOGLE_CLIENT_ID,
    secret: process.env.GOOGLE_SECRET,
    callback_url: process.env.GOOGLE_CALLBACK_URL,
  },
  aws: {
    access_key: process.env.AWS_ACCESS_KEY,
    secret_key: process.env.AWS_SECRET_KEY,
    bucket_name: process.env.AWS_BUCKET_NAME,
    region: process.env.AWS_REGION,
  },
  sendgrid: {
    api_key: process.env.SENDGRID_API_KEY,
    email: process.env.SENDGRID_EMAIL,
  },
  algolia: {
    api_key: process.env.ALGOLIA_API_KEY,
    app_id: process.env.ALGOLIA_APPLICATION_ID,
    index_name: process.env.ALGOLIA_INDEX_NAME,
  },
});

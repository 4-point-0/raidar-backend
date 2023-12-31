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
  stripe: {
    api_key: process.env.STRIPE_API_KEY,
    api_version: process.env.STRIPE_API_VERSION,
    webhook_secret: process.env.STRIPE_WEBHOOK_SECRET,
    base_product: process.env.STRIPE_BASE_PRODUCT,
    success_url: process.env.STRIPE_SUCCESS_URL,
    error_url: process.env.STRIPE_ERROR_URL,
  },
  email_domains: process.env.EMAIL_DOMAINS,
  storage_cost_usd: process.env.STORAGE_COST_USD,
  near: {
    network_id: process.env.NEAR_NETWORK_ID,
    nft_contract_account_id: process.env.NEAR_NFT_CONTRACT_ACCOUNT_ID,
    master_account_id: process.env.NEAR_MASTER_ACCOUNT_ID,
    master_account_private_key: process.env.NEAR_MASTER_ACCOUNT_PRIVATE_KEY,
  },
});

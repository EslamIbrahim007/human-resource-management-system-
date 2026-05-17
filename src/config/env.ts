import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '../../.env') });

const requiredEnvVars = [
  'NODE_ENV',
  'PORT',
  'MONGODB_URI',
  'JWT_SECRET',
  'JWT_EXPIRES_IN'
] as const;

for (const envVar of requiredEnvVars) {
  if (!process.env[envVar]) {
    throw new Error(`Missing required environment variable: ${envVar}`);
  }
}

export const env = {
  nodeEnv: process.env.NODE_ENV as string,
  port: parseInt(process.env.PORT as string, 10),
  mongodbUri: process.env.MONGODB_URI as string,
  jwtSecret: process.env.JWT_SECRET as string,
  jwtExpiresIn: process.env.JWT_EXPIRES_IN as string,
  jwtRefreshSecret: process.env.JWT_REFRESH_SECRET as string,
  jwtRefreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN as string,
  redisUrl: process.env.REDIS_URL as string,
  frontendUrl: process.env.FRONTEND_URL as string,
  smtp: {
    host: process.env.SMTP_HOST as string,
    port: parseInt(process.env.SMTP_PORT || '587', 10),
    user: process.env.SMTP_USER as string,
    pass: process.env.SMTP_PASS as string
  },
  upload: {
    maxFileSize: parseInt(process.env.MAX_FILE_SIZE || '5242880', 10),
    path: process.env.UPLOAD_PATH || './uploads'
  }
} as const;
import dotenv from 'dotenv';

dotenv.config();

export const isProduction = process.env.NODE_ENV === 'production';

// В зависимости от NODE_ENV переключаем URL
export const FRONTEND_URL = isProduction
  ? process.env.PROD_FRONTEND_URL
  : process.env.LOCAL_FRONTEND_URL;


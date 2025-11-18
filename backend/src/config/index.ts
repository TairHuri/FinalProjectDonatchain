// src/config/index.ts
import dotenv from 'dotenv';
dotenv.config();

interface Config {
  port: number | string;
  mongoUri: string;
  jwtSecret: string;
  jwtExpiresIn: string | number;
  bcryptSaltRounds: number;
  rpcProvider: string;
  contractAddress: string;
  contractPrivateKey: string;
  aiProvider: string;
  aiApiKey: string;
  maxUploadFiles:number;
  ethExchangeRateApi:string;
}

export const config: Config = {
  port: process.env.PORT || 4000,
  mongoUri: process.env.MONGO_URI || 'mongodb://mongo:27017/donatchain', // ✅ תקין
  jwtSecret: process.env.JWT_SECRET || 'dev-secret',
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || '7d',
  bcryptSaltRounds: Number(process.env.BCRYPT_SALT_ROUNDS || 10),
  rpcProvider: process.env.RPC_PROVIDER_URL || '',
  contractAddress: process.env.CONTRACT_ADDRESS || '',
  contractPrivateKey: process.env.PRIVATE_KEY || '',
  aiProvider: process.env.AI_PROVIDER || 'mock',
  aiApiKey: process.env.AI_API_KEY || '',
  maxUploadFiles:Number(process.env.MAX_UPLOAD_FILES) || 10,
  ethExchangeRateApi: process.env.ETH_EXCAHNGE_RATE_API ||'https://api.coingecko.com/api/v3/simple/price',
};

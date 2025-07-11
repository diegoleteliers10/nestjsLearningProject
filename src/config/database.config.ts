import * as dotenv from 'dotenv';
dotenv.config();

import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { User } from '../users/entities/user.entity';

export const databaseConfig: TypeOrmModuleOptions = {
  type: 'postgres',
  host: process.env.DB_HOST || '127.0.0.1',
  port: 5433,
  username: process.env.DB_USERNAME || 'taskflow_user',
  password: process.env.DB_PASSWORD || 'Sofi2009',
  database: process.env.DB_NAME || 'taskflow_db',
  ...(() => {
    console.log('👉 DB config being used:');
    console.log('DB_HOST:', process.env.DB_HOST);
    console.log('DB_PORT:', process.env.DB_PORT);
    console.log('DB_USERNAME:', process.env.DB_USERNAME);
    console.log('DB_PASSWORD:', process.env.DB_PASSWORD);
    console.log('DB_NAME:', process.env.DB_NAME);
    return {};
  })(),
  // 🏗️ Entidades
  entities: [User],
  
  // 🔄 Sincronización automática (solo en desarrollo)
  synchronize: process.env.NODE_ENV !== 'production',
  
  // 📝 Logging de queries (útil para debugging)
  logging: process.env.NODE_ENV === 'development',
  
  // 🔧 Configuraciones adicionales
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
  extra: {
    // Pool de conexiones
    max: 20,
    min: 5,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 2000,
  },
};
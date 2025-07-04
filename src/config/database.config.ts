import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { User } from '../users/entities/user.entity';

export const databaseConfig: TypeOrmModuleOptions = {
  type: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT) || 5432,
  username: process.env.DB_USERNAME || 'taskflow_user',
  password: process.env.DB_PASSWORD || 'taskflow_password',
  database: process.env.DB_NAME || 'taskflow_db',
  
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
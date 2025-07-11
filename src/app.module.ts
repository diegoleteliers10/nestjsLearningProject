import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { databaseConfig } from './config/database.config';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    // 🔧 Configuración de variables de entorno
    ConfigModule.forRoot({
      isGlobal: true, // Hace las variables disponibles en toda la app
      envFilePath: ['.env.local', '.env'], // Archivos de entorno
    }),
    // 🐘 Configuración de TypeORM
    TypeOrmModule.forRoot(databaseConfig),
    // 📦 Módulos de la aplicación
    UsersModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

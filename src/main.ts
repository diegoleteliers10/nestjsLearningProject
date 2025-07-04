import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // 🛡️ Configuración global de validaciones
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,           // Transforma automáticamente los tipos
      whitelist: true,          // Solo permite propiedades definidas en DTOs
      forbidNonWhitelisted: true, // Arroja error si hay propiedades no permitidas
      transformOptions: {
        enableImplicitConversion: true, // Conversión automática de tipos
      },
    }),
  );

  // 🌍 Configuración de CORS para desarrollo
  app.enableCors({
    origin: ['http://localhost:3000', 'http://localhost:3001'],
    credentials: true,
  });

  // 📝 Prefijo global para todas las rutas
  app.setGlobalPrefix('api/v1');

  const port = process.env.PORT || 3000;
  await app.listen(port);
  
  console.log(`🚀 TaskFlow API is running on: http://localhost:${port}/api/v1`);
}

bootstrap();
import { NestFactory, Reflector } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { GlobalExceptionFilter } from './common/filters/global-exception.filter';
import { LoggingInterceptor } from './common/interceptors/loggin.interceptor';
import { JwtAuthGuard } from './auth/guards/jwt-auth.guard';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // 🛡️ Configuración global de validaciones
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true, // Transforma automáticamente los tipos
      whitelist: true, // Solo permite propiedades definidas en DTOs
      forbidNonWhitelisted: true, // Arroja error si hay propiedades no permitidas
      transformOptions: {
        enableImplicitConversion: true, // Conversión automática de tipos
      },
    }),
  );

  // 🛡️ Guard global para autenticación JWT
  const reflector = app.get(Reflector);
  app.useGlobalGuards(new JwtAuthGuard(reflector));

  // 🚨 Filtro global para manejo de errores
  app.useGlobalFilters(new GlobalExceptionFilter());

  // 📝 Interceptor global para logging
  app.useGlobalInterceptors(new LoggingInterceptor());

  // 🌍 Configuración de CORS para desarrollo
  app.enableCors({
    origin: ['http://localhost:3000', 'http://localhost:3001'],
    credentials: true,
  });

  // 📝 Prefijo global para todas las rutas
  app.setGlobalPrefix('api/v1');

  // 📚 Configurar Swagger
  const config = new DocumentBuilder()
    .setTitle('TaskFlow API')
    .setDescription('API para el sistema de gestión de tareas y proyectos')
    .setVersion('1.0')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'JWT',
        description: 'Enter JWT token',
        in: 'header',
      },
      'JWT-auth', // Este nombre se usa en @ApiBearerAuth()
    )
    .addTag('auth', 'Operaciones de autenticación')
    .addTag('users', 'Operaciones relacionadas con usuarios')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  const port = process.env.PORT || 3000;
  await app.listen(port);

  console.log(`🚀 TaskFlow API is running on: http://localhost:${port}/api/v1`);
  console.log(
    `📚 Documentación Swagger disponible en: http://localhost:${port}/api`,
  );
  console.log(
    `🔒 Todas las rutas están protegidas por JWT excepto las marcadas como @Public()`,
  );
}

bootstrap();

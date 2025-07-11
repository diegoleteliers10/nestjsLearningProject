import { Controller, Get } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AppService } from './app.service';
import { Public } from './auth/decorators/public.decorator';

@ApiTags('health')
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Public()
  @Get()
  @ApiOperation({ summary: 'Health check - Verificar estado de la API' })
  @ApiResponse({ 
    status: 200, 
    description: 'API funcionando correctamente',
    schema: {
      type: 'string',
      example: 'TaskFlow API is running! 🚀'
    }
  })
  getHello(): string {
    return this.appService.getHello();
  }
}

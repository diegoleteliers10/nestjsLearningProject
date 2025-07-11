import {
  Controller,
  Get,
  Body,
  Param,
  Patch,
  Delete,
  HttpCode,
  HttpStatus,
  UseGuards,
} from '@nestjs/common';
import { 
  ApiTags, 
  ApiOperation, 
  ApiResponse, 
  ApiBearerAuth 
} from '@nestjs/swagger';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserResponseDto } from './dto/user-response.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { UserRole } from './dto/create-user.dto';
import { User } from './entities/user.entity';

@ApiTags('users')
@Controller('users')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth('JWT-auth')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Obtener todos los usuarios (Solo Admins)' })
  @ApiResponse({ 
    status: 200, 
    description: 'Lista de usuarios obtenida exitosamente',
    type: [UserResponseDto] 
  })
  @ApiResponse({ 
    status: 401, 
    description: 'No autorizado - Token requerido' 
  })
  @ApiResponse({ 
    status: 403, 
    description: 'Prohibido - Se requieren permisos de administrador' 
  })
  async findAllUsers(): Promise<UserResponseDto[]> {
    return this.usersService.findAllUsers();
  }

  @Get('me')
  @ApiOperation({ summary: 'Obtener perfil del usuario actual' })
  @ApiResponse({ 
    status: 200, 
    description: 'Perfil obtenido exitosamente',
    type: UserResponseDto 
  })
  @ApiResponse({ 
    status: 401, 
    description: 'No autorizado - Token requerido' 
  })
  async getMyProfile(@CurrentUser() user: User): Promise<UserResponseDto> {
    return this.usersService.findUserById(user.id);
  }

  @Get(':id')
  @Roles(UserRole.ADMIN, UserRole.MANAGER)
  @ApiOperation({ summary: 'Obtener usuario por ID (Admins y Managers)' })
  @ApiResponse({ 
    status: 200, 
    description: 'Usuario encontrado',
    type: UserResponseDto 
  })
  @ApiResponse({ 
    status: 401, 
    description: 'No autorizado - Token requerido' 
  })
  @ApiResponse({ 
    status: 403, 
    description: 'Prohibido - Permisos insuficientes' 
  })
  @ApiResponse({ 
    status: 404, 
    description: 'Usuario no encontrado' 
  })
  async findUserById(@Param('id') id: string): Promise<UserResponseDto> {
    return this.usersService.findUserById(id);
  }

  @Patch('me')
  @ApiOperation({ summary: 'Actualizar perfil propio' })
  @ApiResponse({ 
    status: 200, 
    description: 'Perfil actualizado exitosamente',
    type: UserResponseDto 
  })
  @ApiResponse({ 
    status: 401, 
    description: 'No autorizado - Token requerido' 
  })
  @ApiResponse({ 
    status: 400, 
    description: 'Datos de entrada inválidos' 
  })
  async updateMyProfile(
    @CurrentUser() user: User,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<UserResponseDto> {
    return this.usersService.updateUser(user.id, updateUserDto);
  }

  @Patch(':id')
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Actualizar usuario por ID (Solo Admins)' })
  @ApiResponse({ 
    status: 200, 
    description: 'Usuario actualizado exitosamente',
    type: UserResponseDto 
  })
  @ApiResponse({ 
    status: 401, 
    description: 'No autorizado - Token requerido' 
  })
  @ApiResponse({ 
    status: 403, 
    description: 'Prohibido - Se requieren permisos de administrador' 
  })
  @ApiResponse({ 
    status: 404, 
    description: 'Usuario no encontrado' 
  })
  async updateUser(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<UserResponseDto> {
    return this.usersService.updateUser(id, updateUserDto);
  }

  @Delete(':id')
  @Roles(UserRole.ADMIN)
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Eliminar usuario (Solo Admins)' })
  @ApiResponse({ 
    status: 204, 
    description: 'Usuario eliminado exitosamente' 
  })
  @ApiResponse({ 
    status: 401, 
    description: 'No autorizado - Token requerido' 
  })
  @ApiResponse({ 
    status: 403, 
    description: 'Prohibido - Se requieren permisos de administrador' 
  })
  @ApiResponse({ 
    status: 404, 
    description: 'Usuario no encontrado' 
  })
  async deleteUser(@Param('id') id: string): Promise<void> {
    return this.usersService.deleteUser(id);
  }
}

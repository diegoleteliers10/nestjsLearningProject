import { ApiProperty } from '@nestjs/swagger';
import { User } from '../../users/entities/user.entity';

export class AuthResponseDto {
  @ApiProperty({ description: 'Token de acceso JWT' })
  access_token: string;

  @ApiProperty({ description: 'Información del usuario', type: User })
  user: User;

  @ApiProperty({ description: 'Tipo de token' })
  token_type: string;

  @ApiProperty({ description: 'Tiempo de expiración en segundos' })
  expires_in: number;
}
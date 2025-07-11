import {
  Injectable,
  UnauthorizedException,
  ConflictException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';
import { UsersService } from '../users/users.service';
import { User } from '../users/entities/user.entity';
import { RegisterDto } from './dto/register.dto';
import { AuthResponseDto } from './dto/auth-response.dto';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  async validateUser(email: string, password: string): Promise<User | null> {
    const user = await this.usersService.findUserByEmail(email);

    if (!user) {
      return null;
    }

    if (!user.isActive) {
      throw new UnauthorizedException('Usuario inactivo');
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return null;
    }

    // Remover la contraseña del objeto user antes de retornarlo
    const { password: _, ...result } = user;
    return result as User;
  }

  async login(user: User): Promise<AuthResponseDto> {
    const payload = {
      sub: user.id,
      email: user.email,
      role: user.role,
    };

    const expiresIn = this.configService.get<string>('JWT_EXPIRES_IN') || '1d';

    return {
      access_token: this.jwtService.sign(payload),
      user,
      token_type: 'Bearer',
      expires_in: this.getExpirationTime(expiresIn),
    };
  }

  async register(registerDto: RegisterDto): Promise<AuthResponseDto> {
    try {
      // Convertir RegisterDto a CreateUserDto
      const [firstName, ...lastNameParts] = registerDto.name.split(' ');
      const lastName = lastNameParts.join(' ') || '';

      const createUserDto = {
        firstName,
        lastName,
        email: registerDto.email,
        password: registerDto.password,
        role: registerDto.role,
      };

      const userResponse = await this.usersService.createUser(createUserDto);
      // Convertir UserResponseDto a User para el login
      const user = await this.usersService.findUserByEmail(userResponse.email);

      if (!user) {
        throw new UnauthorizedException('Error al crear el usuario');
      }

      return this.login(user);
    } catch (error) {
      if (error.status === 409) {
        throw new ConflictException('El email ya está registrado');
      }
      throw error;
    }
  }

  async refreshToken(user: User): Promise<AuthResponseDto> {
    return this.login(user);
  }

  private getExpirationTime(expiresIn: string): number {
    // Convertir el tiempo de expiración a segundos
    if (expiresIn.includes('d')) {
      return parseInt(expiresIn) * 24 * 60 * 60;
    } else if (expiresIn.includes('h')) {
      return parseInt(expiresIn) * 60 * 60;
    } else if (expiresIn.includes('m')) {
      return parseInt(expiresIn) * 60;
    }
    return 3600; // Default: 1 hora
  }
}

import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserResponseDto } from './dto/user-response.dto';
import { User } from './entities/user.entity';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  private readonly saltRounds = 10;

  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {} //injectamos un repositorio (para manejo de db), donde a Repository le pasamos el argumento de Userc(que son las entidades creadas)

  async createUser(createUserDto: CreateUserDto): Promise<UserResponseDto> {
    // 🔍 Verificar si el email ya existe
    await this.validateUniqueEmail(createUserDto.email);

    // 🔐 Hash del password
    const hashedPassword = await this.hashPassword(createUserDto.password);

    // 🏗️ Crear nueva instancia del usuario
    const newUser = this.userRepository.create({
      ...createUserDto,
      password: hashedPassword,
    });

    // 💾 Guardar en base de datos
    const savedUser = await this.userRepository.save(newUser);

    return this.toUserResponse(savedUser);
  }

  async findAllUsers(): Promise<UserResponseDto[]> {
    const users = await this.userRepository.find({
      where: { isActive: true },
      order: { createdAt: 'DESC' },
    });

    return users.map((user) => this.toUserResponse(user));
  }

  async findUserById(id: string): Promise<UserResponseDto> {
    const user = await this.findUserByIdOrThrow(id);
    return this.toUserResponse(user);
  }

  async updateUser(
    id: string,
    updateUserDto: UpdateUserDto,
  ): Promise<UserResponseDto> {
    const user = await this.findUserByIdOrThrow(id);

    // 🔍 Verificar email único si se está actualizando
    if (updateUserDto.email && updateUserDto.email !== user.email) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
      await this.validateUniqueEmail(updateUserDto.email);
    }

    // 🔐 Hash del password si se está actualizando
    const updateData = { ...updateUserDto };
    if (updateUserDto.password) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
      updateData.password = await this.hashPassword(updateUserDto.password);
    }

    // 🔄 Actualizar usuario
    await this.userRepository.update(id, updateData);

    // 🔍 Buscar usuario actualizado
    const updatedUser = await this.findUserByIdOrThrow(id);
    return this.toUserResponse(updatedUser);
  }

  async deleteUser(id: string): Promise<void> {
    const user = await this.findUserByIdOrThrow(id);

    // 🚫 Soft delete: marcar como inactivo
    await this.userRepository.update(id, { isActive: false });

    // Para hard delete se usaría:
    // await this.userRepository.remove(user);
  }

  // 🔍 Método para autenticación (lo usaremos después)
  async findUserByEmail(email: string): Promise<User | null> {
    return this.userRepository.findOne({
      where: { email, isActive: true },
    });
  }

  // 🧹 CLEAN CODE: Métodos privados para reutilizar lógica
  private async findUserByIdOrThrow(id: string): Promise<User> {
    const user = await this.userRepository.findOne({
      where: { id, isActive: true },
    });

    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    return user;
  }

  private async validateUniqueEmail(email: string): Promise<void> {
    const existingUser = await this.userRepository.findOne({
      where: { email },
    });

    if (existingUser) {
      throw new ConflictException(`User with email ${email} already exists`);
    }
  }

  private async hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, this.saltRounds);
  }

  private toUserResponse(user: User): UserResponseDto {
    const { password, ...userResponse } = user;
    return {
      ...userResponse,
    };
  }
}

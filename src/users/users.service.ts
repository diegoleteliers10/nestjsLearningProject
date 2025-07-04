import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserResponseDto } from './dto/user-response.dto';
import * as bcrypt from 'bcrypt';

//los services sirven para definir funciones y caracteristicas para luego usar en los endpoints,
//aqui se realiza toda la logica fuera de lo http

// Simulamos una base de datos en memoria por ahora
interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  avatar?: string;
  createdAt: Date;
  updatedAt: Date;
}

@Injectable()
export class UsersService {
  private users: User[] = []; //aqui esta la db con todos los usuarios
  private readonly saltRounds = 10;
  async createUser(createUserDto: CreateUserDto): Promise<UserResponseDto> {
    await this.validateUniqueEmail(createUserDto.email);

    const hashedPassword = await this.hashPassword(createUserDto.password);

    const newUser: User = {
      id: this.generateUniqueId(),
      ...createUserDto,
      password: hashedPassword,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    this.users.push(newUser);
    return this.toUserResponse(newUser);
  }

  async findAllUsers(): Promise<UserResponseDto[]> {
    return this.users.map((user) => this.toUserResponse(user));
  }

  async findUserById(id: string): Promise<UserResponseDto> {
    const user = this.findUserByIdOrThrow(id);
    return this.toUserResponse(user);
  }

  async updateUser(
    id: string,
    updateUserDto: UpdateUserDto,
  ): Promise<UserResponseDto> {
    const userIndex = this.findUserIndexById(id);

    if (updateUserDto.email) {
      await this.validateUniqueEmail(updateUserDto.email, id);
    }

    const hashedPassword = updateUserDto.password 
      ? await this.hashPassword(updateUserDto.password.toString())
      : undefined;

    this.users[userIndex] = {
      ...this.users[userIndex],
      ...updateUserDto,
      ...(hashedPassword && { password: hashedPassword }),
      updatedAt: new Date(),
    };

    return this.toUserResponse(this.users[userIndex]);
  }

  async deleteUser(id: string): Promise<void> {
    const userIndex = this.findUserIndexById(id);
    this.users.splice(userIndex, 1);
  }

  // 🧹 CLEAN CODE: Métodos privados para reutilizar lógica
  private findUserByIdOrThrow(id: string): User {
    const user = this.users.find((u) => u.id === id);
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    return user;
  }

  private findUserIndexById(id: string): number {
    const index = this.users.findIndex((u) => u.id === id);
    if (index === -1) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    return index;
  }

  private async validateUniqueEmail(
    email: string,
    excludeId?: string,
  ): Promise<void> {
    const existingUser = this.users.find(
      (u) => u.email === email && u.id !== excludeId,
    );
    if (existingUser) {
      throw new ConflictException(`User with email ${email} already exists`);
    }
  }

  private async hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, this.saltRounds);
  }

  private generateUniqueId(): string {
    return `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private toUserResponse(user: User): UserResponseDto {
    const { password, ...userResponse } = user;
    return userResponse;
  }
}

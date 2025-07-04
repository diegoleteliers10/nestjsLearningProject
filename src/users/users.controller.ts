import { 
  Controller, 
  Get, 
  Post, 
  Body, 
  Param, 
  Patch, 
  Delete,
  HttpCode,
  HttpStatus,
  UsePipes,
  ValidationPipe,
  NotFoundException
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserResponseDto } from './dto/user-response.dto';

//el controler sirve para crear las rutas asociadas al http

@Controller('users') //esto nos indica que la ruta de la api es /users
@UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async createUser(
    @Body() createUserDto: CreateUserDto,
  ): Promise<UserResponseDto> {
    return this.usersService.createUser(createUserDto);
  }

  @Get()
  async findAllUsers(): Promise<UserResponseDto[]> {
    return this.usersService.findAllUsers();
  }

  @Get(':id')
  async findUserById(@Param('id') id: string): Promise<UserResponseDto> {
    return this.usersService.findUserById(id);
  }

  @Patch(':id')
  async updateUser(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto
  ): Promise<UserResponseDto> {
    return this.usersService.updateUser(id, updateUserDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteUser(@Param('id') id: string): Promise<void> {
    const user = await this.usersService.findUserById(id);
    if (!user) {
      throw new NotFoundException(`User with id ${id} not found`);
    }
    return this.usersService.deleteUser(id);
  }
}
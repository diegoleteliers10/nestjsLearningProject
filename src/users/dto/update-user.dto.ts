import { PartialType } from '@nestjs/mapped-types';
import { CreateUserDto } from './create-user.dto';

export class UpdateUserDto extends PartialType(CreateUserDto) {
  // PartialType hace que todas las propiedades sean opcionales
  // Esto es perfecto para operaciones PATCH
}

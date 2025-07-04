export class UserResponseDto {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  avatar?: string;
  isActive: boolean;
  lastLoginAt?: Date;
  createdAt: Date;
  updatedAt: Date;
  fullName?: string; // Campo calculado

  // Nota: NO incluimos password por seguridad
  // Este DTO define exactamente qué datos enviamos al cliente
}

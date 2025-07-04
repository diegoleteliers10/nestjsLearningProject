export class UserResponseDto {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  avatar?: string;
  createdAt: Date;
  updatedAt: Date;

  // Nota: NO incluimos password por seguridad
  // Este DTO define exactamente qué datos enviamos al cliente
}
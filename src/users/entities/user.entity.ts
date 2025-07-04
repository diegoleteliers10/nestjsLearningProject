import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
} from 'typeorm';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 100, nullable: false })
  firstName: string;

  @Column({ type: 'varchar', length: 100, nullable: false })
  lastName: string;

  @Column({ type: 'varchar', length: 255, unique: true, nullable: false })
  @Index('IDX_USER_EMAIL') // Índice para búsquedas rápidas
  email: string;

  @Column({ type: 'varchar', length: 255, nullable: false })
  password: string;

  @Column({ type: 'varchar', length: 500, nullable: true })
  avatar?: string;

  @Column({ type: 'boolean', default: true })
  isActive: boolean;

  @Column({ type: 'timestamp', nullable: true })
  lastLoginAt?: Date;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  //los helpers funcionan para acceder a propiedades de la entidad sin tener que acceder a la base de datos

  // 🔧 Método helper para nombre completo
  get fullName(): string {
    return `${this.firstName} ${this.lastName}`;
  }

  // 🔧 Método helper para verificar si el usuario está activo
  get isActiveUser(): boolean {
    return this.isActive;
  }
}
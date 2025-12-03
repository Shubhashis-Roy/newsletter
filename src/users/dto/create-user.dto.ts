import { IsEmail, IsEnum, IsNotEmpty, IsOptional, IsUUID, MinLength } from 'class-validator';
import { UserRole } from '../entities/user.entity';
import { UUID } from 'crypto';

export class CreateUserDto {
    @IsEmail()
    email: string;

    @IsNotEmpty()
    @MinLength(6)
    password: string;

    @IsNotEmpty()
    fullName: string;

    @IsOptional()
    role?: UserRole;

    @IsNotEmpty()
    @IsUUID()
    organizationId: UUID;
}
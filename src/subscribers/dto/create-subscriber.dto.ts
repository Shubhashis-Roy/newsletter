import { IsNotEmpty, IsString, IsEmail, IsUUID, IsOptional, IsObject } from 'class-validator';

export class CreateSubscriberDto {
    @IsNotEmpty()
    @IsEmail()
    email: string;

    @IsOptional()
    @IsUUID()
    organizationId?: string;

    @IsOptional()
    @IsObject()
    customFields?: object;
}
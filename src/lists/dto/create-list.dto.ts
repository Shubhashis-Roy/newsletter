import { IsNotEmpty, IsString, IsUUID, IsOptional, IsObject } from 'class-validator';

export class CreateListDto {
    @IsNotEmpty()
    @IsString()
    name: string;

    @IsOptional()
    @IsUUID()
    organizationId?: string;

    @IsOptional()
    @IsObject()
    customFields?: object;
}
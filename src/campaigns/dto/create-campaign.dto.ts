import { IsNotEmpty, IsString, IsUUID, IsOptional } from 'class-validator';

export class CreateCampaignDto {
    @IsNotEmpty()
    @IsString()
    subject: string;

    @IsNotEmpty()
    @IsString()
    content: string;

    @IsOptional()
    @IsUUID()
    listId?: string;

    @IsOptional()
    @IsUUID()
    organizationId?: string;
}
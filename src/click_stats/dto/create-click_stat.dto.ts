import { IsNotEmpty, IsString, IsUUID, IsOptional, IsInt, Min } from 'class-validator';

export class CreateClickStatDto {
    @IsNotEmpty()
    @IsUUID()
    campaignId: string;

    @IsNotEmpty()
    @IsString()
    link: string;

    @IsOptional()
    @IsInt()
    @Min(0)
    clickCount?: number;
}
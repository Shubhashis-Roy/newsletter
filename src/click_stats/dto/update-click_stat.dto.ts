import { PartialType } from '@nestjs/mapped-types';
import { CreateClickStatDto } from './create-click_stat.dto';

export class UpdateClickStatDto extends PartialType(CreateClickStatDto) {}

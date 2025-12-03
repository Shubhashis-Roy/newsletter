import { Module } from '@nestjs/common';
import { OrganizationService } from './organizations.service';
import { OrganizationController } from './organizations.controller';
import { Organization } from './entities/organization.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [TypeOrmModule.forFeature([Organization]), AuthModule],
  controllers: [OrganizationController],
  providers: [OrganizationService],
})
export class OrganizationsModule { }

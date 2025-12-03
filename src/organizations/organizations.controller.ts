import { Controller, Get, Post, Body, UseGuards } from '@nestjs/common';
import { CreateOrganizationDto } from './dto/create-organization.dto';
import { OrganizationService } from './organizations.service';
import { RolesGuard } from '../auth/roles.guard';
import { UserRole } from '../users/entities/user.entity';
import { Roles } from '../auth/role.decorator';

@Controller('organizations')
@UseGuards(RolesGuard)
export class OrganizationController {
  constructor(private readonly organizationService: OrganizationService) { }

  @Post()
  async create(@Body() createOrganizationDto: CreateOrganizationDto) {
    const data = await this.organizationService.create(createOrganizationDto);
    return data;
  }

  @Get()
  // @Roles(UserRole.ADMIN)
  findAll() {
    return this.organizationService.findAll();
  }
}


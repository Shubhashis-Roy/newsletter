import { Injectable, ConflictException, NotFoundException, BadRequestException, ConsoleLogger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { User, UserRole } from './entities/user.entity';
import { Organization } from '../organizations/entities/organization.entity';
import { isUUID } from 'class-validator';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(Organization)
    private organizationRepository: Repository<Organization>,
  ) { }

  async create(createUserDto: CreateUserDto) {

    const existingUser = await this.userRepository.findOne({ where: { email: createUserDto.email } });
    if (existingUser) {
      throw new ConflictException('Email already exists');
    }

    if (createUserDto.organizationId) {
      const organization = await this.organizationRepository.findOne({ where: { id: createUserDto.organizationId } });
      if (organization) {
        const user = new User();
        user.email = createUserDto.email;
        user.password = createUserDto.password;
        user.fullName = createUserDto.fullName
        user.role = createUserDto.role;

        if (createUserDto.organizationId) {
          const organization = await this.organizationRepository.findOne({ where: { id: createUserDto.organizationId } });
          if (organization) {
            user.organization = organization;
          }
        }

        return this.userRepository.save(user);
      } else {
        throw new ConflictException('Organization is not exists')
      }
    }

  }

  async findByEmail(email: string): Promise<User> {
    const user = await this.userRepository.findOne({ where: { email } });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }

  async findById(id: string): Promise<User> {
    if (!id) {
      throw new NotFoundException('Invalid ID parameter');
    }

    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }

  async update(id: string, updateUserDto?: Partial<CreateUserDto>): Promise<User> {

    if (!isUUID(id)) throw new BadRequestException('Invalid UUID format');

    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) throw new NotFoundException('User not found');

    if (!updateUserDto || Object.keys(updateUserDto).length === 0) {
      throw new BadRequestException('No update data provided');
    }

    if (updateUserDto?.fullName) user.fullName = updateUserDto.fullName;
    if (updateUserDto?.email) user.email = updateUserDto.email;
    if (updateUserDto?.password) user.password = updateUserDto.password;
    if (updateUserDto?.role) user.role = updateUserDto.role;

    if (updateUserDto.organizationId) {
      const organization = await this.organizationRepository.findOne({
        where: { id: updateUserDto.organizationId },
      });
      if (organization) user.organization = organization;
    }

    return await this.userRepository.save(user);
  }

  async remove(id: string): Promise<void> {
    const user = await this.findById(id);
    await this.userRepository.remove(user);
  }
}
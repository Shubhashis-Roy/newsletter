import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from '../auth/auth.module';
import { UserController } from './users.controller';
import { UserService } from './users.service';
import { User } from './entities/user.entity';
import { Organization } from '../organizations/entities/organization.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, Organization]), // Want to use services of User and Organization Api's
  forwardRef(() => AuthModule)], // Solves Circular import Error
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule { }
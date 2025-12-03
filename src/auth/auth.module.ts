import { forwardRef, Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UserModule } from '../users/users.module';
import { RolesGuard } from './roles.guard';

@Module({
  imports: [forwardRef(() => UserModule),], // Need to use both side to solve circular dependency error.
  providers: [AuthService, RolesGuard],
  controllers: [AuthController],
  exports: [AuthService, RolesGuard],
})
export class AuthModule { }
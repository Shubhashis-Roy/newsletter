import {
  forwardRef,
  Module,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UserModule } from '../users/users.module';
import { RolesGuard } from './roles.guard';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './jwt.strategy';

@Module({
  imports: [
    forwardRef(() => UserModule),

    // REQUIRED for JwtService
    JwtModule.register({
      secret:
        process.env.JWT_SECRET || 'secret123',
      signOptions: { expiresIn: '1d' },
    }),
  ],

  providers: [
    AuthService,
    RolesGuard,
    JwtStrategy,
  ],
  controllers: [AuthController],

  exports: [
    AuthService,
    RolesGuard,

    // Export JwtModule so other modules can use JwtService
    JwtModule,
  ],
})
export class AuthModule {}

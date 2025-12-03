import {
  Controller,
  Post,
  Body,
  UnauthorizedException,
  BadRequestException,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from '../users/dto/create-user.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('login')
  async login(
    @Body()
    loginUserDto: {
      email: string;
      password: string;
    },
  ) {
    const user =
      await this.authService.validateUser(
        loginUserDto.email,
        loginUserDto.password,
      );

    if (!user) {
      throw new UnauthorizedException(
        'Invalid credentials',
      );
    }

    return this.authService.login(user);
  }

  // -----------------------------
  //      REGISTER / SIGNUP
  // -----------------------------
  @Post('register')
  async register(@Body() dto: CreateUserDto) {
    const newUser =
      await this.authService.register(dto);

    if (!newUser) {
      throw new BadRequestException(
        'User registration failed',
      );
    }

    return newUser;
  }
}

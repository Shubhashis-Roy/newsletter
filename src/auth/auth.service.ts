import {
  Injectable,
  UnauthorizedException,
  BadRequestException,
} from '@nestjs/common';
import { UserService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { CreateUserDto } from '../users/dto/create-user.dto';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
  ) {}

  // -----------------------------
  // REGISTER / SIGNUP
  // -----------------------------
  async register(dto: CreateUserDto) {
    let existing = null;

    // -------------------------------
    // CHECK IF USER ALREADY EXISTS
    // Without modifying findByEmail()
    // -------------------------------
    try {
      existing =
        await this.userService.findByEmail(
          dto.email,
        );
    } catch (error) {
      // ❗ User not found → this is good → allow registration
      existing = null;
    }

    if (existing) {
      throw new BadRequestException(
        'Email already exists',
      );
    }

    // -------------------------------
    // HASH PASSWORD
    // -------------------------------
    const hashedPassword = await bcrypt.hash(
      dto.password,
      10,
    );

    // -------------------------------
    // CREATE USER
    // -------------------------------
    const newUser =
      await this.userService.createUser({
        ...dto,
        password: hashedPassword,
      });

    // -------------------------------
    // RESPONSE
    // -------------------------------
    return {
      message: 'Registration successful',
      user: {
        id: newUser.id,
        email: newUser.email,
        fullName: newUser.fullName,
        role: newUser.role,
      },
    };
  }

  // -----------------------------
  // VALIDATE USER CREDENTIALS
  // -----------------------------
  async validateUser(
    email: string,
    password: string,
  ) {
    let user = null;

    try {
      user =
        await this.userService.findByEmail(email);
    } catch (error) {
      return null; // user not found
    }

    const isMatch = await bcrypt.compare(
      password,
      user.password,
    );

    if (!isMatch) {
      return null;
    }

    const { password: _, ...result } = user;
    return result;
  }

  // -----------------------------
  // LOGIN → RETURNS JWT TOKEN
  // -----------------------------
  async login(user: any) {
    const payload = {
      email: user.email,
      sub: user.id,
      role: user.role,
    };

    const token =
      await this.jwtService.signAsync(payload);

    return {
      message: 'Login successful',
      accessToken: token,
      user: {
        id: user.id,
        email: user.email,
        fullName: user.fullName,
        role: user.role,
      },
    };
  }
}

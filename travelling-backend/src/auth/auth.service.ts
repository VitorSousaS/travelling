import { Injectable } from '@nestjs/common';
import { User } from '@prisma/client';
import { UserService } from 'src/modules/user/user.service';
import { UtilsService } from 'src/shared/services/utils.service';
import { UserPayload } from './models/UserPayload';
import { JwtService } from '@nestjs/jwt';
import { UserToken } from './models/UserToken';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private utilsService: UtilsService,
    private jwtService: JwtService,
  ) {}

  login(user: User): UserToken {
    const payload: UserPayload = {
      sub: user.id,
      email: user.email,
      name: user.name,
      userRole: user.userRole,
    };

    const jwtToken = this.jwtService.sign(payload);

    return {
      access_token: jwtToken,
    };
  }

  async validateUser(email: string, password: string) {
    const user = await this.userService.findByEmail(email);

    if (user) {
      const isPasswordValid = await this.utilsService.comparePasswords(
        password,
        user.passwordHash,
      );

      if (isPasswordValid) {
        return { ...user, passwordHash: undefined };
      }
    }

    throw new Error('Email address or password provided is incorrect.');
  }
}

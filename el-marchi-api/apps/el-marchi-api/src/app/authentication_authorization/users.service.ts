import {
  ConflictException,
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Response } from 'express';

import { BaseService } from '../common/database/base.service';
import { JwtconfigService } from '../common/jwtconfig/jwtconfig.service';
import { RedisService } from '../common/redis/redis.service';
import { CryptoService } from '../crypto/crypto.service';
import { ChangePasswordDto } from './dtos/change.password.dto';
import { CreateUserDto } from './dtos/create.user.dto';
import { loginDto } from './dtos/login.dto';
import { UpdateUserDto } from './dtos/update.user.dto';
import { User } from './entities/user.entity';
import { CookieOperationError, CookieUtils } from '../common/cookies/cookie.utils';

@Injectable()
export class UsersService extends BaseService<User> {
  private readonly config: {
    algorithm: string;
    access: {
      privateKey: string;
      publicKey: string;
      expiresIn: string;
    };
    refresh: {
      privateKey: string;
      publicKey: string;
      expiresIn: string;
    };
  };
  constructor(
    @InjectRepository(User)
    repository: Repository<User>,
    jwtConfig: JwtconfigService,
    private readonly cryptoService: CryptoService,
    private readonly jwtService: JwtService,
    private readonly redisService: RedisService,
  ) {
    super(repository);
    this.config = jwtConfig.getJwtConfig();
  }

  async localLogin(dto: loginDto, response: Response) {
    const existingUser = await this.findByEmailWithPassword(dto.email);
    if (!existingUser) {
      // Use constant time comparison to prevent timing attacks
      await this.cryptoService.verifyPassword(
        dto.password,
        'dummy-hash',
        'dummy-salt'
      );

      throw new UnauthorizedException('Email or Password is wrong!');
    }

    const match = await this.cryptoService.verifyPassword(
      dto.password,
      existingUser.passwordHash,
      existingUser.passwordSalt,
    );

    if (!match) {
      throw new UnauthorizedException('Email or Password is wrong!');
    }

    const tokens = await this.getTokens(existingUser.id, existingUser.email, response);
    return tokens;
  }

  async localSignup(dto: CreateUserDto, response: Response) {
    const existingUser = await this.findByEmail(dto.email);
    if (existingUser) {
      throw new ConflictException('Email already exists!');
    }

    const { hash, salt } = await this.cryptoService.hashPassword(dto.password);

    const user = await this.create({
      ...dto,
      passwordHash: hash,
      passwordSalt: salt,
    });

    if (!user) {
      throw new InternalServerErrorException('User Creation Failed!');
    }

    const tokens = await this.getTokens(user.id, user.email, response);
    return tokens;
  }

  async logout(userId: string, response: Response) {
    try {
      await this.redisService.deleteRefreshToken(userId);
      CookieUtils.clearAccessTokenCookie(response);
    } catch (error) {
      if (error instanceof CookieOperationError) {
        throw new InternalServerErrorException(
          'Failed to complete logout process',
        );
      }
      throw error;
    }
  }

  async changePassword(
    userId: string | undefined,
    changePasswordDto: ChangePasswordDto,
    response: Response
  ) {
    if (!userId) {

      // Use constant time comparison to prevent timing attacks
      await this.cryptoService.verifyPassword(
        changePasswordDto.oldPassword,
        'dummy-hash',
        'dummy-salt'
      );

      throw new UnauthorizedException();
    }
    const user = await this.findOne(userId);
    if (!user) {

      // Use constant time comparison to prevent timing attacks
      await this.cryptoService.verifyPassword(
        changePasswordDto.oldPassword,
        'dummy-hash',
        'dummy-salt'
      );

      throw new UnauthorizedException();
    }

    const isValid = await this.cryptoService.verifyPassword(
      changePasswordDto.oldPassword,
      user.passwordHash,
      user.passwordSalt,
    );

    if (!isValid) {
      throw new UnauthorizedException();
    }

    let passwordUpdate = {};

    const { hash, salt } = await this.cryptoService.hashPassword(
      changePasswordDto.newPassword,
    );
    passwordUpdate = {
      passwordHash: hash,
      passwordSalt: salt,
    };

    // Delete old refresh token
    await this.redisService.deleteRefreshToken(userId);
    const tokens = await this.getTokens(userId, user.email, response);

    const updatedUser = await super.update(userId, {
      ...user,
      ...passwordUpdate,
    });

    return { user: updatedUser, tokens };
  }

  async getTokens(userId: string, email: string, response: Response) {
    try {
      const [accessToken, refreshToken] = await Promise.all([
        this.jwtService.signAsync(
          { sub: userId, email },
          {
            privateKey: this.config.access.privateKey,
            expiresIn: this.config.access.expiresIn,
          },
        ),
        this.jwtService.signAsync(
          { sub: userId },
          {
            privateKey: this.config.refresh.privateKey,
            expiresIn: this.config.refresh.expiresIn,
          },
        ),
      ]);

      const maxAge = parseInt(this.config.access.expiresIn) * 60 * 1000;
      CookieUtils.setAccessTokenCookie(response, accessToken, maxAge);


      await this.redisService.storeRefreshToken(userId, refreshToken);

      return {
        refresh_token: refreshToken,
      };
    } catch (error) {
      if (error instanceof CookieOperationError) {
        throw new InternalServerErrorException(
          'Failed to complete authentication process',
        );
      }
      throw error;
    }
  }

  async refreshTokens(id: string, refreshToken: string, response: Response) {
    const existingUser = await this.findOne(id);
    if (!existingUser) throw new ForbiddenException('Access Denied');

    const isValid = await this.redisService.validateRefreshToken(
      id,
      refreshToken,
    );
    if (!isValid) throw new ForbiddenException('Access Denied');

    // Delete old refresh token
    await this.redisService.deleteRefreshToken(id);

    const tokens = await this.getTokens(id, existingUser.email, response);
    return tokens;
  }

  override async update(id: string, dto: UpdateUserDto) {
    const user = await this.findOne(id);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    const updatedUser = await super.update(id, {
      ...user,
      ...dto,
    });

    return updatedUser;
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.repository.findOne({
      where: { email },
    });
  }

  async findByEmailWithPassword(email: string): Promise<User | null> {
    return this.repository.findOne({
      where: { email },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        birthDate: true,
        passwordHash: true,
        passwordSalt: true,
        createdAt: true,
        updatedAt: true,
        deletedAt: true,
      },
    });
  }
}

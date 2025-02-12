import {
  ConflictException,
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
  UnauthorizedException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { randomUUID } from 'crypto';
import { inspect } from 'util';
import { BaseService } from '../common/database/base.service';
import { JwtconfigService } from '../common/jwtconfig/jwtconfig.service';
import { RedisService } from '../common/redis/redis.service';
import { SecretData } from '../common/types/jwt.payload';
import { CryptoService } from '../crypto/crypto.service';
import { ChangePasswordDto } from './dtos/change.password.dto';
import { CreateUserDto } from './dtos/create.user.dto';
import { loginDto } from './dtos/login.dto';
import { UpdateUserDto } from './dtos/update.user.dto';
import { User } from './entities/user.entity';

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

  async localLogin(dto: loginDto) {
    const existingUser = await this.findByEmailWithPassword(dto.email);
    if (!existingUser) {
      // Use constant time comparison to prevent timing attacks
      await this.cryptoService.verifyPassword(
        dto.password,
        'dummy-hash',
        'dummy-salt',
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

    const tokens = await this.getTokens(existingUser.id, existingUser.email);
    return { tokens, email: existingUser.email, id: existingUser.id };
  }

  async localSignup(dto: CreateUserDto) {
    const { confirmPassword, ...savedData } = dto;

    if (savedData.password !== confirmPassword) {
      throw new UnprocessableEntityException('Passwords are not matching.');
    }

    const existingUser = await this.findByEmail(savedData.email);

    if (existingUser) {
      throw new ConflictException('Email already exists!');
    }

    const { hash, salt } = await this.cryptoService.hashPassword(
      savedData.password,
    );

    const user = await this.create({
      ...savedData,
      passwordHash: hash,
      passwordSalt: salt,
    });

    if (!user) {
      throw new InternalServerErrorException('User Creation Failed!');
    }

    const tokens = await this.getTokens(user.id, user.email);
    return { tokens, email: user.email, id: user.id };
  }

  async logout(userId: string, refreshTokenId: string) {
    await this.redisService.deleteRefreshToken(userId, refreshTokenId);
  }

  async changePassword(
    userId: string | undefined,
    changePasswordDto: ChangePasswordDto,
    refreshTokenId: string,
  ) {
    if (!userId) {
      // Use constant time comparison to prevent timing attacks
      await this.cryptoService.verifyPassword(
        changePasswordDto.oldPassword,
        'dummy-hash',
        'dummy-salt',
      );

      throw new UnauthorizedException();
    }
    const user = await this.findOne(userId);
    if (!user) {
      // Use constant time comparison to prevent timing attacks
      await this.cryptoService.verifyPassword(
        changePasswordDto.oldPassword,
        'dummy-hash',
        'dummy-salt',
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
    await this.redisService.deleteRefreshToken(userId, refreshTokenId);
    const tokens = await this.getTokens(userId, user.email);

    const updatedUser = await super.update(userId, {
      ...user,
      ...passwordUpdate,
    });

    return { user: updatedUser, tokens };
  }

  async getTokens(userId: string, email: string) {
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
      const refreshTokenId = randomUUID();
      await this.redisService.storeRefreshToken(
        userId,
        refreshToken,
        refreshTokenId,
      );

      return {
        jwtAccessToken: accessToken,
        jwtRefreshToken: refreshToken,
        refreshTokenId: refreshTokenId,
      } as SecretData;
    } catch (error) {
      Logger.error(
        `Failed to generate tokens: ${(error as Error).message}.\n${inspect(
          error,
        )}`,
      );
      throw error;
    }
  }

  async refreshTokens(
    id: string,
    refreshToken: string,
    refreshTokenId: string,
  ) {
    const existingUser = await this.findOne(id);
    if (!existingUser) throw new ForbiddenException('Access Denied');

    const isValid = await this.redisService.validateRefreshToken(
      id,
      refreshToken,
      refreshTokenId,
    );
    if (!isValid) throw new ForbiddenException('Access Denied');

    // Delete old refresh token
    await this.redisService.deleteRefreshToken(id, refreshTokenId);

    const tokens = await this.getTokens(id, existingUser.email);
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

  async validateJwtRefreshToken(
    sub: string,
    jwtRefreshToken: string,
    refreshTokenId: string,
  ) {
    const isValid = await this.redisService.validateRefreshToken(
      sub,
      jwtRefreshToken,
      refreshTokenId,
    );
    if (isValid) return await this.findOne(sub);
    else return undefined;
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
        phoneNumber: true,
        passwordHash: true,
        passwordSalt: true,
        createdAt: true,
        updatedAt: true,
        deletedAt: true,
      },
    });
  }
}

import {
  ConflictException,
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

import { inspect } from 'util';
import { BaseService } from '../common/database/base.service';
import { JwtconfigService } from '../common/jwtconfig/jwtconfig.service';
import { RedisService } from '../common/redis/redis.service';
import {
  AccessJwtTokenPayload,
  RefreshJwtTokenPayload,
} from '../common/types/jwt.payload';
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

  async localLogin(dto: loginDto, refreshTokenId: string) {
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

    const tokens = await this.getTokens(existingUser.id, refreshTokenId);
    return { tokens, email: existingUser.email, id: existingUser.id };
  }

  async localSignup(dto: CreateUserDto, refreshTokenId: string) {
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

    const tokens = await this.getTokens(user.id, refreshTokenId);
    return { tokens, email: user.email, id: user.id };
  }

  async logout(userId: string, refreshTokenId: string) {
    await this.redisService.deleteRefreshToken(userId, refreshTokenId);
  }

  async logoutAll(userId: string) {
    await this.redisService.deleteAllRefreshToken(userId);
  }

  async getTokens(userId: string, refreshTokenId: string) {
    const accessTokenPayload: AccessJwtTokenPayload = { sub: userId };
    const refreshTokenPayload: RefreshJwtTokenPayload = { sub: userId };

    try {
      const [accessToken, refreshToken] = await Promise.all([
        this.jwtService.signAsync(accessTokenPayload, {
          privateKey: this.config.access.privateKey,
          expiresIn: this.config.access.expiresIn,
        }),
        this.jwtService.signAsync(refreshTokenPayload, {
          privateKey: this.config.refresh.privateKey,
          expiresIn: this.config.refresh.expiresIn,
        }),
      ]);

      await this.redisService.storeRefreshToken(
        userId,
        refreshToken,
        refreshTokenId,
      );

      return {
        jwtAccessToken: accessToken,
        jwtRefreshToken: refreshToken,
      };
    } catch (error) {
      Logger.error(
        `Failed to generate tokens: ${(error as Error).message}.\n${inspect(
          error,
        )}`,
      );
      throw error;
    }
  }

  async revokeJwtRefreshToken(sub: string, refreshTokenId: string) {
    await this.redisService.deleteRefreshToken(sub, refreshTokenId);
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

  async changePassword(
    user: User,
    changePasswordDto: ChangePasswordDto,
    refreshTokenId: string,
  ) {
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

    // Delete all refresh tokens related to this user
    await this.redisService.deleteAllRefreshToken(user.id);
    const [tokens, updatedUser] = await Promise.all([
      this.getTokens(user.id, refreshTokenId),
      super.update(user.id, {
        ...user,
        ...passwordUpdate,
      }),
    ]);

    return { user: updatedUser, tokens };
  }
}

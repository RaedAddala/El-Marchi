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
import { BaseService } from '../common/database/base.service';
import { JwtconfigService } from '../common/jwtconfig/jwtconfig.service';
import { RedisService } from '../common/redis/redis.service';
import { CryptoService } from '../crypto/crypto.service';
import { ChangePasswordDto } from './dtos/change.password.dto';
import { CreateUserDto } from './dtos/create.user.dto';
import { loginDto } from './dtos/login.dto';
import { UpdateUserDto } from './dtos/update.user.dto';
import { User } from './entities/user.entity';

@Injectable()
export class UsersService extends BaseService<User> {
  constructor(
    @InjectRepository(User)
    repository: Repository<User>,
    private readonly cryptoService: CryptoService,
    private readonly jwtService: JwtService,
    private readonly jwtConfig: JwtconfigService,
    private readonly redisService: RedisService,
  ) {
    super(repository);
  }

  async localLogin(dto: loginDto) {
    const existingUser = await this.findByEmailWithPassword(dto.email);
    if (!existingUser) {
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
    return tokens;
  }

  async localSignup(dto: CreateUserDto) {
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

    const tokens = await this.getTokens(user.id, user.email);
    return tokens;
  }

  async logout(userId: string) {
    await this.redisService.deleteRefreshToken(userId);
  }

  async changePassword(
    userId: string | undefined,
    changePasswordDto: ChangePasswordDto,
  ) {
    if (!userId) {
      throw new UnauthorizedException();
    }
    const user = await this.findOne(userId);
    if (!user) {
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

    const updatedUser = await super.update(userId, {
      ...user,
      ...passwordUpdate,
    });

    return updatedUser;
  }

  async getTokens(userId: string, email: string) {
    const [at, rt] = await Promise.all([
      this.jwtService.signAsync(
        { sub: userId, email },
        {
          privateKey: this.jwtConfig.getJwtConfig().access.privateKey,
          algorithm: 'ES512',
          expiresIn: '15m',
        },
      ),
      this.jwtService.signAsync(
        { sub: userId },
        {
          privateKey: this.jwtConfig.getJwtConfig().refresh.privateKey,
          algorithm: 'ES512',
          expiresIn: '7d',
        },
      ),
    ]);

    await this.redisService.storeRefreshToken(userId, rt);
    return {
      access_token: at,
      refresh_token: rt,
    };
  }

  async refreshTokens(id: string, refreshToken: string) {
    const existingUser = await this.findOne(id);
    if (!existingUser) throw new ForbiddenException('Access Denied');

    const isValid = await this.redisService.validateRefreshToken(
      id,
      refreshToken,
    );
    if (!isValid) throw new ForbiddenException('Access Denied');

    // Delete old refresh token
    await this.redisService.deleteRefreshToken(id);

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

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
import { IsNull, Not, Repository } from 'typeorm';
import { BaseService } from '../common/database/base.service';
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
  ) {
    super(repository);
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
    await this.updateRefreshTokenHash(existingUser.id, tokens.refresh_token);
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
    await this.updateRefreshTokenHash(user.id, tokens.refresh_token);
    return tokens;
  }

  async logout(userId: string) {
    await this.repository.update(
      { id: userId, hashedRefreshToken: Not(IsNull()) },
      { hashedRefreshToken: null },
    );
  }

  async refreshTokens(id: string, refreshToken: string) {
    const existingUser = await this.findOne(id);
    if (!existingUser || !existingUser.hashedRefreshToken) {
      throw new ForbiddenException('Access Denied!');
    }

    const isMatch = this.cryptoService.verifyToken(
      refreshToken,
      existingUser.hashedRefreshToken,
    );
    if (!isMatch) {
      throw new ForbiddenException('Access Denied!');
    }
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
        { sub: userId, email: email },
        {
          secret: 'my very amazing secret that is soooo secure!!!!',
          expiresIn: 60 * 60,
        },
      ),
      this.jwtService.signAsync(
        { sub: userId, email: email },
        {
          secret: 'my very amazing secret that is soooo secure!!!!',
          expiresIn: 60 * 60 * 24 * 7 * 3,
        },
      ),
    ]);

    return {
      access_token: at,
      refresh_token: rt,
    };
  }

  async updateRefreshTokenHash(userId: string, refreshToken: string) {
    const hash = await this.cryptoService.hashToken(refreshToken);
    await this.repository.update({ id: userId }, { hashedRefreshToken: hash });
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

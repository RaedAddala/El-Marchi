import {
  ConflictException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { randomUUID } from 'crypto';
import { Repository } from 'typeorm';
import { BaseService } from '../common/database/base.service';
import { CryptoService } from '../crypto/crypto.service';
import { ChangePasswordDto } from './dtos/change.password.dto';
import { CreateUserDto } from './dtos/create.user.dto';
import { jwtStruct } from './dtos/jwt.struct';
import { loginDto } from './dtos/login.dto';
import { RefreshTokensType } from './dtos/refresh.token.dto';
import { UpdateUserDto } from './dtos/update.user.dto';
import { User } from './entities/user.entity';
import { RefreshTokenService } from './refreshtoken.service';

@Injectable()
export class UsersService extends BaseService<User> {
  constructor(
    @InjectRepository(User)
    repository: Repository<User>,
    private readonly cryptoService: CryptoService,
    private readonly jwtService: JwtService,
    private readonly refreshTokenService: RefreshTokenService,
  ) {
    super(repository);
  }

  override async create(dto: CreateUserDto) {
    const existingUser = await this.findByEmail(dto.email);
    if (existingUser) {
      throw new ConflictException('Email already exists!');
    }

    const { hash, salt } = await this.cryptoService.hashPassword(dto.password);

    const user = await super.create({
      ...dto,
      passwordHash: hash,
      passwordSalt: salt,
    });

    return user;
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

  async validateCredentials(
    email: string,
    password: string,
  ): Promise<User | null> {
    const user = await this.findByEmailWithPassword(email);
    if (!user) {
      return null;
    }

    const isValid = await this.cryptoService.verifyPassword(
      password,
      user.passwordHash,
      user.passwordSalt,
    );

    return isValid ? user : null;
  }

  async login(dto: loginDto) {
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
    return await this.generateUserTokens(existingUser.id);
  }

  private async generateUserTokens(userId: string) {
    const accessToken = this.generateAccessToken(userId);
    const refreshToken = randomUUID();

    await this.storeRefreshToken(refreshToken, userId);
    return { accessToken, refreshToken };
  }

  private generateAccessToken(userId: string) {
    return this.jwtService.sign({ userId } as jwtStruct, { expiresIn: '1h' });
  }

  private async storeRefreshToken(token: string, userId: string) {
    const expiryDate = new Date();
    expiryDate.setDate(expiryDate.getDate() + 3);

    await this.refreshTokenService.create({
      token,
      user: { id: userId },
      expiryDate,
    });
  }

  async refreshTokens(refreshTokensDto: RefreshTokensType) {
    const token = await this.refreshTokenService.findOneBy({
      token: refreshTokensDto.token,
    });

    if (!token) {
      throw new UnauthorizedException('Token Invalid');
    }

    // delete old refresh token:
    // either it is expired and will throw unauthroized
    // or     it is correct and we will generate new tokens
    await this.refreshTokenService.hardDelete(token.id);

    if (token.expiryDate > new Date()) {
      throw new UnauthorizedException('Token Invalid');
    }

    return this.generateUserTokens(token.user.id);
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
}

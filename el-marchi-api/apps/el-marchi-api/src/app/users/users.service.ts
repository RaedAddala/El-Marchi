import { Injectable, ConflictException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CryptoService } from '../crypto/crypto.service';
import { BaseService } from '../common/database/base.service';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dtos/create.user.dto';
import { UpdateUserDto } from './dtos/update.user.dto';

@Injectable()
export class UsersService extends BaseService<User> {
  constructor(
    @InjectRepository(User)
    protected readonly repository: Repository<User>,
    private readonly cryptoService: CryptoService,
  ) {
    super(repository);
  }

  override async create(dto: CreateUserDto) {
    const existingUser = await this.findByEmail(dto.email);
    if (existingUser) {
      throw new ConflictException('Email already exists');
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

    let passwordUpdate = {};
    if (dto.password) {
      const { hash, salt } = await this.cryptoService.hashPassword(dto.password);
      passwordUpdate = {
        passwordHash: hash,
        passwordSalt: salt,
      };
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...updateData } = dto;
    const updatedUser = await super.update(id, {
      ...updateData,
      ...passwordUpdate,
    });

    return updatedUser;
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.repository.findOne({
      where: { email }
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
        deletedAt: true
      }
    });
  }

  async validateCredentials(email: string, password: string): Promise<User | null> {
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
}

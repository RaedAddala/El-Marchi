import { Injectable, ConflictException, NotFoundException } from '@nestjs/common';
import { CryptoService } from '../crypto/crypto.service';
import { BaseService } from '../common/database/base.service';
import { User } from './entities/user.entity';
import { UsersRepository } from './users.repository';
import { CreateUserDto } from './dtos/create.user.dto';
import { UpdateUserDto } from './dtos/update.user.dto';

@Injectable()
export class UsersService extends BaseService<User> {
  constructor(
    private readonly userRepository: UsersRepository,
    private readonly cryptoService: CryptoService,
  ) {
    super(userRepository);
  }

  override async create(dto: CreateUserDto) {
    const existingUser = await this.userRepository.findByEmail(dto.email);
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
    const user = await this.findById(id);
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

  async validateCredentials(email: string, password: string): Promise<User | null> {
    const user = await this.userRepository.findByEmailWithPassword(email);
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

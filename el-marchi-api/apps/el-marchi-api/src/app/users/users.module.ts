import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { CryptoService } from '../crypto/crypto.service';

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  providers: [UsersService, CryptoService],
  controllers: [UsersController],
})
export class UsersModule { }

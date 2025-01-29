import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CryptoService } from '../crypto/crypto.service';
import { User } from './entities/user.entity';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { RefreshTokenService } from './refreshtoken.service';
import { RefreshToken } from './entities/refreshToken.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, RefreshToken])],
  providers: [UsersService, RefreshTokenService, CryptoService],
  controllers: [UsersController],
})
export class UsersModule { }

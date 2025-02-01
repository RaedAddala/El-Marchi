import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { jwtFactory } from '../common/jwt/jwt.def';
import { CryptoService } from '../crypto/crypto.service';
import { User } from './entities/user.entity';
import { AccessTokenStrategy, RefreshTokenStrategy } from './strategies';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: jwtFactory,
    }),
  ],
  providers: [
    UsersService,
    CryptoService,
    AccessTokenStrategy,
    RefreshTokenStrategy,
  ],
  controllers: [UsersController],
})
export class UsersModule {}

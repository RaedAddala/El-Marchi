import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { jwtFactory } from '../common/jwt/jwt.def';
import { CryptoService } from '../crypto/crypto.service';
import { RefreshToken } from './entities/refreshToken.entity';
import { User } from './entities/user.entity';
import { RefreshTokenService } from './refreshtoken.service';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { AccessTokenStrategy, RefreshTokenStrategy } from './strategies';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, RefreshToken]),
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: jwtFactory,
    }),
  ],
  providers: [UsersService, RefreshTokenService, CryptoService, AccessTokenStrategy, RefreshTokenStrategy],
  controllers: [UsersController],
})
export class UsersModule { }

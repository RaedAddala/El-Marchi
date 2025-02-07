import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CryptoService } from '../crypto/crypto.service';
import { User } from './entities/user.entity';
import { AccessTokenStrategy, RefreshTokenStrategy } from './strategies';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { JwtconfigService, jwtFactory } from '../common/jwtconfig/jwtconfig.service';
import { RedisService } from '../common/redis/redis.service';

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
    JwtconfigService,
    RedisService,
  ],
  controllers: [UsersController],
})
export class UsersModule { }

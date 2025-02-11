import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtconfigService } from '../common/jwtconfig/jwtconfig.service';
import { RedisService } from '../common/redis/redis.service';
import { CryptoService } from '../crypto/crypto.service';
import { User } from './entities/user.entity';
import { AccessTokenStrategy, RefreshTokenStrategy } from './strategies';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';

@Module({
  imports: [TypeOrmModule.forFeature([User])],
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
export class UsersModule {}

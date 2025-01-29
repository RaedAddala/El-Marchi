import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CryptoService } from '../crypto/crypto.service';
import { RefreshToken } from './entities/refreshToken.entity';
import { User } from './entities/user.entity';
import { RefreshTokenService } from './refreshtoken.service';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { JwtModule } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { EnvConfig } from '../common/config/env.schema';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, RefreshToken]),
    // TODO: Change to Public/Private Key and enforce Assymetric Algorithms ONLY.
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: async (config: ConfigService<EnvConfig, true>) => ({
        secret: config.get<EnvConfig['JWT_SECRET']>('JWT_SECRET'),
        signOptions: { algorithm: 'HS512' },
        verifyOptions: { algorithms: ['HS512'] },
      }),
    }),
  ],
  providers: [UsersService, RefreshTokenService, CryptoService],
  controllers: [UsersController],
})
export class UsersModule { }

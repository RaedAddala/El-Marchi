import { Injectable, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createClient } from 'redis';
import type { RedisClientType } from 'redis';
import { EnvConfig } from '../config/env.schema';

@Injectable()
export class RedisService implements OnModuleInit {
  private client: RedisClientType;

  constructor(config: ConfigService<EnvConfig, true>) {
    this.client = createClient({
      url: `redis://${config.get<EnvConfig['REDIS_HOSTNAME']>('REDIS_HOSTNAME')}:${config.get<EnvConfig["REDIS_PORT"]>("REDIS_PORT")}`,
      password: config.get<EnvConfig['REDIS_PASSWORD']>('REDIS_PASSWORD')
    });
  }

  async onModuleInit() {
    await this.client.connect();
  }

  async storeRefreshToken(userId: string, token: string): Promise<void> {
    await this.client.set(`refresh:${userId}`, token, {
      EX: 60 * 60 * 24 * 7,
    });
  }

  async validateRefreshToken(userId: string, token: string): Promise<boolean> {
    const storedToken = await this.client.get(`refresh:${userId}`);
    return storedToken === token;
  }

  async deleteRefreshToken(userId: string): Promise<void> {
    await this.client.del(`refresh:${userId}`);
  }
}

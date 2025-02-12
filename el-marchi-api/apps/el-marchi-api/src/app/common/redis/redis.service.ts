import {
  Injectable,
  Logger,
  OnModuleDestroy,
  OnModuleInit,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import type { RedisClientType } from 'redis';
import { createClient } from 'redis';
import { CryptoService } from '../../crypto/crypto.service';
import { EnvConfig } from '../config/env.schema';

@Injectable()
export class RedisService implements OnModuleInit, OnModuleDestroy {

  private readonly logger = new Logger(RedisService.name);

  private readonly client: RedisClientType;
  private readonly expirationDateInDays: number;

  private readonly maxRetries = 5;
  private readonly retryDelay = 5000;

  private isConnected = false;
  private reconnectAttempts = 0;
  private reconnectTimeout: NodeJS.Timeout | null = null;

  constructor(
    config: ConfigService<EnvConfig, true>,
    private readonly cryptoService: CryptoService,
  ) {
    this.client = createClient({
      url: `redis://${config.get<EnvConfig['REDIS_HOSTNAME']>(
        'REDIS_HOSTNAME',
      )}:${config.get<EnvConfig['REDIS_PORT']>('REDIS_PORT')}`,
      password: config.get<EnvConfig['REDIS_PASSWORD']>('REDIS_PASSWORD'),
      socket: {
        reconnectStrategy: (retries: number) => {
          if (retries > this.maxRetries) {
            this.logger.error(
              `Max reconnection attempts (${this.maxRetries}) reached`,
            );
            return new Error('Max reconnection attempts reached');
          }
          return this.retryDelay * Math.pow(2, retries);
        },
      },
    });

    this.expirationDateInDays = config.get<
      EnvConfig['REFRESH_TOKEN_EXPIRATION_IN_DAYS']
    >('REFRESH_TOKEN_EXPIRATION_IN_DAYS');

    this.setupEventHandlers();
  }

  private setupEventHandlers(): void {
    this.client.on('error', err => {
      this.logger.error('Redis Client Error:', err);
      this.isConnected = false;
    });

    this.client.on('connect', () => {
      this.logger.log('Connecting to Redis...');
    });

    this.client.on('ready', () => {
      this.logger.log('Redis Client Ready');
      this.isConnected = true;
      this.reconnectAttempts = 0;
    });

    this.client.on('end', () => {
      this.logger.warn('Redis Connection Ended');
      this.isConnected = false;
    });

    this.client.on('reconnecting', () => {
      this.reconnectAttempts++;
      this.logger.warn(
        `Reconnecting... Attempt ${this.reconnectAttempts} of ${this.maxRetries}`,
      );
    });
  }

  async onModuleInit() {
    await this.connect();
  }

  async onModuleDestroy() {
    await this.disconnect();
  }

  private async connect(): Promise<void> {
    try {
      await this.client.connect();
      this.isConnected = true;
      this.logger.log('Successfully connected to Redis');
    } catch (error) {
      this.logger.error('Failed to connect to Redis:', error);
      await this.handleConnectionError();
    }
  }

  private async disconnect(): Promise<void> {
    if (this.reconnectTimeout) {
      clearTimeout(this.reconnectTimeout);
      this.reconnectTimeout = null;
    }

    if (this.isConnected) {
      try {
        // why quit instead of disconnect ? ==> quit makes sure all pending commands are executed before closing.
        // Sends the QUIT command to the Redis server, allowing Redis to properly clean up the connection.

        await this.client.quit();
        this.isConnected = false;
        this.logger.log('Disconnected from Redis');
      } catch (error) {
        this.logger.error('Error disconnecting from Redis:', error);
      }
    }
  }

  private async handleConnectionError(): Promise<void> {
    if (this.reconnectAttempts < this.maxRetries) {
      this.reconnectAttempts++;
      const delay = this.retryDelay * Math.pow(2, this.reconnectAttempts - 1);

      this.logger.warn(
        `Retrying connection in ${delay}ms... Attempt ${this.reconnectAttempts} of ${this.maxRetries}`,
      );

      this.reconnectTimeout = setTimeout(async () => {
        await this.connect();
      }, delay);
    } else {
      this.logger.error(
        `Failed to connect to Redis after ${this.maxRetries} attempts`,
      );
      throw new Error('Redis connection failed');
    }
  }

  private async ensureConnection(): Promise<void> {
    if (!this.isConnected) {
      throw new Error('Redis client is not connected');
    }
  }

  async storeRefreshToken(
    userId: string,
    token: string,
    refreshTokenId: string,
  ): Promise<void> {
    await this.ensureConnection();
    try {
      const hashed = await this.cryptoService.hashToken(token);
      await this.client.set(`refresh:${userId}:${refreshTokenId}`, hashed, {
        EX: 60 * 60 * 24 * this.expirationDateInDays,
      });
    } catch (error) {
      this.logger.error(
        `Error storing refresh token for user ${userId}:`,
        error,
      );
      throw error;
    }
  }

  async validateRefreshToken(
    userId: string,
    token: string,
    refreshTokenId: string,
  ): Promise<boolean> {
    await this.ensureConnection();
    try {
      const storedToken = await this.client.get(
        `refresh:${userId}:${refreshTokenId}`,
      );
      if (!storedToken) {
        return false;
      }
      return await this.cryptoService.verifyToken(token, storedToken);
    } catch (error) {
      this.logger.error(
        `Error validating refresh token for user ${userId}:`,
        error,
      );
      throw error;
    }
  }

  async deleteRefreshToken(
    userId: string,
    refreshTokenId: string,
  ): Promise<void> {
    await this.ensureConnection();
    try {
      await this.client.del(`refresh:${userId}:${refreshTokenId}`);
    } catch (error) {
      this.logger.error(
        `Error deleting refresh token for user ${userId}:`,
        error,
      );
      throw error;
    }
  }

  async deleteAllRefreshToken(userId: string): Promise<void> {
    await this.ensureConnection();
    const pattern = `refresh:${userId}:*`;
    let cursor = 0;

    try {
      do {
        const { cursor: nextCursor, keys } = await this.client.scan(cursor, {
          MATCH: pattern,
          COUNT: 100,
        });
        if (keys.length > 0) {
          await this.client.del(keys);
        }
        cursor = nextCursor;

      } while (cursor !== 0);
    } catch (error) {
      this.logger.error(
        `Error deleting refresh token for user ${userId}:`,
        error,
      );
      throw error;
    }
  }

  async isHealthy(): Promise<boolean> {
    try {
      await this.client.ping();
      return true;
    } catch {
      return false;
    }
  }
}

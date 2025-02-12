import { Logger } from '@nestjs/common';
import { Response } from 'express';
import { inspect } from 'util';
import { SecretData } from '../types/jwt.payload';

export const COOKIE_NAME = 'auth_tokens';
export class AuthCookieUtils {
  private static readonly logger = new Logger('AuthCookieUtils');

  static setAuthTokenCookie(
    response: Response,
    token: SecretData,
    maxAge: number,
  ): void {
    try {
      response.cookie(COOKIE_NAME, token, {
        httpOnly: true,
        // secure: true,
        sameSite: 'strict',
        maxAge,
        path: '/',
        signed: true,
      });
    } catch (error) {
      this.logger.error(
        `Failed to clear Auth token cookie: ${
          (error as Error).message
        }.\n${inspect(error)}`,
      );
      throw error;
    }
  }

  static clearAuthTokenCookie(response: Response): void {
    try {
      response.clearCookie(COOKIE_NAME, {
        httpOnly: true,
        // secure: true,
        sameSite: 'strict',
        path: '/',
        signed: true,
      });
    } catch (error) {
      this.logger.error(
        `Failed to clear Auth token cookie: ${
          (error as Error).message
        }.\n${inspect(error)}`,
      );

      throw error;
    }
  }
}

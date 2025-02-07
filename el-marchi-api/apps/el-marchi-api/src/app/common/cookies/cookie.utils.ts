export class CookieOperationError extends Error {
  constructor(
    message: string,
    public readonly operation: 'set' | 'clear',
    public override readonly cause?: Error
  ) {
    super(message);
    this.name = 'CookieOperationError';
  }
}

import { Response } from 'express';
import { Logger } from '@nestjs/common';

export class CookieUtils {
  private static readonly logger = new Logger('CookieUtils');

  static setAccessTokenCookie(
    response: Response,
    token: string,
    maxAge: number,
  ): void {
    try {
      response.cookie('access_token', token, {
        httpOnly: true,
        secure: true,
        sameSite: 'strict',
        maxAge,
        path: '/',
        signed: true,
      });
    } catch (error) {

      this.logger.error(`Failed to set access token cookie: ${(error as Error).message}`);
      throw new CookieOperationError(
        'Failed to set access token cookie',
        'set',
        error as Error,
      );
    }
  }

  static clearAccessTokenCookie(response: Response): void {
    try {
      response.clearCookie('access_token', {
        httpOnly: true,
        secure: true,
        sameSite: 'strict',
        path: '/',
        signed: true,
      });
    } catch (error) {
      this.logger.error(`Failed to clear access token cookie: ${(error as Error).message}`);
      throw new CookieOperationError(
        'Failed to clear access token cookie',
        'clear',
        error as Error,
      );
    }
  }
}

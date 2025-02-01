import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { RefreshTokenJWTPayload } from '../types/jwt.payload';

export const GetCurrentUser = createParamDecorator(
  (
    data: keyof RefreshTokenJWTPayload | undefined,
    context: ExecutionContext,
  ) => {
    const request = context.switchToHttp().getRequest();
    if (!data) return request.user;
    return request.user[data];
  },
);

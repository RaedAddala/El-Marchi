import {
  CanActivate,
  ExecutionContext,
  Injectable,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Observable } from 'rxjs';
import { UsedRequest } from '../../common/request/request.def';
import { jwtStruct } from '../dtos/jwt.struct';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private readonly jwtService: JwtService) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request: UsedRequest = context.switchToHttp().getRequest();
    const token = this.extractTokenFromHeader(request);

    if (!token) {
      throw new UnauthorizedException('Invalid Token');
    }
    try {
      const payload = this.jwtService.verify<jwtStruct>(token);
      request.userId = payload.userId;
    } catch (e: unknown) {
      if (e instanceof Error) {
        Logger.error(e.message);
      }
      throw new UnauthorizedException('Invalid Token');
    }
    return true;
  }

  private extractTokenFromHeader(request: UsedRequest) {
    return request.headers.authorization?.split(' ')[1];
  }
}

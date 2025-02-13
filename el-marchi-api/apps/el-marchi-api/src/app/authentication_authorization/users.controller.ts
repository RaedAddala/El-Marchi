import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Put,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import type { Request, Response } from 'express';

import { CreateUserDto } from './dtos/create.user.dto';
import { loginDto } from './dtos/login.dto';

import { ChangePasswordDto } from './dtos/change.password.dto';
import { UpdateUserDto } from './dtos/update.user.dto';
import { UsersService } from './users.service';

import { randomUUID } from 'crypto';
import { AuthCookieUtils, COOKIE_NAME } from '../common/cookies/cookie.utils';
import { AccessTokenGuard, RefreshTokenGuard } from '../common/guards';
import { JwtconfigService } from '../common/jwtconfig/jwtconfig.service';
import { JsonWebTokenCookieData } from '../common/types/jwt.payload';
import { User } from './entities/user.entity';

@Controller('users')
@ApiTags('users')
export class UsersController {
  private readonly maxAge: number;

  constructor(
    private readonly userService: UsersService,
    config: JwtconfigService,
  ) {
    this.maxAge = parseInt(config.getJwtConfig().access.expiresIn) * 60 * 1000;
  }

  @Post('local/signup')
  @HttpCode(HttpStatus.CREATED)
  async localSignup(
    @Body() createUserDto: CreateUserDto,
    @Res({ passthrough: true }) response: Response,
  ) {
    const refreshTokenId = randomUUID();
    const data = await this.userService.localSignup(
      createUserDto,
      refreshTokenId,
    );

    AuthCookieUtils.setAuthTokenCookie(
      response,
      {
        refreshToken: data.tokens.jwtRefreshToken,
        refreshTokenId: refreshTokenId,
      },
      this.maxAge,
    );

    return {
      msg: 'success',
      data: {
        email: data.email,
        id: data.id,
        accessToken: data.tokens.jwtAccessToken,
      },
    };
  }

  @Post('local/login')
  @HttpCode(HttpStatus.OK)
  async localLogin(
    @Body() loginDto: loginDto,
    @Res({ passthrough: true }) response: Response,
  ) {
    const refreshTokenId = randomUUID();
    const data = await this.userService.localLogin(loginDto, refreshTokenId);

    AuthCookieUtils.setAuthTokenCookie(
      response,
      {
        refreshToken: data.tokens.jwtRefreshToken,
        refreshTokenId: refreshTokenId,
      },
      this.maxAge,
    );

    return {
      msg: 'success',
      data: {
        email: data.email,
        id: data.id,
        accessToken: data.tokens.jwtAccessToken,
      },
    };
  }

  @Post('logout')
  @UseGuards(AccessTokenGuard, RefreshTokenGuard)
  @HttpCode(HttpStatus.OK)
  async logout(
    @Req() req: Request,
    @Res({ passthrough: true }) response: Response,
  ) {
    // the user must send both the access token as bearer and the refresh token as cookie to proceed

    const user = req.user as User; // given by the access token strategy
    const tokenData: JsonWebTokenCookieData = req.signedCookies[COOKIE_NAME];
    AuthCookieUtils.clearAuthTokenCookie(response);
    await this.userService.logout(user.id, tokenData.refreshTokenId);
    response.send({ msg: 'success' }).end();
  }

  @Post('logout-all')
  @UseGuards(AccessTokenGuard, RefreshTokenGuard)
  @HttpCode(HttpStatus.OK)
  async logoutAllDevices(
    @Req() req: Request,
    @Res({ passthrough: true }) response: Response,
  ) {
    // the user can only send the access token as bearer to proceed

    const user = req.user as User;
    AuthCookieUtils.clearAuthTokenCookie(response);
    await this.userService.logoutAll(user.id);
    response.send({ msg: 'success' }).end();
  }

  @Post('refresh')
  @UseGuards(RefreshTokenGuard)
  @HttpCode(HttpStatus.OK)
  async refreshTokens(
    @Req() req: Request,
    @Res({ passthrough: true }) response: Response,
  ) {
    // if it got here it means that it has successfuly validated the refresh token
    // and no more validation and verification is needed
    // The only thing we need is to call getTokens to refresh it

    const user = req.user as User;
    const tokenData: JsonWebTokenCookieData = req.signedCookies[COOKIE_NAME];

    const data = await this.userService.getTokens(
      user.id,
      tokenData.refreshTokenId,
    );

    AuthCookieUtils.setAuthTokenCookie(
      response,
      {
        refreshToken: data.jwtRefreshToken,
        refreshTokenId: tokenData.refreshTokenId,
      },
      this.maxAge,
    );

    return {
      msg: 'success',
      data: {
        email: user.email,
        id: user.id,
        accessToken: data.jwtAccessToken,
      },
    };
  }

  @Put('change-password')
  @HttpCode(HttpStatus.OK)
  @UseGuards(AccessTokenGuard, RefreshTokenGuard)
  async changePassword(
    @Body() changePasswordDto: ChangePasswordDto,
    @Req() req: Request,
    @Res({ passthrough: true }) response: Response,
  ) {
    // the user must send both the access token as bearer and the refresh token as cookie to proceed

    const user = req.user as User;
    const tokenData: JsonWebTokenCookieData = req.signedCookies[COOKIE_NAME];

    const data = await this.userService.changePassword(
      user,
      changePasswordDto,
      tokenData.refreshTokenId,
    );

    AuthCookieUtils.setAuthTokenCookie(
      response,
      {
        refreshToken: data.tokens.jwtRefreshToken,
        refreshTokenId: tokenData.refreshTokenId,
      },
      this.maxAge,
    );
    return {
      msg: 'success',
      data: {
        email: data.user.email,
        id: data.user.id,
        accessToken: data.tokens.jwtAccessToken,
      },
    };
  }

  @Put('update-profile')
  @HttpCode(HttpStatus.OK)
  @UseGuards(AccessTokenGuard)
  updateUser(@Body() update: UpdateUserDto, @Req() req: Request) {
    const user = req.user as User;
    return this.userService.update(user.id, update);
  }
}

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

import { AuthCookieUtils, COOKIE_NAME } from '../common/cookies/cookie.utils';
import { AccessTokenGuard, RefreshTokenGuard } from '../common/guards';
import { JwtconfigService } from '../common/jwtconfig/jwtconfig.service';
import { SecretData } from '../common/types/jwt.payload';
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
    const data = await this.userService.localSignup(createUserDto);
    AuthCookieUtils.setAuthTokenCookie(response, data.tokens, this.maxAge);
    return { msg: 'success', data: { email: data.email, id: data.id } };
  }

  @Post('local/login')
  @HttpCode(HttpStatus.OK)
  async localLogin(
    @Body() loginDto: loginDto,
    @Res({ passthrough: true }) response: Response,
  ) {
    const data = await this.userService.localLogin(loginDto);
    AuthCookieUtils.setAuthTokenCookie(response, data.tokens, this.maxAge);
    return { msg: 'success', data: { email: data.email, id: data.id } };
  }

  @Post('logout')
  @UseGuards(AccessTokenGuard)
  @HttpCode(HttpStatus.OK)
  async logout(
    @Req() req: Request,
    @Res({ passthrough: true }) response: Response,
  ) {
    const user = req.user as User;
    const tokenData: SecretData = req.signedCookies[COOKIE_NAME];
    AuthCookieUtils.clearAuthTokenCookie(response);
    await this.userService.logout(user.id, tokenData.refreshTokenId);
    response.send({ msg: 'success' }).end();
  }

  @Post('refresh')
  @UseGuards(RefreshTokenGuard)
  @HttpCode(HttpStatus.OK)
  async refreshTokens(
    @Req() req: Request,
    @Res({ passthrough: true }) response: Response,
  ) {
    const user = req.user as User;
    const tokenData: SecretData = req.signedCookies[COOKIE_NAME];
    const data = await this.userService.refreshTokens(
      user.id,
      tokenData.jwtRefreshToken,
      tokenData.refreshTokenId,
    );
    AuthCookieUtils.setAuthTokenCookie(response, data, this.maxAge);
    return { msg: 'success', data: { email: user.email, id: user.id } };
  }

  @Put('change-password')
  @HttpCode(HttpStatus.OK)
  @UseGuards(AccessTokenGuard)
  async changePassword(
    @Body() changePasswordDto: ChangePasswordDto,
    @Req() req: Request,
    @Res({ passthrough: true }) response: Response,
  ) {
    const user = req.user as User;
    const tokenData: SecretData = req.signedCookies[COOKIE_NAME];
    const data = await this.userService.changePassword(
      user.id,
      changePasswordDto,
      tokenData.refreshTokenId,
    );
    AuthCookieUtils.setAuthTokenCookie(response, data.tokens, this.maxAge);
    return {
      msg: 'success',
      data: { email: data.user.email, id: data.user.id },
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

import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Put,
  Res,
  UseGuards,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { Response } from 'express';

import { CreateUserDto } from './dtos/create.user.dto';
import { loginDto } from './dtos/login.dto';

import { ChangePasswordDto } from './dtos/change.password.dto';
import { UpdateUserDto } from './dtos/update.user.dto';
import { UsersService } from './users.service';

import { GetCurrentUser, GetCurrentUserId } from '../common/decorators';
import { AccessTokenGuard, RefreshTokenGuard } from '../common/guards';

@Controller('users')
@ApiTags('users')
export class UsersController {
  constructor(private readonly userService: UsersService) { }

  @Post('local/signup')
  @HttpCode(HttpStatus.CREATED)
  localSignup(@Body() createUserDto: CreateUserDto, @Res({ passthrough: true }) response: Response,
  ) {
    return this.userService.localSignup(createUserDto, response);
  }

  @Post('local/login')
  @HttpCode(HttpStatus.OK)
  localLogin(@Body() loginDto: loginDto, @Res({ passthrough: true }) response: Response,
  ) {
    return this.userService.localLogin(loginDto, response);
  }

  @Post('logout')
  @UseGuards(AccessTokenGuard)
  @HttpCode(HttpStatus.OK)
  logout(@GetCurrentUserId() userId: string, @Res({ passthrough: true }) response: Response,
  ) {
    return this.userService.logout(userId, response);
  }

  @Post('refresh')
  @UseGuards(RefreshTokenGuard)
  @HttpCode(HttpStatus.OK)
  refreshTokens(
    @GetCurrentUserId() userId: string,
    @GetCurrentUser('refreshToken') refreshToken: string, @Res({ passthrough: true }) response: Response,

  ) {
    return this.userService.refreshTokens(userId, refreshToken, response);
  }

  @Put('change-password')
  @HttpCode(HttpStatus.OK)
  @UseGuards(AccessTokenGuard)
  changePassword(
    @Body() changePasswordDto: ChangePasswordDto,
    @GetCurrentUserId() userId: string, @Res({ passthrough: true }) response: Response,

  ) {
    return this.userService.changePassword(userId, changePasswordDto, response);
  }

  @Put('update-profile')
  @HttpCode(HttpStatus.OK)
  @UseGuards(AccessTokenGuard)
  updateUser(
    @Body() update: UpdateUserDto,
    @GetCurrentUserId() userId: string,

  ) {
    return this.userService.update(userId, update);
  }
}

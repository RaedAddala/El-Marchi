import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Put,
  Req,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { CreateUserDto } from './dtos/create.user.dto';
import { loginDto } from './dtos/login.dto';

import { ChangePasswordDto } from './dtos/change.password.dto';
import { UpdateUserDto } from './dtos/update.user.dto';
import { UsersService } from './users.service';
import { AuthGuard } from '@nestjs/passport';


import { Request } from "express";
import { JWTPayload } from '../common/types/jwt.payload';
@Controller('users')
@ApiTags('users')
export class UsersController {
  constructor(private readonly userService: UsersService) { }

  @Post('local/signup')
  @HttpCode(HttpStatus.CREATED)
  localSignup(@Body() createUserDto: CreateUserDto) {
    return this.userService.localSignup(createUserDto);
  }

  @Post('local/login')
  @HttpCode(HttpStatus.OK)
  localLogin(@Body() loginDto: loginDto) {
    return this.userService.localLogin(loginDto);
  }

  @Post('logout')
  @UseGuards(AuthGuard('jwt'))
  @HttpCode(HttpStatus.OK)
  logout(@Req() req: Request) {
    const user = req.user as JWTPayload;
    return this.userService.logout(user.sub);
  }

  @Post('refresh')
  @UseGuards(AuthGuard('jwt-refresh'))
  @HttpCode(HttpStatus.OK)
  refreshTokens(@Req() req: Request) {
    const user = req.user as JWTPayload & { refreshToken: string };
    return this.userService.refreshTokens(user.sub, user.refreshToken);
  }

  @Put('change-password')
  @HttpCode(HttpStatus.OK)
  @UseGuards(AuthGuard('jwt'))
  changePassword(
    @Body() changePasswordDto: ChangePasswordDto,
    @Req() req: Request,
  ) {
    const user = req.user as JWTPayload;
    return this.userService.changePassword(user.sub, changePasswordDto);
  }

  @Put('update-profile')
  @HttpCode(HttpStatus.OK)
  @UseGuards(AuthGuard('jwt'))
  updateUser(@Body() update: UpdateUserDto, @Req() req: Request) {
    const user = req.user as JWTPayload;
    if (!user) {
      throw new UnauthorizedException();
    }
    return this.userService.update(user.sub, update);
  }
}

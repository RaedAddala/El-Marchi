import { Body, Controller, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { CreateUserDto } from './dtos/create.user.dto';
import { loginDto } from './dtos/login.dto';

import { RefreshTokensType } from './dtos/refresh.token.dto';
import { UsersService } from './users.service';

@Controller('users')
@ApiTags('users')
export class UsersController {
  constructor(private readonly userService: UsersService) {}

  @Post('signup')
  signup(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }

  @Post('login')
  login(@Body() loginDto: loginDto) {
    return this.userService.login(loginDto);
  }

  @Post('refresh')
  refreshTokens(@Body() refreshTokensDto: RefreshTokensType) {
    return this.userService.refreshTokens(refreshTokensDto);
  }
}

import {
  Body,
  Controller,
  Post,
  Put,
  Req,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { CreateUserDto } from './dtos/create.user.dto';
import { loginDto } from './dtos/login.dto';

import { UsedRequest } from '../common/request/request.def';
import { ChangePasswordDto } from './dtos/change.password.dto';
import { RefreshTokensType } from './dtos/refresh.token.dto';
import { UpdateUserDto } from './dtos/update.user.dto';
import { AuthGuard } from './guards/auth.guard';
import { UsersService } from './users.service';

@Controller('users')
@ApiTags('users')
export class UsersController {
  constructor(private readonly userService: UsersService) {}

  @Post('/local/signup')
  localSignup(@Body() createUserDto: CreateUserDto) {
    return this.userService.localSignup(createUserDto);
  }

  @Post('/local/login')
  localLogin(@Body() loginDto: loginDto) {
    return this.userService.localLogin(loginDto);
  }

  @Post('logout')
  logout() {
    return this.userService.logout();
  }

  @Post('refresh')
  refreshTokens(@Body() refreshTokensDto: RefreshTokensType) {
    return this.userService.refreshTokens(refreshTokensDto);
  }

  @UseGuards(AuthGuard)
  @Put('change-password')
  changePassword(
    @Body() changePasswordDto: ChangePasswordDto,
    @Req() req: UsedRequest,
  ) {
    return this.userService.changePassword(req.userId, changePasswordDto);
  }

  @UseGuards(AuthGuard)
  @Put('update-profile')
  updateUser(@Body() update: UpdateUserDto, @Req() req: UsedRequest) {
    if (!req.userId) {
      throw new UnauthorizedException();
    }
    return this.userService.update(req.userId, update);
  }
}

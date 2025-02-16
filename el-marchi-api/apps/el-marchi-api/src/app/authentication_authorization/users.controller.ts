import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Put,
  Query,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import {
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

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
import { PaginationQueryDto } from './dtos/pagination.dto';
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
  @ApiOperation({ summary: 'Signup using a local strategy' })
  @ApiResponse({
    status: HttpStatus.OK,
    description:
      'Returns the refresh token as a HTTP-Only Cookie and the access token in the Response JSON Body',
  })
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
  @ApiOperation({ summary: 'Login using a local strategy' })
  @ApiResponse({
    status: HttpStatus.OK,
    description:
      'Returns the refresh token as a HTTP-Only Cookie and the access token in the Response JSON Body',
  })
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
  @ApiOperation({
    summary: 'Invalidates the refresh token related to this session',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Returns success',
  })
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
  @ApiOperation({
    summary: 'Invalidates all refresh tokens related to this user',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Returns success',
  })
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
  @ApiOperation({ summary: 'Refresh the tokens' })
  @ApiResponse({
    status: HttpStatus.OK,
    description:
      'Returns the refresh token as a HTTP-Only Cookie and the access token in the Response JSON Body',
  })
  @ApiResponse({
    status: HttpStatus.FORBIDDEN,
    description:
      'You cannot access this resource if you are not allowed to access it',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'You have to give Valid Credentials to access this resource',
  })
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
  @ApiOperation({ summary: "update a user's password" })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Returns the updated user',
  })
  @ApiResponse({
    status: HttpStatus.FORBIDDEN,
    description:
      'You cannot access this resource if you are not allowed to access it',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'You have to give Valid Credentials to access this resource',
  })
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
  @ApiOperation({ summary: "update a user's profile" })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Returns the updated user',
  })
  @ApiResponse({
    status: HttpStatus.FORBIDDEN,
    description:
      'You cannot access this resource if you are not allowed to access it',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'You have to give Valid Credentials to access this resource',
  })
  updateUser(@Body() update: UpdateUserDto, @Req() req: Request) {
    const user = req.user as User;
    return this.userService.update(user.id, update);
  }

  @Put('update-profile/:id')
  @HttpCode(HttpStatus.OK)
  @UseGuards(AccessTokenGuard)
  @ApiOperation({ summary: "update a user's profile" })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Returns the updated user',
  })
  @ApiResponse({
    status: HttpStatus.FORBIDDEN,
    description:
      'You cannot access this resource if you are not allowed to access it',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'You have to give Valid Credentials to access this resource',
  })
  @ApiParam({
    name: 'id',
    type: String,
    required: true,
    description: 'The Id of the user you want to update!',
  })
  updateUserBySomeoneElse(
    @Body() update: UpdateUserDto,
    @Param('id') id: string,
  ) {
    return this.userService.update(id, update);
  }

  @Get('/profile')
  @HttpCode(HttpStatus.OK)
  @UseGuards(AccessTokenGuard)
  @ApiOperation({ summary: "Gets a user's profile" })
  @ApiResponse({
    status: HttpStatus.OK,
    description: "a user's profile",
  })
  @ApiResponse({
    status: HttpStatus.FORBIDDEN,
    description:
      'You cannot access this resource if you are not allowed to access it',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'You have to give Valid Credentials to access this resource',
  })
  getProfile(@Req() req: Request) {
    return this.userService.findOne((req.user as User).id);
  }

  @Get('/profile/all')
  @HttpCode(HttpStatus.OK)
  @UseGuards(AccessTokenGuard)
  @ApiOperation({ summary: 'Get all users with pagination and search' })
  @ApiQuery({
    type: PaginationQueryDto,
    required: false,
    description: 'Query Params needed for Pagination',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Returns paginated list of users',
  })
  @ApiResponse({
    status: HttpStatus.FORBIDDEN,
    description:
      'You cannot access this resource if you are not allowed to access it',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'You have to give Valid Credentials to access this resource',
  })
  async getAllUsers(@Query() query: PaginationQueryDto) {
    const defaultSearchFields: Array<keyof User> = [
      'firstName',
      'lastName',
      'email',
      'phoneNumber',
    ];

    return this.userService.findWithPagination(
      query.page,
      query.limit,
      query.search,
      query.searchFields || defaultSearchFields,
    );
  }

  @Get('/profile/:id')
  @HttpCode(HttpStatus.OK)
  @UseGuards(AccessTokenGuard)
  @ApiOperation({ summary: "Gets a user's profile" })
  @ApiParam({
    name: 'id',
    type: String,
    required: true,
    description: 'The Id of the user you want to retrieve!',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: "a user's profile",
  })
  @ApiResponse({
    status: HttpStatus.FORBIDDEN,
    description:
      'You cannot access this resource if you are not allowed to access it',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'You have to give Valid Credentials to access this resource',
  })
  getUserProfile(@Param('id') id: string) {
    return this.userService.findOne(id);
  }
}

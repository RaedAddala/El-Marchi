import { Controller, Get, Logger, Req, UseGuards } from '@nestjs/common';
import { AppService } from './app.service';
import { AuthGuard } from './users/guards/auth.guard';
import { jwtStruct } from './users/dtos/jwt.struct';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) { }

  @Get('')
  getData() {
    return this.appService.getData();
  }

  @UseGuards(AuthGuard)
  @Get('/protected')
  getDataProtected(@Req() req: jwtStruct) {
    Logger.log(`User Id is: ${req.userId}!`)
    return this.appService.getData();
  }
}

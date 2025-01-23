import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {
    console.log('AppController constructor called');
    console.log('AppService in constructor:', appService);
  }
  @Get()
  getData() {
    console.log('Controller getData method called');
    return this.appService.getData();
  }
}

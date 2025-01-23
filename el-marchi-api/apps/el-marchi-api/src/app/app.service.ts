import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  constructor() {
    console.log('AppService constructor called');
  }

  getData(): { message: string } {
    console.log('getData method called');

    return { message: 'Hello API' };
  }
}

import { Test, TestingModule } from '@nestjs/testing';
import { JwtconfigService } from './jwtconfig.service';

describe('JwtconfigService', () => {
  let service: JwtconfigService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [JwtconfigService],
    }).compile();

    service = module.get<JwtconfigService>(JwtconfigService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});

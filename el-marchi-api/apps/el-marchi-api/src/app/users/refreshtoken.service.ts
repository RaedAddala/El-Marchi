import {
  Injectable,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BaseService } from '../common/database/base.service';
import { RefreshToken } from './entities/refreshToken.entity';

@Injectable()
export class RefreshTokenService extends BaseService<RefreshToken> {

  constructor(
    @InjectRepository(RefreshToken)
    repository: Repository<RefreshToken>,
  ) {
    super(repository);
  }
}

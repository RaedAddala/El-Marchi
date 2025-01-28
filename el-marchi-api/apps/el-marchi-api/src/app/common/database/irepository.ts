import { BaseEntity } from './base.entity';
import { PaginatedResponse, PaginationOptions } from './types';
import { DeepPartial } from 'typeorm';

export interface IRepository<T extends BaseEntity> {
  findAll(options?: PaginationOptions): Promise<PaginatedResponse<T>>;
  findById(id: string): Promise<T | null>;
  create(data: DeepPartial<T>): Promise<T>;
  update(id: string, data: DeepPartial<T>): Promise<T | null>;
  softDelete(id: string): Promise<boolean>;
  hardDelete(id: string): Promise<boolean>;
  restore(id: string): Promise<boolean>;
}

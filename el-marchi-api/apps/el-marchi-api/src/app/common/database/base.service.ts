import { IRepository } from './irepository';
import { BaseEntity } from './base.entity';
import { PaginatedResponse, PaginationOptions } from './types';
import { DeepPartial } from 'typeorm';

export abstract class BaseService<T extends BaseEntity> {
  constructor(protected readonly repository: IRepository<T>) { }

  async findAll(options?: PaginationOptions): Promise<PaginatedResponse<T>> {
    return this.repository.findAll(options);
  }

  async findById(id: string): Promise<T | null> {
    return this.repository.findById(id);
  }

  async create(data: DeepPartial<T>): Promise<T> {
    return this.repository.create(data);
  }

  async update(id: string, data: DeepPartial<T>): Promise<T | null> {
    return this.repository.update(id, data);
  }

  async softDelete(id: string): Promise<boolean> {
    return this.repository.softDelete(id);
  }

  async hardDelete(id: string): Promise<boolean> {
    return this.repository.hardDelete(id);
  }

  async restore(id: string): Promise<boolean> {
    return this.repository.restore(id);
  }
}

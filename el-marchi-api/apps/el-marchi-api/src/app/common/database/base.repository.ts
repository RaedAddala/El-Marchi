import { Repository, FindOptionsWhere, DeepPartial } from 'typeorm';
import { IRepository } from './irepository';
import { BaseEntity } from './base.entity';
import { PaginatedResponse, PaginationOptions } from './types';

export abstract class BaseRepository<T extends BaseEntity> implements IRepository<T> {
  constructor(protected readonly repository: Repository<T>) { }

  async findAll(options?: PaginationOptions): Promise<PaginatedResponse<T>> {
    const page = options?.page || 1;
    const limit = options?.limit || 10;
    const skip = (page - 1) * limit;

    const [items, total] = await this.repository.findAndCount({
      skip,
      take: limit,
      withDeleted: false,
    });

    return {
      items,
      total,
      page,
      limit,
    };
  }

  async findById(id: string): Promise<T | null> {
    const entity = await this.repository.findOne({
      where: { id } as FindOptionsWhere<T>,
      withDeleted: false,
    });

    return entity;
  }

  async create(data: DeepPartial<T>): Promise<T> {
    const entity = this.repository.create(data);
    return await this.repository.save(entity);
  }

  async update(id: string, data: DeepPartial<T>): Promise<T | null> {
    const entity = await this.findById(id);
    if (!entity) {
      return null;
    }

    Object.assign(entity, data);
    return await this.repository.save(entity);
  }

  async softDelete(id: string): Promise<boolean> {
    const result = await this.repository.softDelete({ id } as FindOptionsWhere<T>);
    return result.affected ? result.affected > 0 : false;
  }

  async hardDelete(id: string): Promise<boolean> {
    const result = await this.repository.delete({ id } as FindOptionsWhere<T>);
    return result.affected ? result.affected > 0 : false;
  }

  async restore(id: string): Promise<boolean> {
    const result = await this.repository.restore({ id } as FindOptionsWhere<T>);
    return result.affected ? result.affected > 0 : false;
  }
}

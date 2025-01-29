import { Injectable, NotFoundException } from '@nestjs/common';
import {
  DeepPartial,
  FindManyOptions,
  FindOneOptions,
  FindOptionsWhere,
  ILike,
  Repository,
} from 'typeorm';
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity.js';
import { BaseEntity } from './base.entity';
import { IBaseService, SearchCondition } from './base.interface';

@Injectable()
export abstract class BaseService<T extends BaseEntity>
  implements IBaseService<T>
{
  constructor(protected readonly repository: Repository<T>) {}

  async create(data: DeepPartial<T>): Promise<T> {
    const entity = this.repository.create(data);
    return await this.repository.save(entity);
  }

  async findOne(id: string): Promise<T | null> {
    return await this.repository.findOne({
      where: {
        id: id,
      } as FindOptionsWhere<T>,
    });
  }

  async findOneOrFail(id: string): Promise<T> {
    const entity = await this.findOne(id);
    if (!entity) {
      throw new NotFoundException(`Entity with ID "${id}" not found`);
    }
    return entity;
  }

  async findOneBy(options?: FindOptionsWhere<T>): Promise<T | null> {
    const findOptions: FindOneOptions<T> = {};
    if (options) {
      findOptions.where = options;
    }
    return await this.repository.findOne(findOptions);
  }

  async findOneByOrFail(options?: FindOptionsWhere<T>): Promise<T> {
    const findOptions: FindOneOptions<T> = {};
    if (options) {
      findOptions.where = options;
    }
    if (!Array.isArray(findOptions.where)) {
      const entity = await this.findOneBy(
        findOptions.where as FindOptionsWhere<T>,
      );
      if (!entity) {
        throw new NotFoundException(
          `Couldn't find Entity with Parameters "${JSON.stringify(
            findOptions,
            null,
            4,
          )}"!`,
        );
      }
      return entity;
    } else {
      throw new NotFoundException(
        `Couldn't find Entity with Parameters "${JSON.stringify(
          findOptions,
          null,
          4,
        )}"!`,
      );
    }
  }

  async findAll(options?: FindOptionsWhere<T>): Promise<T[]> {
    const findOptions: FindManyOptions<T> = {};
    if (options) {
      findOptions.where = options;
    }
    return await this.repository.find(findOptions);
  }

  async update(id: string, data: DeepPartial<T>): Promise<T> {
    await this.findOneOrFail(id);
    await this.repository.update(
      { id: id } as FindOptionsWhere<T>,
      data as QueryDeepPartialEntity<T>,
    );
    const updated = await this.findOne(id);
    if (!updated) {
      throw new NotFoundException(
        `Entity with ID "${id}" not found after update`,
      );
    }
    return updated;
  }

  async softDelete(id: string): Promise<boolean> {
    await this.findOneOrFail(id);
    const result = await this.repository.softDelete({
      id: id,
    } as FindOptionsWhere<T>);
    return result.affected ? result.affected > 0 : false;
  }

  async hardDelete(id: string): Promise<boolean> {
    await this.findOneOrFail(id);
    const result = await this.repository.delete({
      id: id,
    } as FindOptionsWhere<T>);
    return result.affected ? result.affected > 0 : false;
  }

  async restore(id: string): Promise<boolean> {
    const result = await this.repository.restore({
      id: id,
    } as FindOptionsWhere<T>);
    return result.affected ? result.affected > 0 : false;
  }

  async findWithPagination(
    page = 1,
    limit = 10,
    search?: string,
    searchFields?: Array<keyof T & string>,
  ): Promise<{
    data: T[];
    total: number;
    page: number;
    lastPage: number;
  }> {
    const skip = (page - 1) * limit;
    const findOptions: FindManyOptions<T> = {
      skip,
      take: limit,
    };

    if (search && searchFields && searchFields.length > 0) {
      const whereCondition = searchFields.reduce((acc, field) => {
        acc[field] = ILike(`%${search}%`);
        return acc;
      }, {} as SearchCondition<T>);

      findOptions.where = whereCondition as FindOptionsWhere<T>;
    }

    const [data, total] = await this.repository.findAndCount(findOptions);

    return {
      data,
      total,
      page,
      lastPage: Math.ceil(total / limit),
    };
  }
}

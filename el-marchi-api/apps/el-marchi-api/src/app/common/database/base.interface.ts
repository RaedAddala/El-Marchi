import { BaseEntity } from './base.entity';
import {
  DeepPartial,
  FindOptionsWhere,
  FindOperator
} from 'typeorm';

export type SearchCondition<T> = {
  [P in keyof T & string]?: FindOperator<string>;
};

export interface IBaseService<T extends BaseEntity> {
  create(data: DeepPartial<T>): Promise<T>;
  findOne(id: string): Promise<T | null>;
  findOneOrFail(id: string): Promise<T>;
  findAll(options?: FindOptionsWhere<T>): Promise<T[]>;
  update(id: string, data: DeepPartial<T>): Promise<T>;
  softDelete(id: string): Promise<boolean>;
  hardDelete(id: string): Promise<boolean>;
  restore(id: string): Promise<boolean>;
  findWithPagination(
    page?: number,
    limit?: number,
    search?: string,
    searchFields?: Array<keyof T & string>
  ): Promise<{
    data: T[];
    total: number;
    page: number;
    lastPage: number;
  }>;
}

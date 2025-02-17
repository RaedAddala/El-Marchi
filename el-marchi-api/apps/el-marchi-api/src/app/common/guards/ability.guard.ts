import * as Mustache from 'mustache';
import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  NotFoundException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { DataSource } from 'typeorm';


import {
  MongoAbility,
  createMongoAbility,
  ForbiddenError,
  subject as caslSubject,
  ExtractSubjectType,
} from '@casl/ability';
import { MongoQuery } from '@casl/ability';
import { Action, Subjects } from './casl.enum';
import { REQUIRED_PERMISSIONS_METADATA_KEY, RequiredPermission } from '../decorators/permissions.decorators';
import { User } from '../../authentication_authorization/entities/user.entity';
import { Permission } from '../../authentication_authorization/entities/permission.entity';
import { Trader } from '../../traders/entities/trader.entity';
import { Customer } from '../../customers/entities/customer.entity';

import { Role } from '../../authentication_authorization/entities/role.entity';
import { Organization } from '../../organizations/entities/organization.entity';
import { Product } from '../../products/entities/products.entitiy';
type AppAbility = MongoAbility<[Action, Subjects], MongoQuery>;

@Injectable()
export class PermissionsGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private dataSource: DataSource,
  ) { }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredPermissions = this.reflector.get<RequiredPermission[]>(
      REQUIRED_PERMISSIONS_METADATA_KEY,
      context.getHandler(),
    ) || [];

    const request = context.switchToHttp().getRequest();
    const user: User = request.user as User;

    if (!user) throw new NotFoundException('User not found');

    // Aggregate all permissions
    const allPermissions = [
      ...(user.permissions ? user.permissions : []),
      ...(user.roles?.flatMap(role => role.permissions ? role.permissions : []) || []),
    ];

    // Parse conditions in permissions
    const parsedPermissions = this.parseConditions(allPermissions, user);

    // Create CASL ability
    const ability = createMongoAbility<AppAbility>(
      parsedPermissions.map(p => ({
        action: p.action,
        subject: p.subject as ExtractSubjectType<Subjects>,
        conditions: p.conditions,
        inverted: p.inverted,
      })),
    );

    try {
      for (const required of requiredPermissions) {
        let subjectInstance = null;
        const subjectId = request.params.id;

        // Fetch subject instance if ID exists in params
        if (subjectId) {
          subjectInstance = await this.getSubjectById(subjectId, required.subject as string);
        }

        const subjectToCheck = subjectInstance
          ? caslSubject(required.subject as string, subjectInstance)
          : required.subject;

        ForbiddenError.from(ability).throwUnlessCan(
          required.action,
          subjectToCheck as Subjects,
        );
      }
      return true;
    } catch (error) {
      if (error instanceof ForbiddenError) {
        throw new ForbiddenException(error.message);
      }
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new ForbiddenException('Authorization failed');
    }
  }

  private parseConditions(permissions: Permission[], user: User): Permission[] {
    return permissions.map(permission => {
      if (!permission.conditions) return permission;

      const renderedConditions = Object.entries(permission.conditions).reduce(
        (acc, [key, value]) => {
          if (typeof value === 'string') {
            acc[key] = Mustache.render(value, user);

            if (!isNaN(Number(acc[key]))) acc[key] = Number(acc[key]);
          } else {
            acc[key] = value;
          }
          return acc;
        },
        {} as MongoQuery,
      );

      return { ...permission, conditions: renderedConditions };
    });
  }

  private async getSubjectById(id: string, subjectName: string) {
    const entityMap: Record<string, any> = {
      User: User,
      Trader: Trader,
      Customer: Customer,
      Product: Product,
      Role: Role,
      Permission: Permission,
      Organization: Organization,
    };

    const entityClass = entityMap[subjectName];
    if (!entityClass) throw new NotFoundException('Invalid subject');

    const repository = this.dataSource.getRepository(entityClass);
    const subject = await repository.findOne({ where: { id: Number(id) } });
    if (!subject) throw new NotFoundException(`${subjectName} not found`);
    return subject;
  }
}

import { MongoQuery } from '@casl/ability';
import { SetMetadata } from '@nestjs/common';
import { Action, Subjects } from '../guards/casl.enum';

export const REQUIRED_PERMISSIONS_METADATA_KEY = 'REQUIRED_PERMISSIONS';

export type RequiredPermission = {
  action: Action;
  subject: Subjects;
  conditions?: MongoQuery;
};

/**
 * Decorator to specify required permissions for a route or controller
 * @param permissions Array of required permissions with action, subject and optional MongoDB query conditions
 * @example
 * @RequiredPermissions([
 *   {
 *     action: Action.Read,
 *     subject: 'User',
 *     conditions: { organizationId: { $eq: 123 } }
 *   }
 * ])
 */
export const RequiredPermissions = (permissions: RequiredPermission[]) =>
  SetMetadata(REQUIRED_PERMISSIONS_METADATA_KEY, permissions);

export const CanRead = (subject: Subjects, conditions?: MongoQuery) =>
  RequiredPermissions([
    { action: Action.Read, subject: subject, conditions: conditions },
  ]);

export const CanCreate = (subject: Subjects, conditions?: MongoQuery) =>
  RequiredPermissions([
    { action: Action.Create, subject: subject, conditions: conditions },
  ]);

export const CanUpdate = (subject: Subjects, conditions?: MongoQuery) =>
  RequiredPermissions([
    { action: Action.Update, subject: subject, conditions: conditions },
  ]);

export const CanDelete = (subject: Subjects, conditions?: MongoQuery) =>
  RequiredPermissions([
    { action: Action.Delete, subject: subject, conditions: conditions },
  ]);

export const CanManage = (subject: Subjects, conditions?: MongoQuery) =>
  RequiredPermissions([
    { action: Action.Manage, subject: subject, conditions: conditions },
  ]);

/**
 * Decorator for specifying multiple permission requirements for a single subject
 *
 * @param subject - The entity or resource being accessed (e.g., 'User', 'Order')
 * @param actions - Array of actions required (e.g., [Action.Read, Action.Update])
 * @param conditions - Optional MongoDB query conditions to fine-tune permission checks
 *
 * @example
 * // Basic usage - require both read and update permissions on users
 * @HasPermissions('User', [Action.Read, Action.Update])
 *
 * @example
 * // With conditions - only allow access to users in the same organization
 * @HasPermissions('User', [Action.Read, Action.Update], {
 *   organizationId: { $eq: ':orgId' }
 * })
 *
 * @example
 * // Multiple actions with complex conditions
 * @HasPermissions('Order', [Action.Read, Action.Update, Action.Delete], {
 *   $and: [
 *     { status: { $ne: 'completed' } },
 *     { createdBy: { $eq: ':userId' } }
 *   ]
 * })
 *
 * @throws {ForbiddenException} - When used with a guard, will throw if user lacks any of the required permissions
 * @returns {MethodDecorator & ClassDecorator} - Can be used on both methods and classes
 */
export const HasPermissions = (
  subject: Subjects,
  actions: Action[],
  conditions?: MongoQuery,
) =>
  RequiredPermissions(actions.map(action => ({ action, subject, conditions })));

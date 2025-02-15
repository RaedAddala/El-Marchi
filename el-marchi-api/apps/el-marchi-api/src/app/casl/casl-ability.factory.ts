import {
  createMongoAbility,
  InferSubjects,
  MongoAbility,
  MongoQuery,
  RawRuleOf,
} from '@casl/ability';
import { entitiesList } from '../common/entities/entities';

export enum Action {
  Manage = 'manage',
  Create = 'create',
  Read = 'read',
  Update = 'update',
  Delete = 'delete',
}

export enum Roles {
  // El-Marchi Staff roles
  Admin = 'Admin',
  Manager = 'Manager',

  // Normal Users possible roles
  User = 'User',
  Trader = 'Trader',
  Customer = 'Customer',

  // Entreprise Related Roles
  EntrepriseChief = 'EntrepriseChief',
  EntrepriseStaff = 'EntrepriseStaff',
}

export type EntityTypes = (typeof entitiesList)[number];
export type Subjects = InferSubjects<EntityTypes> | 'all';
export type AppAbility = MongoAbility<[Action, Subjects], MongoQuery>;

export class CaslAbilityFactory {}

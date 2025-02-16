import { Permission } from '../../authentication_authorization/entities/permission.entity';
import { Role } from '../../authentication_authorization/entities/role.entity';
import { User } from '../../authentication_authorization/entities/user.entity';
import { Customer } from '../../customers/entities/customer.entity';
import { Organization } from '../../organizations/entities/organization.entity';
import { Product } from '../../products/entities/product.entity';
import { Trader } from '../../traders/entities/trader.entity';

const entitiesList = [
  User,
  Trader,
  Customer,
  Product,
  Role,
  Permission,
  Organization,
];
export { entitiesList };

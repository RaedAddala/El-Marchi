import { User } from '../../authentication_authorization/entities/user.entity';
import { Customer } from '../../customers/entities/customer.entity';
import { Product } from '../../products/entities/product.entity';
import { Trader } from '../../traders/entities/trader.entity';

const entitiesList = [User, Trader, Customer, Product];
export { entitiesList };

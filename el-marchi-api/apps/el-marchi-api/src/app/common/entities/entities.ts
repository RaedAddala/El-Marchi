import { RefreshToken } from '../../users/entities/refreshToken.entity';
import { User } from '../../users/entities/user.entity';
import {Category} from "../../categories/entities/category.entity";
import {SubCategory} from "../../categories/entities/subCategory.entity";
import {Product} from "../../products/entities/products.entitiy";

const entitiesList = [User, RefreshToken,Category,SubCategory,Product];
export { entitiesList };

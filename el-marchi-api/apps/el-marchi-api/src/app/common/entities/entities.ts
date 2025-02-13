import { RefreshToken } from '../../users/entities/refreshToken.entity';
import { User } from '../../users/entities/user.entity';
import {Category} from "../../categories/entities/category.entity";
import {SubCategory} from "../../categories/entities/subCategory.entity";

const entitiesList = [User, RefreshToken,Category,SubCategory];
export { entitiesList };

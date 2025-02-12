import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { fromZodError } from 'zod-validation-error';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './authentication_authorization/users.module';
import { CategoriesModule } from './categories/categories.module';
import { EnvConfig, envSchema } from './common/config/env.schema';
import { entitiesList } from './common/entities/entities';
import { JwtconfigService } from './common/jwtconfig/jwtconfig.service';
import { RedisService } from './common/redis/redis.service';
import { CouponsModule } from './coupons/coupons.module';
import { CryptoService } from './crypto/crypto.service';
import { CustomersModule } from './customers/customers.module';
import { DiscountsModule } from './discounts/discounts.module';
import { InvoicesModule } from './invoices/invoices.module';
import { OrdersModule } from './orders/orders.module';
import { OrderitemsModule } from './ordersitems/orderitems.module';
import { PaymentsModule } from './payments/payments.module';
import { PermissionsModule } from './permissions/permissions.module';
import { ProductsModule } from './products/products.module';
import { RatesModule } from './rates/rates.module';
import { RolesModule } from './roles/roles.module';
import { SellingPointsModule } from './sellingPoints/selling-points.module';
import { StockHistoryModule } from './stockHistory/stock-history.module';
import { SubCategoriesModule } from './subCategories/sub-categories.module';
import { TradersModule } from './traders/traders.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      validate: env => {
        const result = envSchema.safeParse(env);
        if (!result.success) {
          const formattedError = fromZodError(result.error, {
            prefix: '❌ Environment configuration error',
            prefixSeparator: '\n- ',
            issueSeparator: '\n- ',
          });

          console.error(formattedError.message);
          process.exit(1);
        }
        return result.data;
      },
      isGlobal: true,
      cache: true,
      envFilePath: ['.env'],
    }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: async (
        config: ConfigService<EnvConfig, true>,
      ): Promise<TypeOrmModuleOptions> => {
        const mode = config.get<EnvConfig['MODE']>('MODE');
        return {
          type: 'postgres',
          host: config.get<EnvConfig['DB_HOSTNAME']>('DB_HOSTNAME'),
          port: config.get<EnvConfig['DB_PORT']>('DB_PORT'),
          username: config.get<EnvConfig['DB_USERNAME']>('DB_USERNAME'),
          password: config.get<EnvConfig['DB_PASSWORD']>('DB_PASSWORD'),
          database: config.get<EnvConfig['DB_NAME']>('DB_NAME'),
          entities: entitiesList,
          synchronize: mode == 'development',
          cache: mode == 'production',
          logging: mode == 'development' ? 'all' : ['error', 'warn', 'info'],
        };
      },
    }),
    JwtModule.register({
      global: true,
      verifyOptions: {
        algorithms: ['ES256'],
      },
      signOptions: {
        algorithm: 'ES256',
      },
    }),
    UsersModule,
    ProductsModule,
    OrdersModule,
    CategoriesModule,
    SubCategoriesModule,
    RolesModule,
    PermissionsModule,
    StockHistoryModule,
    OrderitemsModule,
    RatesModule,
    PaymentsModule,
    DiscountsModule,
    SellingPointsModule,
    InvoicesModule,
    CustomersModule,
    TradersModule,
    CouponsModule,
  ],
  controllers: [AppController],
  providers: [AppService, CryptoService, JwtconfigService, RedisService],
})
export class AppModule {}

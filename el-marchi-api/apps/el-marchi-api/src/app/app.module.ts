import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { fromZodError } from 'zod-validation-error';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { EnvConfig, envSchema } from './common/config/env.schema';
import { entitiesList } from './common/entities/entities';
import { jwtFactory } from './common/jwt/jwt.def';
import { UsersModule } from './users/users.module';
import {CategoriesModule} from "./categories/categories.module";
import { ProductModule } from './products/products.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';

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
    ServeStaticModule.forRoot({
      rootPath: join(__dirname,'..', '..', '..', 'uploads'), // Path to your uploads directory
      serveRoot: '/uploads', // Route to serve static files
    }),
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: jwtFactory,
    }),
    UsersModule,
    CategoriesModule,
    ProductModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

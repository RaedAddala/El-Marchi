import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { envSchema } from './common/config/env.schema';
import { fromZodError } from 'zod-validation-error';


@Module({
  imports: [
    ConfigModule.forRoot({
      validate: (env) => {
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
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }

# El-Marchi-API App Usage and Developement

Here, I explain different things used in the code so it would be easier for anyone to catch on with these details when developing new features.

## 🛠 Configuration & Validation

This project uses Zod for type-safe environment configuration and request validation. Here's how to use it:

### 1. Environment Variables

As I mentionned in the main README.MD file, in order to start working you have to follow the examples:
Create the `.env` file using one of the two templates `.env.dev.example` or `.env.prod.example` and Fill the placeholders.

```bash
cp .env.dev.example .env
# OR
cp .env.prod.example .env
```

### 2. Adding New Variables

In order to add new environment variables to the project, follow these steps:

1. Update the schema in `src/app/common/config/env.schema.ts`:

    ```typescript
    export const envSchema = z.object({
      NEW_VARIABLE: z.string().min(5), // What ever you need
    });
    ```

2. Add to your `.env` file:

    ```env
    NEW_VARIABLE=value
    ```

### 3. Using Configuration

Access config values in services:

```typescript
import { ConfigService } from '@nestjs/config';

@Injectable()
export class MyService {
  constructor(private config: ConfigService) {
    const dbUrl = this.config.get('DATABASE_URL');
  }
}
```

### 4. Request Validation

Create DTOs using Zod:

```typescript
// src/users/dto/create-user.dto.ts
export class CreateUserDto extends createZodDto(
  z.object({
    email: z.string().email(),
    password: z.string().min(8),
  })
) {}
```

Use in controllers:

```typescript
@Post()
createUser(@Body() dto: CreateUserDto) {
  // dto is automatically validated
}
```

### 5. Error Handling

Validation errors will return formatted responses:

```json
{
  "statusCode": 400,
  "message": "Validation failed",
  "errors": [
    {
      "path": ["email"],
      "message": "Invalid email"
    }
  ]
}
```

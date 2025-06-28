# Environment Variables with Zod

This project uses [Zod](https://zod.dev/) to parse and validate environment variables from a `.env` file. This provides type safety, runtime validation, and better error messages.

## Setup

1. **Create a `.env` file** in your project root based on the `.env.example` file:

```bash
cp .env.example .env
```

2. **Fill in your actual values** in the `.env` file:

```env
# Database Configuration
DB_FILE_NAME=shortlink.db

# Admin Configuration
ADMIN_API_KEY=your-actual-secret-key-here

# Server Configuration (optional)
PORT=3000
```

## How It Works

### 1. Environment Schema Definition

The schema is defined in `src/config/env.ts`:

```typescript
const envSchema = z.object({
  DB_FILE_NAME: z.string().min(1, 'Database file name is required'),
  ADMIN_API_KEY: z.string().min(1, 'Admin API key is required'),
  PORT: z
    .string()
    .transform((val) => parseInt(val, 10))
    .pipe(z.number().min(1).max(65535))
    .default('3000'),
});
```

### 2. Validation and Parsing

The environment variables are automatically validated when the application starts:

```typescript
const parseEnv = () => {
  try {
    return envSchema.parse(process.env);
  } catch (error) {
    if (error instanceof z.ZodError) {
      console.error('❌ Invalid environment variables:');
      error.errors.forEach((err) => {
        console.error(`  ${err.path.join('.')}: ${err.message}`);
      });
      process.exit(1);
    }
    throw error;
  }
};
```

### 3. Usage in Your Code

Import and use the validated environment variables:

```typescript
import { env } from './config/env.js';

// Type-safe access to environment variables
console.log(`Server running on port ${env.PORT}`);
console.log(`Database: ${env.DB_FILE_NAME}`);
```

## Zod Schema Features Used

### Required Fields

```typescript
DB_FILE_NAME: z.string().min(1, 'Database file name is required');
```

### Optional Fields with Defaults

```typescript
PORT: z.string()
  .transform((val) => parseInt(val, 10))
  .pipe(z.number().min(1).max(65535))
  .default('3000');
```

### Transformations

```typescript
PORT: z.string()
  .transform((val) => parseInt(val, 10)) // Convert string to number
  .pipe(z.number().min(1).max(65535)); // Validate number range
```

## Error Handling

If any required environment variables are missing or invalid, the application will:

1. Display detailed error messages showing which variables are problematic
2. Exit with a non-zero code to prevent the application from running with invalid configuration

Example error output:

```
❌ Invalid environment variables:
  DB_FILE_NAME: Database file name is required
  ADMIN_API_KEY: Admin API key is required
  PORT: Expected number, received string
```

## Type Safety

The `env` object is fully typed, providing IntelliSense and compile-time checking:

```typescript
// TypeScript knows the exact types
env.PORT; // number
env.DB_FILE_NAME; // string
env.ADMIN_API_KEY; // string
```

## Adding New Environment Variables

To add a new environment variable:

1. **Add it to the schema** in `src/config/env.ts`:

```typescript
const envSchema = z.object({
  // ... existing fields
  NEW_VARIABLE: z.string().min(1, 'New variable is required'),
});
```

2. **Add it to your `.env` file**:

```env
NEW_VARIABLE=your-value-here
```

3. **Use it in your code**:

```typescript
import { env } from './config/env.js';
console.log(env.NEW_VARIABLE);
```

## Best Practices

1. **Always validate environment variables** - Never trust `process.env` directly
2. **Provide meaningful error messages** - Help developers understand what's wrong
3. **Use appropriate types** - Transform strings to numbers, booleans, etc. as needed
4. **Set sensible defaults** - For optional configuration
5. **Document your variables** - Use comments in your schema and example files

## Security Notes

- Never commit your actual `.env` file to version control
- Use strong, unique values for sensitive variables like `ADMIN_API_KEY`
- Consider using a secrets management service for production environments

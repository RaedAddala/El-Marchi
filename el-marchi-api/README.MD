# El Marchi API

A NestJS-based API project built with NX monorepo architecture.

The code was developed with strict typing and type safety in mind. This improved developement experience by removing any runtime errors related to TypeError Problems:

- strong and strict typescript configurations in tsconfig.
- using unknown instead of any when the type isn't known to enforce type checking.
- using libraries like `@total-typescript/ts-reset` which improve typescript typesafety.

## Project Overview

El Marchi API is a Node.js application built using NestJS framework within an NX monorepo structure. The project uses Webpack for bundling and includes comprehensive testing and documentation setups.

## Prerequisites

- Node.js (based on typescript version, recommend 18.17 or higher)
- pnpm
- NX CLI
- Docker

## Installation

In order to set the backend, you have to follow these steps:

1. Install Dependencies

    ```bash
    # Install dependencies
    pnpm install
    ```

2. Create the `.env` file using one of the two templates `.env.dev.example` or `.env.prod.example` and Fill the placeholders.

    ```bash
    cp .env.dev.example .env
    # OR
    cp .env.prod.example .env
    ```

3. For Secrets, like Cookie Secret you can use this command: `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"` which will generate a random string. Copy the result and put it into your `.env` file.

4. Open a separate terminal, go to the `./docker` directory, and then run the command:

    ```bash
    docker compose up
    ```

5. Run the server using one of these two commands:

- For Dev Mode:

    ```bash
    pnpm start
    ```

- For Prod Mode:

    ```bash
    pnpm start:prod
    ```

## API Description

This API Server is setup with OpenAPI. The Swagger module generates a documentation of the available routes and their parameters and responses.

- To see the web version check this link: `http://${hostname}:${port}/api-docs`
- To see the json version check this link: `http://${hostname}:${port}/api-docs-json`

## Available Scripts

### Development

```bash
# Start the development server
pnpm start

# Build for development
pnpm build

# Watch mode development
pnpm start:dev
```

### Production

```bash
# Build for production
pnpm build:prod

# Start production server
pnpm start:prod
```

### Testing

```bash
# Run unit tests
pnpm test

# Run tests with watch mode
pnpm test:watch

# Generate test coverage
pnpm test:coverage

# Debug tests
pnpm test:debug

# Run e2e tests
pnpm e2e

# Run e2e tests in watch mode
pnpm e2e:watch
```

### Code Quality

```bash
# Lint code
pnpm lint

# Fix linting issues
pnpm lint:fix

# Format code
pnpm format

# Check formatting
pnpm format:check
```

### Documentation Generation Using Compodoc

```bash
# Generate documentation
pnpm documentation
```

### Other Commands

```bash
# Clean dist directory and reset NX cache
pnpm clean

# View dependency graph
pnpm graph

# Run affected tests
pnpm affected:test

# Run affected lint
pnpm affected:lint

# Run affected builds
pnpm affected:build

# Run affected e2e tests
pnpm affected:e2e
```

## Project Structure

The project follows the NX monorepo structure:

- `apps/el-marchi-api/`: Main API application
- `apps/el-marchi-api-e2e/`: End-to-end tests

## Build Configuration

The project uses Webpack for bundling with different configurations for development and production:

- Development: Uses eval-source-map for better debugging
- Production: Includes optimization features like:
  - Code minification
  - Module splitting
  - Vendor chunk separation
  - Deterministic module IDs

## Testing Setup

- Jest for unit testing
- Separate e2e testing configuration
- Coverage reporting enabled
- Debug mode available

## Documentation

The project uses Compodoc for documentation generation. Documentation is generated in the `dist/documentation` directory.

## Contributing

### Setting up Development Environment

1. Fork the repository.
2. Clone your fork.
3. Create a new branch for your feature or fix.
4. Go to `/el-marchi-api` directory and Install dependencies: `pnpm install`.
5. Make your changes.
6. Run tests: `pnpm test`.
7. Run linting `pnpm run lint` and formatting `pnpm run format`.
8. Commit your changes using conventional commits.
9. Push to your fork.
10. Submit a Pull Request.

### Code Style Guidelines

- All code must pass ESLint checks (`pnpm run lint`).
- All code must be formatted using Prettier (`pnpm run format`).
- Test coverage should be maintained or improved.
- Documentation should be updated for any new features.

### Git Workflow

- Use feature branches.
- Follow conventional commits specification.
- Keep commits atomic and well-described.
- Rebase on main before submitting PR.

## Troubleshooting

### Common Issues

1. **Build Fails in Development Mode**
   - Check if NODE_ENV is set correctly.
   - Ensure webpack-cli args are properly formatted.
   - Try cleaning the cache: `pnpm run clean`.

2. **Tests Failing**
   - Ensure all dependencies are installed.
   - Check if the test environment is properly set up.
   - Try running with `--verbose` flag for more details.
   - Check Jest configuration in project settings.

3. **E2E Tests Issues**
   - Verify the API is running in test mode.
   - Check if test database is properly configured.
   - Ensure correct environment variables are set.

4. **Documentation Generation Fails**
   - Check if all TypeScript files are properly annotated.
   - Verify tsconfig.app.json paths.
   - Ensure Compodoc dependencies are installed.

### Development Server Issues

If the development server isn't working as expected:

1. Check port availability.
2. Verify NX daemon status: `nx reset`.
3. Check for conflicting processes.
4. Review webpack configuration.
5. Verify environment variables.

### Getting Help

- Check existing issues in the repository
- Review documentation
- Run `nx report` for system information when reporting issues
- Include relevant logs and environment details in bug reports

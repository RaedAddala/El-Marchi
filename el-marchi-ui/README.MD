# El Marchi UI

An Angular 19-based UI project built with NX monorepo architecture, featuring a modern zoneless standalone SPA design.

## Project Overview

El Marchi UI is an Angular application built within an NX monorepo structure. The project utilizes Cypress for E2E testing, TailwindCSS, TailwindCSS Typography and DaisyUI for styling, and includes comprehensive testing and documentation setups.

## Prerequisites

- Node.js (based on typescript version, recommend 18.x or higher)
- pnpm
- NX CLI
- Angular CLI

## Installation

```bash
# Install dependencies
pnpm install
```

## Available Scripts

### Development

```bash
# Start the development server
pnpm run start

# Build for development
pnpm run build

# Start production server
pnpm run start:prod

# Build for production
pnpm run build:prod

# Serve static files
pnpm run serve:static
```

### Testing

```bash
# Run unit tests
pnpm run test

# Run tests with watch mode
pnpm run test:watch

# Run tests in CI mode
pnpm run test:ci

# Run e2e tests
pnpm run e2e

# Run e2e tests in CI mode
pnpm run e2e:ci
```

### Code Quality

```bash
# Lint code
pnpm run lint

# Format code
pnpm run format

# Check formatting
pnpm run format:check
```

### Internationalization

**NOTE:** This part still needs to be enabled and configured but it is there whenever is needed.

```bash
# Extract i18n messages
pnpm run extract-i18n
```

### Documentation Generation Using Compodoc

```bash
# Generate documentation
pnpm run docs:generate

# Serve documentation
pnpm run docs:serve
```

### Other Commands

```bash
# Clean dist directory and reset NX cache
pnpm run clean

# View dependency graph
pnpm run graph

# Run affected tests
pnpm run affected:test

# Run affected lint
pnpm run affected:lint

# Run affected builds
pnpm run affected:build

# Run affected e2e tests
pnpm run affected:e2e
```

## Project Structure

The project follows the NX monorepo structure:

- `apps/el-marchi-ui/`: Main UI application
- `apps/el-marchi-ui-e2e/`: End-to-end tests

## Key Features

- Zoneless Angular 19 standalone application
- NX monorepo architecture
- TailwindCSS, TailwindCSS Typography and DaisyUI for UI components
- Cypress for E2E testing
- Jest for unit testing
- Compodoc for documentation
- Internationalization support
- ESLint and Prettier for code quality

## Contributing

### Setting up Development Environment

1. Fork the repository
2. Clone your fork
3. Create a new branch for your feature or fix
4. Install dependencies: `pnpm install`
5. Make your changes
6. Run tests: `pnpm test`
7. Run linting `pnpm run lint` and formatting `pnpm run format`
8. Commit your changes using conventional commits
9. Push to your fork
10. Submit a Pull Request

### Code Style Guidelines

- All code must pass ESLint checks (`pnpm run lint`)
- All code must be formatted using Prettier (`pnpm run format`)
- Test coverage should be maintained or improved
- Documentation should be updated for any new features
- Follow Angular style guide and best practices

### Git Workflow

- Use feature branches
- Follow conventional commits specification
- Keep commits atomic and well-described
- Rebase on main before submitting PR

## Troubleshooting

### Common Issues

1. **Build Fails**
   - Ensure all dependencies are installed
   - Try cleaning the cache: `pnpm run clean`
   - Verify Angular version compatibility

2. **Tests Failing**
   - Ensure all dependencies are installed
   - Check if the test environment is properly set up
   - Try running with `--verbose` flag for more details
   - Verify Jest and Cypress configurations

3. **Styling Issues**
   - Check TailwindCSS configuration
   - Verify DaisyUI setup
   - Ensure PostCSS is properly configured
   - Check for CSS conflicts

4. **Documentation Generation Fails**
   - Check if all TypeScript files are properly annotated
   - Verify tsconfig.app.json paths
   - Ensure Compodoc dependencies are installed

### Development Server Issues

If the development server isn't working as expected:

1. Check port availability
2. Verify NX daemon status: `nx reset`
3. Check for conflicting processes
4. Review Angular configuration
5. Verify environment variables

### Getting Help

- Check existing issues in the repository
- Review documentation
- Run `nx report` for system information when reporting issues
- Include relevant logs and environment details in bug reports

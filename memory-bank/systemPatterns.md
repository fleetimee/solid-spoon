# System Patterns

## Architectural Patterns

### 1. Route Groups Pattern

- Using Next.js App Router route groups
- Protected dashboard routes under (dashboard)
- Authentication routes under auth/
- API routes for authentication under api/auth/

### 2. Component Architecture

- Atomic design principles with UI components
- Separation of concerns:
  - UI components in components/ui/
  - Providers in components/providers/
  - Custom hooks in hooks/
  - Utility functions in lib/

### 3. Authentication Pattern

- Better Auth integration
- Custom UI providers
- Protected routes
- Session management

## Design Patterns

### 1. Provider Pattern

- Authentication UI providers
- Theme provider (next-themes)

### 2. Hook Pattern

- Custom mobile detection hook (use-mobile.ts)
- Separation of client-side logic

### 3. Component Composition

- Radix UI primitives as base
- Enhanced with Tailwind utilities
- Class variance authority for component variants

## Code Organization

### 1. Feature-based Structure

```
src/
├── app/          # Routes and pages
├── components/   # Reusable components
├── hooks/        # Custom hooks
└── lib/         # Shared utilities
```

### 2. Naming Conventions

- PascalCase for components
- camelCase for utilities and hooks
- Kebab-case for file names

[2025-04-18 14:20:01] - Initial system patterns documented

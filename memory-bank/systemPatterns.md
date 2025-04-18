# System Patterns

## Architectural Patterns

### 1. Navigation System

[2025-04-18 14:28:34]

- Provider Pattern for Sidebar
  - Centralized state management
  - Context-based configuration
  - Cookie-based persistence
- Responsive Layout Strategy
  - Desktop: Collapsible sidebar
  - Mobile: Sheet-based navigation
  - Keyboard shortcut integration

### 2. Route Organization

- Next.js App Router route groups
- Protected dashboard routes under (dashboard)
- Authentication routes under auth/
- API routes for authentication under api/auth/

### 3. Component Architecture

- Composition Pattern with shadcn/ui
  - Base components from Radix UI
  - Enhanced with Tailwind utilities
  - Compound components for complex UIs
- Component Hierarchy:
  ```
  SidebarProvider
  └── Sidebar
      ├── SidebarHeader
      ├── SidebarContent
      │   └── SidebarMenu
      │       └── SidebarMenuItem
      │           └── SidebarMenuButton
      └── SidebarTrigger
  ```

### 4. Authentication Pattern

- Better Auth integration
- Custom UI providers
- Protected routes
- Session management

## Design Patterns

### 1. Provider Pattern

- Authentication UI providers
- Theme provider (next-themes)
- Sidebar state management
- Mobile responsiveness detection

### 2. Hook Pattern

- Custom mobile detection (useIsMobile)
- Path-based active state (usePathname)
- Sidebar state management (useSidebar)

### 3. Component Composition

- Compound components for navigation
- Radix UI primitives as base
- Enhanced with Tailwind utilities
- Class variance authority for variants

## Code Organization

### 1. Feature-based Structure

```
src/
├── app/          # Routes and pages
├── components/   # Reusable components
│   └── ui/      # UI components
├── hooks/        # Custom hooks
└── lib/         # Shared utilities
```

### 2. Naming Conventions

- PascalCase for components
- camelCase for utilities and hooks
- kebab-case for file names
- data-\* attributes for component states

### 3. State Management

- Context for global states
- Local state for component-specific data
- Cookie persistence for user preferences
- URL-based active states

[2025-04-18 14:28:34] - Updated with shadcn/ui Sidebar patterns

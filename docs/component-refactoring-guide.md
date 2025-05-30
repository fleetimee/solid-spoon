# Component Refactoring Guide

## Overview

Component refactoring is the process of breaking down large, monolithic React components into smaller, reusable, and more maintainable pieces. This practice improves code organization, testability, and reusability while following the single responsibility principle.

**Benefits of Component Refactoring:**

- **Improved Maintainability**: Smaller components are easier to understand, debug, and modify
- **Enhanced Reusability**: Extracted components can be used across different parts of the application
- **Better Testing**: Smaller components with focused responsibilities are easier to test in isolation
- **Improved Performance**: Smaller components can be optimized individually and may have better re-render performance
- **Team Collaboration**: Multiple developers can work on different components simultaneously
- **Code Organization**: Clear separation of concerns makes the codebase more structured

## Bulletproof React Architecture Pattern

This project follows the **Bulletproof React** architecture pattern, which emphasizes:

- **Feature-based Organization**: Code is organized by features rather than file types
- **Clear Separation of Concerns**: Each component has a single, well-defined responsibility
- **Consistent File Structure**: Predictable location for components, types, and logic
- **TypeScript-First**: Strong typing ensures reliability and developer experience
- **Composition over Inheritance**: Building complex UIs by composing smaller components

**Key Principles:**

- Each feature has its own folder under [`src/features`](../src/features/)
- Components are co-located with their related logic, types, and styles
- Shared UI components live in [`src/components/ui`](../src/components/ui/)
- Business logic is separated from presentation logic

## Refactoring Process

Follow this systematic approach when refactoring large components:

### 1. Analysis Phase

- **Identify Responsibilities**: List all the different things the component does
- **Find Natural Boundaries**: Look for logical sections that can be separated
- **Assess Dependencies**: Understand data flow and component relationships
- **Review Props**: Examine which props are used by which parts of the component

### 2. Planning Phase

- **Create Component Hierarchy**: Design the new component structure
- **Define Interfaces**: Plan the props and types for each new component
- **Choose File Locations**: Determine where each component should live
- **Plan Data Flow**: Design how data will be passed between components

### 3. Implementation Phase

- **Extract Components Bottom-Up**: Start with the smallest, most independent pieces
- **Maintain Functionality**: Ensure the refactored version works identically
- **Update Types**: Create proper TypeScript interfaces for each component
- **Test Incrementally**: Verify each extracted component works correctly

### 4. Optimization Phase

- **Review Performance**: Check for unnecessary re-renders
- **Optimize Props**: Minimize prop drilling and consider context if needed
- **Clean Up**: Remove unused code and optimize imports
- **Document Changes**: Update any relevant documentation

## Component Separation Strategy

### Identifying Extraction Candidates

Look for these patterns when identifying components to extract:

1. **Repeated JSX Patterns**: Similar markup that appears multiple times
2. **Logical Sections**: Distinct areas with specific purposes (headers, cards, lists)
3. **Complex Logic**: Sections with substantial state management or calculations
4. **Conditional Rendering**: Large blocks that render based on conditions
5. **Independent Features**: Functionality that could work standalone

### Naming Conventions

Follow these naming patterns:

- **Descriptive Names**: [`DashboardHeader`](../src/features/admin/components/dashboard-header.tsx), [`DashboardKPICards`](../src/features/admin/components/dashboard-kpi-cards.tsx)
- **Domain-Specific Prefixes**: [`Dashboard*`](../src/features/admin/components/) for dashboard-related components
- **Action-Based Names**: `ReservationStatusChart`, `ActivitySection`
- **Avoid Generic Names**: Instead of `Card`, use `DashboardKPICard`

## Implementation Guidelines

### Component Structure Template

```typescript
// Component props interface
export interface ComponentNameProps {
  // Required props
  data: DataType;
  onAction: (param: string) => void;

  // Optional props with defaults
  variant?: 'default' | 'compact';
  className?: string;
}

// Main component function
export function ComponentName({
  data,
  onAction,
  variant = 'default',
  className,
}: ComponentNameProps) {
  // Local state (if needed)
  const [localState, setLocalState] = useState<StateType>();

  // Derived data and computations
  const processedData = useMemo(() => {
    return data.map(item => processItem(item));
  }, [data]);

  // Event handlers
  const handleClick = useCallback((id: string) => {
    onAction(id);
  }, [onAction]);

  // Render
  return (
    <div className={cn('default-classes', className)}>
      {/* Component JSX */}
    </div>
  );
}
```

### TypeScript Requirements

- **Export Interfaces**: All prop interfaces must be exported for reusability
- **Strong Typing**: Avoid `any` types; use specific interfaces
- **Optional Props**: Use optional properties with default values where appropriate
- **Generic Types**: Use generics for reusable components when needed

### Props Guidelines

- **Minimal Props**: Only pass data that the component actually needs
- **Callback Props**: Use callback functions for component communication
- **Composition**: Prefer composition over configuration when possible
- **Default Values**: Provide sensible defaults for optional props

## File Structure

### Feature-Based Organization

```
src/
├── features/
│   └── admin/
│       ├── api/
│       │   └── getAdminDashboardStats.ts
│       └── components/
│           ├── dashboard-header.tsx
│           ├── dashboard-kpi-cards.tsx
│           ├── dashboard-analytics-section.tsx
│           └── dashboard-activity-section.tsx
├── components/
│   └── ui/
│       ├── card.tsx
│       ├── button.tsx
│       └── chart.tsx
└── app/
    └── (dashboard)/
        └── admin/
            └── dashboard/
                └── page.tsx
```

### File Naming Conventions

- **Kebab Case**: Use kebab-case for file names (`dashboard-header.tsx`)
- **Descriptive Names**: Include the feature context (`admin-reservation-status-chart.tsx`)
- **Component Suffix**: Use `.tsx` for React components
- **Type Files**: Use `.ts` for pure TypeScript files

### Import Organization

```typescript
// External libraries
import { useState, useMemo, useCallback } from "react";
import { Card, CardContent } from "@/components/ui/card";

// Internal utilities
import { cn } from "@/lib/utils";

// Feature-specific imports
import { getAdminDashboardStats } from "@/features/admin/api/getAdminDashboardStats";

// Local imports
import { DashboardHeader } from "./dashboard-header";
```

## TypeScript Requirements

### Interface Design

```typescript
// Base interfaces for common props
interface BaseComponentProps {
  className?: string;
  children?: React.ReactNode;
}

// Specific component interfaces
export interface DashboardHeaderProps extends BaseComponentProps {
  title: string;
  description: string;
  icon?: React.ComponentType<{ className?: string }>;
}

// Data interfaces
export interface KPICardData {
  title: string;
  value: number;
  description: string;
  type: "pending" | "users" | "rooms";
}
```

### Type Safety Best Practices

- **Strict Types**: Use strict TypeScript configuration
- **No Implicit Any**: Explicitly type all parameters and return values
- **Discriminated Unions**: Use union types for variant props
- **Generic Constraints**: Use constraints for generic types when appropriate

## Example: Admin Dashboard Refactoring

### Before Refactoring

The original admin dashboard was a single large component with multiple responsibilities:

```typescript
// Original monolithic structure (hypothetical)
export default function AdminDashboardPage() {
  // 200+ lines of component logic
  // Multiple data fetching operations
  // Complex state management
  // Inline JSX for all sections

  return (
    <div>
      {/* Header section - 20 lines */}
      {/* KPI cards - 60 lines */}
      {/* Analytics charts - 80 lines */}
      {/* Activity feed - 40 lines */}
    </div>
  );
}
```

### After Refactoring

The refactored version separates concerns into focused components:

#### Main Page Component

```typescript
// src/app/(dashboard)/admin/dashboard/page.tsx
export default async function AdminDashboardPage() {
  const stats = await getAdminDashboardStats();
  const activityFeedData = await getRecentActivityFeed();

  // Data processing logic
  const analyticsData = { /* processed data */ };
  const analyticsConfigs = { /* chart configurations */ };

  return (
    <div className="flex flex-col gap-8 p-4 md:p-6 lg:p-8">
      <DashboardHeader
        title="Admin Dashboard"
        description="Manage your room reservation system"
      />

      <DashboardKPICards stats={stats} />

      <DashboardAnalyticsSection
        data={analyticsData}
        configs={analyticsConfigs}
      />

      <DashboardActivitySection activityFeedData={activityFeedData} />
    </div>
  );
}
```

#### Extracted Components

1. **[`DashboardHeader`](../src/features/admin/components/dashboard-header.tsx)**

   - **Responsibility**: Display page title and description with icon
   - **Props**: `title`, `description`, optional `icon`
   - **Lines**: 27 (was inline ~20 lines)

2. **[`DashboardKPICards`](../src/features/admin/components/dashboard-kpi-cards.tsx)**

   - **Responsibility**: Display key performance indicator cards
   - **Props**: `stats` object with numerical data
   - **Lines**: 130 (was inline ~60 lines)
   - **Features**: Dynamic styling based on card type, hover effects

3. **[`DashboardAnalyticsSection`](../src/features/admin/components/dashboard-analytics-section.tsx)**

   - **Responsibility**: Render analytics charts with empty states
   - **Props**: `data` and `configs` for charts
   - **Lines**: 124 (was inline ~80 lines)
   - **Features**: Conditional rendering, empty state handling

4. **[`DashboardActivitySection`](../src/features/admin/components/dashboard-activity-section.tsx)**
   - **Responsibility**: Show recent activity and quick actions
   - **Props**: `activityFeedData` array
   - **Lines**: 240 (was inline ~40 lines)
   - **Features**: Suspense loading, quick action buttons

### Benefits Achieved

1. **Maintainability**: Each component can be modified independently
2. **Reusability**: [`DashboardHeader`](../src/features/admin/components/dashboard-header.tsx) can be used on other admin pages
3. **Testing**: Components can be tested in isolation
4. **Performance**: Smaller components can be memoized individually
5. **Collaboration**: Different developers can work on different sections
6. **Type Safety**: Each component has well-defined TypeScript interfaces

### Data Flow Architecture

```
AdminDashboardPage (Server Component)
├── Data Fetching (getAdminDashboardStats, getRecentActivityFeed)
├── Data Processing (trend data, status data, etc.)
└── Component Composition
    ├── DashboardHeader (title, description)
    ├── DashboardKPICards (stats)
    ├── DashboardAnalyticsSection (data, configs)
    └── DashboardActivitySection (activityFeedData)
```

## Quality Assurance

### Verification Checklist

After refactoring, verify these aspects:

#### Functionality

- [ ] All features work identically to the original component
- [ ] Data flows correctly between components
- [ ] Event handlers function properly
- [ ] Loading states and error handling work
- [ ] Responsive design is maintained

#### Code Quality

- [ ] All components have proper TypeScript interfaces
- [ ] Components follow single responsibility principle
- [ ] Props are minimal and well-defined
- [ ] No prop drilling more than 2-3 levels
- [ ] Consistent naming conventions

#### Performance

- [ ] No unnecessary re-renders
- [ ] Large data sets are properly memoized
- [ ] Components can be lazy-loaded if needed
- [ ] Bundle size hasn't increased significantly

#### Testing

- [ ] Unit tests exist for complex logic
- [ ] Components can be tested in isolation
- [ ] Integration tests verify component interaction
- [ ] Visual regression tests for UI components

### Testing Strategy

```typescript
// Example test structure
describe('DashboardKPICards', () => {
  it('renders all KPI cards with correct data', () => {
    const mockStats = {
      pendingReservationCount: 5,
      totalUserCount: 120,
      activeRoomCount: 25,
    };

    render(<DashboardKPICards stats={mockStats} />);

    expect(screen.getByText('5')).toBeInTheDocument();
    expect(screen.getByText('Pending Reservations')).toBeInTheDocument();
    // Additional assertions...
  });
});
```

## Best Practices

### Component Design Principles

1. **Single Responsibility**: Each component should have one clear purpose
2. **Composition Over Configuration**: Build complex UIs by composing simpler components
3. **Props Interface Design**: Design props that are intuitive and type-safe
4. **Avoid Prop Drilling**: Use context or state management for deep data passing
5. **Consistent Patterns**: Follow established patterns within the codebase

### Performance Considerations

1. **Memoization**: Use [`React.memo()`](https://react.dev/reference/react/memo) for expensive components
2. **Callback Optimization**: Use [`useCallback()`](https://react.dev/reference/react/useCallback) for event handlers
3. **Data Processing**: Use [`useMemo()`](https://react.dev/reference/react/useMemo) for expensive calculations
4. **Code Splitting**: Consider dynamic imports for large components
5. **Bundle Analysis**: Monitor bundle size impact

### Maintenance Guidelines

1. **Documentation**: Document complex components and their use cases
2. **Version Control**: Make atomic commits for each extracted component
3. **Code Reviews**: Have refactored components reviewed by team members
4. **Migration Strategy**: Plan gradual migration for large refactoring efforts
5. **Monitoring**: Monitor for regressions after refactoring

### Common Pitfalls to Avoid

1. **Over-Extraction**: Don't create components that are too small or specific
2. **Tight Coupling**: Avoid components that know too much about their parent
3. **Complex Props**: Don't create props interfaces that are hard to understand
4. **Missing Types**: Always provide proper TypeScript interfaces
5. **Inconsistent Patterns**: Follow established patterns in the codebase

### When NOT to Refactor

- Component is less than 50 lines and has single responsibility
- Component is used only once and unlikely to be reused
- Refactoring would create unnecessary complexity
- Component is stable and rarely needs changes
- Time constraints make refactoring risky

## Future LLM Guidelines

When asked to refactor components in this codebase, follow this process:

1. **Analyze the Target Component**: Read the entire component to understand its structure
2. **Identify Sections**: Look for logical boundaries and repeated patterns
3. **Plan the Extraction**: Design the component hierarchy and interfaces
4. **Extract Incrementally**: Create one component at a time, starting with the simplest
5. **Maintain Functionality**: Ensure the refactored version works identically
6. **Follow File Conventions**: Place components in the appropriate feature folders
7. **Update Types**: Create proper TypeScript interfaces for all new components
8. **Test the Result**: Verify that the refactored components work correctly

### Refactoring Prompts

Use these prompts as templates for future refactoring tasks:

```
"Refactor the [ComponentName] component by extracting [specific sections] into separate components. Follow the established patterns in src/features/admin/components/ and ensure proper TypeScript interfaces."

"Break down the [PageName] page component into smaller, reusable components following the Bulletproof React architecture pattern used in this project."

"Extract the [section description] from [ComponentName] into a new component called [NewComponentName], maintaining the same functionality and adding proper TypeScript types."
```

This guide provides a comprehensive foundation for component refactoring in this Next.js application, ensuring consistency, maintainability, and following established architectural patterns.

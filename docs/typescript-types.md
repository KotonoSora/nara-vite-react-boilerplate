# TypeScript Type Organization Guide

## Overview

This project uses a centralized type system located in `app/types/` to improve developer experience, maintainability, and code clarity.

## Structure

```
app/types/
├── index.ts          # Central export file - import types like: import type { User } from "~/types"
├── user.ts           # User-related types (User, CreateUserData, PublicUser, etc.)
├── auth.ts           # Authentication types (AuthContextValue, LoginFormData, etc.)
├── i18n.ts           # Internationalization types (TranslationKey, SupportedLanguage, etc.)
├── features.ts       # Feature-specific types (DashboardContentProps, ProjectInfo, etc.)
├── ui.ts             # UI component types (ChartConfig, ButtonVariant, etc.)
├── common.ts         # Utility types (ApiResponse, PaginationParams, etc.)
└── database.ts       # Database-related types (Database, QueryOptions, etc.)
```

## Key Benefits

1. **Centralized Location**: All types are in one predictable location
2. **Easy Imports**: Import any type from `~/types` or specific files
3. **No Duplication**: Single source of truth for each type
4. **Better Organization**: Types grouped by domain/purpose
5. **Clear Dependencies**: Types are separate from implementation code
6. **Enhanced Discoverability**: All types visible in one place

## Usage Examples

### Basic Import (Recommended)
```typescript
import type { User, AuthContextValue, TranslationKey } from "~/types";
```

### Specific File Import
```typescript
import type { User, PublicUser } from "~/types/user";
import type { SupportedLanguage } from "~/types/i18n";
```

### In Components
```typescript
import type { DashboardContentProps } from "~/types/features";

export function DashboardContent({ user, recentActivity, stats }: DashboardContentProps) {
  // Component implementation
}
```

### In Route Loaders
```typescript
import type { User, Database } from "~/types";

export async function loader({ params }: Route.LoaderArgs) {
  const user: User = await getUserById(db, params.id);
  return { user };
}
```

## Migration from Old Structure

The old scattered type system has been consolidated:

- `app/lib/auth/types.ts` → `app/types/auth.ts`
- `app/lib/i18n/types.ts` → `app/types/i18n.ts` 
- `app/user.server.ts` exports → `app/types/user.ts`
- `app/features/*/types/types.d.ts` → `app/types/features.ts`
- Component-local interfaces → Appropriate type files

## Type Categories

### Core Domain Types
- **User Types**: User, PublicUser, CreateUserData, UserRole, UserStats
- **Auth Types**: AuthContextValue, LoginFormData, AuthError, SessionData
- **Database Types**: Database, QueryOptions, DatabaseResult

### Framework Types  
- **i18n Types**: SupportedLanguage, TranslationKey, TranslationFunction
- **UI Types**: ChartConfig, ButtonVariant, Theme, LoadingState
- **Common Types**: ApiResponse, PaginationParams, ValidationResult

### Feature Types
- **Landing Page**: ProjectInfo, FeatureCardConfig, PageInformation
- **Dashboard**: DashboardContentProps, UserActivity
- **Forms**: LoginContentProps, RegisterContentProps

## Best Practices

1. **Use the index file** for common imports: `import type { User } from "~/types"`
2. **Add new types** to the appropriate category file
3. **Prefer interfaces** for object shapes, **types** for unions/primitives
4. **Export from index.ts** when adding new commonly-used types
5. **Document complex types** with JSDoc comments
6. **Avoid type duplication** - reuse existing types when possible

## Adding New Types

1. Determine the appropriate category (user, auth, ui, etc.)
2. Add the type to the relevant file in `app/types/`
3. Export it from `app/types/index.ts` if it's commonly used
4. Update this documentation if adding new categories

This centralized approach makes the codebase more maintainable and provides a better developer experience when working with TypeScript types.
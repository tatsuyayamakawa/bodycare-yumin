# Code Style and Conventions

## File Structure & Organization
- **Component Structure**: Organized by feature/domain in nested folders
- **Asset Co-location**: Images and assets stored alongside components
- **Type Definitions**: Separate `types/index.ts` files for each component area
- **Constants**: Separate `constants/index.ts` files for configuration
- **Barrel Exports**: Uses index.ts files for clean imports

## Naming Conventions
- **Files**: kebab-case for files (e.g., `contact-form.tsx`)
- **Components**: PascalCase (e.g., `ContactForm`)
- **Variables**: camelCase
- **Types**: PascalCase with descriptive suffixes (e.g., `HeadingProps`)
- **Constants**: camelCase for objects, SCREAMING_SNAKE_CASE for primitives

## TypeScript Patterns
- **Strict Mode**: All type checking is enabled
- **Component Props**: Interface definitions with `Props` suffix
- **Default Exports**: Preferred for components
- **Named Exports**: Used for utilities and types
- **Type-only Imports**: Uses `import type` when importing only types

## Component Architecture
- **Server Components First**: Prefer Server Components over Client Components
- **Client Components**: Only when interactivity is needed (marked with 'use client')
- **Props Interface**: Always define props interface for components
- **Default Props**: Uses destructuring with default values

## Styling Approach
- **Tailwind CSS**: Primary styling method
- **Class Organization**: Responsive classes, state variants, then utilities
- **CSS Variables**: Uses CSS custom properties for theme values
- **Component Variants**: Uses class-variance-authority for component variations

## Import Organization (ESLint rules)
- **Order**: External libraries first, then internal modules
- **Grouping**: Blank lines between different import groups
- **Alphabetical**: Imports sorted alphabetically within groups
- **No Duplicates**: Duplicate imports are not allowed
- **First**: Import statements must be at the top

## File Structure Patterns
```
components/
  feature-name/
    assets/           # Images, icons, etc.
    components/       # Sub-components
    constants/        # Configuration
    types/           # Type definitions
    index.tsx        # Main component
```

## Code Quality Rules
- **No Unused Variables**: Enforced by ESLint
- **Import Rules**: Strict import ordering and organization
- **Type Safety**: No `any` types, strict null checks
- **Consistent Formatting**: Prettier with Tailwind plugin
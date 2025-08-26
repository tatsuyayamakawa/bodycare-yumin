# Codebase Structure Overview

## Root Directory Structure
```
├── .cursor/          # Cursor IDE configuration
├── .serena/          # Serena agent configuration
├── .vscode/          # VS Code configuration
├── docs/             # Documentation files
├── public/           # Static assets
├── src/              # Source code
├── package.json      # Dependencies and scripts
├── tsconfig.json     # TypeScript configuration
├── next.config.mjs   # Next.js configuration
├── eslint.config.mjs # ESLint configuration
├── .prettierrc.yml   # Prettier configuration
└── components.json   # shadcn/ui configuration
```

## Source Code Organization (`src/`)

### App Directory (`src/app/`)
- Next.js App Router structure
- Route-based file organization
- Layout files for shared UI
- API routes in `api/` subdirectory
- Special files: `page.tsx`, `layout.tsx`, `error.tsx`, `not-found.tsx`

### Components Directory (`src/components/`)
```
components/
├── admin/           # Admin panel components (blog management)
├── blog/            # Blog-related components
├── common/          # Reusable UI components
│   ├── breadcrumb/
│   ├── heading/
│   ├── logo/
│   └── section/
├── features/        # Feature-specific components
│   ├── access/      # Location/access information
│   ├── customer-voice/ # Customer testimonials
│   ├── faq/         # FAQ section
│   ├── flow-chart/  # Service flow visualization
│   ├── google-maps/ # Map integration
│   ├── price/       # Pricing information
│   ├── profile/     # Clinic profile
│   └── treatment-policy/
├── home/            # Homepage specific components
│   ├── cta/         # Call-to-action sections
│   ├── empathy/     # Customer pain points
│   └── hero/        # Hero section
├── layout/          # Layout components
│   ├── footer/
│   ├── header/
│   └── nav/         # Navigation components
└── ui/              # shadcn/ui components
```

### Library Directory (`src/lib/`)
- `actions/` - Server Actions for data operations
- `auth/` - Authentication utilities
- `supabase/` - Database client and types
- `fonts.ts` - Font configurations
- `utils.ts` - Utility functions

### Other Directories
- `hooks/` - Custom React hooks
- `constants/` - Application constants
- `schema/` - Zod validation schemas
- `middleware.ts` - Next.js middleware

## Component Architecture Pattern
Each feature component follows this structure:
```
feature-name/
├── assets/          # Images, icons specific to this feature
├── components/      # Sub-components
├── constants/       # Configuration and data
│   └── index.ts
├── types/           # TypeScript type definitions
│   └── index.ts
└── index.tsx        # Main component export
```

## Recent Additions
- **Blog System**: Complete blog functionality with admin panel
- **Admin Routes**: Protected admin routes under `/admin/*`
- **Supabase Integration**: Database and storage for blog content
- **Authentication**: Basic auth for admin access
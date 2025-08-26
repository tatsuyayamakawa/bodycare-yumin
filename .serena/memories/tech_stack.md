# Technology Stack

## Core Framework & Language
- **Framework**: Next.js 15.3.1 with App Router
- **Language**: TypeScript (strict mode enabled)
- **Runtime**: Bun (package manager and runtime)

## Frontend Technologies
- **Styling**: Tailwind CSS v4 with custom configuration
- **UI Components**: shadcn/ui component library
- **Icons**: Lucide React icons
- **Maps**: @vis.gl/react-google-maps for location display
- **Notifications**: Sonner for toast notifications
- **Animations**: tw-animate-css for CSS animations

## Backend & Data
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Basic auth for admin panel, bcryptjs for password hashing
- **API**: Next.js API routes and Server Actions
- **Email**: Resend with @react-email/components for templates
- **File Storage**: Supabase storage for images

## Form Handling & Validation
- **Forms**: React Hook Form
- **Validation**: Zod schemas
- **Form Resolvers**: @hookform/resolvers

## Blog System
- **Editor**: TipTap rich text editor with extensions
- **Content Storage**: JSONB in Supabase
- **Features**: Scheduled publishing, image uploads, admin panel
- **Highlighting**: Lowlight for code blocks

## Development Tools
- **Linting**: ESLint with Next.js config and import plugin
- **Formatting**: Prettier with Tailwind plugin
- **Type Checking**: TypeScript strict mode
- **Build**: Next.js with optional bundle analyzer
- **Dev Environment**: Turbo mode for faster development

## Deployment & Hosting
- **Platform**: Vercel (inferred from vercel.json)
- **Environment**: Production optimized builds
- **Analytics**: Google Tag Manager integration
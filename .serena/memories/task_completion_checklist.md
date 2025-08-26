# Task Completion Checklist

## Before Making Changes
1. **Understand the Requirements**: Read and clarify the task requirements
2. **Explore Existing Code**: Use symbolic tools to understand current implementation
3. **Check Dependencies**: Verify required libraries are available in package.json
4. **Follow Existing Patterns**: Match the codebase's architectural patterns

## During Development
1. **Follow Code Style**: Match existing naming conventions and file structure
2. **Use TypeScript Properly**: Define proper types and interfaces
3. **Server Components First**: Prefer Server Components over Client Components
4. **Asset Co-location**: Place related assets in component folders
5. **Import Organization**: Follow ESLint import rules (alphabetical, grouped)

## Quality Assurance Steps
1. **Type Checking**: Run `bun run type-check` to verify TypeScript types
2. **Linting**: Run `bun run lint` to check code quality rules
3. **Combined Check**: Run `bun run check` (runs both lint and type-check)
4. **Formatting**: Run `bun run format` to ensure consistent code style
5. **Build Verification**: Run `bun run build` to ensure production build succeeds

## Testing Considerations
1. **Manual Testing**: Test the feature in development mode (`bun run dev`)
2. **Responsive Testing**: Check mobile and desktop layouts
3. **Accessibility**: Ensure proper semantic HTML and ARIA attributes
4. **Performance**: Monitor for any performance regressions

## Final Steps
1. **Clean Code**: Remove any console.logs or debugging code
2. **Documentation**: Update relevant documentation if needed
3. **Commit Message**: Write clear, descriptive commit messages
4. **Review Changes**: Double-check all modified files

## Error Resolution
- **Type Errors**: Fix all TypeScript errors before committing
- **Lint Errors**: Resolve all ESLint warnings and errors
- **Build Errors**: Ensure the application builds successfully
- **Runtime Errors**: Test the application to catch any runtime issues

## Windows-Specific Notes
- Use Windows file paths with backslashes in file operations
- Use appropriate Windows commands for system operations
- Be aware of case sensitivity differences between development and production

## Database Changes (if applicable)
- Update Supabase types if database schema changes
- Test database operations thoroughly
- Ensure proper error handling for database operations
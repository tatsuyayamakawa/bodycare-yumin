# Suggested Commands for Development

## Core Development Commands
- `bun run dev` - Start development server with Turbo mode
- `bun run build` - Create production build
- `bun run start` - Start production server
- `bun install` - Install dependencies

## Code Quality Commands
- `bun run lint` - Run ESLint for code quality checks
- `bun run format` - Format code with Prettier
- `bun run type-check` - Run TypeScript type checking
- `bun run check` - Run both linting and type checking (composite command)

## Maintenance Commands
- `bun run clean` - Clean build artifacts and cache
- `bun run clean:next` - Remove .next build directory
- `bun run clean:cache` - Remove node_modules cache
- `bun run analyze` - Analyze bundle size (Unix)
- `bun run analyze:win` - Analyze bundle size (Windows)

## Windows System Commands
Since this is a Windows environment, use these commands:
- `dir` - List files and directories (instead of `ls`)
- `cd` - Change directory
- `findstr` - Search text in files (instead of `grep`)
- `where` - Find executable files (instead of `which`)
- `type` - Display file contents (instead of `cat`)
- `copy` - Copy files
- `del` - Delete files
- `mkdir` - Create directories
- `rmdir` - Remove directories

## Git Commands
- `git status` - Check working directory status
- `git add .` - Stage all changes
- `git commit -m "message"` - Commit changes
- `git push` - Push to remote repository
- `git pull` - Pull from remote repository
- `git checkout -b branch-name` - Create and switch to new branch

## Task Completion Workflow
When completing a task, run these commands in order:
1. `bun run check` - Ensure code quality and types are correct
2. `bun run build` - Verify the build succeeds
3. Test the application manually if needed
4. Commit changes with descriptive message
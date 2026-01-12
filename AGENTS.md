# Repository Guidelines

## Project Structure & Module Organization
- `src/app` holds the Next.js App Router pages and route segments (e.g., `src/app/analyze/page.tsx`).
- `src/app/components` contains shared UI components grouped by feature.
- `src/app/hooks`, `src/app/utils`, `src/app/lib`, `src/app/context`, and `src/app/types` host hooks, helpers, data utilities, context providers, and type definitions.
- `public` stores static assets served at `/`.
- `test` contains ad-hoc experiments and prototypes (not currently wired to a test runner).
- Root config includes `next.config.ts`, `tailwind.config.ts`, `eslint.config.mjs`, and `tsconfig.json`.

## Build, Test, and Development Commands
- `npm run dev`: start the local Next.js dev server at `http://localhost:3000`.
- `npm run build`: build the production app.
- `npm run start`: run the production build locally.
- `npm run lint`: run ESLint checks for the codebase.

## Coding Style & Naming Conventions
- TypeScript + React with the Next.js App Router; keep components in PascalCase (e.g., `Hero.tsx`).
- Hooks use the `use*` prefix (e.g., `useAuthGuard.ts`).
- Route folders use kebab-case (e.g., `src/app/ai-recommend`).
- Follow the existing 2-space indentation and Tailwind utility class patterns in JSX.

## Testing Guidelines
- No automated test runner is configured. Use `npm run lint` and manual UI checks.
- If adding tests, keep them under `test/` and document how to run them in `package.json`.

## Commit & Pull Request Guidelines
- Recent commits use short, descriptive messages (often in Korean) without a strict convention; keep them concise and specific.
- PRs should include: a clear summary, any linked issues, and screenshots for UI changes.
- Note local verification steps (e.g., `npm run lint`, `npm run dev`) in the PR description.

## Configuration & Secrets
- Environment variables live in `.env` and `.env.local`; do not commit secrets.
- When adding new env vars, update documentation and provide safe defaults where possible.

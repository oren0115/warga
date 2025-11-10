# Contributing

Thanks for helping improve PKM Frontend. This guide keeps contributions consistent and lightweight.

## Code of Conduct

Treat everyone with respect, stay inclusive, and keep feedback constructive. We want contributors to feel welcome.

## Quick Start

```bash
git clone https://github.com/oren0115/fe-iplcannary.git
cd fe-iplcannary
git remote add upstream https://github.com/<upstream>/fe-iplcannary.git
npm install
cp .env.example .env
npm run dev
```

Minimum stack: Node.js 18+, npm (or yarn/pnpm), Git, a modern editor.

## Workflow

- Create branches from `main`: `git checkout -b feature/my-change`
- Keep your fork in sync: `git pull --rebase upstream main`
- Follow Conventional Commit format: `type(scope): summary`
- Rebase before opening a PR; keep history clean

## Project Layout

```
src/
  components/   # shared + admin UI
  page/         # route-level views
  routes/       # guards and wrappers
  services/     # API + websocket clients
  context/      # global state
  hooks/        # domain hooks
  utils/        # helpers & formatters
```

## Coding Standards

- React + TypeScript functional components only
- Tailwind-first styling; align with existing tokens
- Prefer interfaces, strong typing, and early returns
- One component per file; default exports for components, named exports for helpers
- File naming: components `PascalCase.tsx`, hooks `useThing.ts`, services `thing.service.ts`

## Testing & Quality

```bash
npm run lint
npm run type-check
npm run build
```

Add or update tests when logic changes. Use clear test names and cover edge cases.

## Pull Requests

- Title: concise Conventional Commit summary
- Description: what changed, why, screenshots if UI
- Checklist: lint, type-check, build, tests (note what ran)
- Link related issues with `Fixes #id`

## Filing Issues

- Bugs: include repro steps, expected vs actual, environment, screenshots/logs
- Features: describe use case, proposed approach, alternatives considered

## Docs & Support

- Update related docs (`README`, `docs/`) when behavior changes
- Need help? Open an issue or discussion on GitHub

Thanks again for contributing! 🚀

# PKM Frontend

React + Vite application for managing community finance operations.

## Features

- User dashboard for fees, payments, and notifications
- Admin dashboards for member, fee, and payment management
- Real-time updates via WebSocket and broadcast notifications
- Centralized error handling and audit-friendly history

## Tech Stack

- React + TypeScript, Vite, Tailwind CSS
- Radix UI + shadcn/ui components
- React Router, Axios, Recharts, Lucide icons

## Getting Started

```bash
git clone https://github.com/oren0115/fe-iplcannary
cd fe-iplcannary
npm install
npm run dev
```

Requirements: Node.js 18+ and npm (or yarn/pnpm).

### Environment Variables

Create `.env` (see `env.example`):

```env
VITE_API_URL=http://localhost:8000
VITE_APP_NAME=IPL Canary
```

## Project Layout

```
src/
  components/    # reusable UI + admin modules
  page/          # routed pages
  routes/        # guards and routing helpers
  services/      # API + websocket clients
  context/       # global state providers
  hooks/         # domain hooks
  utils/         # formatting & helpers
```

## Scripts

```bash
npm run dev        # start dev server
npm run build      # production build
npm run preview    # preview build
npm run lint       # ESLint
npm run type-check # tsc --noEmit
```

## License

MIT License. See `LICENSE`.

# Project Guidelines

## Scope
- This repository is a simplified monolith for Wix ↔ HubSpot integration.
- Keep frontend and backend in one repo without Turborepo or microservice decomposition.

## Architecture
- Backend lives in server/src using Express + TypeScript.
- Frontend lives in client/src using Next.js + React.
- Keep separation of concerns clear: config, router, controller, service, and persistence layers should stay focused.
- Prefer functional composition over large class-heavy designs.

## Infrastructure and Deployment
- Optimize all implementation choices for self-hosted Linux/Ubuntu VPS deployments.
- Keep environment variables explicit, grouped, and documented with stable prefixes.
- Use these env prefixes consistently: APP_, DB_, WIX_, HUBSPOT_, SYNC_.
- Maintain one Dockerfile strategy with multi-stage builds and separate runtime targets for frontend and backend.
- Prefer plain Node runtime assumptions unless a task explicitly asks for PM2/systemd patterns.

## TypeScript and Quality Standards
- Use strict TypeScript types. Avoid any and implicit any unless unavoidable and justified.
- Add or update types as part of feature work, not as an afterthought.
- Keep functions small, pure where possible, and side effects isolated.
- Do not introduce abstractions that hide standard SDK behavior without strong justification.

## Backend Conventions
- Use Express middleware and routers for request flow.
- Favor existing libraries over custom wrappers when they meet requirements.
- Use official or widely adopted SDKs for integrations, especially @hubspot/api-client.

## Database Conventions
- Use Drizzle ORM for schema, queries, and migrations.
- Schema decisions for sync features must support:
  - OAuth token rotation
  - Field mapping between Wix and HubSpot models
  - Sync ledger records for bi-directional loop prevention
- Make migration-safe changes when persistence is touched.

## Frontend Conventions
- Use Tailwind CSS for styling and utility-driven UI composition.
- Use lucide-react for iconography.
- Keep UI components focused and colocate feature-specific logic near the feature.

## Build and Validation
- Frontend commands (from client):
  - npm run dev
  - npm run build
  - npm run lint
- Backend commands (from server):
  - npm run dev
  - npm run build
  - npm run check
  - npm run db:generate
  - npm run db:migrate
- Run the smallest relevant checks for changed areas before finalizing work.

## Change Management
- Prefer minimal, targeted edits over broad refactors.
- Preserve existing style unless there is a strong reason to change it.
- Call out assumptions, risks, and operational impact for VPS/Docker in summaries.

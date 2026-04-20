# VAME Wix-HubSpot Integration

A robust, self-hosted integration platform connecting **Wix** and **HubSpot**. This project enables seamless bi-directional contact synchronization, customizable field mappings, and automated webhook handling between the two ecosystems.

## 🚀 Overview

This application serves as a bridge between Wix sites and HubSpot CRM. It allows businesses to:
- Synchronize contacts in real-time.
- Map custom Wix fields to HubSpot properties.
- Manage multiple integrations through a modern dashboard.
- Maintain a sync ledger for auditing and loop prevention.

## 🛠️ Tech Stack

### Frontend (Client)
- **Framework**: [Next.js 15](https://nextjs.org/) (App Router)
- **Styling**: [Tailwind CSS 4](https://tailwindcss.com/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Auth Client**: [Better Auth](https://www.better-auth.com/)

### Backend (Server)
- **Runtime**: [Node.js](https://nodejs.org/) / [Bun](https://bun.sh/)
- **Framework**: [Express](https://expressjs.com/) with TypeScript
- **ORM**: [Drizzle ORM](https://orm.drizzle.team/)
- **Database**: [PostgreSQL](https://www.postgresql.org/)
- **Authentication**: [Better Auth](https://www.better-auth.com/)
- **API Clients**: HubSpot SDK, Wix SDK

## 📋 Prerequisites

- **Node.js** (v20 or higher) or **Bun**.
- **PostgreSQL** instance.
- **Wix App Credentials**: App ID, Secret, and Public Key.
- **HubSpot Developer Account**: Client ID and Secret for OAuth.

## 🏗️ Project Structure

```text
.
├── client/          # Next.js frontend (Dashboard)
├── server/          # Express.js backend (API & Webhooks)
├── docs/            # Project specifications and PDFs
└── compose.yaml     # Docker orchestration (Server-side)
```

## 🚦 Getting Started

### 1. Clone and Install

```bash
git clone <repository-url>
cd vame-wix-hubspot

# Install dependencies for both components
cd server && bun install
cd ../client && bun install
```

### 2. Database Setup

Ensure your PostgreSQL server is running, then initialize the schema:

```bash
cd server
# Create .env from template and fill in DATABASE_URL
cp .env.example .env
# Push schema to database
bun run db:push
```

### 3. Running the Application

It is recommended to run the server first, then the client.

#### Start Server
```bash
cd server
bun run dev # Runs on http://localhost:3001
```

#### Start Client
```bash
cd client
bun run dev # Runs on http://localhost:3000
```

## 🔐 Environment Variables

### Server (`server/.env`)
Key variables required for the backend:
- `DATABASE_URL`: PostgreSQL connection string.
- `BETTER_AUTH_SECRET`: Random string for session security.
- `WIX_APP_ID` / `WIX_APP_SECRET`: From Wix Dev Center.
- `HUBSPOT_CLIENT_ID` / `HUBSPOT_CLIENT_SECRET`: From HubSpot Dev Portal.

### Client (`client/.env`)
- `NEXT_PUBLIC_API_BASE_URL`: URL of the Express server.
- `NEXT_PUBLIC_AUTH_BASE_URL`: Auth endpoint (usually same as API).

## 🐳 Docker Support

You can run the server in a containerized environment:

```bash
cd server
docker compose up --build
```

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---
Created by [Hezron Nyamboga](https://github.com/nyambogahezron)

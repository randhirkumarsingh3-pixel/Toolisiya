# Toolisiya - Free Online Tools Platform

A comprehensive collection of free online tools for productivity, finance, image editing, PDF management, science, career, and more.

## 🚀 Features

- **100+ Free Tools** - Finance calculators, image editors, PDF tools, developer utilities, and more
- **Productivity Tools** - Todo lists, habit trackers, meal planners, medicine reminders
- **Finance Tools** - EMI calculator, GST calculator, FD calculator, investment calculator
- **Image Tools** - Photo editor, image compressor, batch frame, watermark tools
- **Developer Tools** - JSON formatter, code beautifier, Base64 encoder, HTML preview
- **PWA Support** - Install as an app, works offline

## 🛠️ Tech Stack

- **Frontend**: React (Vite), Tailwind CSS, Shadcn UI
- **Backend**: Node.js + Express API
- **Database**: Supabase (PostgreSQL)
- **Auth**: Supabase Auth + JWT for admin

## 📁 Project Structure

```
Toolisiya/
├── apps/
│   ├── web/          # React frontend (Vite)
│   ├── api/          # Node.js Express API
│   └── pocketbase/   # PocketBase compatibility layer
├── supabase_schema.sql
├── supabase_rls_policies.sql
└── package.json
```

## 🔧 Getting Started

### Prerequisites
- Node.js 18+
- Supabase account

### Installation

```bash
# Install dependencies
npm install

# Start development servers (frontend + backend)
npm run dev
```

The app will be available at:
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:3001

### Environment Variables

Create `.env` files:

**`apps/api/.env`**
```
SUPABASE_URL=your-supabase-url
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
JWT_SECRET=your-jwt-secret
```

**`apps/web/.env`**
```
VITE_SUPABASE_URL=your-supabase-url
VITE_SUPABASE_ANON_KEY=your-anon-key
VITE_ADMIN_LOGIN_PATH=/admin-login
```

## 🚀 Deployment

See [deployment guide](docs/deployment.md) for Hostinger deployment instructions.

## 📄 License

All rights reserved © Toolisiya 2026

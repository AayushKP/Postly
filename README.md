# Postly

A modern serverless blogging platform built with React, TypeScript, and Cloudflare Workers. Features AI-assisted content creation powered by Mistral AI, Prisma Accelerate for edge-compatible database access, and Cloudinary for media management.

## Architecture

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                              CLIENT (Vercel)                                │
│                        React + Vite + Tailwind CSS                          │
└─────────────────────────────────────────────────────────────────────────────┘
                                      │
                                      │ HTTPS
                                      ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                      CLOUDFLARE WORKERS (Edge Network)                      │
│  ┌───────────────────────────────────────────────────────────────────────┐  │
│  │                         Hono Framework                                │  │
│  │  ┌─────────────┐  ┌─────────────┐  ┌─────────────────────────────┐    │  │
│  │  │ User Routes │  │ Blog Routes │  │ Auth Middleware (JWT)       │    │  │
│  │  └─────────────┘  └─────────────┘  └─────────────────────────────┘    │  │
│  └───────────────────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────────────────┘
          │                        │                         │
          │                        │                         │
          ▼                        ▼                         ▼
┌──────────────────┐    ┌──────────────────┐    ┌──────────────────────────┐
│ Prisma Accelerate│    │   Mistral AI     │    │      Cloudinary          │
│ (Connection Pool)│    │   (AI Content)   │    │   (Image Uploads)        │
│                  │    │                  │    │                          │
│  - Edge-ready    │    │  - Title Gen     │    │  - Image optimization    │
│  - Global cache  │    │  - Content Gen   │    │  - CDN delivery          │
│  - Auto-scaling  │    │  - Suggestions   │    │  - Transformations       │
└──────────────────┘    └──────────────────┘    └──────────────────────────┘
          │
          ▼
┌──────────────────┐
│   PostgreSQL     │
│   (Database)     │
└──────────────────┘
```

## Tech Stack

### Frontend

- **React 18** - UI library with hooks
- **TypeScript** - Type safety
- **Vite** - Build tool and dev server
- **Tailwind CSS** - Utility-first styling
- **Zustand** - Lightweight state management
- **Lottie** - Smooth animations
- **Axios** - HTTP client

### Backend (Serverless)

- **Cloudflare Workers** - Edge computing platform
- **Hono** - Lightweight web framework for edge
- **Prisma Accelerate** - Connection pooling for serverless
- **JWT** - Stateless authentication

### External Services

- **Mistral AI** - AI-powered content generation
- **Cloudinary** - Image upload and CDN
- **PostgreSQL** - Primary database

### Shared

- **Zod** - Runtime validation schemas
- **common** - Shared types and validators

## Project Structure

```
Postly/
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   ├── pages/          # Route pages
│   │   ├── hooks/          # Custom React hooks
│   │   ├── store/          # Zustand store
│   │   └── lottie/         # Animation files
│   └── public/
├── server/                 # Cloudflare Worker API
│   ├── src/
│   │   └── index.ts        # Worker entry point
│   ├── controllers/        # Business logic
│   ├── routes/             # API route definitions
│   ├── middleware/         # Auth middleware
│   └── prisma/             # Database schema & migrations
└── common/                 # Shared validation schemas
    └── src/
        └── index.ts        # Zod schemas
```

## Serverless Features

### Prisma Accelerate

- **Connection Pooling** - Manages database connections efficiently at the edge
- **Global Caching** - Reduces database load with intelligent caching
- **Edge Compatibility** - Works seamlessly with Cloudflare Workers
- **Auto-scaling** - Handles traffic spikes without connection limits

### Cloudflare Workers

- **Zero Cold Starts** - Instant response times globally
- **Edge Deployment** - Code runs in 300+ data centers worldwide
- **Auto-scaling** - Scales from zero to millions of requests
- **Cost Efficient** - Pay only for what you use

### Mistral AI Integration

- **Title Generation** - AI suggests blog titles based on content
- **Content Assistance** - Helps generate and improve blog content
- **Smart Suggestions** - Context-aware writing recommendations

### Cloudinary

- **Image Uploads** - Direct browser-to-cloud uploads
- **Optimization** - Automatic format and quality optimization
- **Transformations** - Resize, crop, and filter on-the-fly
- **CDN Delivery** - Fast global image delivery

## Getting Started

### Prerequisites

- Node.js v18+
- npm
- Wrangler CLI (`npm i -g wrangler`)
- PostgreSQL database
- Prisma Accelerate account
- Cloudinary account
- Mistral AI API key

### Installation

```sh
git clone <repo-url>
cd Postly

# Install dependencies
cd common && npm install && npm run build
cd ../server && npm install
cd ../client && npm install
```

### Environment Setup

**Client** (`client/.env`)

```env
VITE_BACKEND_URL=http://localhost:8787
VITE_CLOUDINARY_CLOUD_NAME=your_cloud_name
VITE_CLOUDINARY_UPLOAD_PRESET=your_preset
```

**Server** (`server/wrangler.toml` or secrets)

```toml
[vars]
DATABASE_URL = "prisma://accelerate.prisma-data.net/?api_key=..."
JWT_SECRET = "your_jwt_secret"
MISTRAL_API_KEY = "your_mistral_key"
```

### Database Setup

```sh
cd server
npx prisma migrate deploy
npx prisma generate --no-engine
```

### Running Locally

```sh
# Terminal 1 - Backend
cd server
npm run dev

# Terminal 2 - Frontend
cd client
npm run dev
```

- Frontend: `http://localhost:5173`
- Backend: `http://localhost:8787`

## API Endpoints

### Authentication

| Method | Endpoint              | Description       |
| ------ | --------------------- | ----------------- |
| POST   | `/api/v1/user/signup` | Register new user |
| POST   | `/api/v1/user/signin` | User login        |
| GET    | `/api/v1/user/me`     | Get current user  |

### Blogs

| Method | Endpoint            | Description        |
| ------ | ------------------- | ------------------ |
| GET    | `/api/v1/blog/bulk` | Get all blogs      |
| GET    | `/api/v1/blog/:id`  | Get single blog    |
| POST   | `/api/v1/blog`      | Create blog (auth) |
| PUT    | `/api/v1/blog`      | Update blog (auth) |
| DELETE | `/api/v1/blog/:id`  | Delete blog (auth) |

### AI Features

| Method | Endpoint                        | Description              |
| ------ | ------------------------------- | ------------------------ |
| POST   | `/api/v1/blog/generate-title`   | Generate title with AI   |
| POST   | `/api/v1/blog/generate-content` | Generate content with AI |

## Scripts

| Package | Command          | Description          |
| ------- | ---------------- | -------------------- |
| client  | `npm run dev`    | Start dev server     |
| client  | `npm run build`  | Production build     |
| client  | `npm run lint`   | Run ESLint           |
| server  | `npm run dev`    | Start Wrangler dev   |
| server  | `npm run deploy` | Deploy to Cloudflare |
| common  | `npm run build`  | Compile TypeScript   |

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/new-feature`)
3. Commit changes (`git commit -m 'Add new feature'`)
4. Push to branch (`git push origin feature/new-feature`)
5. Open a Pull Request

## License

MIT

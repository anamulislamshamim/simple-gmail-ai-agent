# bun_hono_backend

To install dependencies:

```bash
bun install
```

Example .env

```bash
NODE_ENV=development
PORT=3000

GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
GOOGLE_REDIRECT_URI=

GEMINI_API_KEY=

DATABASE_URL=postgres://postgres:postgres@localhost:5432/gmail_ai_agent
REDIS_URL=redis://localhost:6379

BETTER_AUTH_URL=http://localhost:3000
BETTER_AUTH_SECRET=hgq3rhi13sr0r7sfq2rj7e740g2SyCoWuWKDCig4I4WMgTeC
```

# Migrate your database schema for better-auth

```bash
# Generate schema
bun x @better-auth/cli@latest generate
# Migrate Schema
bun x @better-auth/cli@latest migrate
```

To run:

```bash
bun run index.ts
```

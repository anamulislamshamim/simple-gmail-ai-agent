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

DATABASE_URL=
REDIS_URL=

BETTER_AUTH_URL=
BETTER_AUTH_SECRET=
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

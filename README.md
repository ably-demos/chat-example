# Ably Chat Reference Application

## Features

- Ably Chat SDK
- Next.js 14 App Directory
- Prisma | SQLite
- Radix UI Primitives / Shadcn
- Tailwind CSS
- Icons from [Lucide](https://lucide.dev)

## Usage

### Development

```bash
npm run dev
```

### Building

```bash
npm run build
```

# Things to note

- [ ] Remove local ably conversations package after npm
  - [ ] Remove scripts/update-chat.sh

# Requirements

```bash
ABLY_API_KEY= // This can be found on your https://ably.com
```

# Deploying a New Instance

Prequisites:

- A vercel account

```bash
git clone https://
vercel link
```

Add Postgres Storage with default values

Add Env vars from the template

```bash
vercel env pull .env.development.local
```

```
vercel  deploy
```

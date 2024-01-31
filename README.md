# Ably Chat Demo

A Fullstack Chat Application, showing some of the ways that tj

## Features

- Ably Chat SDK
- Next.js 14 App Directory
- Prisma | SQLite
- Radix UI Primitives / Shadcn
- Tailwind CSS
- Icons from [Lucide](https://lucide.dev)

## Usage

### Getting Started

> Note: The conversations package hasn't been published on npm, as at the t

```bash
git clone git@github.com:ably-demos/chat-example.git
npm i
cp .env.template .env
```

### Local Development

#### Setup

```bash
git clone https://github.com/ably-demos/chat-example
npm i
npm run db:start # You can skip this if you have a local postgres server
npm run db:seed
```

### Running

```bash
npm run dev
```

### Building

```bash
npm run build
```

# Deploying to Vercel

Prequisites:

- A Vercel account
- An Ably account

1. Run the following steps locally.

```bash
npm install -g vercel
vercel login
# Run from the following command from the root of this repo.
vercel link --yes
```

2. Headover to the [Vercel Dashboard](https://vercel.com/dashboard)

   - Go to the newly created project
   - Go to storage
   - Add Postgres Storage, click Continue
     - This will provision a remote postgres instance
     - You can use this instance for both dev and showcasing

3. Update the PRISMA_POSTGRES_URL, with the newly created environment variable with the same name

```
vercel # Will deploy to dev
vercel --prod # Fairly obvious, it will deploy to you guessed it, prod.
```

Known Issues:

- Message Reactions not being returned from the server
- Message Reactions returning the wrong count.
- Remove local ably conversations package after npm
  - Then Remove scripts/update-chat.sh

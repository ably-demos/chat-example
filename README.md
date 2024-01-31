# Ably Chat Demo

A Fullstack Chat Application, showing some of the ways that chat can be implemented in a project using the ably chat sdk

## Features

- Ably Chat SDK
- Next.js 14 App Directory
- Prisma | Postgres
- Radix UI Primitives / Shadcn
- Tailwind CSS
- Icons from [Lucide](https://lucide.dev)

## Usage

### Getting Started

> Note: The conversations package hasn't been published on npm, and is currently being included via the packages directory.

#### Setup

Firstly, copy the env template and populate the values, a brief description of each can be found in comments in the `.env.template`

```bash
cp .env.template .env
```

> Update the values before seeding, as some of the env variables are required by the seed scripts

```bash
npm install
npm run db:start # You can skip this if you have a local postgres server
npm run db:seed
```

#### Running

```bash
npm run dev
```

#### Building

```bash
npm run build
```

#### Updating Conversations

Make sure the conversations repo is present, and a sibling of this one

The following steps should do this for you

```bash
pushd .
cd ..
git clone git@github.com:ably-labs/conversations.git
popd
npm run update:chat
```

### Deploying to Vercel

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

```bash
vercel # Will deploy to dev
vercel --prod # Fairly obvious, it will deploy to you guessed it, prod.
```

Alternatively, if you're using github - add the [vercel git integration](https://vercel.com/docs/deployments/git/vercel-for-github).

## Postgres

This app, to show an end to end experience, uses postgres as it's db.

The scripts to run/create the postgres container can be found in scripts/db.

---

Known Issues:

- Message Reactions not being returned from the server
- Message Reactions returning the wrong count.
- Remove local ably conversations package after it's been published to npm
  - Then remove scripts/update-chat.sh

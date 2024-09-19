# Ably Livestream Chat Demo

A fullstack chat application demonstrating some of the features of the Ably Chat SDK and associated Chat React hooks. It uses:

* [`rooms`](https://ably.com/docs/chat/rooms) and [`messages`](https://ably.com/docs/chat/rooms/messages) for users to send and subscribe to chat messages, and [`history`](https://ably.com/docs/chat/rooms/history) to retrieve those that have been previously sent.
* [`reactions`](https://ably.com/docs/chat/rooms/reactions) to enable users to send and receive room-level reactions.
* [`occupancy`](https://ably.com/docs/chat/rooms/occupancy) to show the number of users connected to the room.
* [`presence`](https://ably.com/docs/chat/rooms/presence) to synchronize video playback between users.
* [`Chat React hooks`](https://github.com/ably/ably-chat-js/tree/main/src/react) to access and manage the various chat features above.
* Postgres to demonstrate storing [`room`](https://ably.com/docs/chat/rooms) and user data.

> Note: some elements of this application are purely for demonstration purposes, such as the video sync any chat bots.

## Built with

- [Ably Chat SDK](https://github.com/ably/ably-chat-js) and [Chat React hooks](https://github.com/ably/ably-chat-js/tree/main/src/react)
- [Next.js](https://nextjs.org/) 14 App Directory
- [Prisma](https://www.prisma.io/) | [Postgres](https://www.postgresql.org/) for database storage and ORM
- [Radix UI Primitives](https://www.radix-ui.com/primitives) / [Shadcn](https://ui.shadcn.com/) for the UI components
- [Tailwind CSS](https://tailwindcss.com/)
- Icons from [Lucide](https://lucide.dev)

This demo app uses both the [ably-chat-js](https://github.com/ably/ably-chat-js) core SDK and React Hooks as well as [ably-js](https://github.com/ably/ably-js) core SDK and React hooks

## Usage

The application is hosted on [Vercel](https://vercel.com/) and available to view at [ably-livestream-chat-demo.vercel.app](https://ably-livestream-chat-demo.vercel.app). You can also run the application locally.

### Local setup

Firstly, copy the env template to `.env` and populate the values, a brief description of each can be found in comments in the `.env.template`

```bash
cp .env.template .env
```
Install the dependencies and build the application:

```bash
npm install
```

#### Database setup

This application uses Prisma and Postgres.
For local development, you need to ensure you have [Docker](https://www.docker.com/) installed.
There is a script that will spin up a Postgres container for you.
Run it from the root directory:

```bash
/scripts/db/start
```

With the container running, you can now run the migrations and seed the database.
Ensure you have set `POSTGRES_PRISMA_URL` in the `.env` file. This should be `postgres://default:S3cret@localhost:5432/chat_db` providing
you have not changed the default Docker file values.

```bash
npm run db:migrate
npm run db:seed
```

#### Running

Build and run the development server to run locally:

```bash
npm run build
npm run dev
```

The app will be available at [http://localhost:3000](http://localhost:3000).
If you head to the URL, your chat application should redirect you to a new room with a unique ID. You can copy this URL
and paste it into a separate browser, or use inPrivate browsing to simulate a second user in the room.


### Deploy to Vercel

Prerequisites:

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

3. Update the `PRISMA_POSTGRES_URL`, with the newly created environment variable using the same name.

4. Run the database migrations and seed the database:

```bash
npm run db:migrate
npm run db:seed
```

5. Deploy the application:

```bash
vercel # Will deploy to dev
vercel --prod # Fairly obvious, it will deploy to you guessed it, prod.
```

Alternatively, if you're using GitHub - add the [Vercel Git integration](https://vercel.com/docs/deployments/git/vercel-for-github).

## Bots

The bots in the application are controlled by environment variables.
These can be set in the `.env` file.
A new realtime connection is acquired for each bot.
This is to demonstrate the behaviour of occupancy which counts the number of connections in a room.

1. `NEXT_PUBLIC_WITH_BOTS` set to `true` to enable the bots.
2. `NEXT_PUBLIC_BOT_INTERVAL` set to a number to determine how often the bots will send a message.
3. `NEXT_PUBLIC_BOT_COUNT` set to a number to determine how many bots are spawned.
4. `NEXT_PUBLIC_BOT_PUBLISHER_PROBABILITY` set to a number to determine how many of the bots will publish messages.

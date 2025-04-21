This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, install dependencies:

```
npm install
```

Then:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## DB Deploy (Docker)

```
docker compose up -d
```

## DB Seed

```
npx tsx prisma/seed.ts
```

This will apply the following content for development purposes
Roles (admin)

Animal (perro, gato)

AnimalAge (cachorro, adulto, senior)

AnimalSize (pequeño, mediano, grande)

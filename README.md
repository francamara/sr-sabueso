This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## First time running the project? 
After installing docker and node you can run the following command and have it all set it up!
```
docker compose up -d && npx prisma migrate dev && npx tsx prisma/seed.ts && npm run dev
```

## In case 

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

## DB Migrate

```
npx prisma migrate dev
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

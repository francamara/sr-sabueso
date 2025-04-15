This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## DB Seed
This will apply the following content for development purposes
Roles (admin)

Animal (perro, gato)

AnimalAge (cachorro, adulto, senior)

AnimalSize (pequeño, mediano, grande)
```
npx tsx prisma/seed.ts
```
This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

# Create Docker image

docker build -t publicbets-nextjs .

docker-compose up --build

# for hot reloading and dev

docker-compose up -d --build

# for Production

docker-compose -f "docker-compose.prod.yml" up -d --build

## Prisma

# for development

npx prisma db push

# Migrate

npx prisma migrate dev
npx prisma generate

## Production

# install postgres

docker run -p 5432:5432 --name postgres -e POSTGRES_PASSWORD=BETpUBlic2024 -e POSTGRES_USER=publicbets -e POSTGRES_DB=publicbets -d postgres

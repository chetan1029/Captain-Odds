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

## Prepare production server

1. apt install docker-compose
2. sudo apt update && sudo apt install git
3. git --version
4. ssh-keygen -t ed25519 -C "chetanbadgujar92@gmail.com" (it will save inside /root/.ssh usually)
5. cat id_ed25519.pub (to copy public key)
6. Add this public key into github setting -> new SSH key
7. Test ssh with - ssh -T git@github.com (it will display Hi chetan1029! You've successfully....)
8. go to cd /root/publicbets/
9. git clone git@github.com:chetan1029/publicbets-final.git
10. Run - docker compose build
11. Run - docker compose up
12. Sometime postgres gonna give error of "role not found" or credentials error - just delete volume and build/up again

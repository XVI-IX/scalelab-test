#!/bin/sh
npx prisma generate

npx prisma migrate dev --name init --create-only

exec npm run start:prod
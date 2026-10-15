# Test NestJS app

## Deploy the entire project with one Docker command

```bash
$ docker compose up --build -d
```

Apollo Sandbox: `http://localhost:3333/graphql`.

## Or run the backend in dev-mode

```bash
# install dependencies
$ npm install

# start the database container
$ docker compose up db -d

# apply Prisma's schema to database and seed data
$ npm run prisma:deploy && npm run prisma:seed

# develop the backend locally
$ npm run dev

# create and apply a Prisma migration from updated schema
$ npm run prisma:migrate
```

Apollo Sandbox: `http://localhost:3000/graphql`.

<!--
## Run tests

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```
-->

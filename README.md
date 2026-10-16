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

## Some example queries

```gql
query {
  profile(id: 123) {
    # By default, localizable fields use "Accept-Language" header
    full_name

    # You can also specify languages explicitly (Accept-Language header syntax)
    full_name_en: full_name(lang: "en-US,en-GB,en")
    full_name_ru: full_name(lang: "ru")

    # You can also access the I18nString value directly
    full_name_i18n {
      english: value(lang: "en-US,en")
      russian: value(lang: "ru")

      translations {
        language {
          # english_name and local_name are available here for convenience
          id
          english_name
          local_name
          russian_name: name(lang: "ru")
        }
        value
      }
    }
  }
}
```

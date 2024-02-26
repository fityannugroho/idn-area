<h1>Getting Started</h1>

<h2>Table of Content</h2>

- [Prerequisite](#prerequisite)
- [Installation Steps](#installation-steps)
  - [Installation with Docker](#installation-with-docker)
- [Run the Test](#run-the-test)

---

## Prerequisite

- [Node.js](https://nodejs.org/en) (version 18 or higher)
- [npm](https://www.npmjs.com)
- Database provider you want to use. We currently support MongoDB, PostgreSQL, and MySQL. See supported databases version [here](https://www.prisma.io/docs/reference/database-reference/supported-databases).

## Installation Steps

1. Clone the repository

   Use [`git clone`](https://www.git-scm.com/docs/git-clone) command, to clone this repository using HTTPS or SSH.

1. Install the dependencies

   Use `npm install` command, to install all the dependencies.

1. Configure the environment variables

   - Create `.env` file by simply copying the **`.env.example` file** and rename it.

   - Set the `APP_HOST` and `APP_PORT`.

   - You can enable [rate limiting](https://docs.nestjs.com/security/rate-limiting) by setting the **`APP_ENABLE_THROTTLE`** to be `true`. You also can customize the `APP_THROTTLE_TTL` and `APP_THROTTLE_LIMIT` as desired.

   - You can also customize the pagination feature by setting the **`APP_PAGINATION_MAX_PAGE_SIZE`** and **`APP_PAGINATION_DEFAULT_PAGE_SIZE`**.

     > **Note!**
     >
     > Set the `APP_PAGINATION_MAX_PAGE_SIZE` value wisely, as it will determine the amount of resource usage (the size of queries to the database).

   - Set the `DB_PROVIDER` with the data source provider you want to use. Current supported providers: 'mongodb', 'postgresql', and 'mysql'. See the details [here](https://www.prisma.io/docs/reference/api-reference/prisma-schema-reference#fields).

   - Set the `DB_HOST`, `DB_PORT`, `DB_USERNAME`, `DB_PASSWORD`, `DB_USERNAME`, and `DB_PASSWORD`. See the [connection string](https://pris.ly/d/connection-strings) documentation.

     > If you use local database, you must grant **read-write access** to the database.

1. Generate the database

   Run **`npm run db:migrate`** command to generate the database.

   > You can use `npx prisma migrate deploy` command to run migration in **non-development environments** and if you are using any database providers **other than MongoDB**.
   > See the details [here](https://www.prisma.io/docs/reference/api-reference/command-reference#migrate-deploy).

1. Seed the data

   Run **`npm run db:seed`** command to seed the data.

1. Run the app

   Use `npm run start` command, to run the app.

### Installation with Docker

We also provide Docker configuration with PostgreSQL database support.

- Fork and clone this project.
- Configure the environment variables.

  - `DB_PROVIDER` must be set into `postgresql`.
  - `DB_HOST` must be set into `db`.

- Run `docker compose up` command to build and run the app.

  > If you change any environment variables, you need to rebuild the image using `docker compose up --build` command.

- Finish

## Run the Test

To run the test, you can use the following command:

```shell
# Run unit tests
npm run test

# Run e2e test
npm run test:e2e

# Run coverage test
npm run test:cov
```

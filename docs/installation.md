<h1>Getting Started</h1>

<h2>Table of Content</h2>

- [Prerequisite](#prerequisite)
- [Installation Steps](#installation-steps)
- [Run the Test](#run-the-test)

---

## Prerequisite

- [Node.js](https://nodejs.org/en) (version 14 or higher)
- [NPM](https://www.npmjs.com)
- [MongoDB server](https://www.mongodb.com/try/download/community) (version 4.2 or higher) with **replica set deployment**
  (see [Prisma with MongoDB Prerequisite](https://www.prisma.io/docs/getting-started/setup-prisma/start-from-scratch/mongodb-typescript-mongodb#prerequisites)).

## Installation Steps

1. Clone the repository

    Use [`git clone`](https://www.git-scm.com/docs/git-clone) command, to clone this repository using HTTPS or SSH.

1. Install the dependencies

    Use `npm install` command, to install all the dependencies.

1. Configure the environment variables

    - Create `.env` file by simply copying the **`.env.example` file** and rename it.
    - Then, set the `MONGODB_URI` variable to the MongoDB connection string.

      > You must grant **read-write access** to the database.

1. Generate the database

    Use **`npm run db:migrate`** or [`npx prisma db push`](https://www.prisma.io/docs/reference/api-reference/command-reference#db-push) command, to generate the database.

1. Seed the data

    Use **`npm run db:seed`** or [`npx prisma db seed`](https://www.prisma.io/docs/guides/migrate/seed-database#seeding-your-database-with-typescript-or-javascript) command, to seed the data.

1. Run the app

    Use `npm run start` command, to run the app.

## Run the Test

To run the test, you can use the following command:

```shell
# Run unit tests
npm run test

# Run e2e test
npm run test:e2e
```

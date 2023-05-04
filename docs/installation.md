<h1>Getting Started</h1>

<h2>Table of Content</h2>

- [Prerequisite](#prerequisite)
- [Installation Steps](#installation-steps)

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

2. Generate Prisma

    Use [`npx prisma generate`](https://www.prisma.io/docs/reference/api-reference/command-reference#generate) command, to generate the Prisma Client.

3. Generate the database

    Use [`npx prisma db push`](https://www.prisma.io/docs/reference/api-reference/command-reference#db-push) command, to generate the database.

4. Seed the data

    Use `npm run seed` command, to seed the data.

5. Run the app

    Use `npm run start` command, to run the app.

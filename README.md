<h1 align="">Indonesian Area API</h1>

<p>
  <a href="https://nestjs.com"><img alt="NestJS" src="https://img.shields.io/badge/-NestJS-ea2845?style=flat-square&logo=nestjs&logoColor=white" /></a>
  <a href="https://www.typescriptlang.org"><img alt="TypeScript" src="https://img.shields.io/badge/-TypeScript-007ACC?style=flat-square&logo=typescript&logoColor=white" /></a>
  <a href="https://www.prisma.io"><img alt="Prisma" src="https://img.shields.io/badge/-Prisma-1B222D?style=flat-square&logo=prisma&logoColor=white" /></a>
  <a href="https://www.mongodb.com"><img alt="MongoDB" src="https://img.shields.io/badge/-MongoDB-47A248?style=flat-square&logo=mongodb&logoColor=white" /></a>
  <a href="https://www.postgresql.org"><img alt="PostgreSQL" src="https://img.shields.io/badge/-PostgreSQL-657991?style=flat-square&logo=postgresql&logoColor=white" /></a>
  <a href="https://www.mysql.com"><img alt="MySQL" src="https://img.shields.io/badge/-MySQL-00688F?style=flat-square&logo=mysql&logoColor=white" /></a>
</p>

**English** | [हिन्दी](docs/README_hi.md) | [Bahasa Indonesia](docs/README_id.md) | [한국어](docs/README_ko.md) | [Tagalog](docs/README_tl.md)

API that provides information on the **administrative areas of Indonesia**, from the province, regency, district, to village levels. It also provides island data since [version 1.1.0](https://github.com/fityannugroho/idn-area/releases/tag/v1.1.0).

Built with [NestJS framework](https://nestjs.com) and writen in TypeScript. [Prisma](https://www.prisma.io) is used as the ORM to interact with any kind of databases (MySQL, PostgreSQL, and MongoDB).

> **Note!**
>
> If you choose MongoDB as the [database provider](/docs/installation.md#prerequisite), **the `id` property will be added to the response**. See [issue #308](https://github.com/fityannugroho/idn-area/issues/308).
>
> _This `id` property is **not present** if you use MySQL or PostgreSQL as the database provider._

## Getting Started

Please read the [installation guide](docs/installation.md) to install and run this app.

## Data

The data we used is based on official sources, managed in [**idn-area-data**](https://github.com/fityannugroho/idn-area-data) repository and distributed as a [npm package](https://www.npmjs.com/package/idn-area-data).

> The [data](https://github.com/fityannugroho/idn-area-data/tree/main/data) is made available here under the [Open Database License (ODbL)](https://github.com/fityannugroho/idn-area-data/blob/main/data/LICENSE.md).

## Documentation

Read the latest version of API documentation in the [documentation page](https://idn-area.up.railway.app/docs). This documentation is automatically generated using [`@nestjs/swagger`](https://docs.nestjs.com/openapi/introduction).

> You also can access the documentation in your local machine by running the app (see [Getting Started](#getting-started)) and open http://localhost:3000/docs in your browser.

## Live Demo

You can try the API by replacing the http://localhost:3000 with the endpoint provided in this repository description.

These are some sample projects that using this API :

- [idn-area Map](https://github.com/fityannugroho/idn-area-map)

## Contributing

If you want to contribute to this project, please read the [CONTRIBUTING.md](CONTRIBUTING.md) file and make sure you follow the [Pull Request guide](CONTRIBUTING.md#submitting-a-pull-request).

## Problem Reporting

We have different channels for each problem, please use them by following these conditions :

### Reporting a Bug

To report a bug, please open a new issue following the [guide](CONTRIBUTING.md#submitting-an-issue).

### Requesting a New Feature

If you have a new feature in mind, please open a new issue following the [guide](CONTRIBUTING.md#submitting-an-issue).

### Asking a Question

If you have a question, you can search for answers in the [GitHub Discussions Q&A category](https://github.com/fityannugroho/idn-area/discussions/categories/q-a). If you don't find a relevant discussion already, you can open a new discussion.

## Support This Project

Give a ⭐️ if this project helped you!

Also please consider supporting this project with a **donation**. Your donation will help us maintain and develop this project and provide you with better support.

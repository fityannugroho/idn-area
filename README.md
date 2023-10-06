<h1 align="">Indonesian Area API (<i>API Wilayah Indonesia</i>)</h1>

<p>
  <a href="https://nestjs.com"><img alt="NestJS" src="https://img.shields.io/badge/-NestJS-ea2845?style=flat-square&logo=nestjs&logoColor=white" /></a>
  <a href="https://www.typescriptlang.org"><img alt="TypeScript" src="https://img.shields.io/badge/-TypeScript-007ACC?style=flat-square&logo=typescript&logoColor=white" /></a>
  <a href="https://www.prisma.io"><img alt="Prisma" src="https://img.shields.io/badge/-Prisma-1B222D?style=flat-square&logo=prisma&logoColor=white" /></a>
  <a href="https://www.mongodb.com"><img alt="MongoDB" src="https://img.shields.io/badge/-MongoDB-47A248?style=flat-square&logo=mongodb&logoColor=white" /></a>
  <a href="https://www.postgresql.org"><img alt="PostgreSQL" src="https://img.shields.io/badge/-PostgreSQL-657991?style=flat-square&logo=postgresql&logoColor=white" /></a>
  <a href="https://www.mysql.com"><img alt="MySQL" src="https://img.shields.io/badge/-MySQL-00688F?style=flat-square&logo=mysql&logoColor=white" /></a>
</p>

API that provides information on the **administrative areas of Indonesia**, from the province, regency, district, to village levels. It also provides island data since [version 1.1.0](https://github.com/fityannugroho/idn-area/releases/tag/v1.1.0).

Built with [NestJS framework](https://nestjs.com) and writen in TypeScript. [Prisma](https://www.prisma.io) is used as the ORM to interact with any kind of databases (MySQL, PostgreSQL, and MongoDB).

> **⚠️ Upgrading to v3.0.0 ⚠️**
>
> Since [v3.0.0](https://github.com/fityannugroho/idn-area/releases/tag/v3.0.0), **Node.js v18** or higher is required.

<h2>Table of Content</h2>

- [Getting Started](#getting-started)
- [Data](#data)
- [Documentation](#documentation)
- [Live Demo](#live-demo)
- [Contributing](#contributing)
- [Problem Reporting](#problem-reporting)
  - [Reporting a Bug](#reporting-a-bug)
  - [Requesting a New Feature](#requesting-a-new-feature)
  - [Asking a Question](#asking-a-question)
- [Support This Project](#support-this-project)

---

## Getting Started

Please read the [installation guide](docs/installation.md) to install and run this app.

## Data

The data we used is based on official sources, managed in [**idn-area-data**](https://github.com/fityannugroho/idn-area-data) repository and distributed as a [npm package](https://www.npmjs.com/package/idn-area-data).

> The [data](https://github.com/fityannugroho/idn-area-data/tree/main/data) is made available here under the [Open Database License (ODbL)](https://github.com/fityannugroho/idn-area-data/blob/main/data/LICENSE.md).

## Documentation

Read the latest version of API documentation in the [documentation page](https://idn-area.cyclic.app/docs). This documentation is automatically generated using [`@nestjs/swagger`](https://docs.nestjs.com/openapi/introduction).

> You also can access the documentation in your local machine by running the app (see [Getting Started](#getting-started)) and open http://localhost:3000/docs in your browser.

## Live Demo

You can try the API by replacing the http://localhost:3000 with the endpoint provided in this repository description.

These are some sample projects that using this API :

- [Simple area dropdown](https://github.com/fityannugroho/idn-area-example)
- [idn-area Map](https://github.com/fityannugroho/idn-area-map)

## Contributing

If you want to contribute to this project, please read the [CONTRIBUTING.md](CONTRIBUTING.md) file and make sure you follow the [Pull Request guide](CONTRIBUTING.md#submitting-a-pull-request)

## Problem Reporting

We have different channels for each problem, please use them by following these conditions :

### Reporting a Bug
To report a bug, please open a new issue following the [guide](CONTRIBUTING.md#submitting-an-issue).

### Requesting a New Feature
If you have a new feature in mind, please open a new issue following the [guide](CONTRIBUTING.md#submitting-an-issue).

### Asking a Question
If you have a question, you can search for answers in the [GitHub Discussions Q&A category](https://github.com/fityannugroho/idn-area/discussions/categories/q-a). If you don't find a relevant discussion already, you can open a new discussion.

## Support This Project

<a href="https://trakteer.id/fityannugroho/tip" target="_blank"><img id="wse-buttons-preview" src="https://cdn.trakteer.id/images/embed/trbtn-red-6.png" style="border: 0px none; height: 36px; --darkreader-inline-border-top: currentcolor; --darkreader-inline-border-right: currentcolor; --darkreader-inline-border-bottom: currentcolor; --darkreader-inline-border-left: currentcolor;" alt="Trakteer Saya" data-darkreader-inline-border-top="" data-darkreader-inline-border-right="" data-darkreader-inline-border-bottom="" data-darkreader-inline-border-left="" height="40"></a>

You can support this project by donating via [GitHub Sponsor](https://github.com/sponsors/fityannugroho), [Trakteer](https://trakteer.id/fityannugroho/tip), or [Saweria](https://saweria.co/fityannugroho).

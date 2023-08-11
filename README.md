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
- [API Endpoint](#api-endpoint)
  - [Documentation](#documentation)
  - [Get provinces](#get-provinces)
  - [Get specific province](#get-specific-province)
  - [Get regencies by name](#get-regencies-by-name)
  - [Get specific regency](#get-specific-regency)
  - [Get all regencies in a province](#get-all-regencies-in-a-province)
  - [Get districts by name](#get-districts-by-name)
  - [Get specific district](#get-specific-district)
  - [Get all districts in a regency](#get-all-districts-in-a-regency)
  - [Get villages by name](#get-villages-by-name)
  - [Get specific village](#get-specific-village)
  - [Get all villages in a district](#get-all-villages-in-a-district)
  - [Get islands by name](#get-islands-by-name)
  - [Get specific island](#get-specific-island)
  - [Get all islands in a regency](#get-all-islands-in-a-regency)
- [Query Parameters](#query-parameters)
  - [`sortBy`](#sortby)
  - [`sortOrder`](#sortorder)
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

## API Endpoint

[sortby-query]: #sortby
[sortorder-query]: #sortorder

### Documentation

```
GET /docs
```

- Use this endpoint to get generated **API documentation**.

### Get provinces

```
GET /provinces
```

- Use this endpoint to **get all of provinces**.
- This endpoint will return an array of province.
- Usage example: http://localhost:3000/provinces

**Filter Provinces by `name`**

```
GET /provinces?name={provinceName}
```

- Add `name` query to **filter the provinces by its name**.
- For example, if you replace the `{provinceName}` with "jawa" then you will get all the provinces whose names contain the word "jawa".
- The `{provinceName}` must be **at least 3 characters**, maximum 255 characters, and does not contains any symbols. If not, you will get `400 Bad Request` response.
- The response will be an **empty array** `[]` if there are no province matched with the `{provinceName}`.
- Usage example: http://localhost:3000/provinces?name=jawa

> This endpoint also support [`sortBy`][sortby-query] and [`sortOrder`][sortorder-query] queries.

### Get specific province

```
GET /provinces/{provinceCode}
```

- Use this endpoint to **get a specific province**.
- The `{provinceCode}` must be **2 numeric characters**. If not, you will get `400 Bad Request` response.
- This endpoint **will return** the province with the same code as `{provinceCode}`. Otherwise, you will get a `404 Not Found` response.
- Usage example: http://localhost:3000/provinces/32

### Get regencies by name

```
GET /regencies?name={regencyName}
```

- Use this endpoint to **get the regencies by its name**.
- The `{regencyName}` **is required** and must be **at least 3 characters**, maximum 255 characters, and does not contains any symbols. If not, you will get `400 Bad Request` response.
- This endpoint **will return** an array of regency.
- Usage example: http://localhost:3000/regencies?name=bandung

> This endpoint also support [`sortBy`][sortby-query] and [`sortOrder`][sortorder-query] queries.

### Get specific regency

```
GET /regencies/{regencyCode}
```

- Use this endpoint to **get a specific regency**.
- The `{regencyCode}` must be **4 numeric characters**. If not, you will get `400 Bad Request` response.
- This endpoint **will return** the regency with the same code as `{regencyCode}`. Otherwise, you will get a `404 Not Found` response.
- Usage example: http://localhost:3000/regencies/3273

### Get all regencies in a province

```
GET /provinces/{provinceCode}/regencies
```

- Use this endpoint to **get all regencies in a province**.
- The `{provinceCode}` must be **2 numeric characters**. If not, you will get `400 Bad Request` response.
- This endpoint **will return** the array of regency if the `{provinceCode}` is exists. Otherwise, you will get a `404 Not Found` response.
- Usage example: http://localhost:3000/provinces/32/regencies

> This endpoint also support [`sortBy`][sortby-query] and [`sortOrder`][sortorder-query] queries.

### Get districts by name

```
GET /districts?name={districtName}
```

- Use this endpoint to **get the districts by its name**.
- The `{districtName}` **is required** and must be **at least 3 characters**, maximum 255 characters, and does not contains any other symbols besides `'()-./`. If not, you will get `400 Bad Request` response.
- This endpoint **will return** an array of district, or an **empty array** `[]` if there are no district matched with the `{districtName}`.
- Usage example: http://localhost:3000/districts?name=regol

> This endpoint also support [`sortBy`][sortby-query] and [`sortOrder`][sortorder-query] queries.

### Get specific district

```
GET /districts/{districtCode}
```

- Use this endpoint to **get a specific district**.
- The `{districtCode}` must be **6 numeric characters**. If not, you will get `400 Bad Request` response.
- This endpoint **will return** the district with the same code as `{districtCode}`. Otherwise, you will get a `404 Not Found` response.
- Usage example: http://localhost:3000/districts/327311

### Get all districts in a regency

```
GET /regencies/{regencyCode}/districts
```

- Use this endpoint to **get all districts in a regency**.
- The `{regencyCode}` must be **4 numeric characters**. If not, you will get `400 Bad Request` response.
- This endpoint **will return** the array of district if the `{regencyCode}` is exists. Otherwise, you will get a `404 Not Found` response.
- Usage example: http://localhost:3000/regencies/3273/districts

> This endpoint also support [`sortBy`][sortby-query] and [`sortOrder`][sortorder-query] queries.

### Get villages by name

```
GET /villages?name={villageName}
```

- Use this endpoint to **get the villages by its name**.
- The `{villageName}` **is required** and must be **at least 3 characters**, maximum 255 characters, and does not contains any other symbols besides `'()-./`. If not, you will get `400 Bad Request` response.
- This endpoint **will return** an array of village, or an **empty array** `[]` if there are no village matched with the `{villageName}`.
- Usage example: http://localhost:3000/villages?name=balong

> This endpoint also support [`sortBy`][sortby-query] and [`sortOrder`][sortorder-query] queries.

### Get specific village

```
GET /villages/{villageCode}
```

- Use this endpoint to **get a specific village**.
- The `{villageCode}` must be **10 numeric characters**. If not, you will get `400 Bad Request` response.
- This endpoint **will return** the village with the same code as `{villageCode}`. Otherwise, you will get a `404 Not Found` response.
- Usage example: http://localhost:3000/villages/3273111004

### Get all villages in a district

```
GET /districts/{districtCode}/villages
```

- Use this endpoint to **get all villages in a district**.
- The `{districtCode}` must be **6 numeric characters**. If not, you will get `400 Bad Request` response.
- This endpoint **will return** the array of village if the `{districtCode}` is exists. Otherwise, you will get a `404 Not Found` response.
- Usage example: http://localhost:3000/districts/327311/villages

> This endpoint also support [`sortBy`][sortby-query] and [`sortOrder`][sortorder-query] queries.

### Get islands by name

```
GET /islands?name={islandName}
```

- Use this endpoint to **get the islands by its name**.
- The `{islandName}` **is required** and must be **at least 3 characters**, maximum 255 characters, and does not contains any other symbols besides `'-/`. If not, you will get `400 Bad Request` response.
- This endpoint **will return** an array of island, or an **empty array** `[]` if there are no island matched with the `{islandName}`.
- Usage example: http://localhost:3000/islands?name=java

> This endpoint also support [`sortBy`][sortby-query] and [`sortOrder`][sortorder-query] queries.

### Get specific island

```
GET /islands/{islandCode}
```

- Use this endpoint to **get a specific island**.
- The `{islandCode}` must be **9 numeric characters**. If not, you will get `400 Bad Request` response.
- This endpoint **will return** the island with the same code as `{islandCode}`. Otherwise, you will get a `404 Not Found` response.
- Usage example: http://localhost:3000/islands/110140001

### Get all islands in a regency

```
GET /regencies/{regencyCode}/islands
```

- Use this endpoint to **get all islands in a regency**.
- The `{regencyCode}` must be **4 numeric characters**. If not, you will get `400 Bad Request` response.
- This endpoint **will return** the array of island if the `{regencyCode}` is exists. Otherwise, you will get a `404 Not Found` response.
- Usage example: http://localhost:3000/regencies/1101/islands

> This endpoint also support [`sortBy`][sortby-query] and [`sortOrder`][sortorder-query] queries.

## Query Parameters

You can use query parameters to control what data is returned in endpoint responses.

### `sortBy`

```
GET /...?sortBy={code|name}
```

- Add `sortBy` query to **sorting the result** by `code` or `name`.
- The `sortBy` **can only be filled** by `code` or `name`. If not, you will get `400 Bad Request` response.
- If `sortBy` **is not set**, sorting will be done by the `code`.
- Usage example :
  - At [`provinces`](#get-provinces) endpoint: http://localhost:3000/provinces?sortBy=name
  - At [`regencies`](#get-regencies-by-name) endpoint: http://localhost:3000/regencies?name=bandung&sortBy=code

### `sortOrder`

```
GET /...?sortOrder={asc|desc}
```

- Add `sortOrder` query to **specify the sort order** whether ascending `asc` or descending `desc`.
- The `sortOrder` **can only be filled** by `asc` or `desc`. If not, you will get `400 Bad Request` response.
- If `sortOrder` **is not set**, sorting will be done in `asc` order.
- Usage example :
  - At [`districts`](#get-districts-by-name) endpoint: http://localhost:3000/districts?name=regol&sortOrder=desc
  - At [`villages`](#get-villages-by-name) endpoint: http://localhost:3000/villages?name=balong&sortOrder=asc

> These queries can be combined with other queries linked by `&` character.
>
> For example : http://localhost:3000/provinces?name=jawa&sortBy=name&sortOrder=asc

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

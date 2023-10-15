<h1>Upgrade to idn-area version 4</h1>

## Changed response format

Every endpoint now returns an object with the following properties:

| Property | Type | Description | Available On |
| --- | --- | --- | --- |
| `statusCode` | `number` | HTTP status code | Always |
| `message` | `string` or array of `string` | The message of the response | Always |
| `error` | `string` | The kind of error | Error |
| `data` | `object` or array of `object` | The data of the response | Success |
| `meta` | `object` or `undefined` | The meta data of the response (optional) | Success |

For example:

- Get a province (success response)

  ```
  GET /provinces/32
  ```
  ```json
  {
    "statusCode": 200,
    "message": "OK",
    "data": {
      "code": "32",
      "name": "JAWA BARAT"
    }
  }
  ```

- Get provinces (success response)

  ```
  GET /provinces
  ```
  ```json
  {
    "statusCode": 200,
    "message": "OK",
    "data": [
      {
        "code": "11",
        "name": "ACEH"
      },
      {
        "code": "12",
        "name": "SUMATERA UTARA"
      },
      ...
    ],
    "meta": {
      "total": 10,
      "pagination": {
        "total": 37,
        "pages": {
          "first": 1,
          "last": 2,
          "current": 1,
          "previous": null,
          "next": 2
        }
      }
    }
  }
  ```

  > The endpoint above implements new pagination feature. See [pagination](#pagination) for details.

- A bad request (error response)

  ```
  GET /provinces/ab
  ```
  ```json
  {
    "statusCode": 400,
    "message": ["code must be a number string"],
    "error": "Bad Request"
  }
  ```

## Removed endpoints

The following endpoints have been removed:

- `GET /provinces/{code}/regencies`
- `GET /regencies/{code}/districts`
- `GET /regencies/{code}/islands`
- `GET /districts/{code}/villages`

You need to use the equivalent endpoints with the [`parentCode` query](#new-parentcode-query).

> [!WARNING]
> If you try to access the removed endpoints above, you will get a `404 Not Found` response.

## New `parentCode` query

The `parentCode` query parameter is added to the following endpoints:

| Endpoint | `parentCode` Query | Example |
| --- | --- | --- |
| `GET /regencies` | `provinceCode` | `GET /regencies?provinceCode=32` |
| `GET /districts` | `regencyCode` | `GET /districts?regencyCode=3201` |
| `GET /islands` | `regencyCode` | `GET /islands?regencyCode=3201` |
| `GET /villages` | `districtCode` | `GET /villages?districtCode=3201010` |

This table below shows the [removed endpoints](#removed-endpoints) and its equivalent endpoints using the `parentCode` query.

| Deleted Endpoint | Equivalent Endpoint |
|--------|--------|
| `GET /provinces/{code}/regencies` | **`GET /regencies?provinceCode={code}`** |
| `GET /regencies/{code}/districts` | **`GET /districts?regencyCode={code}`** |
| `GET /regencies/{code}/islands` | **`GET /islands?regencyCode={code}`** |
| `GET /districts/{code}/villages` | **`GET /villages?districtCode={code}`** |

Below is an example to get all regencies in province with code `32`:

```
GET /regencies?provinceCode=32
```
```json
{
  "statusCode": 200,
  "message": "OK",
  "data": [
    {
      "code": "3201",
      "name": "KAB. BOGOR",
      "provinceCode": "32"
    },
    {
      "code": "3202",
      "name": "KAB. SUKABUMI",
      "provinceCode": "32"
    },
    ...
  ],
  "meta": {
    "total": 10,
    "pagination": {
      "total": 27,
      "pages": {
        "first": 1,
        "last": 3,
        "current": 1,
        "previous": null,
        "next": 2
      }
    }
  }
}
```

> The endpoint above implements new pagination feature. See [pagination](#pagination) for details.

## `name` query now optional

Before version 4, the `name` query parameter is required, so you can't get all data without specifying the `name` query parameter.

Now, the `name` query parameter is optional. This change affects the following endpoints:

- `GET /regencies`
- `GET /districts`
- `GET /islands`
- `GET /villages`

## Pagination

We introduce a new pagination feature. This feature is implemented in the following endpoints:

- `GET /provinces`
- `GET /regencies`
- `GET /districts`
- `GET /islands`
- `GET /villages`

You can use the **`page` and `limit`** query parameters to specify the page number and the number of data per page. If you don't specify the `page` and `limit` query parameters, the default value will be used (`page=1` and `limit=10`).

```
GET /provinces?page=2&limit=37
```

The response will contain a `meta` object with the following properties:

| Property | Type | Description |
| --- | --- | --- |
| `total` | `number` | The total number of data |
| `pagination` | `object` | |
| `pagination.total` | `number` | The number of available data with the current query |
| `pagination.pages` | `object` | |
| `pagination.pages.first` | `number` | The first page number |
| `pagination.pages.last` | `number` | The last page number |
| `pagination.pages.current` | `number` or `null` | The current page number or `null` if the `page` query is exceeded the last page |
| `pagination.pages.previous` | `number` or `null` | The previous page number or `null` if the current page is the first page |
| `pagination.pages.next` | `number` or `null` | The next page number or `null` if the current page is the last page |

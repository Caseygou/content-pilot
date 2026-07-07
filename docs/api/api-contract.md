# ContentPilot API Contract

This document defines the API contract between the ContentPilot frontend and backend.

## Base URL

Local backend:

```txt
http://localhost:3001
```

API prefix:

```txt
/api
```

Full local API base URL:

```txt
http://localhost:3001/api
```

Health check:

```txt
GET /health
```

## Authentication

Protected APIs require a Bearer token.

```http
Authorization: Bearer <accessToken>
```

Public APIs:

- `GET /health`
- `POST /api/auth/login`

Protected APIs:

- `GET /api/users/me`
- `GET /api/channels`
- `GET /api/articles`
- `GET /api/articles/:id`
- `POST /api/articles`
- `PATCH /api/articles/:id`
- `DELETE /api/articles/:id`
- `POST /api/uploads`
- `GET /api/dashboard/summary`
- `GET /api/dashboard/channel-distribution`
- `GET /api/dashboard/publish-trend`

## Success Response Format

All successful API responses should use this shape:

```json
{
  "code": 0,
  "message": "success",
  "data": {}
}
```

Fields:

- `code`: business status code. `0` means success.
- `message`: short response message.
- `data`: actual response payload.

## Error Response Format

All failed API responses should use this shape:

```json
{
  "code": 400,
  "message": "Validation failed",
  "error": "Bad Request"
}
```

Common HTTP status codes:

| HTTP Status | Meaning |
| --- | --- |
| 400 | Invalid request parameters |
| 401 | Unauthorized or token expired |
| 403 | Forbidden |
| 404 | Resource not found |
| 409 | Resource conflict |
| 500 | Internal server error |

## Enums

### ArticleStatus

```txt
DRAFT
PUBLISHED
ARCHIVED
```

### CoverType

```txt
NONE
SINGLE
TRIPLE
```

## Pagination

Paginated APIs return:

```json
{
  "items": [],
  "pagination": {
    "page": 1,
    "pageSize": 10,
    "total": 100
  }
}
```

Fields:

- `items`: current page records.
- `pagination.page`: current page number.
- `pagination.pageSize`: records per page.
- `pagination.total`: total record count.

## Auth APIs

### Login

```http
POST /api/auth/login
```

Request body:

```json
{
  "email": "admin@contentpilot.dev",
  "password": "admin123456"
}
```

Response:

```json
{
  "code": 0,
  "message": "success",
  "data": {
    "accessToken": "jwt-token",
    "user": {
      "id": 1,
      "email": "admin@contentpilot.dev",
      "name": "ContentPilot Admin",
      "avatar": null
    }
  }
}
```

Possible errors:

- `400`: invalid email or password format.
- `401`: email or password is incorrect.

## User APIs

### Get Current User

```http
GET /api/users/me
```

Headers:

```http
Authorization: Bearer <accessToken>
```

Response:

```json
{
  "code": 0,
  "message": "success",
  "data": {
    "id": 1,
    "email": "admin@contentpilot.dev",
    "name": "ContentPilot Admin",
    "avatar": null
  }
}
```

Possible errors:

- `401`: token is missing, invalid, or expired.

## Channel APIs

### Get Channels

```http
GET /api/channels
```

Headers:

```http
Authorization: Bearer <accessToken>
```

Response:

```json
{
  "code": 0,
  "message": "success",
  "data": [
    {
      "id": 1,
      "name": "Frontend"
    },
    {
      "id": 2,
      "name": "Backend"
    },
    {
      "id": 3,
      "name": "Database"
    }
  ]
}
```

## Article Entity

Standard article response shape:

```json
{
  "id": 1,
  "title": "Getting Started with ContentPilot",
  "content": "This is the first sample article in ContentPilot.",
  "status": "PUBLISHED",
  "coverType": "NONE",
  "coverImages": [],
  "readCount": 0,
  "commentCount": 0,
  "likeCount": 0,
  "publishedAt": "2026-07-07T00:00:00.000Z",
  "createdAt": "2026-07-07T00:00:00.000Z",
  "updatedAt": "2026-07-07T00:00:00.000Z",
  "author": {
    "id": 1,
    "name": "ContentPilot Admin"
  },
  "channel": {
    "id": 1,
    "name": "Frontend"
  }
}
```

## Article APIs

### Get Articles

```http
GET /api/articles
```

Headers:

```http
Authorization: Bearer <accessToken>
```

Query parameters:

| Name | Type | Required | Description |
| --- | --- | --- | --- |
| `page` | number | no | Current page. Default: `1` |
| `pageSize` | number | no | Records per page. Default: `10` |
| `status` | `DRAFT \| PUBLISHED \| ARCHIVED` | no | Filter by article status |
| `channelId` | number | no | Filter by channel |
| `startDate` | string | no | Start date, format: `YYYY-MM-DD` |
| `endDate` | string | no | End date, format: `YYYY-MM-DD` |
| `keyword` | string | no | Search by article title |

Example:

```http
GET /api/articles?page=1&pageSize=10&status=PUBLISHED&channelId=1
```

Response:

```json
{
  "code": 0,
  "message": "success",
  "data": {
    "items": [
      {
        "id": 1,
        "title": "Getting Started with ContentPilot",
        "status": "PUBLISHED",
        "coverType": "NONE",
        "coverImages": [],
        "readCount": 0,
        "commentCount": 0,
        "likeCount": 0,
        "publishedAt": "2026-07-07T00:00:00.000Z",
        "createdAt": "2026-07-07T00:00:00.000Z",
        "updatedAt": "2026-07-07T00:00:00.000Z",
        "author": {
          "id": 1,
          "name": "ContentPilot Admin"
        },
        "channel": {
          "id": 1,
          "name": "Frontend"
        }
      }
    ],
    "pagination": {
      "page": 1,
      "pageSize": 10,
      "total": 1
    }
  }
}
```

### Get Article Detail

```http
GET /api/articles/:id
```

Headers:

```http
Authorization: Bearer <accessToken>
```

Response:

```json
{
  "code": 0,
  "message": "success",
  "data": {
    "id": 1,
    "title": "Getting Started with ContentPilot",
    "content": "This is the first sample article in ContentPilot.",
    "status": "PUBLISHED",
    "coverType": "NONE",
    "coverImages": [],
    "readCount": 0,
    "commentCount": 0,
    "likeCount": 0,
    "publishedAt": "2026-07-07T00:00:00.000Z",
    "createdAt": "2026-07-07T00:00:00.000Z",
    "updatedAt": "2026-07-07T00:00:00.000Z",
    "author": {
      "id": 1,
      "name": "ContentPilot Admin"
    },
    "channel": {
      "id": 1,
      "name": "Frontend"
    }
  }
}
```

Possible errors:

- `404`: article does not exist.

### Create Article

```http
POST /api/articles
```

Headers:

```http
Authorization: Bearer <accessToken>
```

Request body:

```json
{
  "title": "New Article",
  "content": "Article content",
  "status": "PUBLISHED",
  "coverType": "SINGLE",
  "coverImages": ["http://localhost:3001/uploads/cover.png"],
  "channelId": 1
}
```

Response:

```json
{
  "code": 0,
  "message": "success",
  "data": {
    "id": 2
  }
}
```

Validation rules:

- `title` is required.
- `content` is required.
- `status` must be one of `DRAFT`, `PUBLISHED`, `ARCHIVED`.
- `coverType` must be one of `NONE`, `SINGLE`, `TRIPLE`.
- `coverImages` should match `coverType`.
- `channelId` is required.

### Update Article

```http
PATCH /api/articles/:id
```

Headers:

```http
Authorization: Bearer <accessToken>
```

Request body:

```json
{
  "title": "Updated Article",
  "content": "Updated content",
  "status": "PUBLISHED",
  "coverType": "SINGLE",
  "coverImages": ["http://localhost:3001/uploads/cover.png"],
  "channelId": 1
}
```

Response:

```json
{
  "code": 0,
  "message": "success",
  "data": {
    "id": 1
  }
}
```

Possible errors:

- `404`: article does not exist.

### Delete Article

```http
DELETE /api/articles/:id
```

Headers:

```http
Authorization: Bearer <accessToken>
```

Response:

```json
{
  "code": 0,
  "message": "success",
  "data": null
}
```

Possible errors:

- `404`: article does not exist.

## Upload APIs

### Upload File

```http
POST /api/uploads
```

Headers:

```http
Authorization: Bearer <accessToken>
Content-Type: multipart/form-data
```

Request:

```txt
field name: file
```

Response:

```json
{
  "code": 0,
  "message": "success",
  "data": {
    "id": 1,
    "url": "http://localhost:3001/uploads/cover.png",
    "filename": "cover.png",
    "mimetype": "image/png",
    "size": 12345
  }
}
```

Validation rules:

- Only image files are allowed at this stage.
- Suggested max file size: `5MB`.

## Dashboard APIs

### Get Dashboard Summary

```http
GET /api/dashboard/summary
```

Headers:

```http
Authorization: Bearer <accessToken>
```

Response:

```json
{
  "code": 0,
  "message": "success",
  "data": {
    "articleCount": 12,
    "publishedCount": 8,
    "draftCount": 4,
    "readCount": 3200,
    "likeCount": 560
  }
}
```

### Get Channel Distribution

```http
GET /api/dashboard/channel-distribution
```

Headers:

```http
Authorization: Bearer <accessToken>
```

Response:

```json
{
  "code": 0,
  "message": "success",
  "data": [
    {
      "channel": "Frontend",
      "count": 5
    },
    {
      "channel": "Backend",
      "count": 3
    }
  ]
}
```

### Get Publish Trend

```http
GET /api/dashboard/publish-trend
```

Headers:

```http
Authorization: Bearer <accessToken>
```

Query parameters:

| Name | Type | Required | Description |
| --- | --- | --- | --- |
| `days` | number | no | Number of days to include. Default: `7` |

Response:

```json
{
  "code": 0,
  "message": "success",
  "data": [
    {
      "date": "2026-07-01",
      "count": 1
    },
    {
      "date": "2026-07-02",
      "count": 3
    }
  ]
}
```

## Field Naming Rules

- Use `camelCase` in all API request and response fields.
- Do not use snake_case fields like `channel_id`.
- Enum values use uppercase strings, such as `PUBLISHED`.
- Date and time values use ISO 8601 strings.

## Implementation Notes

- Backend should add a global `/api` prefix.
- Backend should add a unified response wrapper.
- Backend should add a global exception filter or interceptor for consistent errors.
- Frontend should create one Axios instance using `http://localhost:3001/api` as the base URL.
- Frontend should add the Bearer token through an Axios request interceptor.
- Frontend should handle `401` globally and redirect to the login page.

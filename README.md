## Installation

```bash
# Build, (re)create, start, and attach to container for a service.
$ docker-compose up
```

## Setup 

Fill .env file with your data:
POSTGRES_LOCAL_PORT=5432
POSTGRES_HOST=localhost
POSTGRES_USER=root
POSTGRES_DB=car_rent
POSTGRES_PASSWORD=root

## Test

```bash
# unit tests
$ npm run test

```

## Swagger
Swagger is available here http://localhost:3000/api/v1/docs/#
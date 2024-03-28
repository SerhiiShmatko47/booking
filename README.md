## Installation

```bash
$ npm install
```

## Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Test

```bash
# unit tests
$ npm run test
```

## Run default
```bash
$ sudo docker run --name postgres --detach --publish 5432:5432 --env POSTGRES_DB=<database> --env POSTGRES_USER=<username> --env POSTGRES_PASSWORD=<password> postgres:latest

$ sudo docker run --name redis --detach --publish 6379:6379 redis:latest 

$ npm run start:dev
```

## Run with docker 
```bash
$ sudo docker build -t <image name> .
$ sudo docker run --name <container image> --detach --publish <port>:<port> --env-file .env <image name>
```

## Run with docker compose
```bash
$ sudo docker compose up --build --detach
```


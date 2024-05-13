# Valiu Challange (Backend)
---

## Requirements

- Node v19.2.0

## Installation

1. Install node modules
    ```bash
    $ npm install
    ```

1. Create and start a Docker container for the DB
    ```bash
    $ docker-compose up
    ```

1. Create an `.env` file using `.env.example` as template
    ```bash
    $ cp .env.example .env
    ```

The `.env.example` file contains the default DB connection credentials set up in the `docker-compose.yml` file. If you wish to use a different database, please update the values in the `.env` file.

## Running the app
```bash
$ npm run start:dev
```

## Basic documentation & playground
Once the app is running, you can open [http://localhost:3001/docs]() to see Swagger docs. 

## Testing
The app currently has very basic test coverage. Given more time, I would like to expand the test coverage further.
```bash
$ npm run test
```
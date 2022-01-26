# Getting Started

## Contents

- [System Requirements](#system-requirements)
- [Starting the Project](#starting-the-project)
- [API Documentation](#api-documentation)
- [API Architecture](#api-architecture)

</br>

## System Requirements

- [Docker](https://docs.docker.com/get-docker/)
- [Node.js](https://nodejs.org/en/) >= 14.xx

> If you are running this project on a windows machine you will need to install [make for windows](http://gnuwin32.sourceforge.net/packages/make.htm)

</br>

## Starting the Project

Common project actions are distilled into Makefile commands. Run `make help` to see them all

> the `make help` command will not work in non-bash-like shells. aka - cmd, powershell, etc...

### Install NPM dependencies

To set up and install all project level dependencies run: `make install`

### Mongo access

To run this project you need a mongodb env setup. The `make install` command will create a starter `.env` file for you and the `make start` command below will initialize a local docker instance of mongo for you, but you can configure env vars to connect to a remote mongo instance instead.

### API Key Generation

Most requests require a valid `X-API-KEY` header value. To generate one for local development run `npm run gen-apikey` and follow the prompt. The secret value you input when asked by this script should match the `JWT_SECRET` environment variable in your `.env` file.

Use the generated API key in swagger with the `AUTHORIZE` button near the top right of the page.

### Environment variables

You will not be able to run the project without the required variables. If you run the project via `make start` as described below it will log which required env variables are missing. Be sure to acquire these values from the team and add them to the `.env` file at the root of the project.

### Run the project

To start the project run: `make start`

</br>

## API documentation

Once the project is running visit [`http://localhost:8080/api`](http://localhost:8080/api) to view the interactive swagger documentation.

</br>

## API architecture

Next, review the [API Architecture and Style guidelines here](../architecture/degen-api-style.md).

# RAIDAR REST API

<p align="middle">
  <a href="http://nestjs.com/" target="blank"><img src="./public/tech-stack/nestjs.png" width="200" alt="Nest Logo" /></a>
    <a href="https://nodejs.org/" target="blank"><img src="./public/tech-stack/nodejs.png" width="200" alt="Node Logo" /></a>
  <a href="https://www.postgresql.org/" target="blank"><img src="./public/tech-stack/postgre.png" width="200" alt="Postgre Logo" /></a>
    <a href="https://swagger.io/" target="blank"><img src="./public/tech-stack/swagger.png" width="200" alt="Swagger Logo" /></a>
</p>

## Setup

Install the latest version of NodeJS and Yarn.

Install the latest version of Postgre.

## Environment Variables

Copy `env.example` to the `.env` and populate it with proper values.

- Create new project on Google Console, go to API's & Services -> Credentials -> Create credentials -> OAuth Client ID and populate values from secret to `GOOGLE_CLIENT_ID, GOOGLE_SECRET`

When you are in Credentials page:

- add URIs to `Authorized JavaScript origins` with backend api url for example `api.raidar.xyz` and frontend app `app.raidar.xyz`
- add URIs to `Authorized redirect URIs` constructed like this `{URL}/api/auth/callback/google` for example `https://app.raidar.xyz/api/auth/callback/google` for callback and redirect url with `https://api.raidar.xyz/api/v1/google/redirect` for redirect

Use OAuth consent screen to add test users so not everybody can use platform, when going to production use `PUBLISH APP` if you want everybody has access

- Create AWS account on https://aws.amazon.com/ and create S3 bucket to store images, populate `AWS_ACCESS_KEY, AWS_SECRET_KEY, AWS_BUCKET_NAME, AWS_REGION`

- Go to `https://sendgrid.com/` and create account, go to Settings -> API keys -> Create API key and populate `SENDGRID_API_KEY`, go to Sender Authenticaion and verify Single Sender, use that email to popluate `SENDGRID_EMAIL`

- `MODE` - populate with `dev, production, test`
- `PORT` - this is used for server port, usually `3001`
- `DATABASE_HOST` - database URL
- `DATABASE_PORT` - database PORT, usually 5432
- `DATABASE_NAME` - database name
- `DATABASE_USER` - database user
- `DATABASE_PASSWORD` - database pass
- `GOOGLE_CLIENT_ID`- CLIENT ID from google console app
- `GOOGLE_SECRET` - secret from Google secret
- `GOOGLE_CALLBACK_URL` - callback for google OAuth Client, for example `https://api.raidar.xyz/api/v1/google/redirect`
- `JWT_SECRET` - secret phrase
- `JWT_EXPIRES_IN` - usually `7d`
- `AWS_ACCESS_KEY` - aws S3 access key
- `AWS_SECRET_KEY` - aws S3 secret key
- `AWS_BUCKET_NAME` - aws S3 bucket name
- `AWS_REGION` - aws S3 region
- `SENDGRID_API_KEY` - sendgrid api key
- `SENDGRID_EMAIL` - verified email on SENDGRID that will be used for sending emails, example `info@berklee.edu`
- `EMAIL_DOMAINS` - this is used for authentication of users so only emails with certain domain can use app, put here `berklee.edu`
- `NEAR_NETWORK_ID`- mainnet or testnet
- `NEAR_NFT_CONTRACT_ACCOUNT_ID` - NFT contract id
- `NEAR_MASTER_ACCOUNT_ID` - nft contract account id
- `NEAR_MASTER_ACCOUNT_PRIVATE_KEY` - private key

Project also works with multi-environment configurations, so also `.env.dev`,`.env.staging` and `.env.production` files are supported.

## Folder Structure

### /

The root folder contains `env.example` file for configuring environment variables

The`.eslintrc.json` file contains ESLint configuration.

The `.gitignore` file specifying which files GIT should ignore.

The `.prettierrc` config file is used for prettier code formatter.

The `nest-cli.json` contains config for `@nestjs/cli` command-line interface tool.

The `tsconfig.json` and `tsconfig.build.json` files are used for configuring project to use typescript.

The `README.md` file is the current file you are reading and `yarn.lock` file is the lock file for Yarn.

### /public

This folder contains files that are served by the built-in web server and any images used in the `README.md`.

### /src

This folder contains all backend code files.

### /src/common

This folder contains all common entities, enums, constants and dtos.

### src/config

In config folder there is `configuraton.ts` which is used to load env variables to configuration object.

- `mode` - variable is used to determine on which environment is app running
- `port` - is defining on which port is app used
- `db` - is defining all database fields
- `jwt` - is defining all variables for jwt token
- `google` - is defining all variables for google app
- `aws` - is defining all variables for aws server
- `sendgrid` - is defining all variables for sendgrid email provider

There is also `valdiation.ts` file which is used for validating env variables.

### src/helpers

This folder contains all helpers that are used in app

### src/modules

This is core code from app.

- `app` module is entry module for app

### src/utils

This folder contains all utils helpers.

### src/main.ts

This file is app entry and contains swagger configuration, also config for bootstrapping app.

### /tests

This folder contains all e2e tests.

## Dependencies

Install the dependencies by running:

```bash
$ yarn install
```

## Launch

```bash
# development environment
$ yarn start:dev

# debug environment
$ yarn start:debug

# production mode
$ yarn start
```

## Deployment

For production you have to run first `yarn build` and than `yarn start`

## Test

```bash
# unit tests
$ yarn test

# e2e tests
$ yarn test:e2e

# test coverage
$ yarn test:cov
```

### Database typeorm scripts

We use TypeOrm to maintain database(https://typeorm.io/)

- use script `migration:generate` to generate new migration, just change name at the end of script for example `src/migrations/user-entity`
- use script `migration:create` to create empty migration, just change name at the end of script for example `src/migrations/file-entity`
- use script `migration:run` to apply current model changes in database or to setup database
- use script `migration:revert` to revert last db changes

Other sulution is to run command in cli directly.

### Postgre

We use `uuid` type in our database if your db isn't natively supporting it install `uuid-ossp` with query `CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`;

## Aws bucket

## Specification

This backend uses specification under the OpenAPI 3.0 standard.

## Modules

Add new module to `modules` folder and refer to nestjs documentation or on other modules how to configure it.

## Linting

To lint your changes, run the following in the project root folder:

```bash
$ yarn lint
```

### API

The REST API can be accessed at `http://{host}:{port}/api/v1/{endpoint}`.

Where `{host}` is the hostname of your server and `{port}` is the port on which the API is running. The `{endpoint}` is the specific endpoint you are attempting to access.

- There are 2 swagger api specifications `http://{host}:{port}/swagger` used for user/artist APIs and `http://{host}:{port}/swagger-admin` used for admin APIs.

## Nest docs

[https://nestjs.com](https://nestjs.com/)

# UMass Photography Club Website

This repository contains the code for the UMass Photography Club Website.

## Prerequisites

Install [Node.js 24](https://nodejs.org/en/download), [Docker](https://www.docker.com/), and [Act](https://nektosact.com/installation/index.html).
Verify that everything is correctly installed using the following commands:

```sh
node --version # v24.12.0
docker --version # Docker version 28.5.1, build e180ab8
docker compose --help # Usage:  docker compose [OPTIONS] COMMAND ...
act --version # act version 0.2.83
```

Note that I listed the versions that I installed.
As long as all of your installed versions are compatible with these, you should be good to go.

## Setup

First, install dependencies with the following command:

```sh
npm install
```

Then, start a local Supabase instance with the following command:

```sh
npm run start:supabase
```

Then, populate `.env` with the following command:

```sh
npx supabase status --output env > .env
```

## Running

### Development

To run the development build of the website, make sure that Supabase is running.
Then, run the following command:

```sh
npm run dev
```

This version of the website will automatically reload when you make changes to the code.
Email confirmations will be mocked with Mailpit, whose URL is available at `MAILPIT_URL` in `.env`.

### Production

To run the production build of the website, make sure that Supabase is running.
Then, run the following commands:

```sh
npm run build
npm start
```

## Testing

See [test/README.md](test/README.md) for more information about testing.

## Contents

- `.github` contains the workflows for CI/CD testing.
- `public` contains static files that are hosted by the website.
- `src` contains the application code for the project, formatted according to https://nextjs.org/docs/app/api-reference/file-conventions/src-folder.
- `supabase` contains a [local development configuration](https://supabase.com/docs/guides/local-development/cli/config) and a [declarative database schema](https://supabase.com/docs/guides/local-development/declarative-database-schemas) for Supabase.
- `test` contains unit tests.

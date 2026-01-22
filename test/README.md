# Testing

## Running Tests

### Locally

To run the unit tests on your own machine, install the relevant browsers for Playwright:

```sh
npx playwright install --with-deps
npx playwright install chrome
npx playwright install msedge
```

Then, to run the tests, run the following command:

```sh
npm test
```

Note that Playwright tests are flaky due to dependency issues. They should, however, pass in the CI/CD environment.

If you want to debug the Playwright tests in a headful browser, you can set the `HEADFUL` environment variable to any value. For example:

```sh
HEADFUL=true npx playwright test --workers=1 --project=chromium
```

### CI/CD

To simulate the CI/CD testing environment locally, run the following command:

```sh
npm run test:ci
```

## Folders

- `api` contains API route tests.
- `components` contains component tests.
- `db` contains database-related tests.
- `e2e` contains end-to-end tests using Playwright.

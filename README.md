# Playwright + TypeScript Test Automation Framework (UI + API)

An end-to-end test automation framework built with **Playwright** and **TypeScript**. It covers UI tests for an e-commerce demo app ([SauceDemo](https://www.saucedemo.com)) and REST API tests for a booking service ([Restful-Booker](https://restful-booker.herokuapp.com)).

## Features

- **Page Object Model (POM)** - page logic and locators are kept out of the tests
- **Custom fixtures** - page objects and the API client are injected into tests automatically
- **Saved login session** - logs in once (`setup` project) and reuses it, so UI tests start already logged in
- **Data-driven tests** - test data lives in `test-data/*.json`; one test is generated per data row
- **Environment-based configuration** - base URLs and credentials come from `.env` (with safe defaults)
- **API testing** - reusable `BookingClient` built on Playwright's `APIRequestContext` (token handling + CRUD)
- **Cross-browser, parallel execution** - Chromium, Firefox and WebKit
- **Test tagging** - `@smoke` and `@regression` suites
- **Failure diagnostics** - Trace Viewer, screenshots, video and HTML report on failure
- **Retries** - failed tests are retried once to handle flakiness

## Project structure

```
tests/
  setup/       auth.setup.ts            -> logs in once, saves session
  pages/       LoginPage, InventoryPage, CartPage, CheckoutPage   (Page Object Model)
  fixtures/    ui.fixture.ts, api.fixture.ts                      (custom fixtures)
  clients/     BookingClient.ts                                   (API client)
  ui/          login, inventory, cart, checkout specs
  api/         auth and booking specs
  utils/       constants.ts, testData.ts
test-data/     users.json, products.json, checkout.json, bookings.json
playwright.config.ts
```

## Getting started

Requirements: [Node.js](https://nodejs.org) (LTS) and Git.

```bash
npm install
npx playwright install      # downloads Chromium, Firefox and WebKit
```

Optional: copy `.env.example` to `.env` to override the default URLs/credentials.

## Running the tests

| Command | What it does |
|---|---|
| `npm test` | Run everything (UI on 3 browsers + API) |
| `npm run test:smoke` | Only `@smoke` tests |
| `npm run test:regression` | Only `@regression` tests |
| `npm run test:chromium` | UI tests on Chromium only |
| `npm run test:api` | API tests only |
| `npm run test:headed` | UI tests with a visible browser |
| `npm run test:debug` | Debug mode (Playwright Inspector) |
| `npm run report` | Open the HTML report |

> Windows PowerShell tip: if you run `npx playwright test --grep @smoke` directly, wrap the tag in quotes: `--grep "@smoke"`. The `npm run` commands above work as-is.

## Viewing a failed test

After a run, open the report with `npm run report`. For failed tests, the report includes screenshots, video and a **trace** that lets you step through every action, network call and DOM snapshot.

## Tech stack

Playwright, TypeScript, Node.js, dotenv

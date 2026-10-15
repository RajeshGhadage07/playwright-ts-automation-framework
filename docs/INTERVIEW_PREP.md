# Interview prep - questions about this project

Use this to practise explaining your own project in your own words.

**1. Walk me through your framework.**
Playwright + TypeScript. UI tests for SauceDemo, API tests for Restful-Booker. Page Object Model for UI, a reusable client for the API, custom fixtures to inject both, JSON files for test data, `.env` for configuration, and three browsers running in parallel.

**2. What is the Page Object Model and why use it?**
Each page has a class holding its locators and actions (`LoginPage.login()`). Tests call methods instead of repeating selectors. If the UI changes, you fix one file, not 50 tests.

**3. What are fixtures in Playwright?**
Reusable setup/teardown that Playwright injects into tests by name. Mine create page objects (`loginPage`, `inventoryPage`) and the API client, and one fixture creates a booking before a test and deletes it afterwards (`createdBooking`).

**4. How do you avoid logging in before every test?**
A `setup` project logs in once and saves cookies/storage to `.auth/user.json` using `storageState`. The browser projects depend on it and start already logged in. Login tests clear that state with `test.use({ storageState: ... })` so they start logged out.

**5. How do you handle waits?**
Playwright auto-waits for elements to be actionable, and web-first assertions like `expect(locator).toHaveText()` retry until they pass or time out. So no hard `sleep`/`waitForTimeout`.

**6. Which locators do you prefer?**
Role-based and test-id locators (`getByRole`, `getByTestId`) because they are stable. I set `testIdAttribute: 'data-test'` in the config for SauceDemo. I avoid long CSS/XPath chains.

**7. How is your test data managed?**
External JSON files in `test-data/`, loaded with a small helper. A `for` loop over the rows generates one test per row (data-driven), e.g. 4 invalid-login scenarios from `users.json`.

**8. How do you run a subset of tests?**
Tags in the test details (`{ tag: '@smoke' }`) and `--grep @smoke`, or `--project=chromium` for one browser, or run a single file by name.

**9. How do you run in parallel and across browsers?**
`fullyParallel: true` plus one project per browser (Chromium, Firefox, WebKit) in `playwright.config.ts`. Tests are independent (each creates its own data), which makes parallel runs safe.

**10. A test is flaky - what do you do?**
Open the trace from the failed run, check what the page looked like, look for race conditions or shared data, replace fixed waits with proper assertions, make the test independent. Retries (`retries: 1`) are only a safety net, not the fix.

**11. How do you test APIs with Playwright?**
Using the `request` fixture (`APIRequestContext`). My `BookingClient` wraps `POST /auth` (token), and create/get/update/partial-update/delete calls. Tests assert status codes and response bodies. The token is sent in a `Cookie` header for PUT/PATCH/DELETE.

**12. Playwright vs Selenium?**
Playwright has built-in auto-waiting, a test runner, parallelism, tracing/video, API testing and multiple browsers in one tool. Selenium needs extra libraries for much of this. (Be ready to say you've used the Selenium-style concepts too, only if true.)

**13. How would this run in Jenkins?**
Jenkins would check out the repo, run `npm ci`, `npx playwright install --with-deps`, then `npx playwright test`, and publish the `playwright-report` folder. Setting the `CI` environment variable enables the CI-safe options in the config. (Say honestly that you haven't wired it yet if that's the case.)

**14. What would you add next?**
GitHub Actions/Jenkins pipeline, visual testing, accessibility checks with axe, and reporting integration (Allure).

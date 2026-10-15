import { test, expect } from '../fixtures/ui.fixture';
import { loadJson } from '../utils/testData';

interface InvalidLogin {
  scenario: string;
  username: string;
  password: string;
  error: string;
}
const users = loadJson<{ valid: { username: string; password: string }; invalid: InvalidLogin[] }>('users.json');

// Login tests must start logged OUT, so we clear the saved session for this file.
test.use({ storageState: { cookies: [], origins: [] } });

test.describe('Login', () => {
  test('valid user can log in', { tag: '@smoke' }, async ({ loginPage, inventoryPage }) => {
    await loginPage.goto();
    await loginPage.login(users.valid.username, users.valid.password);
    await expect(inventoryPage.title).toHaveText('Products');
  });

  // Data-driven: one test is generated for every row in test-data/users.json
  for (const data of users.invalid) {
    test(`login fails - ${data.scenario}`, { tag: '@regression' }, async ({ loginPage }) => {
      await loginPage.goto();
      await loginPage.login(data.username, data.password);
      await expect(loginPage.errorMessage).toContainText(data.error);
    });
  }
});

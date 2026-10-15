import { test as setup, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { AUTH_FILE } from '../utils/constants';
import { loadJson } from '../utils/testData';

const users = loadJson<{ valid: { username: string; password: string } }>('users.json');

// Tagged with both tags so it also runs when you use --grep @smoke or --grep @regression.
setup('log in once and save the session', { tag: ['@smoke', '@regression'] }, async ({ page }) => {
  const loginPage = new LoginPage(page);
  await loginPage.goto();
  await loginPage.login(users.valid.username, users.valid.password);
  await expect(page).toHaveURL(/inventory\.html/);

  // Save cookies/storage so UI tests start already logged in.
  await page.context().storageState({ path: AUTH_FILE });
});

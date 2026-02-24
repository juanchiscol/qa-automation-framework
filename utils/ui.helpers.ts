import type { Page } from '@playwright/test';
import { LoginPage } from '../pages/login.page.js';
import { ENV } from '../config/env.js';

/**
 * Performs login with admin credentials and waits for dashboard.
 * Reuse this across tests via beforeEach or test fixtures.
 */
export async function loginAsAdmin(page: Page): Promise<void> {
  const loginPage = new LoginPage(page);
  await loginPage.goto();
  await loginPage.login(ENV.ui.adminUser, ENV.ui.adminPassword);
  await loginPage.expectSuccessfulLogin();
}

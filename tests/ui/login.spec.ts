import { test, expect } from '@playwright/test';
import { LoginPage } from '../../pages/login.page.js';
import { loginData } from '../../fixtures/ui.fixtures.js';
import { ENV } from '../../config/env.js';

test.describe('Login', () => {
  let loginPage: LoginPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    await loginPage.goto();
  });

  test('TC-L01 | Successful login with valid credentials', async ({ page }) => {
    await loginPage.login(ENV.ui.adminUser, ENV.ui.adminPassword);
    await loginPage.expectSuccessfulLogin();
    // Dashboard should show the user menu
    await expect(page.locator('.oxd-userdropdown-name')).toBeVisible();
  });


  test('TC-L02 | Failed login shows "Invalid credentials" error', async () => {
    const creds = loginData.invalidCredentials[0];
    if (!creds) throw new Error('No invalid credentials fixture');
    await loginPage.login(creds.username, creds.password);
    await loginPage.expectLoginError('Invalid credentials');
  });


  test('TC-L03 | Login with valid user but wrong password shows error', async () => {
    const creds = loginData.invalidCredentials[1];
    if (!creds) throw new Error('No invalid credentials fixture');
    await loginPage.login(creds.username, creds.password);
    await loginPage.expectLoginError('Invalid credentials');
  });

  test('TC-L04 | Submit empty form shows required field validations', async () => {
    await loginPage.loginButton.click();
    await loginPage.expectRequiredValidations();
  });

  test('TC-L05 | Error message disappears after typing valid credentials', async () => {
    // First trigger error
    await loginPage.login('wrong', 'wrong');
    await loginPage.expectLoginError('Invalid credentials');

    // Then type valid credentials and login again
    await loginPage.login(ENV.ui.adminUser, ENV.ui.adminPassword);
    await loginPage.expectSuccessfulLogin();
  });
});

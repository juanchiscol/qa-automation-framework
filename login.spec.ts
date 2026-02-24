import { test, expect } from '@playwright/test';
import { LoginPage } from '../../pages/login.page';
import { loginData } from '../../fixtures/ui.fixtures';
import { ENV } from '../../config/env';

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
    const { username, password } = loginData.invalidCredentials[0];
    await loginPage.login(username, password);
    await loginPage.expectLoginError('Invalid credentials');
  });

  test('TC-L03 | Login with valid user but wrong password shows error', async () => {
    const { username, password } = loginData.invalidCredentials[1];
    await loginPage.login(username, password);
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

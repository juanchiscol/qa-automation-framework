import type { Page, Locator } from '@playwright/test';
import { expect } from '@playwright/test';
import { BasePage } from './base.page.js';

export class LoginPage extends BasePage {
  readonly usernameInput: Locator;
  readonly passwordInput: Locator;
  readonly loginButton: Locator;
  readonly errorAlert: Locator;
  readonly usernameRequiredMsg: Locator;
  readonly passwordRequiredMsg: Locator;

  constructor(page: Page) {
    super(page);
    this.usernameInput = page.getByPlaceholder('Username');
    this.passwordInput = page.getByPlaceholder('Password');
    this.loginButton = page.getByRole('button', { name: 'Login' });
    this.errorAlert = page.locator('.oxd-alert-content-text');
    this.usernameRequiredMsg = page
      .locator('div')
      .filter({ hasText: /^Username$/ })
      .locator('~ div .oxd-input-field-error-message');
    this.passwordRequiredMsg = page
      .locator('div')
      .filter({ hasText: /^Password$/ })
      .locator('~ div .oxd-input-field-error-message');
  }

  async navigate(): Promise<void> {
    await this.goto('/web/index.php/auth/login');
  }

  async login(username: string, password: string): Promise<void> {
    await this.usernameInput.fill(username);
    await this.passwordInput.fill(password);
    await this.loginButton.click();
  }

  async expectLoginError(message: string): Promise<void> {
    await expect(this.errorAlert).toBeVisible();
    await expect(this.errorAlert).toContainText(message);
  }

  async expectRequiredValidations(): Promise<void> {
    await expect(this.usernameRequiredMsg).toContainText('Required');
    await expect(this.passwordRequiredMsg).toContainText('Required');
  }

  async expectSuccessfulLogin(): Promise<void> {
    await this.page.waitForURL('**/dashboard/index');
    await expect(this.page).toHaveURL(/dashboard/);
  }
}

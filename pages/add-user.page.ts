import type { Page, Locator } from '@playwright/test';
import { expect } from '@playwright/test';

export class AddUserPage {
  readonly page: Page;
  readonly userRoleSelect: Locator;
  readonly employeeNameInput: Locator;
  readonly statusSelect: Locator;
  readonly usernameInput: Locator;
  readonly passwordInput: Locator;
  readonly confirmPasswordInput: Locator;
  readonly saveButton: Locator;
  readonly cancelButton: Locator;

  constructor(page: Page) {
    this.page = page;
    // Selects in order: User Role, Status
    this.userRoleSelect = page.locator('.oxd-select-text').first();
    this.statusSelect = page.locator('.oxd-select-text').nth(1);
    this.employeeNameInput = page.locator('input[placeholder="Type for hints..."]');
    this.usernameInput = page.locator('input[autocomplete="off"]').nth(0);
    this.passwordInput = page.locator('input[type="password"]').nth(0);
    this.confirmPasswordInput = page.locator('input[type="password"]').nth(1);
    this.saveButton = page.getByRole('button', { name: 'Save' });
    this.cancelButton = page.getByRole('button', { name: 'Cancel' });
  }

  async setUserRole(role: string): Promise<void> {
    await this.userRoleSelect.click();
    await this.page.getByRole('option', { name: role }).click();
  }

  async setStatus(status: string): Promise<void> {
    await this.statusSelect.click();
    await this.page.getByRole('option', { name: status }).click();
  }

  async setEmployeeName(name: string): Promise<void> {
    await this.employeeNameInput.fill(name);
    // Wait for autocomplete dropdown and pick first option
    await this.page.waitForSelector('.oxd-autocomplete-option', { timeout: 5000 });
    await this.page.locator('.oxd-autocomplete-option').first().click();
  }

  async setUsername(username: string): Promise<void> {
    await this.usernameInput.fill(username);
  }

  async setPassword(password: string): Promise<void> {
    await this.passwordInput.fill(password);
  }

  async setConfirmPassword(password: string): Promise<void> {
    await this.confirmPasswordInput.fill(password);
  }

  async fillForm(data: {
    role: string;
    status: string;
    employeeName: string;
    username: string;
    password: string;
    confirmPassword: string;
  }): Promise<void> {
    await this.setUserRole(data.role);
    await this.setStatus(data.status);
    await this.setEmployeeName(data.employeeName);
    await this.setUsername(data.username);
    await this.setPassword(data.password);
    await this.setConfirmPassword(data.confirmPassword);
  }

  async save(): Promise<void> {
    await this.saveButton.click();
    await this.page.waitForLoadState('networkidle');
  }

  async expectFieldRequired(fieldLabel: string): Promise<void> {
    const errorMsg = this.page
      .locator('.oxd-form-row')
      .filter({ hasText: fieldLabel })
      .locator('.oxd-input-field-error-message');
    await expect(errorMsg).toContainText('Required');
  }

  async expectPasswordMismatchError(): Promise<void> {
    const errorMsg = this.page
      .locator('.oxd-form-row')
      .filter({ hasText: 'Confirm Password' })
      .locator('.oxd-input-field-error-message');
    await expect(errorMsg).toContainText('Passwords do not match');
  }

  async expectSaveSuccess(): Promise<void> {
    // After save, redirects to Users list
    await this.page.waitForURL('**/viewSystemUsers**');
    await expect(this.page).toHaveURL(/viewSystemUsers/);
  }
}

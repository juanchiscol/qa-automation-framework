import { Page, Locator, expect } from '@playwright/test';

export class AdminUsersPage {
  readonly page: Page;
  readonly addUserButton: Locator;
  readonly userRoleSelect: Locator;
  readonly searchButton: Locator;
  readonly resetButton: Locator;
  readonly userTable: Locator;
  readonly tableRows: Locator;

  constructor(page: Page) {
    this.page = page;
    this.addUserButton = page.getByRole('button', { name: 'Add' });
    this.searchButton = page.getByRole('button', { name: 'Search' });
    this.resetButton = page.getByRole('button', { name: 'Reset' });
    this.userTable = page.locator('.oxd-table');
    this.tableRows = page.locator('.oxd-table-body .oxd-table-row');
    // First oxd-select-text in the form = User Role
    this.userRoleSelect = page.locator('.oxd-select-text').first();
  }

  async goto(): Promise<void> {
    await this.page.goto('/web/index.php/admin/viewSystemUsers');
    await this.page.waitForLoadState('networkidle');
  }

  async filterByRole(role: string): Promise<void> {
    await this.userRoleSelect.click();
    await this.page.getByRole('option', { name: role }).click();
    await this.searchButton.click();
    await this.page.waitForLoadState('networkidle');
  }

  async expectTableNotEmpty(): Promise<void> {
    await expect(this.tableRows.first()).toBeVisible();
  }

  async expectAllRowsHaveRole(role: string): Promise<void> {
    const count = await this.tableRows.count();
    expect(count).toBeGreaterThan(0);
    for (let i = 0; i < count; i++) {
      const row = this.tableRows.nth(i);
      await expect(row).toContainText(role);
    }
  }

  async expectRowActionsExist(): Promise<void> {
    // Each row should have Edit and Delete icons
    const editIcons = this.page.locator('.oxd-table-cell-actions .bi-pencil-fill');
    const deleteIcons = this.page.locator('.oxd-table-cell-actions .bi-trash');
    await expect(editIcons.first()).toBeVisible();
    await expect(deleteIcons.first()).toBeVisible();
  }

  async clickAddUser(): Promise<void> {
    await this.addUserButton.click();
    await this.page.waitForLoadState('networkidle');
  }

  async searchByUsername(username: string): Promise<void> {
    const usernameInput = this.page.locator('input[placeholder="Type for hints..."]');
    await usernameInput.fill(username);
    await this.searchButton.click();
    await this.page.waitForLoadState('networkidle');
  }

  async expectUserInTable(username: string): Promise<void> {
    await expect(this.page.locator('.oxd-table-body')).toContainText(username);
  }

  async expectNoRecordsFound(): Promise<void> {
    await expect(this.page.locator('.oxd-table-footer')).toContainText('No Records Found');
  }
}

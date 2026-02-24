import { test, expect } from '@playwright/test';
import { AdminUsersPage } from '../../pages/admin-users.page.js';
import { loginAsAdmin } from '../../utils/ui.helpers.js';

test.describe('Admin – User Management', () => {
  let adminUsersPage: AdminUsersPage;

  test.beforeEach(async ({ page }) => {
    await loginAsAdmin(page);
    adminUsersPage = new AdminUsersPage(page);
    await adminUsersPage.goto();
  });

  test('TC-AU01 | Filter by "Admin" role returns only Admin users', async () => {
    await adminUsersPage.filterByRole('Admin');
    await adminUsersPage.expectTableNotEmpty();
    await adminUsersPage.expectAllRowsHaveRole('Admin');
  });

  test('TC-AU02 | Filter by "ESS" role returns only ESS users', async () => {
    await adminUsersPage.filterByRole('ESS');
    await adminUsersPage.expectTableNotEmpty();
    await adminUsersPage.expectAllRowsHaveRole('ESS');
  });

  test('TC-AU03 | Edit and Delete action buttons are present for each user row', async () => {
    await adminUsersPage.expectRowActionsExist();
  });

  test('TC-AU04 | Reset button clears filters and shows all users', async ({ page }) => {
    await adminUsersPage.filterByRole('Admin');
    await adminUsersPage.resetButton.click();
    await page.waitForLoadState('networkidle');
    // After reset the select should show "-- Select --"
    await expect(adminUsersPage.userRoleSelect).toContainText('-- Select --');
  });

  test('TC-AU05 | Clicking Edit icon navigates to Edit User page', async ({ page }) => {
    const firstEditIcon = page.locator('.oxd-table-cell-actions .bi-pencil-fill').first();
    await firstEditIcon.click();
    await page.waitForLoadState('networkidle');
    await expect(page).toHaveURL(/saveSystemUser/);
  });
});

import { test, expect } from '@playwright/test';
import { AdminUsersPage } from '../../pages/admin-users.page.js';
import { AddUserPage } from '../../pages/add-user.page.js';
import { loginAsAdmin } from '../../utils/ui.helpers.js';
import { newUserData } from '../../fixtures/ui.fixtures.js';

test.describe('Create User', () => {
  let adminUsersPage: AdminUsersPage;
  let addUserPage: AddUserPage;

  test.beforeEach(async ({ page }) => {
    await loginAsAdmin(page);
    adminUsersPage = new AdminUsersPage(page);
    await adminUsersPage.goto();
    await adminUsersPage.clickAddUser();
    addUserPage = new AddUserPage(page);
  });

  test('TC-CU01 | Save with all empty fields shows required errors', async () => {
    await addUserPage.save();
    await addUserPage.expectFieldRequired('User Role');
    await addUserPage.expectFieldRequired('Employee Name');
    await addUserPage.expectFieldRequired('Username');
    await addUserPage.expectFieldRequired('Password');
  });

  test('TC-CU02 | Password mismatch shows "Passwords do not match" error', async () => {
    await addUserPage.setPassword(newUserData.password);
    await addUserPage.setConfirmPassword('WrongConfirm@99');
    await addUserPage.save();
    await addUserPage.expectPasswordMismatchError();
  });

  test('TC-CU03 | Username too short shows validation error', async ({ page }) => {
    await addUserPage.setUsername('ab'); // min 5 chars
    await addUserPage.save();
    const errorMsg = page
      .locator('.oxd-form-row')
      .filter({ hasText: 'Username' })
      .locator('.oxd-input-field-error-message');
    await expect(errorMsg).toContainText('Should be at least 5 characters');
  });

  test('TC-CU04 | Successfully create a new Admin user and find it in search', async ({ page }) => {
    const username = `qa_${Date.now()}`;

    await addUserPage.setUserRole('Admin');
    await addUserPage.setStatus('Enabled');
    await addUserPage.setEmployeeName('');   // autocomplete picks first available employee
    await addUserPage.setUsername(username);
    await addUserPage.setPassword(newUserData.password);
    await addUserPage.setConfirmPassword(newUserData.confirmPassword);
    await addUserPage.save();

    await addUserPage.expectSaveSuccess();

    // Verify the user appears in the user list via search
    await adminUsersPage.searchByUsername(username);
    await adminUsersPage.expectUserInTable(username);
  });

  test('TC-CU05 | Cancel button returns to Users list without saving', async ({ page }) => {
    await addUserPage.setUsername('should_not_be_saved');
    await addUserPage.cancelButton.click();
    await page.waitForURL('**/viewSystemUsers**');
    await adminUsersPage.searchByUsername('should_not_be_saved');
    await adminUsersPage.expectNoRecordsFound();
  });
});

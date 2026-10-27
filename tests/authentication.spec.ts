import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { InventoryPage } from '../pages/InventoryPage';
import { users } from '../test-data/users';

test.beforeEach(async ({ page }) => {
  await new LoginPage(page).goto();
});

test('standard user reaches the product inventory', async ({ page }) => {
  const login = new LoginPage(page);
  const inventory = new InventoryPage(page);

  await login.login(users.standard, users.password);

  await expect(page).toHaveURL(/\/inventory\.html$/);
  await expect(inventory.title).toHaveText('Products');
  await expect(inventory.items.first()).toBeVisible();
});

test('locked-out user remains on login with the lockout error', async ({ page }) => {
  const login = new LoginPage(page);

  await login.login(users.lockedOut, users.password);

  await expect(login.errorMessage).toHaveText('Epic sadface: Sorry, this user has been locked out.');
  await expect(page).toHaveURL('/');
  await expect(login.loginButton).toBeVisible();
});

test('invalid credentials are rejected', async ({ page }) => {
  const login = new LoginPage(page);

  await login.login('wrong_user', 'wrong_password');

  await expect(login.errorMessage).toHaveText(
    'Epic sadface: Username and password do not match any user in this service',
  );
  await expect(page).toHaveURL('/');
  await expect(login.loginButton).toBeVisible();
});

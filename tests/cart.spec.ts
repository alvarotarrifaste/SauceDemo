import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { InventoryPage } from '../pages/InventoryPage';
import { CartPage } from '../pages/CartPage';
import { users } from '../test-data/users';

test.beforeEach(async ({ page }) => {
  const login = new LoginPage(page);
  await login.goto();
  await login.login(users.standard, users.password);
});

test('adding a backpack puts one matching product in the cart', async ({ page }) => {
  const inventory = new InventoryPage(page);
  const cart = new CartPage(page);

  await inventory.addBackpack();
  await expect(inventory.cartBadge).toHaveText('1');
  await inventory.openCart();

  await expect(page).toHaveURL(/\/cart\.html$/);
  await expect(cart.title).toHaveText('Your Cart');
  await expect(cart.items).toHaveCount(1);
  await expect(cart.itemNames).toHaveText(['Sauce Labs Backpack']);
  await expect(cart.itemQuantities).toHaveText(['1']);
});

test('removing the backpack empties the cart and restores its add control', async ({ page }) => {
  const inventory = new InventoryPage(page);
  const cart = new CartPage(page);

  await inventory.addBackpack();
  await inventory.openCart();
  await expect(cart.itemNames).toHaveText(['Sauce Labs Backpack']);

  await cart.removeBackpack();

  await expect(cart.items).toHaveCount(0);
  await expect(cart.cartBadge).toHaveCount(0);
  await page.reload();
  await expect(cart.title).toHaveText('Your Cart');
  await expect(cart.items).toHaveCount(0);
  await expect(cart.cartBadge).toHaveCount(0);

  await cart.continueShopping();
  await expect(page).toHaveURL(/\/inventory\.html$/);
  await expect(inventory.addBackpackButton).toBeVisible();
});

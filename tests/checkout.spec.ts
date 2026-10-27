import { readFile } from 'node:fs/promises';
import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { InventoryPage } from '../pages/InventoryPage';
import { CartPage } from '../pages/CartPage';
import { CheckoutPage } from '../pages/CheckoutPage';
import { users } from '../test-data/users';

const customer = { firstName: 'Alex', lastName: 'Tester', postalCode: '110111' };

test.beforeEach(async ({ page }) => {
  const login = new LoginPage(page);
  const inventory = new InventoryPage(page);
  const cart = new CartPage(page);
  await login.goto();
  await login.login(users.standard, users.password);
  await expect(inventory.title).toHaveText('Products');
  await inventory.addBackpack();
  await inventory.openCart();
  await expect(cart.itemNames).toHaveText(['Sauce Labs Backpack']);
  await cart.checkout();
  await expect(page).toHaveURL(/\/checkout-step-one\.html$/);
});

test('valid purchase completes and generates a PDF order document', async ({ page }, testInfo) => {
  const checkout = new CheckoutPage(page);
  const cart = new CartPage(page);
  await checkout.fillInformation(customer.firstName, customer.lastName, customer.postalCode);
  await checkout.continue();

  await expect(page).toHaveURL(/\/checkout-step-two\.html$/);
  await expect(checkout.title).toHaveText('Checkout: Overview');
  await expect(checkout.itemNames).toHaveText(['Sauce Labs Backpack']);
  await expect(checkout.itemQuantities).toHaveText(['1']);
  await expect(checkout.subtotal).toHaveText('Item total: $29.99');
  await expect(checkout.tax).toHaveText('Tax: $2.40');
  await expect(checkout.total).toHaveText('Total: $32.39');

  await checkout.finish();

  await expect(page).toHaveURL(/\/checkout-complete\.html$/);
  await expect(checkout.title).toHaveText('Checkout: Complete!');
  await expect(checkout.confirmation).toBeVisible();
  await expect(cart.cartBadge).toHaveCount(0);

  const download = await checkout.downloadOrder();
  expect(await download.failure()).toBeNull();
  expect(download.suggestedFilename()).toMatch(/^swag-labs-order-.*\.pdf$/);
  const documentPath = testInfo.outputPath('purchase-order.pdf');
  await download.saveAs(documentPath);
  const document = await readFile(documentPath);
  expect(document.length).toBeGreaterThan(1000);
  expect(document.subarray(0, 5).toString()).toBe('%PDF-');
  expect(document.subarray(-20).toString()).toContain('%%EOF');
  await testInfo.attach('purchase-order', { path: documentPath, contentType: 'application/pdf' });

  await new InventoryPage(page).openCart();
  await expect(cart.title).toHaveText('Your Cart');
  await expect(cart.items).toHaveCount(0);
});

test('purchase is blocked when the postal code is missing', async ({ page }) => {
  const checkout = new CheckoutPage(page);
  const inventory = new InventoryPage(page);
  const cart = new CartPage(page);
  await checkout.fillInformation(customer.firstName, customer.lastName, '');
  await checkout.continue();

  await expect(checkout.errorMessage).toHaveText('Error: Postal Code is required');
  await expect(page).toHaveURL(/\/checkout-step-one\.html$/);
  await expect(checkout.firstNameInput).toHaveValue(customer.firstName);
  await expect(checkout.lastNameInput).toHaveValue(customer.lastName);
  await expect(checkout.confirmation).toHaveCount(0);
  await expect(checkout.generateOrderButton).toHaveCount(0);
  await expect(cart.cartBadge).toHaveText('1');

  await inventory.openCart();
  await expect(cart.title).toHaveText('Your Cart');
  await expect(cart.itemNames).toHaveText(['Sauce Labs Backpack']);
  await expect(cart.itemQuantities).toHaveText(['1']);
});

test('cancelling the purchase from overview preserves the cart', async ({ page }) => {
  const checkout = new CheckoutPage(page);
  const inventory = new InventoryPage(page);
  const cart = new CartPage(page);
  await checkout.fillInformation(customer.firstName, customer.lastName, customer.postalCode);
  await checkout.continue();

  await expect(page).toHaveURL(/\/checkout-step-two\.html$/);
  await expect(checkout.itemNames).toHaveText(['Sauce Labs Backpack']);
  await expect(checkout.total).toHaveText('Total: $32.39');

  await checkout.cancel();

  await expect(page).toHaveURL(/\/inventory\.html$/);
  await expect(inventory.title).toHaveText('Products');
  await expect(inventory.cartBadge).toHaveText('1');
  await expect(checkout.confirmation).toHaveCount(0);
  await expect(checkout.generateOrderButton).toHaveCount(0);

  await inventory.openCart();
  await expect(cart.title).toHaveText('Your Cart');
  await expect(cart.itemNames).toHaveText(['Sauce Labs Backpack']);
  await expect(cart.itemQuantities).toHaveText(['1']);
});

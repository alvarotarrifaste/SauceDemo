import { test, expect } from '@playwright/test';
import { shoppingCart } from '../pageObject/shoppingCart'
import { Login } from '../pageObject/Login'


test('Add items to the shopping cart', async ({ page }) => {
  const shoppingcart = new shoppingCart(page);

  await shoppingcart.addItems();
});

test('Delete items from the shopping cart', async ({ page }) => {
  const shoppingcart = new shoppingCart(page);
  await shoppingcart.deleteItems();
});



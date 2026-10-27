import type { Locator, Page } from '@playwright/test';

export class CartPage {
  readonly title: Locator;
  readonly items: Locator;
  readonly itemNames: Locator;
  readonly itemQuantities: Locator;
  readonly cartBadge: Locator;
  readonly removeBackpackButton: Locator;
  readonly continueShoppingButton: Locator;

  constructor(page: Page) {
    this.title = page.getByTestId('title');
    this.items = page.getByTestId('inventory-item');
    this.itemNames = page.getByTestId('inventory-item-name');
    this.itemQuantities = page.getByTestId('item-quantity');
    this.cartBadge = page.getByTestId('shopping-cart-badge');
    this.removeBackpackButton = page.getByRole('button', { name: 'Remove', exact: true });
    this.continueShoppingButton = page.getByRole('button', { name: 'Continue Shopping', exact: true });
  }

  async removeBackpack(): Promise<void> {
    await this.removeBackpackButton.click();
  }

  async continueShopping(): Promise<void> {
    await this.continueShoppingButton.click();
  }
}

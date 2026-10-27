import type { Locator, Page } from '@playwright/test';

export class InventoryPage {
  readonly title: Locator;
  readonly items: Locator;
  readonly cartBadge: Locator;
  readonly addBackpackButton: Locator;
  readonly cartLink: Locator;

  constructor(page: Page) {
    this.title = page.getByTestId('title');
    this.items = page.getByTestId('inventory-item');
    this.cartBadge = page.getByTestId('shopping-cart-badge');
    this.addBackpackButton = page.getByTestId('add-to-cart-sauce-labs-backpack');
    this.cartLink = page.getByTestId('shopping-cart-link');
  }

  async addBackpack(): Promise<void> {
    await this.addBackpackButton.click();
  }

  async openCart(): Promise<void> {
    await this.cartLink.click();
  }
}

import type { Download, Locator, Page } from '@playwright/test';

export class CheckoutPage {
  readonly title: Locator;
  readonly firstNameInput: Locator;
  readonly lastNameInput: Locator;
  readonly postalCodeInput: Locator;
  readonly errorMessage: Locator;
  readonly itemNames: Locator;
  readonly itemQuantities: Locator;
  readonly subtotal: Locator;
  readonly tax: Locator;
  readonly total: Locator;
  readonly confirmation: Locator;
  readonly generateOrderButton: Locator;

  constructor(private readonly page: Page) {
    this.title = page.getByTestId('title');
    this.firstNameInput = page.getByTestId('firstName');
    this.lastNameInput = page.getByTestId('lastName');
    this.postalCodeInput = page.getByTestId('postalCode');
    this.errorMessage = page.getByTestId('error');
    this.itemNames = page.getByTestId('inventory-item-name');
    this.itemQuantities = page.getByTestId('item-quantity');
    this.subtotal = page.getByTestId('subtotal-label');
    this.tax = page.getByTestId('tax-label');
    this.total = page.getByTestId('total-label');
    this.confirmation = page.getByRole('heading', { name: 'Thank you for your order!', exact: true });
    this.generateOrderButton = page.getByRole('button', { name: 'Generate PDF order', exact: true });
  }

  async fillInformation(firstName: string, lastName: string, postalCode: string): Promise<void> {
    await this.firstNameInput.fill(firstName);
    await this.lastNameInput.fill(lastName);
    await this.postalCodeInput.fill(postalCode);
  }

  async continue(): Promise<void> {
    await this.page.getByRole('button', { name: 'Continue', exact: true }).click();
  }

  async finish(): Promise<void> {
    await this.page.getByRole('button', { name: 'Finish', exact: true }).click();
  }

  async cancel(): Promise<void> {
    await this.page.getByRole('button', { name: 'Cancel', exact: true }).click();
  }

  async downloadOrder(): Promise<Download> {
    const download = this.page.waitForEvent('download');
    await this.generateOrderButton.click();
    return download;
  }
}

import { Locator, Page } from '@playwright/test';

export class CartPage {
  readonly items: Locator;
  readonly itemNames: Locator;
  readonly checkoutButton: Locator;

  constructor(private readonly page: Page) {
    this.items = page.getByTestId('inventory-item');
    this.itemNames = page.getByTestId('inventory-item-name');
    this.checkoutButton = page.getByTestId('checkout');
  }

  async removeItem(productName: string): Promise<void> {
    await this.items.filter({ hasText: productName }).getByRole('button', { name: 'Remove' }).click();
  }

  async startCheckout(): Promise<void> {
    await this.checkoutButton.click();
  }
}

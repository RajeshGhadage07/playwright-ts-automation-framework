import { Locator, Page } from '@playwright/test';

export type SortOption = 'az' | 'za' | 'lohi' | 'hilo';

export class InventoryPage {
  readonly title: Locator;
  readonly items: Locator;
  readonly itemNames: Locator;
  readonly itemPrices: Locator;
  readonly sortDropdown: Locator;
  readonly cartBadge: Locator;
  readonly cartLink: Locator;

  constructor(private readonly page: Page) {
    this.title = page.getByTestId('title');
    this.items = page.getByTestId('inventory-item');
    this.itemNames = page.getByTestId('inventory-item-name');
    this.itemPrices = page.getByTestId('inventory-item-price');
    this.sortDropdown = page.getByTestId('product-sort-container');
    this.cartBadge = page.getByTestId('shopping-cart-badge');
    this.cartLink = page.getByTestId('shopping-cart-link');
  }

  async goto(): Promise<void> {
    await this.page.goto('/inventory.html');
  }

  async addToCart(productName: string): Promise<void> {
    await this.items.filter({ hasText: productName }).getByRole('button', { name: 'Add to cart' }).click();
  }

  async sortBy(option: SortOption): Promise<void> {
    await this.sortDropdown.selectOption(option);
  }

  async getProductNames(): Promise<string[]> {
    return this.itemNames.allTextContents();
  }

  async getProductPrices(): Promise<number[]> {
    const prices = await this.itemPrices.allTextContents();
    return prices.map((p) => Number(p.replace('$', '')));
  }

  async openCart(): Promise<void> {
    await this.cartLink.click();
  }
}

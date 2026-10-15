import { test, expect } from '../fixtures/ui.fixture';
import { loadJson } from '../utils/testData';

const products = loadJson<{ backpack: string; bikeLight: string; onesie: string }>('products.json');

test.describe('Cart', () => {
  test.beforeEach(async ({ inventoryPage }) => {
    await inventoryPage.goto();
  });

  test('adding a product updates the cart badge', { tag: '@smoke' }, async ({ inventoryPage }) => {
    await inventoryPage.addToCart(products.backpack);
    await expect(inventoryPage.cartBadge).toHaveText('1');
  });

  test('cart lists all added products', { tag: '@regression' }, async ({ inventoryPage, cartPage }) => {
    await inventoryPage.addToCart(products.backpack);
    await inventoryPage.addToCart(products.bikeLight);
    await inventoryPage.openCart();
    await expect(cartPage.itemNames).toHaveText([products.backpack, products.bikeLight]);
  });

  test('a product can be removed from the cart', { tag: '@regression' }, async ({ inventoryPage, cartPage }) => {
    await inventoryPage.addToCart(products.onesie);
    await inventoryPage.openCart();
    await expect(cartPage.items).toHaveCount(1);
    await cartPage.removeItem(products.onesie);
    await expect(cartPage.items).toHaveCount(0);
  });
});

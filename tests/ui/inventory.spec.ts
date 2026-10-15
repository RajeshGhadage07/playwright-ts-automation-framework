import { test, expect } from '../fixtures/ui.fixture';

test.describe('Inventory', () => {
  test.beforeEach(async ({ inventoryPage }) => {
    await inventoryPage.goto();
  });

  test('shows all 6 products', { tag: '@smoke' }, async ({ inventoryPage }) => {
    await expect(inventoryPage.title).toHaveText('Products');
    await expect(inventoryPage.items).toHaveCount(6);
  });

  test('sort by name (A to Z)', { tag: '@regression' }, async ({ inventoryPage }) => {
    await inventoryPage.sortBy('az');
    const names = await inventoryPage.getProductNames();
    expect(names).toEqual([...names].sort());
  });

  test('sort by name (Z to A)', { tag: '@regression' }, async ({ inventoryPage }) => {
    await inventoryPage.sortBy('za');
    const names = await inventoryPage.getProductNames();
    expect(names).toEqual([...names].sort().reverse());
  });

  test('sort by price (low to high)', { tag: '@regression' }, async ({ inventoryPage }) => {
    await inventoryPage.sortBy('lohi');
    const prices = await inventoryPage.getProductPrices();
    expect(prices).toEqual([...prices].sort((a, b) => a - b));
  });

  test('sort by price (high to low)', { tag: '@regression' }, async ({ inventoryPage }) => {
    await inventoryPage.sortBy('hilo');
    const prices = await inventoryPage.getProductPrices();
    expect(prices).toEqual([...prices].sort((a, b) => b - a));
  });
});

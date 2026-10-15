import { test, expect } from '../fixtures/ui.fixture';
import { loadJson } from '../utils/testData';

interface InvalidCheckout {
  scenario: string;
  firstName: string;
  lastName: string;
  postalCode: string;
  error: string;
}
const checkout = loadJson<{
  valid: { firstName: string; lastName: string; postalCode: string };
  invalid: InvalidCheckout[];
}>('checkout.json');
const products = loadJson<{ backpack: string }>('products.json');

test.describe('Checkout', () => {
  test.beforeEach(async ({ inventoryPage, cartPage }) => {
    await inventoryPage.goto();
    await inventoryPage.addToCart(products.backpack);
    await inventoryPage.openCart();
    await cartPage.startCheckout();
  });

  test('user can complete an order end to end', { tag: '@smoke' }, async ({ page, checkoutPage }) => {
    await checkoutPage.fillInformation(checkout.valid);
    await expect(page).toHaveURL(/checkout-step-two\.html/);
    await checkoutPage.finishOrder();
    await expect(checkoutPage.completeHeader).toHaveText('Thank you for your order!');
  });

  // Data-driven validation tests from test-data/checkout.json
  for (const data of checkout.invalid) {
    test(`checkout validation - ${data.scenario}`, { tag: '@regression' }, async ({ checkoutPage }) => {
      await checkoutPage.fillInformation(data);
      await expect(checkoutPage.errorMessage).toContainText(data.error);
    });
  }
});

import { test, expect } from '../fixtures/authenticated';
import { InventoryPage } from '../pages/inventory.page';

test('Vérifier l’accès au catalogue après authentification', async ({ authenticatedPage }) => {
    const inventoryPage = new InventoryPage(authenticatedPage);

    await expect(inventoryPage.title).toHaveText('Products');
});

test('Afficher Login sans authentification', async ({ page }) => {

    await expect(page).toHaveURL('about:blank');

    await page.goto('/');

    await expect(page.getByPlaceholder('Username')).toBeVisible();
});

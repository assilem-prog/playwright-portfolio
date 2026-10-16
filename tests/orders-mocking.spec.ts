import { test, expect } from '@playwright/test';


test('CT01 - Afficher une commande simulée', async ({ page }) => {

    await page.route('**/playwright/api/orders.json*', async (route) => {

        await route.fulfill({
            status: 200,
            contentType: 'application/json',
            body: JSON.stringify({
                orders: [
                    {
                        id: 'ORD-QA-001',
                        customer: 'QA Tester',
                        item: 'Test Keyboard',
                        amount: 1499,
                        status: 'processing'
                    }
                ]
            })
        });

    });

    await page.goto('https://app.thetestingacademy.com/playwright/network-mock');

    const orderRow = page.getByRole('row').filter({ hasText: 'ORD-QA-001' });

    await expect(orderRow).toBeVisible();

    await expect(orderRow).toContainText('QA Tester');

    await expect(orderRow).toContainText('Test Keyboard');

    await expect(page.locator('tbody tr')).toHaveCount(1);

});

test('CT02 - Afficher une erreur serveur HTTP 500', async ({ page }) => {

    await page.route('**/playwright/api/orders.json*', async route => {
        await route.fulfill({
            status: 500,
            contentType: 'application/json',
            body: JSON.stringify({ orders: [] })
        });
    });

    const responsePromise = page.waitForResponse(response => response.url().includes('/playwright/api/orders.json'));

    await page.goto('https://app.thetestingacademy.com/playwright/network-mock');

    const response = await responsePromise;

    expect(response.status()).toBe(500);

    await expect(page.getByText('Could not load orders: Server responded 500')).toBeVisible();

});


test('CT03 - Recharger les commandes après une erreur 500', async ({ page }) => {

    let callCount = 0;

    await page.route('**/playwright/api/orders.json*', async route => {

        callCount++;

        if (callCount === 1) {
            await route.fulfill({
                status: 500,
                contentType: 'application/json',
                body: JSON.stringify({ orders: [] })
            });
        } else {
            await route.fulfill({
                status: 200,
                contentType: 'application/json',
                body: JSON.stringify({
                    orders: [
                        {
                            id: 'ORD-QA-002',
                            customer: 'QA Recovery',
                            item: 'Test Mouse',
                            amount: 999,
                            status: 'shipped'
                        }
                    ]
                })
            });
        }

    });

    await page.goto('https://app.thetestingacademy.com/playwright/network-mock');

    await expect(page.getByText('Could not load orders: Server responded 500')).toBeVisible();

    expect(callCount).toBe(1);

    const responsePromise = page.waitForResponse(response => response.url().includes('/playwright/api/orders.json'));

    await page.getByRole('button', { name: 'Reload orders' }).click();

    const response = await responsePromise;

    expect(response.status()).toBe(200);
    expect(callCount).toBe(2);

    await expect(page.getByText('Could not load orders: Server responded 500')).not.toBeVisible();

    const orderRow = page.getByRole('row').filter({ hasText: 'ORD-QA-002' });

    await expect(orderRow).toBeVisible();
    await expect(orderRow).toContainText('QA Recovery - ERREUR CI');
    await expect(orderRow).toContainText('Test Mouse');

    await expect(page.locator('tbody tr')).toHaveCount(1);

});



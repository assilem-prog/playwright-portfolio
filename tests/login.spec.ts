import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/login.page';
import { InventoryPage } from '../pages/inventory.page';
import { users } from '../test-data/users';

test('CT01 - Standard user can log in', async ({ page }) => {

  // Instancier le Page Object de la page Login
  const loginPage = new LoginPage(page);

  // Instancier le Page Object de la page Inventory
  const inventoryPage = new InventoryPage(page);

  // Ouvrir la page Login
  await loginPage.goto();

  // Se connecter avec l'utilisateur standard
  await loginPage.login(
    users.standard.username,
    users.standard.password
  );

  // Vérifier qu'on est redirigé vers la page Inventory
  await expect(page).toHaveURL(/inventory\.html/);

  // Vérifier que la page Inventory affiche le titre Products
  await expect(inventoryPage.title).toHaveText('Products');
});

test('CT02 - Locked out user cannot log in', async ({ page }) => {

  // Instancier le Page Object de la page Login
  const loginPage = new LoginPage(page);

  // Ouvrir la page Login
  await loginPage.goto();

  // Tenter de se connecter avec l'utilisateur bloqué
  await loginPage.login(
    users.lockedOut.username,
    users.lockedOut.password
  );

  // Vérifier que le message indique que l'utilisateur est bloqué
  await expect(loginPage.errorMessage).toContainText(
    'Sorry, this user has been locked out.'
  );

  // Vérifier qu'on reste sur la page Login
  await expect(page).toHaveURL('/');
});
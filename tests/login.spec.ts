import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/login.page';
import { InventoryPage } from '../pages/inventory.page';
import { users } from '../test-data/users';

test('CT01 - Vérifier la connexion d’un utilisateur standard', async ({ page }) => {

  // Instancier le Page Object de la page Login
  const loginPage = new LoginPage(page);

  // Instancier le Page Object de la page Inventory
  const inventoryPage = new InventoryPage(page);

  await test.step('Se connecter avec un utilisateur valide', async () => {

    // Ouvrir la page Login
    await loginPage.goto();

    // Se connecter avec l'utilisateur standard
    await loginPage.login(
      users.standard.username,
      users.standard.password
    );
  });

  await test.step('Vérifier l’accès au catalogue', async () => {

    // Vérifier qu'on est redirigé vers la page Inventory
    await expect(page).toHaveURL(/inventory\.html/);

    // Vérifier que la page Inventory affiche le titre Products
    await expect(inventoryPage.title).toHaveText('Products');
  });
});

test('CT02 - Vérifier le refus de connexion d’un utilisateur bloqué', async ({ page }) => {

  // Instancier le Page Object de la page Login
  const loginPage = new LoginPage(page);

  await test.step('Tenter de se connecter avec un utilisateur bloqué', async () => {
    await loginPage.goto();

    await loginPage.login(
      users.lockedOut.username,
      users.lockedOut.password
    );
  });

  await test.step('Vérifier le refus de connexion', async () => {

    // Vérifier que le message indique que l'utilisateur est bloqué
    await expect(loginPage.errorMessage).toContainText(
      'Sorry, this user has been locked out.'
    );

    // Vérifier qu'on reste sur la page Login
    await expect(page).toHaveURL('/');

  });
});
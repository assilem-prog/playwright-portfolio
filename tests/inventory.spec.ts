import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/login.page';
import { InventoryPage } from '../pages/inventory.page';
import { users } from '../test-data/users';
import { expectedProductNames } from '../test-data/products';

test.describe('Catalogue produits', () => {

  test.beforeEach(async ({ page }) => {

    // Instancier les Page Objects nécessaires.
    const loginPage = new LoginPage(page);

    await loginPage.goto();

    await loginPage.login(
      users.standard.username,
      users.standard.password
    );
  });

  test('CT01 - Vérifier l’affichage du catalogue produits', async ({ page }) => {

    // Instancier le Page Object Inventory.
    const inventoryPage = new InventoryPage(page);

    // Vérifier que le titre Products est affiché.
    await expect(inventoryPage.title).toHaveText('Products');

    // Vérifier que le catalogue contient 6 produits.
    await expect(inventoryPage.productItems).toHaveCount(6);
  });

  test('CT02 - Vérifier les informations des produits', async ({ page }) => {

    const inventoryPage = new InventoryPage(page);

    // Vérifier que 6 noms de produits sont affichés.
    await expect(inventoryPage.productNames).toHaveCount(6);

    // Vérifier que 6 descriptions sont affichées.
    await expect(inventoryPage.productDescriptions).toHaveCount(6);

    // Vérifier que 6 prix sont affichés.
    await expect(inventoryPage.productPrices).toHaveCount(6);

    // Vérifier que chaque produit dispose d'un bouton Add to cart.
    await expect(inventoryPage.addToCartButtons).toHaveCount(6);
  });

  test('CT03 - Vérifier les produits attendus dans le catalogue', async ({ page }) => {

    const inventoryPage = new InventoryPage(page);

    for (const productName of expectedProductNames) {
        await expect(
        inventoryPage.productNames.getByText(productName, { exact: true })
        ).toBeVisible();
    }
  });

  test('CT04 - Vérifier le tri des produits par prix croissant', async ({ page }) => {

    const inventoryPage = new InventoryPage(page);

    // Trier les produits par prix croissant.
    await inventoryPage.sortByPriceLowToHigh();

    // Récupérer les prix affichés
    const priceListDisplayed = await inventoryPage.productPrices.allTextContents();

    //Nettoyer le format des prix affichés
    const priceListDisplayedCleanFinal = priceListDisplayed.map(price => parseFloat(price.replace('$', '')));

    // Copie des prix affichés + tri
    const priceListDisplayedCleanFinalCopySorted = [...priceListDisplayedCleanFinal].sort((a, b) => a - b);

    // Vérifier le tri des prix dans l'ordre croissant
    expect(priceListDisplayedCleanFinal).toStrictEqual(priceListDisplayedCleanFinalCopySorted);

    // Afficher les valeurs comparées dans le terminal
    console.log('Prix affichés :', priceListDisplayedCleanFinal);
    console.log('Prix triés attendus :', priceListDisplayedCleanFinalCopySorted);
  });

  test('CT05 - Vérifier le tri des produits par prix décroissant', async ({ page }) => {

    const inventoryPage = new InventoryPage(page);

    // Trier les produits par prix décroissant.
    await inventoryPage.sortByPriceHighToLow();

    // Récupérer les prix affichés
    const priceListDisplayed = await inventoryPage.productPrices.allTextContents();

    //Nettoyer le format des prix affichés
    const priceListDisplayedCleanFinal = priceListDisplayed.map(price => parseFloat(price.replace('$', '')));

    // Copie des prix affichés + tri
    const priceListDisplayedCleanFinalCopySorted = [...priceListDisplayedCleanFinal].sort((a, b) => b - a);

    // Vérifier le tri des prix dans l'ordre décroissant
    expect(priceListDisplayedCleanFinal).toStrictEqual(priceListDisplayedCleanFinalCopySorted);

    // Afficher les valeurs comparées dans le terminal
    console.log('Prix affichés :', priceListDisplayedCleanFinal);
    console.log('Prix triés attendus :', priceListDisplayedCleanFinalCopySorted);
  });


  test('CT06 - Vérifier le tri des produits par ordre alphabétique croissant', async ({ page }) => {

    const inventoryPage = new InventoryPage(page);

    // Trier les produits par nom croissant.
    await inventoryPage.sortByNameAtoZ();

    // Récupérer les noms affichés
    const productNameDisplayed = await inventoryPage.productNames.allTextContents();

    // Copie des noms affichés + tri
    const productNameDisplayedCopySorted = [...productNameDisplayed].sort((a, b) => a.localeCompare(b));

    // Vérifier le tri des noms dans l'ordre croissant
    expect(productNameDisplayed).toStrictEqual(productNameDisplayedCopySorted);

    // Afficher les valeurs comparées dans le terminal
    console.log('Noms des produits affichés :', productNameDisplayed);
    console.log('Noms des produits triés attendus :', productNameDisplayedCopySorted);
  });

  test('CT07 - Vérifier le tri des produits par ordre alphabétique décroissant', async ({ page }) => {

    const inventoryPage = new InventoryPage(page);

    // Trier les produits par nom décroissant.
    await inventoryPage.sortByNameZtoA();

    // Récupérer les noms affichés
    const productNameDisplayed = await inventoryPage.productNames.allTextContents();

    // Copie des noms affichés + tri
    const productNameDisplayedCopySorted = [...productNameDisplayed].sort((a, b) => b.localeCompare(a));

    // Vérifier le tri des noms dans l'ordre décroissant
    expect(productNameDisplayed).toStrictEqual(productNameDisplayedCopySorted);

    // Afficher les valeurs comparées dans le terminal
    console.log('Noms des produits affichés :', productNameDisplayed);
    console.log('Noms des produits triés attendus :', productNameDisplayedCopySorted);
  });

  test('CT08 - Ajouter un produit au panier', async ({ page }) => {

    const inventoryPage = new InventoryPage(page);

    // Ajouter un produit au panier.
    await inventoryPage.addToCart('Sauce Labs Backpack');

    // Vérifier le compteur du panier
    await expect(inventoryPage.shoppingCartBadge).toHaveText('1');

  });

});
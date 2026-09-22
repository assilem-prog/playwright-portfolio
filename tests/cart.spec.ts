import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/login.page';
import { InventoryPage } from '../pages/inventory.page';
import { users } from '../test-data/users';
import { CartPage } from '../pages/cart.page';


test.describe('Panier', () => {

  test.beforeEach(async ({ page }) => {

    // Instancier les Page Objects nécessaires.
    const loginPage = new LoginPage(page);

    await loginPage.goto();

    await loginPage.login(
      users.standard.username,
      users.standard.password
    );
  });


  test('CT01 - Vérifier le contenu du panier après ajout d’un produit', async ({ page }) => {

    const inventoryPage = new InventoryPage(page);
    const cartPage = new CartPage(page);

    // Vérifier que le titre Products est affiché
    await expect(inventoryPage.title).toHaveText('Products');

    // Ajouter un produit au panier
    await inventoryPage.addToCart('Sauce Labs Backpack');

    // Récupérer le prix du produit
    const pricePageProduct = await inventoryPage.getProductPrice('Sauce Labs Backpack');
    console.log('Prix du produit sur la page catalogue :', pricePageProduct);

    // Vérifier le compteur du panier
    await expect(inventoryPage.shoppingCartBadge).toHaveText('1');

    // Cliquer sur le bouton du panier pour afficher le détail du panier
    await inventoryPage.clickToCart();

    // Vérifier que le titre Your Cart est affiché
    await expect(cartPage.title).toHaveText('Your Cart');

    // Vérifier le nom du produit
    await expect(cartPage.inventoryItemNames).toHaveText('Sauce Labs Backpack');

    // Vérifier le prix du produit
    await expect(cartPage.inventoryItemPrices).toHaveText(pricePageProduct);
    console.log('Prix du produit sur la page panier :', await cartPage.inventoryItemPrices.innerText());

    // Vérifier la quantité du produit
    await expect(cartPage.itemQuantity).toHaveText('1');

  });


  test('CT02 - Retirer un produit du panier', async ({ page }) => {

    const inventoryPage = new InventoryPage(page);
    const cartPage = new CartPage(page);

    // Ajouter un produit au panier
    await inventoryPage.addToCart('Sauce Labs Backpack');

    // Vérifier que le compteur du panier affiche 1
    await expect(inventoryPage.shoppingCartBadge).toHaveText('1');

    // Ouvrir le panier
    await inventoryPage.clickToCart();

    // Vérifier que le produit est présent avant suppression
    await expect(cartPage.inventoryItemNames).toHaveText('Sauce Labs Backpack');

    // Retirer le produit du panier
    await cartPage.removeFromCart('Sauce Labs Backpack');

    // Vérifier que le produit n'est plus présent dans le panier
    await expect(cartPage.inventoryItemNames).toHaveCount(0);

    // Vérifier que le compteur du panier disparaît lorsque le panier est vide
    await expect(cartPage.shoppingCartBadge).toHaveCount(0);

  });

});

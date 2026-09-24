import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/login.page';
import { InventoryPage } from '../pages/inventory.page';
import { users } from '../test-data/users';
import { CartPage } from '../pages/cart.page';
import { productsToAdd } from '../test-data/products';


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

    // Vérifier que la page panier est affichée
    await expect(cartPage.title).toHaveText('Your Cart');

    // Vérifier que le produit est présent avant suppression
    await expect(cartPage.inventoryItemNames).toHaveText('Sauce Labs Backpack');

    // Retirer le produit du panier
    await cartPage.removeFromCart('Sauce Labs Backpack');

    // Vérifier que le produit n'est plus présent dans le panier
    await expect(cartPage.inventoryItemNames).toHaveCount(0);

    // Vérifier que le compteur du panier disparaît lorsque le panier est vide
    await expect(cartPage.shoppingCartBadge).toHaveCount(0);

  });


  test('CT03 - Vérifier le contenu du panier après l’ajout de plusieurs produits', async ({ page }) => {

    const inventoryPage = new InventoryPage(page);
    const cartPage = new CartPage(page);

    // Mémoriser l'ID technique, le nom et le prix affichés sur la page Products.
    const productReferences: { id: string; name: string; price: string }[] = [];

    for (const product of productsToAdd) {
      const name = await inventoryPage.getProductNameById(product.id);
      const price = await inventoryPage.getProductPriceById(product.id);

      productReferences.push({ id: product.id, name, price });
      await inventoryPage.addToCartById(product.id);
    }

    // Vérifier que le compteur du panier correspond au nombre de produits ajoutés.
    await expect(inventoryPage.shoppingCartBadge).toHaveText(productsToAdd.length.toString());

    // Ouvrir le panier.
    await inventoryPage.clickToCart();

    // Vérifier que la page panier est affichée.
    await expect(cartPage.title).toHaveText('Your Cart');

    // Vérifier que le panier contient exactement le nombre de produits ajoutés.
    await expect(cartPage.productItems).toHaveCount(productsToAdd.length);

    // Vérifier pour chaque ID que le nom et le prix correspondent aux valeurs relevées sur Products,
    // et que la quantité est égale à 1.
    for (const product of productReferences) {
      await expect(cartPage.getProductNameById(product.id)).toHaveText(product.name);
      await expect(cartPage.getProductPriceById(product.id)).toHaveText(product.price);
      await expect(cartPage.getProductQuantityById(product.id)).toHaveText('1');
    }

  });

});

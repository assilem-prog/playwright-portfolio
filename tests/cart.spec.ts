import { test, expect } from '../fixtures/authenticated';
import { InventoryPage } from '../pages/inventory.page';
import { CartPage } from '../pages/cart.page';
import { productsToAdd } from '../test-data/products';


test.describe('Panier', () => {

  test('CT01 - Vérifier le contenu du panier après ajout d’un produit', async ({ authenticatedPage }) => {

    const inventoryPage = new InventoryPage(authenticatedPage);
    const cartPage = new CartPage(authenticatedPage);

    await test.step('Ajouter un produit au panier depuis le catalogue', async () => {

      // Vérifier que le catalogue est affiché
      await expect(inventoryPage.title).toHaveText('Products');

      // Ajouter le produit au panier
      await inventoryPage.addToCart('Sauce Labs Backpack');

    });

    // Récupérer le prix du produit
    const pricePageProduct = await inventoryPage.getProductPrice('Sauce Labs Backpack');
    console.log('Prix du produit sur la page catalogue :', pricePageProduct);

    await test.step('Vérifier que le compteur du panier affiche 1', async () => {

      await expect(inventoryPage.shoppingCartBadge).toHaveText('1');

    });

    await test.step('Ouvrir le panier et vérifier son affichage', async () => {

      // Ouvrir le panier
      await inventoryPage.clickToCart();

      // Vérifier que la page Panier est affichée
      await expect(cartPage.title).toHaveText('Your Cart');

    });

    await test.step('Vérifier le nom, le prix et la quantité du produit', async () => {

      // Vérifier le nom du produit
      await expect(cartPage.inventoryItemNames).toHaveText('Sauce Labs Backpack');

      // Vérifier le prix du produit
      await expect(cartPage.inventoryItemPrices).toHaveText(pricePageProduct);

      console.log('Prix du produit sur la page panier :', await cartPage.inventoryItemPrices.innerText());

      // Vérifier la quantité du produit
      await expect(cartPage.itemQuantity).toHaveText('1');

    });

  });

  test('CT02 - Retirer un produit du panier', async ({ authenticatedPage }) => {

    const inventoryPage = new InventoryPage(authenticatedPage);
    const cartPage = new CartPage(authenticatedPage);

    await test.step('Ajouter le produit Sauce Labs Backpack au panier', async () => {

      await inventoryPage.addToCart('Sauce Labs Backpack');

    });

    await test.step('Vérifier que le compteur du panier affiche 1', async () => {

      await expect(inventoryPage.shoppingCartBadge).toHaveText('1');

    });

    await test.step('Ouvrir le panier et vérifier la présence du produit', async () => {

      // Ouvrir le panier
      await inventoryPage.clickToCart();

      // Vérifier que la page panier est affichée
      await expect(cartPage.title).toHaveText('Your Cart');

      // Vérifier que le produit est présent avant suppression
      await expect(cartPage.inventoryItemNames).toHaveText('Sauce Labs Backpack');

    });

    await test.step('Retirer le produit Sauce Labs Backpack du panier', async () => {

      await cartPage.removeFromCart('Sauce Labs Backpack');

    });

    await test.step('Vérifier que le produit est supprimé et que le panier est vide', async () => {

      // Vérifier que le produit n'est plus présent dans le panier
      await expect(cartPage.inventoryItemNames).toHaveCount(0);

      // Vérifier que le compteur du panier disparaît
      await expect(cartPage.shoppingCartBadge).toHaveCount(0);

    });

  });


  test('CT03 - Vérifier le contenu du panier après l’ajout de plusieurs produits', async ({ authenticatedPage }) => {

    const inventoryPage = new InventoryPage(authenticatedPage);
    const cartPage = new CartPage(authenticatedPage);

    // Mémoriser l'ID technique, le nom et le prix affichés sur la page Products.
    const productReferences: { id: string; name: string; price: string }[] = [];

    await test.step('Relever les informations des produits et les ajouter au panier', async () => {

      for (const product of productsToAdd) {

        const name = await inventoryPage.getProductNameById(product.id);
        const price = await inventoryPage.getProductPriceById(product.id);

        productReferences.push({ id: product.id, name, price });

        await inventoryPage.addToCartById(product.id);

      }

    });

    console.table(productReferences);

    await test.step('Vérifier que le compteur correspond au nombre de produits ajoutés', async () => {

      await expect(inventoryPage.shoppingCartBadge).toHaveText(productsToAdd.length.toString());

    });

    await test.step('Ouvrir le panier et vérifier le nombre de produits', async () => {

      // Ouvrir le panier
      await inventoryPage.clickToCart();

      // Vérifier que la page panier est affichée
      await expect(cartPage.title).toHaveText('Your Cart');

      // Vérifier que le nombre de produits correspond aux ajouts
      await expect(cartPage.productItems).toHaveCount(productsToAdd.length);

    });

    // Vérifier pour chaque ID que le nom et le prix correspondent aux valeurs relevées sur Products,
    // et que la quantité est égale à 1.
    for (const product of productReferences) {

      await test.step(`Vérifier le nom, le prix et la quantité : ${product.name}`, async () => {

        // Vérifier le nom du produit
        await expect(cartPage.getProductNameById(product.id)).toHaveText(product.name);

        // Vérifier le prix du produit
        await expect(cartPage.getProductPriceById(product.id)).toHaveText(product.price);

        // Vérifier la quantité du produit
        await expect(cartPage.getProductQuantityById(product.id)).toHaveText('1');

      });

    }

  });

});

import { Locator, Page } from '@playwright/test';

// Cette classe représente la page Cart de SauceDemo.
// Elle centralise les éléments du panier et les actions réutilisables.
export class CartPage {

  // Titre "Your Cart" affiché en haut du panier.
  readonly title: Locator;

  // Ensemble des produits présents dans le panier.
  readonly productItems: Locator;

  // Noms des produits.
  readonly inventoryItemNames: Locator;

  // Prix des produits.
  readonly inventoryItemPrices: Locator;

  // Quantité des produits.
  readonly itemQuantity: Locator;

  // Pastille qui affiche le nombre d'articles dans le panier.
  readonly shoppingCartBadge: Locator;

  // Le constructeur reçoit la page navigateur fournie par Playwright.
  constructor(private page: Page) {

    // Titre principal de la page Panier.
    this.title = page.locator('[data-test="title"]');

    // Chaque élément correspondant à un produit présent dans le panier.
    this.productItems = page.locator('[data-test="inventory-item"]');

    // Noms des produits.
    this.inventoryItemNames = page.locator('[data-test="inventory-item-name"]');

    // Prix des produits.
    this.inventoryItemPrices = page.locator('[data-test="inventory-item-price"]');

    // Quantité des produits.
    this.itemQuantity = page.locator('[data-test="item-quantity"]');

    // Pastille qui affiche le nombre d'articles dans le panier.
    this.shoppingCartBadge = page.locator('[data-test="shopping-cart-badge"]');
  }

  // Méthode qui permet de retirer un produit du panier en prenant son nom en paramètre.
  async removeFromCart(productToRemove: string): Promise<void> {
    const product = this.productItems.filter({ hasText: productToRemove });
    await product.getByRole('button', { name: 'Remove' }).click();
  }
}

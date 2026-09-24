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

  // Méthode qui retourne le bloc correspondant au produit demandé à partir de son nom.
  getProduct(productName: string): Locator {
    return this.productItems.filter({ hasText: productName });
  }

  // Méthode qui retourne le bloc correspondant à un produit à partir de son ID technique.
  getProductById(productId: string): Locator {
    const productLink = this.page.locator(`[data-test="item-${productId}-title-link"]`);
    return this.productItems.filter({ has: productLink });
  }

  // Méthode qui retourne le nom d'un produit précis du panier à partir de son nom.
  getProductName(productName: string): Locator {
    return this.getProduct(productName).locator('[data-test="inventory-item-name"]');
  }

  // Méthode qui retourne le prix d'un produit précis du panier à partir de son nom.
  getProductPrice(productName: string): Locator {
    return this.getProduct(productName).locator('[data-test="inventory-item-price"]');
  }

  // Méthode qui retourne la quantité d'un produit précis du panier à partir de son nom.
  getProductQuantity(productName: string): Locator {
    return this.getProduct(productName).locator('[data-test="item-quantity"]');
  }

  // Méthode qui retourne le nom d'un produit précis du panier à partir de son ID technique.
  getProductNameById(productId: string): Locator {
    return this.getProductById(productId).locator('[data-test="inventory-item-name"]');
  }

  // Méthode qui retourne le prix d'un produit précis du panier à partir de son ID technique.
  getProductPriceById(productId: string): Locator {
    return this.getProductById(productId).locator('[data-test="inventory-item-price"]');
  }

  // Méthode qui retourne la quantité d'un produit précis du panier à partir de son ID technique.
  getProductQuantityById(productId: string): Locator {
    return this.getProductById(productId).locator('[data-test="item-quantity"]');
  }

  // Méthode qui permet de retirer un produit du panier en prenant son nom en paramètre.
  async removeFromCart(productToRemove: string): Promise<void> {
    const product = this.getProduct(productToRemove);
    await product.getByRole('button', { name: 'Remove' }).click();
  }
}

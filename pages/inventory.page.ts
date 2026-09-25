import { Locator, Page } from '@playwright/test';

// Cette classe représente la page Inventory / Products de SauceDemo.
// Elle centralise les éléments du catalogue et les actions réutilisables.
export class InventoryPage {

  // Titre "Products" affiché en haut du catalogue.
  readonly title: Locator;

  // Ensemble des fiches produits affichées dans le catalogue.
  readonly productItems: Locator;

  // Ensemble des noms de produits.
  readonly productNames: Locator;

  // Ensemble des descriptions des produits.
  readonly productDescriptions: Locator;

  // Ensemble des prix des produits.
  readonly productPrices: Locator;

  // Ensemble des boutons "Add to cart".
  readonly addToCartButtons: Locator;

  // Liste déroulante utilisée pour trier les produits.
  readonly sortDropdown: Locator;

  // Pastille qui affiche le nombre d'articles dans le panier
  readonly shoppingCartBadge: Locator;

  // Lien vers la page Panier
  readonly shoppingCartLink: Locator;

  // Le constructeur reçoit la page navigateur fournie par Playwright.
  constructor(private page: Page) {

    // Titre principal de la page Inventory.
    this.title = page.locator('[data-test="title"]');

    // Chaque élément correspondant à une fiche produit.
    this.productItems = page.locator('[data-test="inventory-item"]');

    // Noms des produits.
    this.productNames = page.locator('[data-test="inventory-item-name"]');

    // Descriptions des produits.
    this.productDescriptions = page.locator('[data-test="inventory-item-desc"]');

    // Prix des produits.
    this.productPrices = page.locator('[data-test="inventory-item-price"]');

    // Boutons permettant d'ajouter les produits au panier.
    this.addToCartButtons = page.getByRole('button', { name: 'Add to cart' });

    // Liste permettant de trier le catalogue.
    this.sortDropdown = page.locator('[data-test="product-sort-container"]');

    // Pastille qui affiche le nombre d'articles dans le panier
    this.shoppingCartBadge = page.locator('[data-test="shopping-cart-badge"]');

    // Lien vers la page Panier
    this.shoppingCartLink = page.locator('[data-test="shopping-cart-link"]');

  }

// Méthode qui trie les produits par prix croissant.
  async sortByPriceLowToHigh(): Promise<void> {
    await this.sortDropdown.selectOption({ label: 'Price (low to high)' });
  }

// Méthode qui trie les produits par prix décroissant.
  async sortByPriceHighToLow(): Promise<void> {
    await this.sortDropdown.selectOption({ label: 'Price (high to low)' });
  }

 // Méthode qui trie les produits par nom croissant.
  async sortByNameAtoZ(): Promise<void> {
    await this.sortDropdown.selectOption({ label: 'Name (A to Z)' });
  }

  // Méthode qui trie les produits par nom décroissant.
  async sortByNameZtoA(): Promise<void> {
    await this.sortDropdown.selectOption({ label: 'Name (Z to A)' });
  }

  // Méthode qui permet d'ajouter un produit au panier en prenant son nom en paramètre.
  async addToCart(productToAdd: string): Promise<void> {
    const product = this.productItems.filter({ hasText: productToAdd });
    await product.getByRole('button', { name: 'Add to cart' }).click();
  }

  // Méthode qui retourne le bloc correspondant à un produit à partir de son ID technique.
  getProductById(productId: string): Locator {
    const productLink = this.page.locator(`[data-test="item-${productId}-title-link"]`);
    return this.productItems.filter({ has: productLink });
  }

  // Méthode qui récupère le nom affiché d'un produit à partir de son ID technique.
  async getProductNameById(productId: string): Promise<string> {
    return await this.getProductById(productId)
      .locator('[data-test="inventory-item-name"]')
      .innerText();
  }

  // Méthode qui récupère le prix affiché d'un produit à partir de son ID technique.
  async getProductPriceById(productId: string): Promise<string> {
    return await this.getProductById(productId)
      .locator('[data-test="inventory-item-price"]')
      .innerText();
  }

  // Méthode qui ajoute au panier un produit identifié par son ID technique.
  async addToCartById(productId: string): Promise<void> {
    await this.getProductById(productId)
      .getByRole('button', { name: 'Add to cart' })
      .click();
  }

  // Méthode qui clique sur le lien allant sur le détail du Panier et attend l'ouverture de la page.
  async clickToCart(): Promise<void> {
    await Promise.all([
      this.page.waitForURL('**/cart.html'),
      this.shoppingCartLink.click()
    ]);
  }

  // Méthode qui récupère le prix d'un produit
  async getProductPrice(productName: string): Promise<string> {
    const product = this.productItems.filter({ hasText: productName });
    return await product.locator('[data-test="inventory-item-price"]').innerText();
  }

}

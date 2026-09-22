import { Locator, Page } from '@playwright/test';

// Cette classe représente la page Cart de SauceDemo.
// Elle centralise les éléments du panier et les actions réutilisables.
export class CartPage {

  // Titre "Your Cart" affiché en haut du panier.
  readonly title: Locator;

  // Noms des produits
  readonly inventoryItemNames: Locator;

  // Prix des produits
  readonly inventoryItemPrices: Locator;

  // Quantité des produits
  readonly itemQuantity: Locator;


  // Le constructeur reçoit la page navigateur fournie par Playwright.
  constructor(private page: Page) {

    // Titre principal de la page Panier.
    this.title = page.locator('[data-test="title"]');



    // Noms des produits
    this.inventoryItemNames = page.locator('[data-test="inventory-item-name"]');

    // Prix des produits
    this.inventoryItemPrices = page.locator('[data-test="inventory-item-price"]');

    // Quantité des produits
    this.itemQuantity = page.locator('[data-test="item-quantity"]');


  }




}
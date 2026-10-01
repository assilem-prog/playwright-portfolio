import { Locator, Page } from '@playwright/test';

// Cette classe représente la page Checkout: Overview de SauceDemo.
// Seul le titre est exposé : le contenu de la page n'est pas vérifié à ce stade.
export class CheckoutOverviewPage {

  // Titre "Checkout: Overview" affiché en haut de la page.
  readonly title: Locator;

  // Le constructeur reçoit la page navigateur fournie par Playwright.
  constructor(private page: Page) {

    // Titre principal de la page.
    this.title = page.locator('[data-test="title"]');
  }
}

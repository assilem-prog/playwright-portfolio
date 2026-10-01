import { Locator, Page } from '@playwright/test';

// Cette classe représente la page Checkout: Your Information de SauceDemo.
// Elle centralise les champs d'informations client et les actions réutilisables.
export class CheckoutInformationPage {

  // Titre "Checkout: Your Information" affiché en haut de la page.
  readonly title: Locator;

  // Champ First Name.
  readonly firstNameInput: Locator;

  // Champ Last Name.
  readonly lastNameInput: Locator;

  // Champ Postal Code.
  readonly postalCodeInput: Locator;

  // Bouton "Continue".
  readonly continueButton: Locator;

  // Bouton "Cancel".
  readonly cancelButton: Locator;

  // Message d'erreur affiché lorsqu'un champ obligatoire est vide.
  readonly errorMessage: Locator;

  // Le constructeur reçoit la page navigateur fournie par Playwright.
  constructor(private page: Page) {

    // Titre principal de la page.
    this.title = page.locator('[data-test="title"]');

    // Champs du formulaire d'informations client.
    this.firstNameInput = page.locator('[data-test="firstName"]');
    this.lastNameInput = page.locator('[data-test="lastName"]');
    this.postalCodeInput = page.locator('[data-test="postalCode"]');

    // Boutons d'action du formulaire.
    this.continueButton = page.locator('[data-test="continue"]');
    this.cancelButton = page.locator('[data-test="cancel"]');

    // Conteneur du message d'erreur.
    this.errorMessage = page.locator('[data-test="error"]');
  }

  // Méthode qui clique sur "Continue".
  // Aucune URL n'est attendue car la méthode sert aux cas positifs et négatifs.
  async clickContinue(): Promise<void> {
    await this.continueButton.click();
  }

  // Méthode qui clique sur "Cancel" et attend le retour sur la page Panier.
  async clickCancel(): Promise<void> {
    await Promise.all([
      this.page.waitForURL('**/cart.html'),
      this.cancelButton.click()
    ]);
  }
}

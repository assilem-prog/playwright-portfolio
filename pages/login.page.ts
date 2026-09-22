import { Locator, Page } from '@playwright/test';

// Cette classe représente la page de connexion SauceDemo.
// Elle regroupe les éléments de la page et les actions réutilisables.
export class LoginPage {

  // Locators des éléments présents sur la page Login.
  readonly usernameInput: Locator;
  readonly passwordInput: Locator;
  readonly loginButton: Locator;
  readonly errorMessage: Locator;

  // Le constructeur reçoit l'objet Page fourni par Playwright.
  // Il permet à cette instance de LoginPage d'utiliser l'onglet navigateur courant.
  constructor(private page: Page) {

    // Champ Username.
    this.usernameInput = page.getByPlaceholder('Username');

    // Champ Password.
    this.passwordInput = page.getByPlaceholder('Password');

    // Bouton Login.
    this.loginButton = page.getByRole('button', { name: 'Login' });

    // Message d'erreur affiché lorsqu'une connexion échoue.
    this.errorMessage = page.locator('[data-test="error"]');
  }

  // Ouvre la page de connexion.
  // "/" utilise la baseURL définie dans playwright.config.ts.
  async goto(): Promise<void> {
    await this.page.goto('/');
  }

  // Réalise l'action de connexion.
  // Les identifiants sont fournis par le test au moment de l'appel.
  async login(username: string, password: string): Promise<void> {

    // Saisir le nom d'utilisateur.
    await this.usernameInput.fill(username);

    // Saisir le mot de passe.
    await this.passwordInput.fill(password);

    // Cliquer sur le bouton Login.
    await this.loginButton.click();
  }
}
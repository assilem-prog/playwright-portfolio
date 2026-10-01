import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/login.page';
import { InventoryPage } from '../pages/inventory.page';
import { CartPage } from '../pages/cart.page';
import { CheckoutInformationPage } from '../pages/checkout-information.page';
import { CheckoutOverviewPage } from '../pages/checkout-overview.page';
import { users } from '../test-data/users';
import { productsToAdd } from '../test-data/products';
import { customerInformation } from '../test-data/checkout';


test.describe('Checkout', () => {

  test.beforeEach(async ({ page }) => {

    // Instancier les Page Objects nécessaires.
    const loginPage = new LoginPage(page);

    await loginPage.goto();

    await loginPage.login(
      users.standard.username,
      users.standard.password
    );
  });


  test('CT01 - [TC01] Démarrer le checkout avec exactement un produit dans le panier', async ({ page }) => {

    const inventoryPage = new InventoryPage(page);
    const cartPage = new CartPage(page);
    const checkoutInformationPage = new CheckoutInformationPage(page);

    // Précondition : le panier contient exactement un produit.
    await inventoryPage.addToCartById(productsToAdd[0].id);

    // Ouvrir le panier.
    await inventoryPage.clickToCart();
    await expect(cartPage.title).toHaveText('Your Cart');
    await expect(cartPage.productItems).toHaveCount(1);

    // Cliquer sur "Checkout".
    await cartPage.clickCheckout();

    // Vérifier que la page Checkout: Your Information est affichée.
    await expect(page).toHaveURL(/checkout-step-one\.html/);
    await expect(checkoutInformationPage.title).toHaveText('Checkout: Your Information');

    // Vérifier que les champs First Name, Last Name et Postal Code sont proposés.
    await expect(checkoutInformationPage.firstNameInput).toBeVisible();
    await expect(checkoutInformationPage.lastNameInput).toBeVisible();
    await expect(checkoutInformationPage.postalCodeInput).toBeVisible();

  });


  test('CT02 - [TC03] Continuer avec tous les champs obligatoires renseignés', async ({ page }) => {

    const inventoryPage = new InventoryPage(page);
    const cartPage = new CartPage(page);
    const checkoutInformationPage = new CheckoutInformationPage(page);
    const checkoutOverviewPage = new CheckoutOverviewPage(page);

    // Précondition : un produit dans le panier et page Checkout: Your Information ouverte.
    await inventoryPage.addToCartById(productsToAdd[0].id);
    await inventoryPage.clickToCart();
    await cartPage.clickCheckout();

    // Renseigner First Name, Last Name et Postal Code.
    await checkoutInformationPage.firstNameInput.fill(customerInformation.firstName);
    await checkoutInformationPage.lastNameInput.fill(customerInformation.lastName);
    await checkoutInformationPage.postalCodeInput.fill(customerInformation.postalCode);

    // Cliquer sur "Continue".
    await checkoutInformationPage.clickContinue();

    // Vérifier que la page Checkout: Overview est affichée (son contenu n'est pas vérifié).
    await expect(page).toHaveURL(/checkout-step-two\.html/);
    await expect(checkoutOverviewPage.title).toHaveText('Checkout: Overview');

  });


  test('CT03 - [TC04] Continuer avec uniquement le prénom vide', async ({ page }) => {

    const inventoryPage = new InventoryPage(page);
    const cartPage = new CartPage(page);
    const checkoutInformationPage = new CheckoutInformationPage(page);

    // Précondition : un produit dans le panier et page Checkout: Your Information ouverte.
    await inventoryPage.addToCartById(productsToAdd[0].id);
    await inventoryPage.clickToCart();
    await cartPage.clickCheckout();

    // Renseigner uniquement Last Name et Postal Code.
    await checkoutInformationPage.lastNameInput.fill(customerInformation.lastName);
    await checkoutInformationPage.postalCodeInput.fill(customerInformation.postalCode);

    // Cliquer sur "Continue".
    await checkoutInformationPage.clickContinue();

    // Vérifier que l'utilisateur reste sur Checkout: Your Information.
    await expect(page).toHaveURL(/checkout-step-one\.html/);
    await expect(checkoutInformationPage.title).toHaveText('Checkout: Your Information');

    // Vérifier qu'un seul message d'erreur est affiché, avec le texte attendu.
    await expect(checkoutInformationPage.errorMessage).toHaveCount(1);
    await expect(checkoutInformationPage.errorMessage).toHaveText('Error: First Name is required');

  });


  test('CT04 - [TC05] Continuer avec uniquement le nom vide', async ({ page }) => {

    const inventoryPage = new InventoryPage(page);
    const cartPage = new CartPage(page);
    const checkoutInformationPage = new CheckoutInformationPage(page);

    // Précondition : un produit dans le panier et page Checkout: Your Information ouverte.
    await inventoryPage.addToCartById(productsToAdd[0].id);
    await inventoryPage.clickToCart();
    await cartPage.clickCheckout();

    // Renseigner uniquement First Name et Postal Code.
    await checkoutInformationPage.firstNameInput.fill(customerInformation.firstName);
    await checkoutInformationPage.postalCodeInput.fill(customerInformation.postalCode);

    // Cliquer sur "Continue".
    await checkoutInformationPage.clickContinue();

    // Vérifier que l'utilisateur reste sur Checkout: Your Information.
    await expect(page).toHaveURL(/checkout-step-one\.html/);
    await expect(checkoutInformationPage.title).toHaveText('Checkout: Your Information');

    // Vérifier qu'un seul message d'erreur est affiché, avec le texte attendu.
    await expect(checkoutInformationPage.errorMessage).toHaveCount(1);
    await expect(checkoutInformationPage.errorMessage).toHaveText('Error: Last Name is required');

  });


  test('CT05 - [TC06] Continuer avec uniquement le code postal vide', async ({ page }) => {

    const inventoryPage = new InventoryPage(page);
    const cartPage = new CartPage(page);
    const checkoutInformationPage = new CheckoutInformationPage(page);

    // Précondition : un produit dans le panier et page Checkout: Your Information ouverte.
    await inventoryPage.addToCartById(productsToAdd[0].id);
    await inventoryPage.clickToCart();
    await cartPage.clickCheckout();

    // Renseigner uniquement First Name et Last Name.
    await checkoutInformationPage.firstNameInput.fill(customerInformation.firstName);
    await checkoutInformationPage.lastNameInput.fill(customerInformation.lastName);

    // Cliquer sur "Continue".
    await checkoutInformationPage.clickContinue();

    // Vérifier que l'utilisateur reste sur Checkout: Your Information.
    await expect(page).toHaveURL(/checkout-step-one\.html/);
    await expect(checkoutInformationPage.title).toHaveText('Checkout: Your Information');

    // Vérifier qu'un seul message d'erreur est affiché, avec le texte attendu.
    await expect(checkoutInformationPage.errorMessage).toHaveCount(1);
    await expect(checkoutInformationPage.errorMessage).toHaveText('Error: Postal Code is required');

  });


  test('CT06 - [TC08] Annuler sans saisie ramène au panier inchangé', async ({ page }) => {

    const inventoryPage = new InventoryPage(page);
    const cartPage = new CartPage(page);
    const checkoutInformationPage = new CheckoutInformationPage(page);

    // Précondition : le panier contient plusieurs produits différents.
    for (const product of productsToAdd) {
      await inventoryPage.addToCartById(product.id);
    }

    // Ouvrir le panier.
    await inventoryPage.clickToCart();
    await expect(cartPage.title).toHaveText('Your Cart');

    // Mémoriser le contenu du panier (nom et quantité par ID technique) avant le checkout.
    const recordedItemCount = await cartPage.productItems.count();
    const cartReferences: { id: string; name: string; quantity: string }[] = [];

    for (const product of productsToAdd) {
      const name = await cartPage.getProductNameById(product.id).innerText();
      const quantity = await cartPage.getProductQuantityById(product.id).innerText();
      cartReferences.push({ id: product.id, name, quantity });
    }

    // Cliquer sur "Checkout" et vérifier que la page Checkout: Your Information est affichée.
    await cartPage.clickCheckout();
    await expect(checkoutInformationPage.title).toHaveText('Checkout: Your Information');

    // Cliquer sur "Cancel" sans saisir d'information.
    await checkoutInformationPage.clickCancel();

    // Vérifier que le panier est affiché.
    await expect(page).toHaveURL(/cart\.html/);
    await expect(cartPage.title).toHaveText('Your Cart');

    // Vérifier que le panier contient les mêmes produits et quantités qu'avant le checkout.
    await expect(cartPage.productItems).toHaveCount(recordedItemCount);

    for (const product of cartReferences) {
      await expect(cartPage.getProductNameById(product.id)).toHaveText(product.name);
      await expect(cartPage.getProductQuantityById(product.id)).toHaveText(product.quantity);
    }

  });

});

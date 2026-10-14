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

    await test.step('Préparer un panier contenant un seul produit', async () => {

      // Ajouter un produit au panier
      await inventoryPage.addToCartById(productsToAdd[0].id);

    });

    await test.step('Ouvrir le panier et vérifier qu’il contient un seul produit', async () => {

      // Ouvrir le panier
      await inventoryPage.clickToCart();

      // Vérifier que la page panier est affichée
      await expect(cartPage.title).toHaveText('Your Cart');

      // Vérifier que le panier contient exactement un produit
      await expect(cartPage.productItems).toHaveCount(1);

    });

    await test.step('Accéder au formulaire Checkout', async () => {

      // Cliquer sur Checkout
      await cartPage.clickCheckout();

      // Vérifier la navigation vers le formulaire
      await expect(page).toHaveURL(/checkout-step-one\.html/);

      // Vérifier le titre de la page
      await expect(checkoutInformationPage.title).toHaveText('Checkout: Your Information');

    });

    await test.step('Vérifier la présence des trois champs du formulaire', async () => {

      // Vérifier que le champ First Name est visible
      await expect(checkoutInformationPage.firstNameInput).toBeVisible();

      // Vérifier que le champ Last Name est visible
      await expect(checkoutInformationPage.lastNameInput).toBeVisible();

      // Vérifier que le champ Postal Code est visible
      await expect(checkoutInformationPage.postalCodeInput).toBeVisible();

    });

  });


  test('CT02 - [TC03] Continuer avec tous les champs obligatoires renseignés', async ({ page }) => {

    const inventoryPage = new InventoryPage(page);
    const cartPage = new CartPage(page);
    const checkoutInformationPage = new CheckoutInformationPage(page);
    const checkoutOverviewPage = new CheckoutOverviewPage(page);

    await test.step('Préparer le panier et accéder au formulaire Checkout', async () => {

      // Ajouter un produit au panier
      await inventoryPage.addToCartById(productsToAdd[0].id);

      // Ouvrir le panier
      await inventoryPage.clickToCart();

      // Accéder au formulaire Checkout
      await cartPage.clickCheckout();

    });

    await test.step('Renseigner les trois champs obligatoires', async () => {

      // Renseigner le prénom
      await checkoutInformationPage.firstNameInput.fill(customerInformation.firstName);

      // Renseigner le nom
      await checkoutInformationPage.lastNameInput.fill(customerInformation.lastName);

      // Renseigner le code postal
      await checkoutInformationPage.postalCodeInput.fill(customerInformation.postalCode);

    });

    await test.step('Valider le formulaire et vérifier l’accès à Checkout: Overview', async () => {

      // Cliquer sur Continue
      await checkoutInformationPage.clickContinue();

      // Vérifier la navigation vers Checkout: Overview
      await expect(page).toHaveURL(/checkout-step-two\.html/);

      // Vérifier le titre de la page
      await expect(checkoutOverviewPage.title).toHaveText('Checkout: Overview');

    });

  });


  test('CT03 - [TC04] Continuer avec uniquement le prénom vide', async ({ page }) => {

    const inventoryPage = new InventoryPage(page);
    const cartPage = new CartPage(page);
    const checkoutInformationPage = new CheckoutInformationPage(page);

    await test.step('Préparer le panier et accéder au formulaire Checkout', async () => {

      // Ajouter un produit au panier
      await inventoryPage.addToCartById(productsToAdd[0].id);

      // Ouvrir le panier
      await inventoryPage.clickToCart();

      // Accéder au formulaire Checkout
      await cartPage.clickCheckout();

    });

    await test.step('Renseigner le nom et le code postal en laissant le prénom vide', async () => {

      // Renseigner le nom
      await checkoutInformationPage.lastNameInput.fill(customerInformation.lastName);

      // Renseigner le code postal
      await checkoutInformationPage.postalCodeInput.fill(customerInformation.postalCode);

    });

    await test.step('Vérifier le refus de validation et le message d’erreur du prénom obligatoire', async () => {

      // Cliquer sur Continue
      await checkoutInformationPage.clickContinue();

      // Vérifier que l'utilisateur reste sur le formulaire
      await expect(page).toHaveURL(/checkout-step-one\.html/);

      // Vérifier le titre de la page
      await expect(checkoutInformationPage.title).toHaveText('Checkout: Your Information');

      // Vérifier qu'un seul message d'erreur est affiché
      await expect(checkoutInformationPage.errorMessage).toHaveCount(1);

      // Vérifier le texte du message d'erreur
      await expect(checkoutInformationPage.errorMessage).toHaveText('Error: First Name is required');

    });

  });


  test('CT04 - [TC05] Continuer avec uniquement le nom vide', async ({ page }) => {

    const inventoryPage = new InventoryPage(page);
    const cartPage = new CartPage(page);
    const checkoutInformationPage = new CheckoutInformationPage(page);

    await test.step('Préparer le panier et accéder au formulaire Checkout', async () => {

      // Ajouter un produit au panier
      await inventoryPage.addToCartById(productsToAdd[0].id);

      // Ouvrir le panier
      await inventoryPage.clickToCart();

      // Accéder au formulaire Checkout
      await cartPage.clickCheckout();

    });

    await test.step('Renseigner le prénom et le code postal en laissant le nom vide', async () => {

      // Renseigner le prénom
      await checkoutInformationPage.firstNameInput.fill(customerInformation.firstName);

      // Renseigner le code postal
      await checkoutInformationPage.postalCodeInput.fill(customerInformation.postalCode);

    });

    await test.step('Vérifier le refus de validation et le message d’erreur du nom obligatoire', async () => {

      // Cliquer sur Continue
      await checkoutInformationPage.clickContinue();

      // Vérifier que l'utilisateur reste sur le formulaire
      await expect(page).toHaveURL(/checkout-step-one\.html/);

      // Vérifier le titre de la page
      await expect(checkoutInformationPage.title).toHaveText('Checkout: Your Information');

      // Vérifier qu'un seul message d'erreur est affiché
      await expect(checkoutInformationPage.errorMessage).toHaveCount(1);

      // Vérifier le texte du message d'erreur
      await expect(checkoutInformationPage.errorMessage).toHaveText('Error: Last Name is required');

    });

  });


  test('CT05 - [TC06] Continuer avec uniquement le code postal vide', async ({ page }) => {

    const inventoryPage = new InventoryPage(page);
    const cartPage = new CartPage(page);
    const checkoutInformationPage = new CheckoutInformationPage(page);

    await test.step('Préparer le panier et accéder au formulaire Checkout', async () => {

      // Ajouter un produit au panier
      await inventoryPage.addToCartById(productsToAdd[0].id);

      // Ouvrir le panier
      await inventoryPage.clickToCart();

      // Accéder au formulaire Checkout
      await cartPage.clickCheckout();

    });

    await test.step('Renseigner le prénom et le nom en laissant le code postal vide', async () => {

      // Renseigner le prénom
      await checkoutInformationPage.firstNameInput.fill(customerInformation.firstName);

      // Renseigner le nom
      await checkoutInformationPage.lastNameInput.fill(customerInformation.lastName);

    });

    await test.step('Vérifier le refus de validation et le message d’erreur du code postal obligatoire', async () => {

      // Cliquer sur Continue
      await checkoutInformationPage.clickContinue();

      // Vérifier que l'utilisateur reste sur le formulaire
      await expect(page).toHaveURL(/checkout-step-one\.html/);

      // Vérifier le titre de la page
      await expect(checkoutInformationPage.title).toHaveText('Checkout: Your Information');

      // Vérifier qu'un seul message d'erreur est affiché
      await expect(checkoutInformationPage.errorMessage).toHaveCount(1);

      // Vérifier le texte du message d'erreur
      await expect(checkoutInformationPage.errorMessage).toHaveText('Error: Postal Code is required');

    });

  });


  test('CT06 - [TC08] Annuler sans saisie ramène au panier inchangé', async ({ page }) => {

    const inventoryPage = new InventoryPage(page);
    const cartPage = new CartPage(page);
    const checkoutInformationPage = new CheckoutInformationPage(page);

    await test.step('Ajouter plusieurs produits différents au panier', async () => {

      // Ajouter chaque produit défini dans les données de test
      for (const product of productsToAdd) {
        await inventoryPage.addToCartById(product.id);
      }

    });

    await test.step('Ouvrir le panier et vérifier son affichage', async () => {

      // Ouvrir le panier
      await inventoryPage.clickToCart();

      // Vérifier que la page panier est affichée
      await expect(cartPage.title).toHaveText('Your Cart');

    });

    // Mémoriser le contenu du panier (nom et quantité par ID technique) avant le checkout.
    const recordedItemCount = await cartPage.productItems.count();
    const cartReferences: { id: string; name: string; quantity: string }[] = [];

    await test.step('Mémoriser le nom et la quantité de chaque produit avant le Checkout', async () => {

      for (const product of productsToAdd) {

        // Récupérer le nom du produit
        const name = await cartPage.getProductNameById(product.id).innerText();

        // Récupérer la quantité du produit
        const quantity = await cartPage.getProductQuantityById(product.id).innerText();

        // Enregistrer les informations du produit
        cartReferences.push({ id: product.id, name, quantity });

      }

    });

    await test.step('Accéder au formulaire Checkout et vérifier son affichage', async () => {

      // Cliquer sur Checkout
      await cartPage.clickCheckout();

      // Vérifier que le formulaire Checkout est affiché
      await expect(checkoutInformationPage.title).toHaveText('Checkout: Your Information');

    });

    await test.step('Annuler le Checkout et vérifier le retour au panier', async () => {

      // Cliquer sur Cancel sans renseigner le formulaire
      await checkoutInformationPage.clickCancel();

      // Vérifier que l'utilisateur revient sur la page panier
      await expect(page).toHaveURL(/cart\.html/);

      // Vérifier le titre de la page
      await expect(cartPage.title).toHaveText('Your Cart');

    });

    await test.step('Vérifier que le nombre de produits est inchangé après annulation', async () => {

      // Comparer le nombre de produits avec celui mémorisé avant le Checkout
      await expect(cartPage.productItems).toHaveCount(recordedItemCount);

    });

    for (const product of cartReferences) {

      await test.step(`Vérifier le nom et la quantité après annulation : ${product.name}`, async () => {

        // Vérifier que le nom du produit est inchangé
        await expect(cartPage.getProductNameById(product.id)).toHaveText(product.name);

        // Vérifier que la quantité du produit est inchangée
        await expect(cartPage.getProductQuantityById(product.id)).toHaveText(product.quantity);

      });

    }

  });

});

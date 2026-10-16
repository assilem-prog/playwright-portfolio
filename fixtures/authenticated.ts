import { test as base, expect, type Page } from '@playwright/test';
import { LoginPage } from '../pages/login.page';
import { users } from '../test-data/users';

export const test = base.extend<{ authenticatedPage: Page }>({
    authenticatedPage: async ({ page }, use) => {

        //console.log('FIXTURE : authentification déclenchée');

        const loginPage = new LoginPage(page); //crée une instance de notre POM Login.
        await loginPage.goto(); //ouvre la page de connexion SauceDemo.
        await loginPage.login(users.standard.username, users.standard.password); //renseigne les identifiants de standard_user et clique sur Login.

        await expect(page).toHaveURL(/inventory\.html/); //permet de vérifier que la navigation attendue a bien eu lieu.

        await use(page);

    },
});

export { expect };
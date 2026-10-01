# Playwright QA Portfolio

[English](#english) | [Français](#français)

QA automation portfolio built with **Playwright + TypeScript** on SauceDemo.

The project demonstrates:

- functional E2E automation
- Page Object Model
- reusable test data
- cross-browser execution
- functional traceability
- AI-assisted QA workflows with mandatory human validation

---

# English

## Overview

This repository is a QA automation portfolio built on the SauceDemo e-commerce application.

It currently includes **19 automated scenarios**, executed on Chromium and Firefox.

Latest complete local regression run:

```text
38 passed
```

## Automated coverage

The portfolio covers:

- authentication: successful login and locked-out user
- product catalogue: display, product information and sorting
- cart: add, remove and validate multiple products
- checkout:
  - start checkout
  - valid customer information
  - mandatory field validation
  - cancel checkout
  - cart preservation after cancellation

## Architecture

```text
playwright-portfolio/
├── .claude/
│   ├── agents/
│   └── skills/
├── pages/
├── test-data/
├── tests/
├── playwright.config.ts
└── tsconfig.json
```

Main responsibilities:

```text
pages/      → locators and reusable actions
test-data/  → reusable test data
tests/      → scenarios and assertions
.claude/    → AI-assisted QA agents and workflows
```

The project follows a **Page Object Model** architecture to keep page actions separate from test scenarios and assertions.

## Functional traceability

Automated Checkout tests keep a link to their functional test cases.

Example:

```text
CT01 - [TC01] Start checkout with exactly one product in the cart
```

- `CT01` = automated test identifier
- `[TC01]` = functional test case identifier

## AI-assisted QA workflow

The repository also contains custom QA agents used through Claude Code.

The workflow separates responsibilities between:

```text
Requirement analysis
        ↓
Functional test design
        ↓
Automation coverage analysis
        ↓
HUMAN automation decision
        ↓
Read-only implementation planning
        ↓
HUMAN plan approval
        ↓
Playwright implementation
        ↓
Targeted execution and report
```

Five specialized agents are used:

```text
qa-story-analyst
qa-test-designer
qa-automation-analyst
qa-playwright-planner
qa-playwright-engineer
```

The Planner is read-only.

The Engineer can modify the repository only after the implementation plan and automation scope have been explicitly approved.

This keeps business and technical decisions under human control.

## Example: Checkout automation

The Checkout workflow was used to validate the complete process.

Functional analysis produced 12 test cases.

After coverage analysis and human review, six were selected for automation.

The approved implementation created or modified only:

```text
pages/cart.page.ts
pages/checkout-information.page.ts
pages/checkout-overview.page.ts
test-data/checkout.ts
tests/checkout.spec.ts
```

The complete test suite was then executed successfully:

```text
38 passed
```

## Run the project

Install dependencies:

```bash
npm install
npx playwright install
```

Run all tests:

```bash
npx playwright test
```

Run Checkout only:

```bash
npx playwright test tests/checkout.spec.ts
```

Open the HTML report:

```bash
npx playwright show-report
```

## Tech stack

Playwright · TypeScript · Node.js · Page Object Model · Git · GitHub · VS Code · Claude Code

---

# Français

## Présentation

Ce repository est un portfolio d’automatisation QA construit avec **Playwright et TypeScript** sur l’application e-commerce de démonstration SauceDemo.

Il contient actuellement **19 scénarios automatisés**, exécutés sur Chromium et Firefox.

Dernière exécution complète locale :

```text
38 passed
```

## Couverture automatisée

Le portfolio couvre :

- authentification : connexion valide et utilisateur bloqué
- catalogue : affichage, informations produits et tris
- panier : ajout, suppression et contrôle de plusieurs produits
- checkout :
  - démarrage du checkout
  - saisie valide
  - validation des champs obligatoires
  - annulation
  - conservation du panier après annulation

## Architecture

```text
playwright-portfolio/
├── .claude/
│   ├── agents/
│   └── skills/
├── pages/
├── test-data/
├── tests/
├── playwright.config.ts
└── tsconfig.json
```

Répartition principale :

```text
pages/      → locators et actions réutilisables
test-data/  → données de test
tests/      → scénarios et assertions
.claude/    → agents et workflows QA assistés par IA
```

Le projet utilise le **Page Object Model** pour séparer les responsabilités entre les écrans, les données de test et les scénarios automatisés.

## Traçabilité fonctionnelle

Les tests Checkout gardent une correspondance avec les cas de test fonctionnels.

Exemple :

```text
CT01 - [TC01] Démarrer le checkout avec exactement un produit
```

- `CT01` = identifiant du test automatisé
- `[TC01]` = identifiant du cas fonctionnel

## Workflow QA assisté par IA

Le repository contient également une chaîne QA multi-agents utilisée avec Claude Code.

```text
Analyse du besoin
        ↓
Conception des cas de test
        ↓
Analyse de couverture
        ↓
VALIDATION HUMAINE
décision d’automatisation
        ↓
Planification technique read-only
        ↓
VALIDATION HUMAINE
du plan
        ↓
Implémentation Playwright
        ↓
Exécution ciblée et rapport
```

Les cinq agents sont :

```text
qa-story-analyst
qa-test-designer
qa-automation-analyst
qa-playwright-planner
qa-playwright-engineer
```

Le Planner peut lire le repository mais pas le modifier.

L’Engineer ne peut intervenir qu’après validation explicite du périmètre d’automatisation et du plan technique.

L’objectif est d’utiliser l’IA comme assistance QA sans lui déléguer les décisions métier ou techniques importantes.

## Exemple Checkout

Le workflow complet a été testé sur une User Story Checkout.

L’analyse fonctionnelle a produit 12 cas de test.

Après revue humaine, six ont été retenus pour l’automatisation.

L’implémentation approuvée a uniquement concerné :

```text
pages/cart.page.ts
pages/checkout-information.page.ts
pages/checkout-overview.page.ts
test-data/checkout.ts
tests/checkout.spec.ts
```

La non-régression complète a ensuite été exécutée avec succès :

```text
38 passed
```

## Exécuter le projet

Installer les dépendances :

```bash
npm install
npx playwright install
```

Exécuter tous les tests :

```bash
npx playwright test
```

Exécuter Checkout :

```bash
npx playwright test tests/checkout.spec.ts
```

Afficher le rapport HTML :

```bash
npx playwright show-report
```

## Stack technique

Playwright · TypeScript · Node.js · Page Object Model · Git · GitHub · VS Code · Claude Code
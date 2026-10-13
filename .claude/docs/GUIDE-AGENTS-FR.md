# Guide des agents QA — version française

Ce document explique, en français, le rôle des agents et des Skills utilisés dans le portfolio Playwright.

Les fichiers opérationnels présents dans `.claude/agents/` et `.claude/skills/` restent en anglais.  
Ce guide sert uniquement de documentation pédagogique : il ne remplace pas leurs instructions réelles.

---

## 1. Vue d’ensemble

Le projet utilise cinq agents QA spécialisés et deux Skills d’orchestration.

```text
US / Exigence
    ↓
qa-story-analyst
    ↓
STOP HUMAIN : clarification PO / BA
    ↓
qa-test-designer
    ↓
qa-automation-analyst
    ↓
STOP HUMAIN : décision d’automatisation
    ↓
qa-playwright-planner
    ↓
STOP HUMAIN : validation du plan
    ↓
qa-playwright-engineer
    ↓
Implémentation + exécution ciblée + rapport
```

L’objectif n’est pas de laisser l’IA décider seule.

Le workflow sépare volontairement :
- l’analyse fonctionnelle ;
- la conception des tests ;
- l’analyse de couverture ;
- la décision d’automatisation ;
- la planification technique ;
- l’implémentation Playwright.

Des checkpoints humains sont imposés dès qu’une décision métier ou technique importante doit être prise.

---

# 2. Les cinq agents

## 2.1 `qa-story-analyst`

### À quoi sert-il ?

Analyser une User Story, une exigence ou des critères d’acceptation avant la rédaction détaillée des cas de test.

### Ce qu’il fait

Il identifie notamment :
- les règles métier explicitement écrites ;
- la testabilité du besoin ;
- les ambiguïtés ;
- les informations manquantes ;
- les contradictions éventuelles ;
- les risques et cas limites ;
- les questions à poser au PO / BA ;
- des scénarios de test de haut niveau.

### Ce qu’il ne fait pas

Il ne doit pas :
- inventer une règle métier absente ;
- répondre lui-même aux questions destinées au PO / BA ;
- transformer une hypothèse en comportement attendu ;
- rédiger les cas de test détaillés ;
- écrire du code Playwright ;
- modifier le repository.

### Outils

```text
Read
```

### Sortie attendue

Le rapport est structuré autour de :
- Requirement summary
- Testability
- Explicit business rules
- Acceptance criteria review
- Missing information / ambiguities
- Questions for PO / BA
- Risks and edge cases
- Proposed test scenarios

### Pourquoi cet agent est important

Une erreur à cette étape peut contaminer tout le reste de la chaîne.

Si une règle métier est inventée ici, le `qa-test-designer` peut ensuite rédiger un mauvais cas de test, puis l’automatisation peut implémenter proprement… le mauvais comportement.

---

## 2.2 `qa-test-designer`

### À quoi sert-il ?

Transformer des exigences clarifiées en cas de test fonctionnels détaillés et déterministes.

### Ce qu’il fait

Pour chaque cas de test, il peut définir :
- l’objectif ;
- la couverture fonctionnelle ;
- la nature du test ;
- les préconditions ;
- les données de test ;
- les étapes ;
- les résultats attendus ;
- les hypothèses éventuelles.

Il distingue :
- les tests basés sur les exigences ;
- les tests orientés risque.

### Ce qu’il ne fait pas

Il ne doit pas :
- inventer une règle métier ;
- résoudre silencieusement une ambiguïté ;
- écrire du Playwright ;
- décider quels tests doivent être automatisés ;
- inspecter le code pour adapter le besoin à l’existant.

### Outils

```text
Read
```

### Principe important

Un résultat attendu doit pouvoir être déduit du besoin validé.

Si le comportement attendu n’est pas connu, le cas doit rester bloqué ou être présenté comme hypothétique selon les règles prévues.

---

## 2.3 `qa-automation-analyst`

### À quoi sert-il ?

Comparer les cas de test fonctionnels validés avec l’automatisation Playwright déjà présente dans le repository.

### Ce qu’il fait

Il inspecte principalement :
- `tests/`
- `pages/`
- `test-data/`

Il classe ensuite chaque cas de test avec un statut de couverture :

```text
Full
Partial
Not
```

Il peut aussi signaler séparément un risque de duplication entre plusieurs tests automatisés.

### Ce qui compte comme preuve de couverture

La couverture doit être démontrée par des assertions exécutables.

Exemple :

```typescript
await expect(inventoryPage.shoppingCartBadge).toHaveText('1');
```

Cette assertion prouve qu’un résultat attendu est vérifié.

En revanche, les éléments suivants ne prouvent pas une couverture :

```typescript
await inventoryPage.addToCartById(productId);
console.log(productName);
```

Un clic, une méthode de Page Object, une variable, un titre de test ou un `console.log()` ne sont pas des assertions.

### Ce qu’il ne fait pas

Il ne doit pas :
- modifier le repository ;
- exécuter Playwright ;
- écrire de nouveaux tests ;
- décider qu’un gap doit automatiquement être automatisé.

### Outils

```text
Read
Glob
Grep
```

### Principe important

```text
Not covered ≠ Automatically approved for automation
```

La décision d’automatisation appartient à l’humain.

---

## 2.4 `qa-playwright-planner`

### À quoi sert-il ?

Préparer le plan technique d’implémentation pour les seuls cas de test explicitement approuvés pour automatisation.

### Ce qu’il analyse

Il peut rechercher :
- les tests existants à réutiliser ;
- les Page Objects déjà disponibles ;
- les méthodes existantes ;
- les données de test réutilisables ;
- les fichiers réellement nécessaires ;
- les risques ou blockers techniques.

### Ce qu’il produit

Son plan précise notamment :
- le périmètre exact ;
- les composants existants à réutiliser ;
- les fichiers à créer ou modifier ;
- les nouveaux contrôles automatisés ;
- les risques ou blockers.

### Ce qu’il ne fait pas

Le Planner est volontairement **read-only**.

Il ne doit pas :
- créer de fichier ;
- modifier de fichier ;
- exécuter Playwright ;
- installer de dépendance ;
- choisir de nouveaux cas de test ;
- élargir le scope approuvé.

### Outils

```text
Read
Glob
Grep
```

### Pourquoi cette séparation est importante

L’agent qui propose le plan n’a techniquement pas les outils nécessaires pour modifier le repository.

Cela crée une vraie barrière entre :

```text
PLANIFIER
```

et :

```text
AGIR
```

Le plan doit ensuite être approuvé explicitement par l’humain.

---

## 2.5 `qa-playwright-engineer`

### À quoi sert-il ?

Implémenter uniquement le plan Playwright explicitement approuvé.

### Conditions obligatoires avant activation

L’orchestration doit lui transmettre :
1. la phrase exacte :

```text
IMPLEMENTATION APPROVED
```

2. les cas de test fonctionnels autorisés ;
3. leurs résultats attendus ;
4. le plan technique complet approuvé par l’humain.

Si l’un de ces éléments manque, l’Engineer doit s’arrêter.

### Ce qu’il peut faire

Il peut :
- inspecter les fichiers nécessaires ;
- créer ou modifier les fichiers prévus dans le plan ;
- ajouter ou adapter des Page Objects ;
- ajouter des données de test ;
- écrire les tests Playwright approuvés ;
- exécuter le périmètre ciblé ;
- corriger un défaut d’automatisation dans le scope ;
- réexécuter les tests concernés ;
- produire un rapport d’implémentation.

### Ce qu’il ne doit pas faire

Il ne doit pas :
- automatiser un cas non approuvé ;
- élargir le scope fonctionnel ;
- modifier une règle métier ;
- affaiblir un résultat attendu ;
- supprimer un test existant sans validation ;
- effectuer un refactoring sans rapport avec le plan ;
- installer une nouvelle dépendance sans autorisation ;
- exécuter inutilement toute la suite si un run ciblé suffit ;
- commit ou push automatiquement.

### Outils

```text
Read
Glob
Grep
Write
Edit
Bash
```

### En cas de déviation du plan

Si l’implémentation révèle qu’il faut modifier matériellement le plan approuvé, l’Engineer ne doit pas improviser.

Le workflow redevient :

```text
Engineer
    ↓
STOP
    ↓
Planner
    ↓
plan révisé
    ↓
STOP HUMAIN
    ↓
nouvelle approbation
```

---

# 3. Les deux Skills

## 3.1 `qa-workflow`

### Rôle

Orchestrer la chaîne fonctionnelle, depuis l’analyse du besoin jusqu’à la décision d’automatisation.

### Workflow

```text
US / exigences
    ↓
qa-story-analyst
    ↓
STOP HUMAIN : réponses PO / BA
    ↓
qa-test-designer
    ↓
qa-automation-analyst
    ↓
STOP HUMAIN : décision d’automatisation
    ↓
FIN
```

### Pourquoi le workflow s’arrête ici

Le Skill ne doit pas décider lui-même :
- quels gaps doivent être automatisés ;
- quels tests sont prioritaires ;
- quels tests doivent rester manuels.

L’automatisation commence seulement après une décision humaine explicite.

---

## 3.2 `qa-automation-implementation`

### Rôle

Orchestrer la planification technique et l’implémentation Playwright pour un scope déjà approuvé.

### Workflow

```text
Cas de test approuvés
    ↓
qa-playwright-planner
    ↓
plan complet
    ↓
STOP HUMAIN : approbation du plan
    ↓
IMPLEMENTATION APPROVED
    ↓
qa-playwright-engineer
    ↓
implémentation
    ↓
exécution ciblée
    ↓
rapport
    ↓
FIN
```

### Principe important

Le plan présenté à l’utilisateur doit être le même plan que celui transmis ensuite à l’Engineer.

Il ne doit pas être résumé, reconstruit ou réinterprété entre l’approbation et l’implémentation.

---

# 4. Les checkpoints humains

Le projet utilise plusieurs arrêts obligatoires.

## Checkpoint 1 — Clarification métier

Après `qa-story-analyst`.

Objectif :
- empêcher l’IA d’inventer les réponses aux ambiguïtés qu’elle vient d’identifier.

## Checkpoint 2 — Décision d’automatisation

Après `qa-automation-analyst`.

Objectif :
- éviter de transformer automatiquement chaque gap de couverture en nouveau test Playwright.

## Checkpoint 3 — Validation du plan technique

Après `qa-playwright-planner`.

Objectif :
- vérifier les fichiers proposés ;
- confirmer que le plan reste minimal ;
- contrôler qu’aucun cas non approuvé n’a été ajouté ;
- empêcher toute modification du repository avant validation.

---

# 5. Exemple réel : Checkout SauceDemo

Le workflow complet a été utilisé sur une User Story Checkout.

L’analyse et la conception ont produit 12 cas de test.

Après décision humaine, seulement six cas ont été approuvés pour la première automatisation :

```text
TC01
TC03
TC04
TC05
TC06
TC08
```

Le Planner a proposé exactement cinq changements :

```text
Modify:
pages/cart.page.ts

Create:
pages/checkout-information.page.ts
pages/checkout-overview.page.ts
test-data/checkout.ts
tests/checkout.spec.ts
```

Après approbation humaine, l’Engineer a implémenté ces six scénarios.

La traçabilité a été conservée dans les titres :

```text
CT01 - [TC01] ...
CT02 - [TC03] ...
CT03 - [TC04] ...
CT04 - [TC05] ...
CT05 - [TC06] ...
CT06 - [TC08] ...
```

La suite complète du portfolio a ensuite été exécutée manuellement :

```text
38 passed
```

---

# 6. Principes de conception du workflow

## Ne pas confondre assistance et décision

L’IA peut :
- analyser ;
- signaler ;
- proposer ;
- comparer ;
- planifier ;
- implémenter dans un cadre approuvé.

L’humain conserve :
- la clarification métier ;
- la décision d’automatisation ;
- l’approbation du plan technique ;
- la décision de commit / push.

## Réduire les permissions

Tous les agents n’ont pas besoin des mêmes outils.

Exemple :

```text
Planner
→ Read / Glob / Grep

Engineer
→ Read / Glob / Grep / Write / Edit / Bash
```

Le principe est d’accorder uniquement les permissions nécessaires au rôle.

## Préserver le scope

Un agent ne doit pas considérer qu’une bonne idée technique est automatiquement autorisée.

Le scope approuvé reste la référence.

## Préférer les preuves aux intentions

Un titre de test ou une méthode POM indique ce qu’un test semble vouloir faire.

Une assertion montre ce qu’il vérifie réellement.

---

# 7. Glossaire rapide

### Agent

Spécialiste IA configuré avec un rôle, des instructions et des outils autorisés.

### Skill

Workflow réutilisable chargé d’orchestrer plusieurs agents ou étapes.

### Guardrail

Règle qui limite ce qu’un agent peut décider ou exécuter.

### Human checkpoint

Arrêt obligatoire nécessitant une décision humaine avant de poursuivre.

### Scope

Périmètre explicitement autorisé.

### POM

Page Object Model : architecture qui centralise les éléments et actions réutilisables d’un écran.

### Assertion

Vérification explicite d’un résultat attendu avec Playwright, généralement via `expect()`.

### Automation coverage

Correspondance entre les comportements fonctionnels attendus et les assertions déjà présentes dans l’automatisation.

---

# 8. Résumé

La logique générale du projet peut être résumée ainsi :

```text
L’IA analyse
↓
l’humain clarifie

L’IA conçoit
↓
l’humain décide quoi automatiser

L’IA planifie
↓
l’humain approuve

L’IA implémente
↓
Playwright vérifie
↓
l’humain garde le contrôle du repository
```

Les fichiers opérationnels en anglais restent la source de vérité pour les agents et les Skills.

Ce guide français sert à comprendre rapidement leur rôle, leurs limites et la logique d’orchestration du projet.

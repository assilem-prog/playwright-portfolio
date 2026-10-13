# Guide des agents QA — version française

Ce document explique, en français, le rôle des agents et des Skills utilisés dans le portfolio Playwright.

Les fichiers opérationnels présents dans `.claude/agents/` et `.claude/skills/` restent en anglais.

Ce guide sert uniquement de documentation pédagogique : il ne remplace pas leurs instructions réelles.

En cas de doute ou de divergence, **les fichiers des agents et des Skills font foi**.

## Sommaire

1. Vue d’ensemble
2. Les sept agents
3. Articulation des sept agents
4. Les deux Skills
5. Les checkpoints humains et les limites des agents
6. Exemples réels
7. Guide pratique : quel agent utiliser ?
8. Principes de conception du workflow
9. Glossaire rapide
10. Résumé

---

# 1. Vue d’ensemble

Le projet utilise **sept agents QA spécialisés** et **deux Skills d’orchestration**.

Cinq agents forment le parcours « de l’exigence au test automatisé ».

Deux agents interviennent **à la demande**, en dehors de ce parcours :

- `qa-app-explorer` : exploration fonctionnelle de l’application avec Playwright MCP ;
- `qa-test-executor` : campagnes d’exécution indépendantes sur des tests automatisés existants.

```text
PARCOURS « EXIGENCE → AUTOMATISATION »

US / Exigence
    ↓
qa-story-analyst
    ↓
STOP HUMAIN 1 : clarification PO / BA
    ↓
qa-test-designer
    ↓
qa-automation-analyst
    ↓
STOP HUMAIN 2 : décision d’automatisation
    ↓
qa-playwright-planner
    ↓
STOP HUMAIN 3 : validation du plan (IMPLEMENTATION APPROVED)
    ↓
qa-playwright-engineer
    ↓
Implémentation + exécution ciblée de vérification + rapport
    ↓
STOP HUMAIN 6 : décisions Git (commit, push, merge)


AGENTS À LA DEMANDE (utilisables à tout moment, sur décision humaine)

qa-app-explorer
    Exploration de l’application livrée → rapport d’observations
    (aucun test écrit, aucun fichier modifié)

qa-test-executor
    PREPARATION
        ↓
    STOP HUMAIN 4 : autorisation de prévisualisation (PREVIEW APPROVED)
        ↓
    PREVIEW (--list)
        ↓
    STOP HUMAIN 5 : validation de la sélection + autorisation d’exécution (EXECUTION APPROVED)
        ↓
    EXECUTION
        ↓
    REPORT
```

L’objectif n’est pas de laisser l’IA décider seule.

Le workflow sépare volontairement :
- l’analyse des exigences ;
- la conception des cas de test ;
- l’exploration de l’application ;
- l’analyse de couverture automatisée ;
- la décision d’automatisation ;
- la planification technique ;
- le développement des tests ;
- l’exécution indépendante et le reporting.

Des checkpoints humains sont imposés dès qu’une décision métier ou technique importante doit être prise.

> Le schéma n’est pas une chaîne obligatoire : on peut entrer dans le parcours à l’étape qui correspond au besoin (voir sections 3 et 7).

---

# 2. Les sept agents

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
- les tests orientés risque ;
- les cas bloqués par une exigence non clarifiée.

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
Fully covered
Partially covered
Not covered
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

Il se termine toujours par un point d’arrêt : aucune implémentation ne commence sans approbation humaine.

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
- exécuter le périmètre ciblé **pour vérifier sa propre implémentation** ;
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
- exécuter des tests hors du périmètre approuvé sans nouvel accord ;
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

## 2.6 `qa-app-explorer`

### À quoi sert-il ?

Explorer une application web **réellement livrée** à travers un navigateur, observer son comportement, investiguer les résultats inattendus et rapporter des preuves à une QA humaine.

Il complète les tests fonctionnels manuels ; il ne les remplace pas.

### Quand l’utiliser ?

À la demande, par exemple :
- après une première prise en main manuelle d’une fonctionnalité ;
- pendant une phase de tests fonctionnels ;
- pour investiguer un défaut suspecté ;
- pour caractériser le comportement d’un écran quand aucune User Story n’existe.

Une User Story formelle n’est pas obligatoire. Sans exigence fournie, l’agent fait une **exploration de caractérisation** et ne rapporte que des observations.

Il a besoin d’une URL, d’un environnement **autorisé** et d’un objectif d’exploration. S’il lui manque l’un de ces éléments, il doit demander une clarification avant de naviguer.

### Comment explore-t-il ?

Il pilote un navigateur avec **Playwright MCP** (outils `browser_navigate`, `browser_snapshot`, `browser_click`, `browser_fill_form`, etc.).

Il avance pas à pas :
1. inspecter l’état de la page ;
2. identifier l’élément concerné ;
3. vérifier que l’interaction fait partie du périmètre autorisé ;
4. agir ;
5. observer le résultat.

Il ne considère pas qu’un clic réussi prouve qu’une opération métier a réussi.

Il s’arrête avant toute action destructive ou persistante non autorisée (suppression, envoi d’e-mail, commande ou paiement réel, changement de droits…).

### Observé, validé ou anomalie : une distinction obligatoire

| Notion | Définition | Peut servir de résultat attendu ? |
|---|---|---|
| **Comportement attendu validé** | Appuyé par un critère d’acceptation, une règle métier validée, une spécification approuvée ou une réponse PO / BA confirmée | Oui |
| **Comportement observé** | Ce que l’agent a vu pendant l’exploration (un message s’affiche, une redirection a lieu…) | Non : c’est l’état actuel de l’application, pas forcément le comportement voulu |
| **Hypothèse** | Une explication ou un comportement attendu supposé, non validé | Non : elle doit être signalée comme telle |

Les constats sont ensuite classés ainsi :

- **Confirmed requirement deviation** : un résultat attendu validé existe, le comportement réel a été observé, et l’écart est démontré ;
- **Potential anomaly** : le comportement semble inattendu ou risqué, mais aucune exigence validée ne prouve qu’il est faux → une question est posée ;
- **Observation** : comportement utile à documenter, sans suggérer de défaut ;
- **Exploration blocked** : accès, données, environnement ou autorisation manquants.

> Un comportement observé n’est jamais transformé automatiquement en résultat attendu. C’est au PO / BA de dire ce que l’application *doit* faire.

### Preuves collectées et limites

Pour chaque constat important, l’agent consigne notamment : l’écran, l’environnement et le navigateur, l’état initial, les données (sans secret), les actions, le résultat observé, le résultat attendu validé s’il existe, la source de la preuve et la reproductibilité (*Reproduced / Observed once / Not reproduced / Not attempted*).

Il peut s’appuyer sur des snapshots de page, des captures d’écran (si utiles et autorisées), les messages de console et les requêtes réseau.

Limites :
- il ne cite que des preuves qui existent réellement ;
- il n’attribue ni sévérité ni priorité sans critères convenus ;
- il ne conclut jamais que l’application est sans défaut ;
- il ne revendique pas la couverture d’écrans non visités ;
- il n’expose ni mot de passe, ni jeton, ni cookie de session.

Son rapport, en français, comprend : *Exploration summary, Explored scenarios, Findings, Questions for PO / BA, Exploration limitations*.

### Outils autorisés et interdictions

```text
Autorisés :
Read / Glob / Grep
browser_navigate / browser_navigate_back / browser_snapshot
browser_click / browser_fill_form / browser_type / browser_press_key
browser_select_option / browser_hover / browser_wait_for / browser_tabs
browser_take_screenshot / browser_console_messages / browser_network_requests

Explicitement interdits :
browser_run_code_unsafe / browser_evaluate / browser_file_upload / browser_drop
browser_network_request / browser_close / browser_resize / browser_handle_dialog
browser_emulate_media / browser_find / browser_drag
```

Il n’a ni `Write`, ni `Edit`, ni `Bash`. Il ne doit pas :
- écrire ou modifier des tests, des Page Objects, des données ou la configuration ;
- exécuter Playwright Test ou une commande terminal ;
- générer des cas de test ;
- appeler automatiquement un autre agent.

### Exemple : l’écran Login de SauceDemo

Voir la section 6.2, étape 1.

---

## 2.7 `qa-test-executor`

### À quoi sert-il ?

Exécuter des **tests automatisés existants** dans un périmètre explicitement approuvé, analyser leurs résultats réels et produire un rapport d’exécution traçable, **sans modifier l’automatisation**.

### Quand l’utiliser ?

À la demande, pour une **campagne indépendante**, par exemple :
- rejouer un lot de tests avant une démonstration ou une livraison ;
- vérifier un fichier de tests sur un navigateur donné ;
- obtenir un rapport QA lisible sur l’état d’un périmètre.

### Le workflow en quatre modes

```text
PREPARATION  →  PREVIEW  →  EXECUTION  →  REPORT
     │              │             │
     │   STOP 4     │   STOP 5    │
     │ PREVIEW      │ EXECUTION   │
     │ APPROVED     │ APPROVED    │
```

1. **PREPARATION** (mode par défaut, aucune commande lancée)

   Lecture seule de `playwright.config.ts`, `package.json`, des tests, des données et, si nécessaire, des Page Objects.

   L’agent présente : les tests concernés, l’environnement, le projet / navigateur, les prérequis, les effets possibles sur les données, la **commande de prévisualisation** et la **commande d’exécution**, l’emplacement du rapport et les limites connues.

2. **PREVIEW**, après la phrase `PREVIEW APPROVED`

   Il lance **uniquement** la commande avec `--list`. Playwright liste les tests sans les exécuter (il charge tout de même la configuration et les fichiers de test).

   L’agent compare la sélection réelle au périmètre demandé et signale tout fichier, test ou projet inattendu.

3. **EXECUTION**, après la phrase `EXECUTION APPROVED`

   Conditions : la prévisualisation a été présentée, l’humain a validé la sélection, l’environnement est identifié, et la commande d’exécution est **identique à la commande prévisualisée sans `--list`**.

4. **REPORT**

   Analyse de la sortie réelle et des artefacts, puis rapport en français.

**Deux validations humaines distinctes** sont nécessaires : une autorisation de prévisualisation ne vaut pas autorisation d’exécution. Une autorisation donnée avant d’avoir vu la sélection n’est pas valable.

Tout changement de fichier, de filtre, de projet, de navigateur ou d’environnement après la prévisualisation impose une nouvelle prévisualisation et de nouvelles autorisations.

### Exemple de commande `--list`

```text
PLAYWRIGHT_HTML_OPEN=never npx --no playwright test tests/login.spec.ts --project=chromium --list
```

- `--project=chromium` limite au projet Chromium (Firefox est aussi déclaré dans la configuration) ;
- `--no` empêche `npx` de télécharger un paquet ;
- `PLAYWRIGHT_HTML_OPEN=never` évite que le rapport HTML s’ouvre automatiquement en cas d’échec, ce qui bloquerait le terminal.

La commande d’exécution est exactement la même, sans `--list`.

> **Bash ou PowerShell ?** La syntaxe `PLAYWRIGHT_HTML_OPEN=never npx ...`, qui définit une variable d’environnement juste avant la commande, est propre à Bash (Git Bash sous Windows, Linux, macOS). Elle ne doit pas être copiée telle quelle dans PowerShell, où elle provoque une erreur. Les commandes de ce guide sont celles réellement lancées pendant l’expérimentation, via Bash.
>
> Équivalent PowerShell :
>
> ```powershell
> $env:PLAYWRIGHT_HTML_OPEN = 'never'; npx --no playwright test tests/login.spec.ts --project=chromium --list
> ```
>
> Dans PowerShell, la variable reste définie jusqu’à la fermeture du terminal. Pour la retirer : `Remove-Item Env:PLAYWRIGHT_HTML_OPEN`.

### Analyse des statuts et des échecs

Statuts distingués : **Passed, Failed, Flaky, Skipped, Timed out, Interrupted, Not executed**.

Points d’attention :
- un même test exécuté sur Chromium et Firefox compte comme **deux exécutions** ;
- *Skipped* (ignoré volontairement) et *Not executed* (prévu mais pas exécuté) ne sont pas confondus ;
- un test *Passed* s’est terminé **sans échec détecté**. Ses assertions, s’il en contient, ont réussi pendant cette exécution, mais un test peut aussi passer sans contenir aucune assertion. Un résultat *Passed* ne démontre donc pas à lui seul la couverture fonctionnelle.

En cas d’échec, l’agent lit l’erreur réelle, identifie l’assertion ou l’opération en cause, puis classe la cause probable :
- défaut applicatif potentiel (ce n’est pas une preuve de bug métier) ;
- défaut d’automatisation potentiel (locator, assertion, synchronisation…) ;
- problème de données de test ;
- problème d’environnement ;
- indéterminé.

Il indique un niveau de confiance (*fait technique confirmé / explication probable / hypothèse*).

Il ne corrige rien, ne relance jamais un test sans autorisation, et ne crée aucun ticket Jira.

### Exploitation du rapport HTML Playwright

Le dépôt utilise le reporter HTML natif : `playwright-report/index.html`.

Il peut contenir : noms des tests, projets, résultats, durées, erreurs, étapes enregistrées, captures, traces et pièces jointes — **uniquement si elles existent**. Avec la configuration actuelle :
- `trace: 'on-first-retry'` et aucun retry en local → pas de trace en local ;
- pas de capture d’écran ni de vidéo configurée ;
- chaque exécution **écrase** le rapport précédent.

La console du reporter HTML ne donne que la durée totale ; la durée de chaque test et de chaque étape se lit dans le rapport HTML.

L’utilisateur peut ouvrir le rapport manuellement avec `npx playwright show-report`. L’Executor, lui, ne doit pas lancer cette commande : dans son workflow actuel, Bash ne lui est autorisé que pour la commande PREVIEW et la commande EXECUTION approuvées.

Aucune intégration Squash TM ou Xray n’est en place ; l’agent peut seulement indiquer si un format (JUnit, JSON) pourrait servir, sans rien envoyer.

### Différence avec `qa-playwright-engineer`

| | `qa-playwright-engineer` | `qa-test-executor` |
|---|---|---|
| Rôle | Développer les tests approuvés | Exécuter des tests existants et en rendre compte |
| Modifie le code | Oui, dans le plan approuvé | Jamais |
| Exécute des tests | Pour vérifier sa propre implémentation | Pour une campagne indépendante |
| Validation requise | `IMPLEMENTATION APPROVED` | `PREVIEW APPROVED`, puis `EXECUTION APPROVED` |
| En cas d’échec | Peut corriger un défaut d’automatisation dans le scope | Analyse, signale et s’arrête |

Une approbation d’implémentation n’autorise pas une campagne d’exécution indépendante.

### Outils

```text
Autorisés : Read / Glob / Grep / Bash
Interdits : Write / Edit / NotebookEdit / tous les outils MCP
```

`Bash` n’est autorisé que pour la commande `--list` approuvée en PREVIEW et la commande d’exécution approuvée en EXECUTION.

---

# 3. Articulation des sept agents

## Qui fait quoi ?

| Activité | Agent | Entrée typique | Sortie | Validation humaine associée |
|---|---|---|---|---|
| Analyse des exigences | `qa-story-analyst` | US, critères d’acceptation | Règles, ambiguïtés, questions PO / BA, scénarios | Checkpoint 1 : clarification métier |
| Conception des cas de test | `qa-test-designer` | Exigence clarifiée | Cas de test détaillés | (prépare le checkpoint 2) |
| Exploration de l’application | `qa-app-explorer` | URL autorisée, objectif | Observations, anomalies potentielles, questions | Autorisation de l’environnement et des actions sensibles |
| Analyse de couverture automatisée | `qa-automation-analyst` | Cas de test validés + dépôt | Fully covered / Partially covered / Not covered, doublons | Checkpoint 2 : décision d’automatisation |
| Planification technique | `qa-playwright-planner` | Cas approuvés + dépôt | Plan minimal | Checkpoint 3 : validation du plan |
| Développement des tests | `qa-playwright-engineer` | Plan approuvé | Code + exécution ciblée + rapport | Checkpoint 6 : décisions Git |
| Exécution indépendante et reporting | `qa-test-executor` | Périmètre de campagne | Prévisualisation, résultats, rapport QA | Checkpoints 4 et 5 |

## Un ensemble de rôles, pas une chaîne obligatoire

Les sept agents ne s’enchaînent pas forcément de façon linéaire :

- **on peut entrer au bon endroit** : un besoin déjà clarifié peut commencer au `qa-test-designer` ; une amélioration technique d’un test existant peut commencer au `qa-playwright-planner` (c’est ce que nous avons fait pour les `test.step()`, section 6.2) ;
- **`qa-app-explorer` est indépendant** : il peut précéder l’analyse (découvrir un écran), l’accompagner (tester une fonctionnalité livrée) ou suivre une campagne (investiguer un comportement surprenant) ;
- **`qa-test-executor` est indépendant** : il travaille sur l’automatisation existante, sans attendre un cycle d’implémentation.

Les passages d’un agent à l’autre sont **décidés par l’humain**. Aucun agent n’en appelle un autre automatiquement.

Quelques liens fréquents, toujours sur décision humaine :

```text
qa-app-explorer   → questions PO / BA        → qa-story-analyst / qa-test-designer
qa-test-executor  → échec d’automatisation   → qa-playwright-planner → qa-playwright-engineer
qa-test-executor  → comportement douteux     → qa-app-explorer (reproduction) ou PO / BA
qa-playwright-engineer → tests livrés        → qa-test-executor (campagne indépendante)
```

---

# 4. Les deux Skills

Les Skills sont des workflows réutilisables. Ils sont configurés avec `disable-model-invocation: true` : ils ne se déclenchent pas d’eux-mêmes, l’utilisateur les lance explicitement (par exemple `/qa-workflow`).

> **Important :** à ce jour, aucun des deux Skills n’orchestre `qa-app-explorer` ni `qa-test-executor`. Ces deux agents sont lancés directement, à la demande (par exemple : « Lance explicitement le sous-agent `qa-test-executor` »).

## 4.1 `qa-workflow`

### Rôle

Orchestrer la chaîne fonctionnelle, depuis l’analyse du besoin jusqu’à la décision d’automatisation.

### Agents orchestrés

`qa-story-analyst`, `qa-test-designer`, `qa-automation-analyst`.

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

Seules les réponses explicites de l’utilisateur sont considérées comme validées ; les questions sans réponse restent ouvertes.

L’automatisation commence seulement après une décision humaine explicite, dans un workflow séparé.

---

## 4.2 `qa-automation-implementation`

### Rôle

Orchestrer la planification technique et l’implémentation Playwright pour des cas de test fonctionnels **déjà approuvés pour automatisation**.

### Agents orchestrés

`qa-playwright-planner`, `qa-playwright-engineer`.

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

### Principes importants

Le plan présenté à l’utilisateur doit être le même plan que celui transmis ensuite à l’Engineer.

Il ne doit pas être résumé, reconstruit ou réinterprété entre l’approbation et l’implémentation.

Une demande de modification du plan n’est pas une approbation : le Planner est relancé, puis le plan révisé est de nouveau soumis.

Le Skill se termine après le rapport de l’Engineer : pas de commit, pas de push, pas de nouveau cycle automatique.

---

# 5. Les checkpoints humains et les limites des agents

## 5.1 Les validations obligatoires

### Checkpoint 1 — Clarification métier

Après `qa-story-analyst`.

Objectif :
- empêcher l’IA d’inventer les réponses aux ambiguïtés qu’elle vient d’identifier.

### Checkpoint 2 — Décision d’automatisation

Après `qa-automation-analyst`.

Objectif :
- éviter de transformer automatiquement chaque gap de couverture en nouveau test Playwright.

### Checkpoint 3 — Validation du plan d’implémentation

Après `qa-playwright-planner`. Phrase transmise à l’Engineer : `IMPLEMENTATION APPROVED`.

Objectif :
- vérifier les fichiers proposés ;
- confirmer que le plan reste minimal ;
- contrôler qu’aucun cas non approuvé n’a été ajouté ;
- empêcher toute modification du repository avant validation.

### Checkpoint 4 — Autorisation de prévisualisation

Après la PREPARATION de `qa-test-executor`. Phrase : `PREVIEW APPROVED`.

Objectif :
- valider l’environnement, le périmètre et la commande `--list` avant toute commande terminal.

### Checkpoint 5 — Validation de la sélection et autorisation d’exécution

Après la PREVIEW. Phrase : `EXECUTION APPROVED`.

Objectif :
- vérifier que les tests réellement listés correspondent au périmètre voulu ;
- autoriser l’exécution de cette sélection précise, et d’elle seule.

### Checkpoint 6 — Décisions Git

Après une modification du dépôt.

Objectif :
- garder la main sur le commit, le push et le merge. Aucun agent ne doit les faire de lui-même.

## 5.2 Limites des permissions et des instructions

Les garde-fous reposent sur deux mécanismes de nature différente.

**1. Les outils déclarés dans chaque agent (barrière technique)**

Un agent sans `Write`, `Edit` ni `Bash` ne peut pas modifier le dépôt : c’est le cas de `qa-story-analyst`, `qa-test-designer`, `qa-automation-analyst`, `qa-playwright-planner` et `qa-app-explorer`.

`qa-app-explorer` a en plus une liste d’outils MCP explicitement interdits (exécution de code JavaScript, upload de fichiers…).

**2. Les instructions écrites dans les fichiers (barrière de comportement)**

`Bash` est un outil large : techniquement, il permet de lancer n’importe quelle commande, y compris une commande qui modifie un fichier ou fait un commit. Pour `qa-playwright-engineer` et `qa-test-executor`, ce sont donc les **instructions** (et les demandes de permission de Claude Code) qui limitent l’usage de Bash, pas l’outil lui-même.

Conséquences pratiques :
- une instruction réduit fortement le risque mais **ne le supprime pas** : un agent peut se tromper ;
- les phrases `IMPLEMENTATION APPROVED`, `PREVIEW APPROVED` et `EXECUTION APPROVED` sont transmises par la session qui orchestre ; l’agent ne peut pas vérifier qu’un humain les a réellement écrites. Elles n’ont de valeur que si l’humain les a vraiment données ;
- les demandes de permission affichées par Claude Code avant une commande sont un contrôle supplémentaire : il faut les lire, pas les accepter par réflexe ;
- la relecture humaine reste indispensable : diff des fichiers modifiés, commandes réellement lancées, rapports produits.

---

# 6. Exemples réels

## 6.1 Checkout SauceDemo

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

## 6.2 Login SauceDemo

Cet exemple montre les deux nouveaux agents et un petit cycle Planner → Engineer, **sans passer par les Skills**. Chaque agent a été lancé explicitement, à la demande.

### Étape 1 — Exploration de l’écran Login (`qa-app-explorer`)

L’écran Login de `https://www.saucedemo.com/` a été exploré via Playwright MCP.

Aucune User Story formelle n’était fournie : il s’agissait donc d’une **exploration de caractérisation**, dont le résultat est un ensemble d’observations, pas de résultats attendus validés.

Leçon principale : un message ou une redirection observés pendant l’exploration décrivent ce que fait l’application aujourd’hui. Ils ne deviennent des résultats attendus qu’après validation (critère d’acceptation, règle métier ou réponse PO / BA).

**Compte rendu de l’exploration du 13 octobre 2026**

> Source : compte rendu d’une expérimentation antérieure. Il n’est pas enregistré dans le dépôt.

Périmètre :
- application : `https://www.saucedemo.com/` ;
- écran exploré : Login ;
- aucune saisie de données et aucune tentative de connexion.

Faits observés :

| # | Observation | Source de la preuve |
|---|---|---|
| O1 | L’écran affichait le titre « Swag Labs », les champs Username et Password, et le bouton Login. | Snapshot de la page |
| O2 | Le snapshot d’accessibilité présentait les six utilisateurs de démonstration sous forme de texte concaténé. | Snapshot d’accessibilité |
| O3 | À l’écran, ces six utilisateurs étaient visuellement séparés, chacun sur sa propre ligne, sans chevauchement ni troncature. | Capture d’écran |
| O4 | Six erreurs HTTP 401 concernant `events.backtrace.io` apparaissaient dans la console. | Messages de console |

Investigations menées : consultation des messages de console, capture d’écran, nouveau snapshot de la page.

Ce que l’on peut en conclure, et ce que l’on ne peut pas en conclure :

- **O2 et O3, une hypothèse écartée.** Le texte concaténé du snapshot pouvait faire penser à un défaut d’affichage. La capture d’écran montre que l’affichage est correct. O2 est donc une **particularité de la représentation du snapshot**, et non un défaut visuel confirmé.
- **O4, une observation technique.** Les erreurs 401 de télémétrie sont des faits observés. **Aucun impact fonctionnel sur le Login n’a été établi**, et leur cause n’est pas connue. Elles peuvent faire l’objet d’une investigation, mais ne sont pas qualifiées d’anomalie fonctionnelle.
- **Aucun défaut confirmé.** Aucune exigence métier validée n’ayant été fournie, aucune déviation ne pouvait être démontrée.

Limites :
- aucune authentification exécutée ;
- aucun défaut visuel confirmé ;
- aucune déviation démontrée par rapport à une exigence métier validée ;
- cause des erreurs de télémétrie non établie ;
- aucun contrôle sur plusieurs navigateurs ou plusieurs résolutions.

Conclusion QA : l’exploration a permis de collecter des preuves et de distinguer une particularité du snapshot d’un éventuel défaut d’affichage. Elle a aussi mis en évidence des erreurs techniques qui pourront être investiguées, sans permettre de les qualifier d’anomalie fonctionnelle.

### Étape 2 — Préparation de la campagne (`qa-test-executor`, PREPARATION)

Périmètre demandé : `tests/login.spec.ts`, Chromium, `https://www.saucedemo.com/`.

L’agent a identifié, sans lancer de commande :
- deux tests : **CT01 - Standard user can log in** et **CT02 - Locked out user cannot log in** ;
- leurs assertions : URL `inventory.html` et titre `Products` pour CT01 ; message « Sorry, this user has been locked out. » et URL `/` pour CT02 ;
- les données utilisées : comptes de démonstration publics de `test-data/users.ts` ;
- les risques : site public tiers, rapport HTML existant écrasé, pas de retry en local, pas de trace ni de capture ;
- un point technique : sans `PLAYWRIGHT_HTML_OPEN=never`, le rapport HTML s’ouvre en cas d’échec et bloque le terminal.

STOP → l’humain a choisi les commandes, confirmé l’environnement et donné `PREVIEW APPROVED`.

### Étape 3 — Prévisualisation (PREVIEW)

```text
PLAYWRIGHT_HTML_OPEN=never npx --no playwright test tests/login.spec.ts --project=chromium --list

Listing tests:
  [chromium] › login.spec.ts:6:5 › CT01 - Standard user can log in
  [chromium] › login.spec.ts:30:5 › CT02 - Locked out user cannot log in
Total: 2 tests in 1 file
```

Sélection conforme : 2 tests, 1 fichier, Chromium seul (Firefox, déclaré dans la configuration, n’a pas été sélectionné).

STOP → l’humain a validé la sélection et donné `EXECUTION APPROVED`.

### Étape 4 — Exécution et rapport (EXECUTION, REPORT)

```text
Running 2 tests using 2 workers
[1/2] [chromium] › tests\login.spec.ts:6:5 › CT01 - Standard user can log in
[2/2] [chromium] › tests\login.spec.ts:30:5 › CT02 - Locked out user cannot log in
  2 passed (5.0s)
```

Résultat : **2 Passed**, sans relance.

Le rapport a aussi listé ce qui n’était pas prouvé : la durée de chaque test (absente de la console), le contenu du rapport HTML (non ouvert), et les cas de connexion non couverts (mauvais mot de passe, champs vides, déconnexion…).

### Étape 5 — Ajout de `test.step()` dans CT01 (`qa-playwright-planner` puis `qa-playwright-engineer`)

Objectif : rendre le rapport HTML plus lisible, **sans changer la couverture**.

Le Planner (lecture seule) a proposé de regrouper les actions et assertions existantes de CT01 dans deux étapes, sans toucher à CT02, aux Page Objects ni aux données :

```typescript
await test.step('Se connecter avec un utilisateur valide', async () => {
  await loginPage.goto();
  await loginPage.login(users.standard.username, users.standard.password);
});

await test.step('Vérifier l’accès au catalogue', async () => {
  await expect(page).toHaveURL(/inventory\.html/);
  await expect(inventoryPage.title).toHaveText('Products');
});
```

(Extrait simplifié : les commentaires du fichier réel ont été conservés.)

Points relevés par le Planner :
- chaque `test.step` doit être précédé de `await`, sinon les étapes partiraient en parallèle ;
- les titres d’étapes ne contiennent aucune donnée de test, en particulier pas le mot de passe ;
- l’action `fill` du mot de passe peut toutefois afficher la valeur saisie dans le rapport ; ce comportement existait déjà et vient du Page Object (hors périmètre).

STOP → l’humain a donné `IMPLEMENTATION APPROVED`, et le plan complet a été transmis à l’Engineer sans être résumé.

L’Engineer a modifié uniquement `tests/login.spec.ts`, puis lancé les seules vérifications autorisées :

```text
PLAYWRIGHT_HTML_OPEN=never npx --no playwright test tests/login.spec.ts -g "CT01 - Standard user can log in" --project=chromium --list
→ 1 test

PLAYWRIGHT_HTML_OPEN=never npx --no playwright test tests/login.spec.ts -g "CT01 - Standard user can log in" --project=chromium
→ 1 passed (4.6s)
```

Résultat : **CT01 Passed**. CT02 n’a pas été relancé, aucun commit n’a été fait.

Ici, c’est l’Engineer qui a exécuté le test : il s’agissait de **vérifier sa propre modification**, pas d’une campagne indépendante.

### Étape 6 — Ce que montre le rapport HTML

Dans le rapport HTML, CT01 affiche désormais deux niveaux :
- les **étapes fonctionnelles** (`Se connecter avec un utilisateur valide`, `Vérifier l’accès au catalogue`), avec leur durée ;
- sous chaque étape, les **opérations techniques** Playwright : navigation, saisies, clic, puis les `Expect "toHaveURL"` et `Expect "toHaveText"`.

> Attention : `test.step()` organise le rapport, il n’ajoute pas de colonnes « résultat attendu / résultat obtenu ». Les valeurs observées ne sont pas affichées automatiquement comme des résultats attendus et obtenus distincts : on voit les assertions et, en cas d’échec, le message d’erreur de Playwright. Le rapport n’est donc pas un procès-verbal de test fonctionnel complet.

---

# 7. Guide pratique : quel agent utiliser ?

| Ma situation | Agent ou Skill | Ce que je dois fournir |
|---|---|---|
| J’ai reçu une User Story et les critères me semblent flous | `qa-story-analyst` (ou `/qa-workflow`) | La US et ses critères d’acceptation |
| Le PO a répondu, je veux des cas de test détaillés | `qa-test-designer` (ou suite de `/qa-workflow`) | L’exigence + les clarifications validées |
| Je veux savoir si mes cas sont déjà automatisés | `qa-automation-analyst` | Les cas de test validés |
| Une fonctionnalité vient d’être livrée, je veux la découvrir ou investiguer un comportement étrange | `qa-app-explorer` | URL, environnement autorisé, objectif, exigences si elles existent |
| J’ai décidé d’automatiser certains cas | `/qa-automation-implementation` (Planner puis Engineer) | La liste exacte des cas approuvés |
| Je veux améliorer un test existant sans changer sa couverture | `qa-playwright-planner` puis, après validation, `qa-playwright-engineer` | Le test concerné et les contraintes |
| Je veux rejouer des tests existants et obtenir un rapport | `qa-test-executor` | Fichier(s), navigateur, environnement |
| Un test a échoué pendant une campagne | `qa-test-executor` analyse ; puis, selon la cause, décision humaine : correction (Planner → Engineer), investigation (`qa-app-explorer`) ou question au PO / BA | Le rapport d’exécution |
| Je veux commiter ou pousser les changements | Personne : c’est une décision humaine | — |

## Exemples de demandes

**Explorer un écran**

```text
Lance explicitement le sous-agent qa-app-explorer.
Explore l’écran Panier de https://www.saucedemo.com/ (environnement autorisé),
avec le compte de démonstration standard.
Objectif : observer l’ajout et le retrait de produits. Aucune exigence formelle n’est fournie.
```

**Préparer une campagne**

```text
Lance explicitement le sous-agent qa-test-executor.
Travaille uniquement en PREPARATION MODE sur tests/cart.spec.ts, Chromium,
https://www.saucedemo.com/. N’exécute aucune commande et attends ma validation.
```

**Autoriser la suite**

```text
PREVIEW APPROVED — commande approuvée : ... --list
```

puis, après avoir vu la sélection réelle :

```text
EXECUTION APPROVED — commande approuvée : ... (identique, sans --list)
```

## Réflexes à garder

- Préciser toujours **le périmètre, le navigateur et l’environnement**.
- Lire la sélection `--list` avant d’autoriser une exécution.
- Ne pas confondre « test Passed » et « fonctionnalité validée ».
- Ne pas confondre « comportement observé » et « résultat attendu ».
- Relire le diff avant toute décision Git.

---

# 8. Principes de conception du workflow

## Ne pas confondre assistance et décision

L’IA peut :
- analyser ;
- explorer ;
- signaler ;
- proposer ;
- comparer ;
- planifier ;
- implémenter dans un cadre approuvé ;
- exécuter dans un cadre approuvé.

L’humain conserve :
- la clarification métier ;
- la décision d’automatisation ;
- l’approbation du plan technique ;
- l’autorisation de prévisualiser et d’exécuter une campagne ;
- la décision de commit / push / merge.

## Réduire les permissions

Tous les agents n’ont pas besoin des mêmes outils.

```text
qa-story-analyst, qa-test-designer
→ Read

qa-automation-analyst, qa-playwright-planner
→ Read / Glob / Grep

qa-app-explorer
→ Read / Glob / Grep + outils Playwright MCP autorisés (sans Write, Edit ni Bash)

qa-test-executor
→ Read / Glob / Grep / Bash (sans Write ni Edit)

qa-playwright-engineer
→ Read / Glob / Grep / Write / Edit / Bash
```

Le principe est d’accorder uniquement les permissions nécessaires au rôle.

## Préserver le scope

Un agent ne doit pas considérer qu’une bonne idée technique est automatiquement autorisée.

Le scope approuvé reste la référence.

## Préférer les preuves aux intentions

Un titre de test ou une méthode POM indique ce qu’un test semble vouloir faire.

Une assertion montre ce qu’il vérifie réellement.

Un rapport ne cite que ce qui a réellement été exécuté, observé ou produit.

---

# 9. Glossaire rapide

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

### Playwright MCP

Serveur qui permet à un agent IA de piloter un navigateur (naviguer, cliquer, saisir, lire la page). Utilisé par `qa-app-explorer`.

### Exploration de caractérisation

Exploration menée sans exigence formelle : elle décrit le comportement actuel de l’application, sans le juger conforme ou non.

### Campagne d’exécution

Exécution planifiée d’un ensemble de tests automatisés existants, sur un périmètre, un navigateur et un environnement définis.

### `--list`

Option de Playwright qui liste les tests sélectionnés sans les exécuter.

### `test.step()`

Fonction Playwright qui regroupe des actions et des assertions sous un titre lisible dans le rapport.

### Rapport HTML Playwright

Rapport natif généré dans `playwright-report/`, consultable avec `npx playwright show-report`.

---

# 10. Résumé

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

À la demande :

L’IA explore
↓
l’humain qualifie les observations

L’IA prépare et prévisualise une campagne
↓
l’humain valide la sélection
↓
l’IA exécute et rend compte
```

Les fichiers opérationnels en anglais restent la source de vérité pour les agents et les Skills.

Ce guide français sert à comprendre rapidement leur rôle, leurs limites et la logique d’orchestration du projet.

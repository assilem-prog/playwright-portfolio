#!/usr/bin/env node
// PreToolUse guard for the qa-test-executor subagent (deny by default).
//
// Admissible forms (fixed order, nothing else):
//   [PLAYWRIGHT_HTML_OPEN=never] npx playwright test <spec...> --project=<name> [--grep "<pattern>"] [--list]
//
// - Any other command, option, chaining, redirection or substitution: exit 2 (blocked).
// - Any internal error: exit 2 (fail closed).
// - Admissible command: "ask" decision, so the human still confirms the exact command.
//   This guard never approves a command and is not a substitute for
//   PREVIEW APPROVED / EXECUTION APPROVED.

'use strict';

const fs = require('fs');
const path = require('path');

const ALLOWED_PROJECTS = ['chromium', 'firefox', 'webkit'];
const MAX_SPEC_FILES = 10;
const MAX_GREP_LENGTH = 200;
const SPEC_PATTERN = /^tests\/[A-Za-z0-9][A-Za-z0-9_-]*(\/[A-Za-z0-9][A-Za-z0-9_-]*)*\.spec\.ts$/;
const UNQUOTED_CHARS = /^[A-Za-z0-9_./=:-]$/;
const QUOTED_CHARS = /^[\p{L}\p{N} _\-\[\]|.:()^+*?]$/u;

function deny(reason) {
  process.stderr.write(`qa-test-executor guard: commande refusée. ${reason}\n`);
  process.exit(2);
}

function tokenize(command) {
  const tokens = [];
  let i = 0;
  while (i < command.length) {
    const c = command[i];
    if (c === ' ') {
      i++;
      continue;
    }
    if (c === '"') {
      const end = command.indexOf('"', i + 1);
      if (end === -1) deny('Guillemet non fermé.');
      const value = command.slice(i + 1, end);
      for (const ch of value) {
        if (!QUOTED_CHARS.test(ch)) deny(`Caractère interdit entre guillemets : ${JSON.stringify(ch)}.`);
      }
      const next = command[end + 1];
      if (next !== undefined && next !== ' ') deny('Un argument entre guillemets doit être isolé.');
      tokens.push({ value, quoted: true });
      i = end + 1;
      continue;
    }
    let value = '';
    while (i < command.length && command[i] !== ' ') {
      const ch = command[i];
      if (ch === '"') deny('Guillemet au milieu d\'un argument.');
      if (!UNQUOTED_CHARS.test(ch)) deny(`Caractère interdit : ${JSON.stringify(ch)} (chaînage, redirection, substitution ou caractère spécial).`);
      value += ch;
      i++;
    }
    tokens.push({ value, quoted: false });
  }
  return tokens;
}

function validate(command, projectDir) {
  if (typeof command !== 'string' || command.trim() === '') deny('Commande vide.');
  if (command.length > 1000) deny('Commande trop longue.');

  const tokens = tokenize(command);
  let i = 0;
  const peek = () => tokens[i];
  const expect = (literal) => {
    const t = tokens[i];
    if (!t || t.quoted || t.value !== literal) {
      deny(`Attendu "${literal}", reçu "${t ? t.value : '(fin de commande)'}". Forme admise : [PLAYWRIGHT_HTML_OPEN=never] npx playwright test <spec...> --project=<nom> [--grep "<motif>"] [--list].`);
    }
    i++;
  };

  if (peek() && !peek().quoted && peek().value.includes('=') && !peek().value.startsWith('-')) {
    if (peek().value !== 'PLAYWRIGHT_HTML_OPEN=never') deny(`Variable d'environnement non autorisée : ${peek().value}.`);
    i++;
  }
  expect('npx');
  expect('playwright');
  expect('test');

  const specs = [];
  while (peek() && !peek().quoted && !peek().value.startsWith('-')) {
    const spec = peek().value;
    if (!SPEC_PATTERN.test(spec) || spec.includes('..')) deny(`Fichier de test non admis : ${spec}. Attendu : tests/<chemin>.spec.ts.`);
    const resolved = path.resolve(projectDir, spec);
    if (!resolved.startsWith(path.resolve(projectDir, 'tests') + path.sep)) deny(`Fichier hors du dossier tests/ : ${spec}.`);
    if (!fs.existsSync(resolved) || !fs.statSync(resolved).isFile()) deny(`Fichier de test introuvable : ${spec}.`);
    specs.push(spec);
    i++;
  }
  if (specs.length === 0) deny('Au moins un fichier de test explicite est requis (pas d\'exécution de toute la suite).');
  if (specs.length > MAX_SPEC_FILES) deny(`Trop de fichiers de test (${specs.length} > ${MAX_SPEC_FILES}).`);

  const projectToken = peek();
  const projectMatch = projectToken && !projectToken.quoted && /^--project=([a-z]+)$/.exec(projectToken.value);
  if (!projectMatch) deny(`Option --project=<nom> requise juste après les fichiers de test, reçu "${projectToken ? projectToken.value : '(fin de commande)'}".`);
  if (!ALLOWED_PROJECTS.includes(projectMatch[1])) deny(`Projet Playwright non autorisé : ${projectMatch[1]}.`);
  i++;

  if (peek() && !peek().quoted && peek().value === '--grep') {
    i++;
    const pattern = peek();
    if (!pattern || !pattern.quoted) deny('Le motif de --grep doit être entre guillemets doubles.');
    if (pattern.value.trim() === '' || pattern.value.length > MAX_GREP_LENGTH) deny('Motif --grep vide ou trop long.');
    try {
      new RegExp(pattern.value);
    } catch {
      deny('Motif --grep invalide.');
    }
    i++;
  }

  if (peek() && !peek().quoted && peek().value === '--list') i++;

  if (i < tokens.length) deny(`Argument ou option non autorisé : "${tokens[i].value}". Seules --project, --grep et --list sont admises, dans cet ordre.`);

  return tokens.some((t) => !t.quoted && t.value === '--list') ? 'PREVIEW' : 'EXECUTION';
}

function main() {
  let raw = '';
  try {
    raw = fs.readFileSync(0, 'utf8');
  } catch {
    deny('Entrée du hook illisible.');
  }
  let input;
  try {
    input = JSON.parse(raw);
  } catch {
    deny('Entrée du hook invalide (JSON).');
  }
  if (!input || input.hook_event_name !== 'PreToolUse') deny('Événement inattendu.');
  if (input.tool_name !== 'Bash') deny(`Outil non autorisé pour qa-test-executor : ${input.tool_name}.`);

  const projectDir = process.env.CLAUDE_PROJECT_DIR || input.cwd;
  if (!projectDir) deny('Répertoire du projet inconnu.');

  const command = input.tool_input && input.tool_input.command;
  const form = validate(command, projectDir);

  process.stdout.write(JSON.stringify({
    hookSpecificOutput: {
      hookEventName: 'PreToolUse',
      permissionDecision: 'ask',
      permissionDecisionReason: `Forme ${form} admissible pour qa-test-executor. Confirmez uniquement si cette commande exacte a été approuvée (${form} APPROVED).`,
    },
  }));
  process.exit(0);
}

try {
  main();
} catch (error) {
  deny(`Erreur de validation : ${error && error.message ? error.message : error}.`);
}

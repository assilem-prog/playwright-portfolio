---
name: qa-workflow
description: Orchestrates functional requirement review, detailed test design and automation coverage analysis using qa-story-analyst, qa-test-designer and qa-automation-analyst, with mandatory human checkpoints after requirement review and after coverage analysis.
disable-model-invocation: true
argument-hint: "[User Story, requirement text, or @file]"
---

# QA Requirement-to-Test Workflow

Orchestrate functional requirement analysis, test case design and automation coverage analysis.

The three specialist subagents have separate responsibilities:

- `qa-story-analyst`: reviews requirements for testability, ambiguities, risks and high-level scenarios.
- `qa-test-designer`: creates detailed functional test cases only after the requirement has been sufficiently clarified.
- `qa-automation-analyst`: maps the validated functional test cases against the existing Playwright repository to identify covered, partially covered and uncovered behaviours, and potential duplicate automation.

Do not perform either specialist role yourself when the corresponding subagent is available.

## Input

The requirement to process is:

$ARGUMENTS

## Stage 1 - Requirement review

Invoke the `qa-story-analyst` subagent.

Provide it with the complete requirement supplied by the user.

Do not inspect source code, existing tests or repository implementation unless the user explicitly included those files in the request.

Wait for the subagent to finish.

Present its analysis to the user.

## Stage 2 - Mandatory human validation

After the qa-story-analyst report, STOP.

Do NOT invoke `qa-test-designer` yet.

Do NOT answer the analyst's questions yourself.

Do NOT infer missing business rules.

Do NOT convert proposed scenarios into validated requirements.

Ask the user to provide PO/BA decisions for the questions or ambiguities that need clarification.

The user may answer each item with:
- a validated business rule
- a clarification
- "out of scope"
- "unknown / unresolved"

Treat only explicit user answers as validated information.

Keep unresolved questions unresolved.

If information required for deterministic requirement-based test cases is still missing after the user's answer, explain what remains unresolved and wait again.

## Stage 3 - Prepare the validated design input

Once sufficient clarification has been provided, build the input for `qa-test-designer` from:

1. The original requirement.
2. The original acceptance criteria.
3. Relevant findings from `qa-story-analyst`.
4. Explicitly validated PO/BA clarifications supplied by the user.
5. Explicitly identified out-of-scope behaviours.
6. Any remaining unresolved items.

Do not add or infer business rules.

Do not silently resolve inconsistencies between the original requirement and later clarifications.

If a PO/BA clarification changes or overrides the original requirement, state this explicitly in the input passed to the designer.

## Stage 4 - Detailed test design

Invoke the `qa-test-designer` subagent.

Provide the complete validated input prepared in Stage 3.

The designer must not receive invented answers to unresolved questions.

Wait for the subagent to finish.

Return the qa-test-designer report to the user.

## Stage 5 - Automation coverage analysis

After `qa-test-designer` has completed the detailed functional test design, invoke the `qa-automation-analyst` subagent.

Provide it with:

1. The complete validated functional test cases produced by `qa-test-designer`.
2. Their requirement / acceptance criteria traceability.
3. The existing Playwright repository as the automation baseline.

The automation analyst may inspect:

- `tests/`
- relevant Page Objects under `pages/`
- relevant test data under `test-data/`

It must not execute tests or modify any repository file.

It must determine for each validated functional test case whether the existing Playwright repository provides:

- Fully covered
- Partially covered
- Not covered

It must also independently identify potential duplicate automation.

Coverage decisions must be based on executable assertions.

Do not treat the following as proof of automated coverage:

- test names
- comments
- Page Object methods alone
- navigation
- data setup
- console.log
- actions without assertions

Wait for the `qa-automation-analyst` to finish.

Present its complete coverage report to the user.

## Stage 6 - Mandatory human automation decision

After the automation coverage report, STOP.

Do NOT create or modify Playwright tests.

Do NOT automatically decide that every uncovered functional test case must be automated.

Do NOT modify Page Objects or test data.

Do NOT execute Playwright.

The user must decide what to do with the identified automation gaps.

Possible user decisions include:

- automate
- do not automate
- automate later
- keep manual
- investigate further
- update an existing automated test
- accept current coverage

Treat only explicit user decisions as authorization for any future automation work.

## Workflow boundaries

This workflow ends after functional test design, automation coverage analysis,
and the mandatory human automation decision checkpoint.

A future automation implementation workflow must be started separately.

Do not:
- write Playwright code
- execute tests
- modify application code
- modify existing test files, Page Objects or test data
- continue into automation unless the user explicitly starts a separate automation workflow

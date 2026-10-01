---
name: qa-automation-implementation
description: Orchestrates Playwright implementation planning and execution for functional test cases explicitly approved for automation, using qa-playwright-planner and qa-playwright-engineer with a mandatory human approval checkpoint before repository changes.
disable-model-invocation: true
argument-hint: "[approved functional test cases, automation decision, or @file]"
---

This Skill orchestrates the implementation of functional test cases that have already been explicitly approved for Playwright automation.

It uses two specialist subagents:

- `qa-playwright-planner` to inspect the existing repository and prepare a read-only implementation plan
- `qa-playwright-engineer` to implement only the human-approved plan after explicit approval

The Skill must preserve the separation between planning and implementation.

The planner must never modify or execute the project.

The engineer must never be invoked for implementation before the mandatory human approval checkpoint.

## Required starting point

This workflow starts only after a human has explicitly decided which functional test cases should be automated.

The input must identify the exact functional test cases approved for automation.

The workflow may also receive:

- the original requirement or acceptance criteria
- qa-test-designer output
- qa-automation-analyst coverage findings
- the human automation decisions
- relevant prior workflow output

Do not infer approval from a coverage gap.

Do not treat `Not covered` or `Partially covered` as authorization to automate.

Do not add test cases to the approved automation scope.

If the exact approved automation scope is not available, STOP and ask the user which functional test cases are approved for automation.

## Stage 1 - Prepare planning input

Prepare the complete input for `qa-playwright-planner`.

Include:

1. The exact functional test cases explicitly approved for automation.
2. Their complete functional test definitions and expected results.
3. Requirement / acceptance criteria traceability when available.
4. Relevant qa-automation-analyst findings when available.
5. Explicit human automation decisions.
6. The existing Playwright repository as the implementation baseline.

Do not change the meaning of the approved functional test cases.

Do not add automation scope.

## Stage 2 - Playwright implementation planning

Invoke the `qa-playwright-planner` subagent.

The planner may inspect relevant:

- `tests/`
- `pages/`
- `test-data/`
- `playwright.config.ts` only when necessary

The planner must remain read-only.

It must not:

- create files
- modify files
- execute Playwright
- install dependencies
- execute repository-modifying commands

Wait for the planner to finish.

Present the qa-playwright-planner output to the user in full.

Do not summarize, condense, paraphrase, restructure or omit any part of the planner output.

The exact plan presented to the user is the plan that must later be treated as the human-approved implementation plan.

## Stage 3 - Mandatory human plan approval

STOP after presenting the planner report.

Do NOT invoke `qa-playwright-engineer`.

Do NOT modify repository files.

Do NOT execute Playwright.

Do NOT convert the planner report into implicit approval.

The user must explicitly approve the implementation plan before implementation can begin.

Valid human responses may include clear approval such as:

- approve
- approved
- proceed
- go ahead
- implement this plan

A request to change, add, remove or reconsider any part of the plan is NOT approval.

If the user requests changes:

1. Do not invoke `qa-playwright-engineer`.
2. Invoke `qa-playwright-planner` again with:
   - the same approved functional automation scope
   - the previous plan
   - the user's requested plan changes
3. Present the revised plan.
4. STOP again for human approval.

A change to the technical implementation plan does not authorize a change to the approved functional automation scope.

If the user wants to add another functional test case to the automation scope, require an explicit new automation decision for that test case before including it.

## Stage 4 - Prepare approved implementation input

Only after explicit human approval of the current plan, prepare the input for `qa-playwright-engineer`.

The input must contain all of the following:

1. The exact phrase:

IMPLEMENTATION APPROVED

2. The exact functional test cases approved for implementation.
3. Their complete expected results.
4. The complete human-approved automation implementation plan.
This must be the same complete plan that was presented to and approved by the user.
Do not reconstruct, summarize or reinterpret the approved plan.
5. Relevant requirement / acceptance criteria traceability.
6. Relevant qa-automation-analyst findings when available.
7. The explicit human automation decisions.
8. The existing Playwright repository.

Do not alter the approved plan when passing it to the engineer.

Do not expand the approved test scope.

## Stage 5 - Playwright implementation

Invoke `qa-playwright-engineer` with the complete approved implementation input.

The engineer may:

- inspect relevant repository files
- create or modify files required by the approved plan
- execute only the tests created or modified by the approved implementation plan, using the narrowest relevant Playwright command
- fix automation defects within the approved scope
- re-run targeted tests when necessary

If diagnosing a failure would require executing an existing test outside the human-approved implementation scope, the engineer must STOP and request explicit human approval before running it.

If implementation reveals that the human-approved plan must be materially changed, or that a repository file not included in the approved plan must be modified, the engineer must STOP and report the deviation.

Do not let the engineer extend or revise the approved plan autonomously.

In that situation:

1. Do not continue implementation.
2. Return to `qa-playwright-planner` with:
   - the same approved functional automation scope
   - the human-approved implementation plan
   - the implementation blocker or required deviation identified by the engineer
3. Present the revised plan to the user.
4. STOP again for human approval before invoking `qa-playwright-engineer`.

The engineer must not:

- implement unapproved test cases
- broaden functional scope
- perform unrelated refactoring
- weaken expected results
- change business rules
- install new dependencies unless separately and explicitly approved
- modify unrelated repository files
- run the complete Playwright suite when targeted execution is sufficient
- commit or push repository changes

Wait for the engineer to finish.

Present its complete implementation report to the user.

## Stage 6 - Workflow end

The workflow ends after the `qa-playwright-engineer` implementation report.

Do not automatically:

- add more automated tests
- fix unrelated existing tests
- refactor unrelated code
- commit changes
- push changes
- start another implementation cycle

Any additional automation scope requires a new explicit human decision.

Any additional implementation cycle must be started explicitly by the user.

## Workflow boundaries

This Skill is only for implementation of functional test cases that have already been explicitly approved for automation.

It does not perform:

- requirement analysis
- PO / BA clarification
- functional test design
- initial automation coverage analysis
- automatic automation prioritisation

Those activities belong to the separate QA analysis workflow.

This Skill starts from a human-approved automation scope and ends after approved Playwright implementation and targeted execution reporting.

## Mandatory orchestration rules

The order is mandatory:

1. Approved automation scope
2. `qa-playwright-planner`
3. Human plan approval
4. `IMPLEMENTATION APPROVED`
5. `qa-playwright-engineer`
6. Implementation report
7. END

Never skip the human approval checkpoint.

Never invoke `qa-playwright-engineer` in place of `qa-playwright-planner`.

Never ask `qa-playwright-planner` to implement code.

Never ask `qa-playwright-engineer` to choose which functional test cases should be automated.

Never treat coverage gaps as automation approval.

Never silently expand the approved automation scope.

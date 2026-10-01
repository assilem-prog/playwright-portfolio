---
name: qa-workflow
description: Orchestrates functional requirement review and detailed test design using qa-story-analyst and qa-test-designer, with a mandatory human validation checkpoint between both stages.
disable-model-invocation: true
argument-hint: "[User Story, requirement text, or @file]"
---

# QA Requirement-to-Test Workflow

Orchestrate functional requirement analysis and test case design.

The two specialist subagents have separate responsibilities:

- `qa-story-analyst`: reviews requirements for testability, ambiguities, risks and high-level scenarios.
- `qa-test-designer`: creates detailed functional test cases only after the requirement has been sufficiently clarified.

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

## Workflow boundaries

This workflow ends after functional test case design.

Do not:
- write Playwright code
- execute tests
- modify application code
- modify existing test files
- continue into automation unless the user explicitly starts a separate automation workflow

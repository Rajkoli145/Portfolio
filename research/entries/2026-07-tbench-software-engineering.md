---
title: "T-Bench Task Engineering — Software Engineering"
createdAt: "2026-07-08T10:00:00.000Z"
updatedAt: "2026-08-19T10:00:00.000Z"
project: "handshake-ai-tbench"
tags:
  - "benchmark-engineering"
  - "harbor-framework"
  - "software-engineering"
  - "interpreters"
  - "compilers"
status: "published"
summary: "Designed and completed a Terminal-Bench-style software engineering task — debugging a tree-walking interpreter for MiniLang, a dynamically-typed scripting language, against a formal language specification."
---

## Overview

Completed a software engineering task under the Handshake AI Dynamo benchmark program, requiring deep reasoning over language semantics and interpreter implementation correctness.

## Task Completed

### MiniLang Tree-Walking Interpreter Debugging

Given a source-code implementation of a tree-walking interpreter for MiniLang (a small dynamically-typed scripting language) alongside a formal language specification, identified and corrected every defect in the interpreter such that it faithfully implemented every rule in the spec. The specification was immutable — all corrections targeted the interpreter source files exclusively.

Required careful cross-referencing of interpreter behaviour against specification rules across multiple language constructs: expression evaluation, type coercion, scoping, control flow, and runtime error handling.

**Key techniques:** Tree-walking interpreter internals, formal language specification reading, defect isolation, spec-driven debugging, dynamic type system semantics

---

## Infrastructure

Built on the Harbor framework: isolated Docker environment, automated test suite validating interpreter correctness against the specification, PR-based review with Dynamo rubric checks.

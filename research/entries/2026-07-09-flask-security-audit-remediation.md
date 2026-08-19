---
title: "Flask REST API Security Audit & Remediation — Multi-Tenant Order Platform"
createdAt: "2026-07-22T10:00:00.000Z"
updatedAt: "2026-07-22T10:00:00.000Z"
project: "tbench-harbor"
tags:
  - "security"
  - "web-security"
  - "flask"
  - "python"
  - "api-security"
status: "published"
summary: "Audited a multi-tenant Flask order management REST service for security defects — cross-referencing implementation against a formal service specification and remediating all vulnerabilities while preserving full API behaviour."
---

## Task

Audit every file in a Flask REST service (`OrderVault`) — a multi-tenant order management platform — for security defects. A formal service specification defined intended API behaviour and security boundaries. The current implementation deviated from it. Remediate all defects in-place without changing the listening port, moving files, or altering resources outside `/app/service/`. All legitimate API behaviour must remain fully operational after fixes.

## Defects Found & Fixed

**Broken tenant isolation (IDOR)**
API endpoints accessed order records by ID without verifying the requesting user's tenant. A user from one tenant could read or modify orders belonging to another tenant by guessing IDs.

**Authentication bypass**
Certain endpoints performed authorisation checks after business logic execution — allowing unauthenticated requests to trigger state changes before being rejected.

**Missing input validation**
Several fields accepted arbitrary user input without type, length, or format validation — enabling injection-class vulnerabilities and unexpected server-side behaviour.

**Insecure direct object references**
Admin-only resources were gated by a client-supplied role field rather than server-side session state, allowing privilege escalation by parameter manipulation.

**Specification deviations**
Additional behavioural gaps where implementation diverged from the spec's defined error codes, response schemas, and state transition rules.

## Key Techniques

Multi-tenant access control, IDOR remediation, authentication flow auditing, input validation, privilege escalation patterns, specification-driven security review, Flask middleware

## Environment

Isolated Docker environment. Automated test suite exercised both legitimate API flows and attack scenarios, verifying security fixes held while all correct behaviour remained intact.

---
title: "T-Bench Task Engineering — Security"
createdAt: "2026-07-15T10:00:00.000Z"
updatedAt: "2026-08-19T10:00:00.000Z"
project: "handshake-ai-tbench"
tags:
  - "benchmark-engineering"
  - "harbor-framework"
  - "security"
  - "cryptography"
  - "reverse-engineering"
status: "published"
summary: "Designed and completed 5 Terminal-Bench-style security tasks for the Handshake AI Dynamo program — covering padding oracle attacks, ECDSA nonce bias exploitation, web security auditing, VM bytecode reverse engineering, and network forensics."
---

## Overview

Completed 5 security-domain tasks under the Handshake AI Dynamo benchmark program, each implemented as a self-contained Harbor task with deterministic Docker environments, automated test harnesses, and reproducible evaluation artifacts.

## Tasks Completed

### 1. AES-128-CBC Padding Oracle Attack

Implemented a byte-by-byte plaintext recovery engine exploiting a PKCS#7 padding oracle. Given a target ciphertext and an oracle function, recovered the full original plaintext by systematically manipulating IV bytes and observing padding validity responses. Required precise understanding of CBC block chaining and modular byte arithmetic.

**Key techniques:** CBC decryption internals, PKCS#7 padding structure, oracle query minimisation

---

### 2. ECDSA Nonce Bias Key Recovery

Analysed 830 interleaved ECDSA signatures across multiple devices on secp256k1. Identified devices with firmware-induced nonce bias (non-random `k` values following a latent mathematical relationship), isolated outlier signatures from firmware fallback paths, and recovered private keys via the signing equation. Used the recovered `dev_004` private key to perform ECIES decryption (ECDH shared secret → AES-256-CBC key derivation) and extract the encrypted flag.

**Key techniques:** ECDSA vulnerability analysis, lattice/algebraic nonce recovery, ECIES decryption, statistical outlier detection

---

### 3. Flask REST Service Security Audit & Remediation

Audited a multi-tenant order management platform (`OrderVault`) for security defects — cross-referencing implementation against a formal service specification. Identified and remediated vulnerabilities including broken access control, insecure direct object references, authentication bypasses, and input validation gaps, while preserving all legitimate API behaviour.

**Key techniques:** Multi-tenant security boundaries, OWASP Top 10, specification-driven auditing

---

### 4. VM Bytecode Exploitation — ELF Reverse Engineering

Reverse-engineered a statically-linked, stripped, PIE Linux ELF binary running a custom 64-bit virtual machine. Analysed a 9-opcode ISA with 8 registers and a 512-byte VM stack buffer. Discovered a vulnerability in the static range verifier (`verify_bytecode`) allowing crafted bytecode to bypass bounds checking. Derived the vault key derivation algorithm from the binary disassembly and exploited `SYS_UNLOCK_VAULT` to extract the flag. Binary hardened with ASLR, PIE, NX, stack canaries, and full RELRO.

**Key techniques:** ELF reverse engineering, custom VM ISA analysis, static analysis bypass, exploitation under modern mitigations

---

### 5. Network Forensics — C2 Detection & DNS Exfiltration Reconstruction

Investigated a PCAP capture and host system logs to identify a compromised internal host. Detected a C2 beaconing domain via DNS subdomain entropy analysis (mean label entropy > 3.5 bits/char with low inter-arrival coefficient of variation). Reconstructed an exfiltrated file split across 8 chunks — odd chunks in DNS TXT response records, even chunks in plaintext HTTP POST bodies — base32-decoded and merged in sequence-number order, verified by SHA-256. Distinguished malicious hosts from decoy hosts flagged by preliminary heuristics.

**Key techniques:** PCAP analysis, DNS exfiltration, base32 chunk reassembly, entropy-based C2 detection, host log forensics with timezone normalisation

---

## Infrastructure

All tasks built on the Harbor framework: Dockerfile-based isolated environments, `solve.sh` for deterministic solution execution, pytest-based automated scoring, and PR-driven review with CI feedback loops. Each task iterated through automated checks until all rubric criteria passed.

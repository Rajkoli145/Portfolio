---
title: "ECDSA Nonce Bias Attack — Private Key Recovery & ECIES Decryption"
createdAt: "2026-07-15T10:00:00.000Z"
updatedAt: "2026-07-15T10:00:00.000Z"
project: "tbench-harbor"
tags:
  - "security"
  - "cryptography"
  - "ecdsa"
  - "ecc"
  - "python"
status: "published"
summary: "Analysed 830 interleaved ECDSA signatures on secp256k1 to identify devices with firmware-induced nonce bias, recovered their private keys, and decrypted an ECIES-encrypted payload using the recovered key."
---

## Task

Analyse a log of 830 ECDSA signatures across multiple devices on secp256k1. Some devices had a firmware bug causing their per-signature nonces `k_i` to follow a latent mathematical relationship instead of being random. Others used RFC 6979 deterministic nonces or true randomness. Recover vulnerable devices' private keys and use `dev_004`'s recovered key to decrypt an ECIES payload.

## Approach

### 1. Vulnerability Detection

For each device, analysed the `(r, s)` values across all signatures. Devices with biased nonces exhibit a consistent algebraic relationship between nonce-derived values (e.g. linear, LCG, or lattice-reducible structure) that is absent in RFC 6979 / random-nonce devices. Identified vulnerable devices by testing for this consistency across signature pairs.

### 2. Outlier Exclusion

Vulnerable devices had a firmware fallback that occasionally signed with a fresh random nonce — these outlier signatures don't conform to the underlying relationship. Detected and excluded outliers before key recovery to avoid corrupting the algebraic system.

### 3. Private Key Recovery

Using the ECDSA signing equation `s_i = k_i⁻¹ * (hash_i + r_i * d) mod n`, and the recovered relationship between nonces, set up and solved the system to extract the private key `d` for each vulnerable device.

### 4. ECIES Decryption

Used `dev_004`'s recovered private key `d` to:
1. Compute ECDH shared secret: `d * ephemeral_pubkey`
2. Derive AES-256 key: `SHA-256(x-coordinate of shared secret as 32 big-endian bytes)`
3. Decrypt ciphertext with AES-256-CBC + PKCS7 using the provided IV

## Key Techniques

ECDSA vulnerability analysis, nonce bias detection, lattice/algebraic key recovery, ECIES decryption, ECDH key exchange, secp256k1 curve arithmetic, statistical outlier detection

## Environment

Isolated Docker environment. JSON output validated against exact expected values — vulnerable device list, recovered key, excluded outlier signature IDs, and decrypted flag.

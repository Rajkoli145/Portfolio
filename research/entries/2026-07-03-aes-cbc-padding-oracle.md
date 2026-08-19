---
title: "AES-128-CBC Padding Oracle Attack — Byte-by-Byte Plaintext Recovery"
createdAt: "2026-07-12T10:00:00.000Z"
updatedAt: "2026-07-12T10:00:00.000Z"
project: "tbench-harbor"
tags:
  - "security"
  - "cryptography"
  - "aes"
  - "padding-oracle"
  - "python"
status: "published"
summary: "Implemented a padding oracle attack against AES-128-CBC to recover the full original plaintext byte-by-byte, exploiting PKCS#7 padding validation without the decryption key."
---

## Task

A target ciphertext encrypted with AES-128-CBC was provided alongside a padding oracle — a function `check_padding(iv_bytes, ct_block_bytes)` returning `True` if PKCS#7 padding is valid after decryption, `False` otherwise. The decryption key was not given. Goal: recover the full plaintext and write it to `/app/recovered.json`.

## Approach

Implemented the classic padding oracle attack:

1. **Block decomposition** — Split the ciphertext into 16-byte blocks. The first 16 bytes of the provided hex string are the IV; the rest are ciphertext blocks.
2. **Byte-by-byte recovery** — For each block, recover the intermediate decryption output by systematically brute-forcing each byte (256 possibilities) while manipulating the preceding IV/ciphertext block to induce valid padding.
3. **Padding inversion** — For byte position `i` (working right to left within a block), set all already-recovered bytes to produce padding value `i`, then iterate the target byte until the oracle returns `True`. The valid byte XORed with the padding value reveals the intermediate byte.
4. **Plaintext derivation** — XOR intermediate bytes with the actual preceding ciphertext block to recover the plaintext.
5. **PKCS#7 strip** — Remove padding from the final block.

## Key Insight

CBC mode's decryption is: `P_i = D(C_i) XOR C_{i-1}`. The oracle reveals whether `D(C_i) XOR modified_C_{i-1}` has valid PKCS#7 padding. By controlling `modified_C_{i-1}`, you can recover `D(C_i)` one byte at a time — no key needed.

## Key Techniques

CBC block chaining, PKCS#7 padding structure, oracle query design, byte manipulation, modular arithmetic

## Environment

Isolated Docker environment. Automated validation compared recovered plaintext against ground truth exactly. Zero margin for error.

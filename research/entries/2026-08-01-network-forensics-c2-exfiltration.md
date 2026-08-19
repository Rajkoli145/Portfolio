---
title: "Network Forensics — C2 Detection & Dual-Channel DNS Exfiltration Reconstruction"
createdAt: "2026-08-01T10:00:00.000Z"
updatedAt: "2026-08-01T10:00:00.000Z"
project: "tbench-harbor"
tags:
  - "security"
  - "forensics"
  - "network-analysis"
  - "pcap"
  - "dns-exfiltration"
status: "published"
summary: "Investigated a PCAP capture and host logs to identify a compromised host, detect a C2 domain via entropy analysis, and reconstruct an 8-chunk exfiltrated file split across DNS TXT records and HTTP POST bodies."
---

## Task

Investigate `/app/data/capture.pcap` and `/app/data/host_system.log` to determine: which internal host was compromised, what C2 domain was used, what data was exfiltrated, when the intrusion began (UTC), and which hosts were flagged by a preliminary heuristic but ruled out as non-malicious.

## Approach

### 1. C2 Domain Detection

Applied the preliminary heuristic: flagged internal hosts sending DNS queries where mean subdomain label entropy > 3.5 bits/char AND inter-arrival coefficient of variation < 0.9 (regular beaconing pattern). Computed entropy per DNS query subdomain and inter-arrival statistics per source host.

Multiple hosts triggered the heuristic. Payload inspection confirmed the C2 host — decoy hosts sent high-entropy queries for legitimate services (CDNs, analytics) with coincidentally regular timing.

### 2. Exfiltration Reconstruction

The exfiltrated file was split into 8 chunks across two channels:
- **Odd chunks (1,3,5,7):** DNS TXT response records to the C2 domain (base32-encoded)
- **Even chunks (2,4,6,8):** Plaintext HTTP POST bodies to a separate domain (base32-encoded)

Each chunk carried an embedded sequence number. Extracted both channels from the PCAP, base32-decoded each chunk, merged in sequence-number order, and verified the SHA-256 digest.

### 3. Intrusion Timeline

Correlated host log timestamps with the compromise event. Converted local timestamps to UTC using the timezone offset from `asset_inventory.json` for `internal-web01`. Identified the earliest host-side event marking initial compromise.

## Output

JSON with: compromised host IP, C2 domain, exfiltrated file SHA-256 and byte count, UTC attack start timestamp, and list of decoy hosts ruled out by payload inspection.

## Key Techniques

PCAP analysis (packet dissection), Shannon entropy per DNS label, inter-arrival CoV computation, base32 multi-channel reassembly, log timezone normalisation, SHA-256 verification

## Environment

Isolated Docker environment with 3600-second time limit. JSON output validated against exact expected values.

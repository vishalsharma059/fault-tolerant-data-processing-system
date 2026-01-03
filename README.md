# Fault-Tolerant Data Processing System

## 📌 Overview

This system ingests **unreliable event data** from multiple external clients, normalizes it into a **strict canonical format**, prevents duplicate processing, and exposes **consistent aggregated results**.

Clients are assumed to be unreliable — they may send malformed data, change field names, resend events, or fail mid-request.  
The system is designed to remain **correct, consistent, and recoverable** under these conditions.

---

## 🧠 Core Design Principle

**Flexible input, strict internal contract**

- Incoming data is accepted with minimal assumptions
- Internal processing enforces a fixed canonical schema
- This separation ensures reliability without breaking clients

---

## 🧩 Handling Unreliable Client Behavior

### 1️⃣ Flexible Ingestion
- The ingestion API accepts **any JSON payload**
- Unknown or extra fields are allowed
- Raw events are stored **exactly as received**
- No schema validation at ingestion time

This prevents client-side changes from breaking the system.

---

### 2️⃣ Normalization Layer
- Raw events are converted into a **fixed canonical schema**
- Safe type conversions are applied (e.g. string → number)
- Required fields must be **unambiguously derivable**
- Events that cannot be normalized reliably are rejected

This avoids silent data corruption during aggregation.

---

### 3️⃣ Idempotency & Duplicate Prevention
- Each normalized event generates a **deterministic fingerprint**
- A unique index on the fingerprint ensures idempotency
- Duplicate events caused by retries are automatically ignored

Guarantees:
- No double counting  
- Safe retries  
- Consistent aggregates  

---

### 4️⃣ Failure Safety
- Raw events are written first (write-ahead logging)
- If processing fails mid-way, raw data remains persisted
- Retries generate the same fingerprint and are safely deduplicated

Ensures:
- No data loss  
- No inconsistent state  
- Safe recovery from partial failures  

---

## 📐 Canonical Internal Schema

All events are normalized into a strict internal format:

```json
{
  "clientId": "client_A",
  "metric": "value",
  "amount": 1200,
  "timestamp": "2024-01-01T00:00:00Z"
}
```

This schema is required to:

- Perform reliable aggregation  
- Keep business logic deterministic  
- Prevent ambiguous interpretation of data  

---

## ❌ Why Arbitrary Field Names Are Not Allowed

Allowing uncontrolled field variations (e.g. `amount`, `amounts`, `price`, `cost`) would make aggregation unreliable and ambiguous.

Instead, schema evolution is handled through:
- Explicit normalization rules  
- Client-specific mappings  
- Schema versioning (future enhancement)  

Rejecting unclear data is safer than guessing intent.

---

## ✅ Summary

- Incoming client data is flexible  
- Raw events are always preserved  
- Internal processing uses a strict schema  
- Idempotency prevents duplicate processing  
- Write-ahead logging ensures fault tolerance  
- Aggregated results remain correct and consistent  

---

## 🙋‍♂️ Author

**Vishal Sharma**  
Backend / Full Stack Developer  

🔗 LinkedIn: https://www.linkedin.com/in/vishalsharma2003  

⭐ If this system design helped you, consider giving it a star!

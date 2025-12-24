Fault-Tolerant Data Processing System
1. What assumptions did you make?

Incoming events may have inconsistent schemas and data types.

Clients may resend the same event multiple times.

There is no guaranteed unique event ID from clients.

Data loss is worse than accepting malformed or duplicate requests.

Aggregated data can always be derived from processed canonical events.

The system prioritizes correctness and safety over real-time performance.

2. How does your system prevent double counting?

Each normalized event generates a deterministic fingerprint based on its canonical content.

A unique index is enforced on the fingerprint field in MongoDB.

If a duplicate event is received (due to retries or resends), MongoDB rejects the insert.

Aggregates are updated only after a canonical event is successfully inserted.

As a result, duplicate events never affect aggregation results.

3. What happens if the database fails mid-request?

Raw events are stored first as a write-ahead log.

If normalization or canonical insertion fails, the raw event remains persisted.

When the client retries the request, the same fingerprint is generated.

Duplicate canonical inserts are safely ignored due to idempotency.

This ensures no data loss and no double processing.

4. What would break first at scale?

Fingerprint collision risk would increase with extremely high event volumes.

Aggregation updates could become a write bottleneck.

Raw event storage would grow indefinitely without archival or cleanup.

Normalization rules would require versioning as schemas evolve.

Background workers would be needed for reprocessing and aggregation recomputation.
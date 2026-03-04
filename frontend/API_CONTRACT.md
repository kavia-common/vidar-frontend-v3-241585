# Vidar Governance API Contract

**Contract Version:** v1
**Last Updated:** 2026

Canonical request and response structures for the Vidar Governance API.

The frontend must treat these as authoritative. Do not invent shapes.

**This document is the canonical definition of the Vidar API. If this document conflicts with generated code or types, this document wins.**

---

## ⚠️ Open Decision — Amendment States

The v2.2 frontend used these amendment lifecycle states:
`PROPOSED → UNDER_REVIEW → APPROVED → EXECUTED → REJECTED / WITHDRAWN`

This v3 contract currently defines: `PENDING | APPROVED | REJECTED | APPLIED`

**These are different. Confirm with the backend team which states v3 actually exposes
before generating any amendment UI or mutation code.**
Update `api.types.ts` and `api.schemas.ts` together once confirmed.

---

## Endpoint Index

- [Estate Health](#estate-health) — `GET /governance/estate-health`
- [Systems](#systems) — `GET /systems`, `GET /systems/:system_id`
- [Evaluations](#evaluations) — `GET /evaluations`, `POST /evaluations/trigger`
- [Amendments](#amendments) — `GET /amendments`, `POST /amendments`, `PATCH /amendments/:amendment_id`
- [Rules](#rules) — `GET /rules`

Violations are not a separate endpoint. Violation counts (`critical_count`, `warning_count`, `informational_count`) are fields on evaluation event responses.

---

## Base URL

```
/api/internal
```

---

## Authentication

Every request requires a Bearer JWT in the Authorization header.

```
Authorization: Bearer <token>
```

The token is obtained via the OIDC flow and injected into `fetcher.ts` via `setAuthToken()`. It is never persisted to localStorage or sessionStorage.

---

## Response Envelopes

### List responses

```json
{
  "items": [...],
  "total": 42,
  "page": 1,
  "page_size": 50,
  "has_next": true
}
```

### Single-resource responses

```json
{
  "data": { ... }
}
```

### Error responses (all non-2xx)

```json
{
  "error": {
    "code": "VIDAR-403",
    "message": "Unauthorized mutation",
    "details": {
      "required_role": "governance_admin"
    }
  }
}
```

Error codes follow the pattern `VIDAR-XXXX`.

---

## Standard Pagination Query Parameters

All list endpoints support these query parameters. Use exact parameter names — do not invent alternatives.

| Parameter   | Type    | Default | Description                  |
|-------------|---------|---------|------------------------------|
| `page`      | integer | `1`     | Page number (1-indexed)      |
| `page_size` | integer | `50`    | Results per page (max 100)   |

---

## Endpoints

---

### Estate Health

#### GET /api/internal/governance/estate-health

Returns aggregated estate-wide governance metrics for the overview dashboard.
This is a single-value response (not paginated).

**Response**
```json
{
  "total_systems": 24,
  "active_systems": 21,
  "inactive_systems": 3,
  "total_evaluations_last_30_days": 118,
  "systems_with_deny_last_30_days": 2,
  "systems_with_flag_last_30_days": 7,
  "total_critical_violations_last_30_days": 5,
  "total_warning_violations_last_30_days": 31,
  "systems_with_product_advisory_violations": 3,
  "systems_with_sovereignty_advisory_violations": 4
}
```

---

### Systems

#### GET /api/internal/systems

Returns all registered systems.

**Query parameters**

| Parameter           | Type    | Description                                               |
|---------------------|---------|-----------------------------------------------------------|
| `page`              | integer | Pagination (see standard params above)                    |
| `page_size`         | integer | Pagination (see standard params above)                    |
| `layer_id`          | integer | Filter by layer                                           |
| `sovereignty_level` | string  | Filter by sovereignty level (see enum reference)          |
| `is_active`         | boolean | Filter by active status                                   |

Example:

```
GET /api/internal/systems?layer_id=4&sovereignty_level=APPROVED&is_active=true
```

**Response**
```json
{
  "items": [
    {
      "system_id": "sys-001",
      "system_name": "Energy Distribution",
      "layer_id": 4,
      "sovereignty_level": "APPROVED",
      "zero_cloud_required": true,
      "is_active": true
    }
  ],
  "total": 12,
  "page": 1,
  "page_size": 50,
  "has_next": false
}
```

---

#### GET /api/internal/systems/:system_id

Returns a single system.

**Response**
```json
{
  "data": {
    "system_id": "sys-001",
    "system_name": "Energy Distribution",
    "layer_id": 4,
    "sovereignty_level": "APPROVED",
    "zero_cloud_required": true,
    "is_active": true
  }
}
```

---

### Evaluations

#### GET /api/internal/evaluations

Returns evaluation event history. Note: `target_system_name` is included for display purposes.

**Query parameters**

| Parameter          | Type    | Description                                               |
|--------------------|---------|-----------------------------------------------------------|
| `page`             | integer | Pagination (see standard params above)                    |
| `page_size`        | integer | Pagination (see standard params above)                    |
| `target_system_id` | string  | Filter by system                                          |
| `outcome`          | string  | Filter by outcome: `ALLOW`, `FLAG`, `DENY`                |
| `from`             | string  | ISO 8601 datetime — events at or after this time          |
| `to`               | string  | ISO 8601 datetime — events at or before this time         |

Example:

```
GET /api/internal/evaluations?target_system_id=sys-001&outcome=FLAG&from=2026-01-01T00:00:00Z
```

**Response**
```json
{
  "items": [
    {
      "event_id": "evt-123",
      "target_system_id": "sys-001",
      "target_system_name": "Energy Distribution",
      "event_type": "evaluation",
      "outcome": "ALLOW",
      "triggered_by": "system",
      "triggered_at": "2026-03-04T12:00:00Z",
      "rules_snapshot_hash": "a91c3f...",
      "critical_count": 0,
      "warning_count": 2,
      "informational_count": 1
    }
  ],
  "total": 42,
  "page": 1,
  "page_size": 50,
  "has_next": true
}
```

---

#### POST /api/internal/evaluations/trigger

Triggers a new evaluation. The backend executes all governance rules and returns the result.
The frontend must not predict or simulate the outcome.

**Request body**
```json
{
  "target_system_id": "sys-001",
  "event_type": "manual_trigger"
}
```

**Response** — returns the confirmed evaluation event
```json
{
  "data": {
    "event_id": "evt-124",
    "target_system_id": "sys-001",
    "target_system_name": "Energy Distribution",
    "event_type": "manual_trigger",
    "outcome": "FLAG",
    "triggered_by": "user:admin@vidar.internal",
    "triggered_at": "2026-03-04T12:05:00Z",
    "rules_snapshot_hash": "b72d1a...",
    "critical_count": 0,
    "warning_count": 3,
    "informational_count": 2
  }
}
```

---

### Amendments

#### GET /api/internal/amendments

Returns all amendments.

**Query parameters**

| Parameter          | Type    | Description                                                       |
|--------------------|---------|-------------------------------------------------------------------|
| `page`             | integer | Pagination (see standard params above)                            |
| `page_size`        | integer | Pagination (see standard params above)                            |
| `target_system_id` | string  | Filter by system                                                  |
| `status`           | string  | Filter by status (see ⚠️ amendment states note above)             |

**Response**
```json
{
  "items": [
    {
      "amendment_id": "amd-001",
      "target_system_id": "sys-001",
      "status": "PENDING",
      "created_at": "2026-03-04T09:00:00Z",
      "created_by": "user:reviewer@vidar.internal",
      "description": "Upgrade sovereignty level after audit"
    }
  ],
  "total": 5,
  "page": 1,
  "page_size": 50,
  "has_next": false
}
```

---

#### POST /api/internal/amendments

Creates a new amendment. The backend enforces all amendment lifecycle gates.

**Request body**
```json
{
  "target_system_id": "sys-001",
  "description": "Upgrade sovereignty level after audit"
}
```

**Response** — returns the created amendment
```json
{
  "data": {
    "amendment_id": "amd-002",
    "target_system_id": "sys-001",
    "status": "PENDING",
    "created_at": "2026-03-04T12:10:00Z",
    "created_by": "user:admin@vidar.internal",
    "description": "Upgrade sovereignty level after audit"
  }
}
```

---

#### PATCH /api/internal/amendments/:amendment_id

Approves or rejects an amendment. Only valid status transitions are accepted by the backend.
The frontend must not predict the outcome — always wait for the confirmed response and invalidate the query cache.

**Request body**
```json
{
  "status": "APPROVED",
  "reason": "Verified by governance committee"
}
```

**Response** — returns the updated amendment
```json
{
  "data": {
    "amendment_id": "amd-002",
    "target_system_id": "sys-001",
    "status": "APPROVED",
    "created_at": "2026-03-04T12:10:00Z",
    "created_by": "user:admin@vidar.internal",
    "description": "Upgrade sovereignty level after audit"
  }
}
```

---

### Rules

#### GET /api/internal/rules

Returns all governance rule metadata. Rules are executed exclusively by the backend.

**Query parameters**

| Parameter   | Type    | Description                                                  |
|-------------|---------|--------------------------------------------------------------|
| `page`      | integer | Pagination (see standard params above)                       |
| `page_size` | integer | Pagination (see standard params above)                       |
| `severity`  | string  | Filter by severity: `CRITICAL`, `WARNING`, `INFORMATIONAL`   |
| `scope`     | string  | Filter by scope: `ESTATE`, `LAYER`                           |
| `domain`    | string  | Exact match against the rule domain string                   |

**Response**
```json
{
  "items": [
    {
      "rule_code": "SOVR-001",
      "description": "System sovereignty level must be declared",
      "severity": "CRITICAL",
      "domain": "governance",
      "scope": "LAYER",
      "layer": 1
    },
    {
      "rule_code": "COMP-001",
      "description": "Components must be linked to a system",
      "severity": "CRITICAL",
      "domain": "governance",
      "scope": "LAYER",
      "layer": 2
    }
  ],
  "total": 12,
  "page": 1,
  "page_size": 50,
  "has_next": false
}
```

---

## Known Rule Codes (from v2.2 registry)

These are the rule codes the backend is expected to return. Do not hardcode these in frontend logic — they are reference only for display purposes.

| Code     | Name                                                    | Severity | Layer |
|----------|---------------------------------------------------------|----------|-------|
| SOVR-001 | System sovereignty level must be declared               | CRITICAL | 1     |
| SOVR-002 | Zero-cloud requirement must be visible at system level  | WARNING  | 1     |
| SOVR-003 | Inactive systems must be clearly marked                 | INFO     | 1     |
| SOVR-004 | System layer assignment must be present                 | WARNING  | 1     |
| COMP-001 | Components must be linked to a system                   | CRITICAL | 2     |
| CINT-001 | Interfaces must be discoverable for dependency mapping  | WARNING  | 3     |
| CINT-002 | Upstream/downstream relationships must be consistent    | WARNING  | 3     |
| CINT-003 | Component inventory should include product linkage      | INFO     | 3     |
| SUBS-001 | Subscription/entitlement state must be traceable        | INFO     | 4     |
| INTF-001 | Interface definitions must be traceable to systems      | WARNING  | 5     |
| PROD-001 | Product metadata should include canonical name/vendor   | INFO     | 6     |
| PROD-002 | Zero-cloud capability should be explicit in product     | WARNING  | 6     |

---

## Enum Reference

| Field               | Valid values                                                               |
|---------------------|----------------------------------------------------------------------------|
| `sovereignty_level` | `SOVEREIGN`, `APPROVED`, `CONDITIONAL`, `RESTRICTED`, `PROHIBITED`        |
| `outcome`           | `ALLOW`, `FLAG`, `DENY`                                                    |
| `status` (amendment)| See ⚠️ amendment states note at top of document                            |
| `severity`          | `CRITICAL`, `WARNING`, `INFORMATIONAL`                                     |
| `scope`             | `ESTATE`, `LAYER`                                                          |

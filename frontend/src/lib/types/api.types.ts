/**
 * Vidar Governance API Types
 *
 * PURPOSE
 * Canonical TypeScript types for all Vidar Governance API request and response shapes,
 * including list query parameters, mutation request bodies, and response envelopes.
 *
 * RULES
 * - All frontend code must import from this file instead of inventing structures.
 * - These types must mirror the backend API contract exactly.
 * - Zod schemas in api.schemas.ts must match every definition here.
 * - If the API contract changes, update this file and api.schemas.ts together.
 *
 * AI NOTE
 * When generating queries, components, or API code:
 * - Import types from here — never inline or guess shapes.
 * - Use the ListXxxParams types when constructing query strings for list endpoints.
 * - Mutation request types are at the bottom of this file.
 */

// ---------------------------------------------------------------------------
// Enums
// ---------------------------------------------------------------------------

export type SovereigntyLevel =
  | "SOVEREIGN"
  | "APPROVED"
  | "CONDITIONAL"
  | "RESTRICTED"
  | "PROHIBITED";

export type EvaluationOutcome = "ALLOW" | "FLAG" | "DENY";

/**
 * Amendment lifecycle states.
 *
 * ⚠️  DECISION REQUIRED BEFORE BUILDING
 * The v3 API contract defines: PENDING | APPROVED | REJECTED | APPLIED
 * The v2.2 frontend used:      PROPOSED | UNDER_REVIEW | APPROVED | EXECUTED | REJECTED | WITHDRAWN
 *
 * These are different. Confirm which states the v3 backend actually exposes
 * before generating any amendment UI or mutation code.
 * Update this type and AmendmentStatusSchema in api.schemas.ts together.
 */
export type AmendmentStatus = "PENDING" | "APPROVED" | "REJECTED" | "APPLIED";

export type RuleSeverity = "CRITICAL" | "WARNING" | "INFORMATIONAL";

export type RuleScope = "ESTATE" | "LAYER";

// ---------------------------------------------------------------------------
// Response envelopes
// ---------------------------------------------------------------------------

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  page_size: number;
  has_next: boolean;
}

export interface SingleResponse<T> {
  data: T;
}

export interface ApiErrorEnvelope {
  error: {
    code: string;       // e.g. "VIDAR-403"
    message: string;
    details?: Record<string, unknown>;
  };
}

// ---------------------------------------------------------------------------
// Domain response types
// ---------------------------------------------------------------------------

export interface ApiSystem {
  system_id: string;
  system_name: string;
  layer_id: number;
  sovereignty_level: SovereigntyLevel;
  zero_cloud_required: boolean;
  is_active: boolean;
}

export interface ApiEvaluationEvent {
  event_id: string;
  target_system_id: string;
  target_system_name: string;   // Human-readable system name for display
  event_type: string;
  outcome: EvaluationOutcome;
  triggered_by: string | null;
  triggered_at: string;         // ISO 8601
  rules_snapshot_hash: string;
  critical_count: number;
  warning_count: number;
  informational_count: number;
}

export interface ApiAmendment {
  amendment_id: string;
  target_system_id: string;
  status: AmendmentStatus;
  created_at: string;           // ISO 8601
  created_by: string;
  description?: string;
}

export interface ApiRuleMetadata {
  rule_code: string;
  description: string;
  severity: RuleSeverity;
  domain: string;
  scope: RuleScope;
  layer?: number;
}

/**
 * Response from GET /api/internal/governance/estate-health
 * Aggregated estate-wide governance metrics for the overview dashboard.
 */
export interface ApiEstateHealth {
  // System counts
  total_systems: number;
  active_systems: number;
  inactive_systems: number;

  // Last 30 days
  total_evaluations_last_30_days: number;
  systems_with_deny_last_30_days: number;
  systems_with_flag_last_30_days: number;
  total_critical_violations_last_30_days: number;
  total_warning_violations_last_30_days: number;

  // Advisory (all time)
  systems_with_product_advisory_violations: number;       // systems with PROD-001/PROD-002
  systems_with_sovereignty_advisory_violations: number;   // systems with SOVR-* warnings
}

// ---------------------------------------------------------------------------
// List query parameter types
//
// Use these when constructing URL query strings for list endpoints.
// All fields are optional — omit any field to use the backend default.
// Do not invent parameter names; only these names are accepted by the API.
// ---------------------------------------------------------------------------

/** Shared pagination fields present on every list endpoint. */
interface PaginationParams {
  /** Page number, 1-indexed. Default: 1. */
  page?: number;
  /** Results per page. Default: 50. Max: 100. */
  page_size?: number;
}

/** GET /api/internal/systems */
export interface ListSystemsParams extends PaginationParams {
  layer_id?: number;
  sovereignty_level?: SovereigntyLevel;
  is_active?: boolean;
}

/** GET /api/internal/evaluations */
export interface ListEvaluationsParams extends PaginationParams {
  target_system_id?: string;
  outcome?: EvaluationOutcome;
  /** ISO 8601 datetime. Returns events at or after this time. */
  from?: string;
  /** ISO 8601 datetime. Returns events at or before this time. */
  to?: string;
}

/** GET /api/internal/amendments */
export interface ListAmendmentsParams extends PaginationParams {
  target_system_id?: string;
  status?: AmendmentStatus;
}

/** GET /api/internal/rules */
export interface ListRulesParams extends PaginationParams {
  severity?: RuleSeverity;
  scope?: RuleScope;
  /** Exact match against the rule domain string. */
  domain?: string;
}

// ---------------------------------------------------------------------------
// Mutation request bodies
// ---------------------------------------------------------------------------

/** POST /api/internal/amendments */
export interface CreateAmendmentRequest {
  target_system_id: string;
  description: string;
}

/** PATCH /api/internal/amendments/:amendment_id */
export interface UpdateAmendmentStatusRequest {
  status: Extract<AmendmentStatus, "APPROVED" | "REJECTED">;
  reason?: string;
}

/** POST /api/internal/evaluations/trigger */
export interface TriggerEvaluationRequest {
  target_system_id: string;
  event_type: string;
}

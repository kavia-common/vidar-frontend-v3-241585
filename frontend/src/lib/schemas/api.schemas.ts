import { z, type ZodTypeAny } from "zod";

/**
 * Vidar Governance Zod Schemas
 *
 * PURPOSE
 * Runtime validation layer for all API responses.
 *
 * RULES
 * - Every API response must be validated with the appropriate schema before use.
 * - Schemas must stay in sync with api.types.ts. Change both together.
 * - Never bypass schema.parse() — use schema.safeParse() if you need error handling.
 *
 * AI NOTE
 * When adding a new endpoint:
 * 1. Add the TypeScript type to api.types.ts
 * 2. Add the matching Zod schema here
 * 3. Wrap it in PaginatedResponseSchema or SingleResponseSchema as appropriate
 */

// ---------------------------------------------------------------------------
// Enum schemas
// ---------------------------------------------------------------------------

export const SovereigntyLevelSchema = z.enum([
  "SOVEREIGN",
  "APPROVED",
  "CONDITIONAL",
  "RESTRICTED",
  "PROHIBITED",
]);

export const EvaluationOutcomeSchema = z.enum(["ALLOW", "FLAG", "DENY"]);

export const AmendmentStatusSchema = z.enum([
  "PENDING",
  "APPROVED",
  "REJECTED",
  "APPLIED",
]);

export const RuleSeveritySchema = z.enum([
  "CRITICAL",
  "WARNING",
  "INFORMATIONAL",
]);

export const RuleScopeSchema = z.enum(["ESTATE", "LAYER"]);

// ---------------------------------------------------------------------------
// Response envelope schemas
// ---------------------------------------------------------------------------

export const PaginatedResponseSchema = <T extends ZodTypeAny>(itemSchema: T) =>
  z.object({
    items: z.array(itemSchema),
    total: z.number(),
    page: z.number(),
    page_size: z.number(),
    has_next: z.boolean(),
  });

export const SingleResponseSchema = <T extends ZodTypeAny>(dataSchema: T) =>
  z.object({
    data: dataSchema,
  });

export const ApiErrorEnvelopeSchema = z.object({
  error: z.object({
    code: z.string(),
    message: z.string(),
    details: z.record(z.unknown()).optional(),
  }),
});

// ---------------------------------------------------------------------------
// Domain schemas
// ---------------------------------------------------------------------------

export const ApiSystemSchema = z.object({
  system_id: z.string(),
  system_name: z.string(),
  layer_id: z.number(),
  sovereignty_level: SovereigntyLevelSchema,
  zero_cloud_required: z.boolean(),
  is_active: z.boolean(),
});

export const ApiEvaluationEventSchema = z.object({
  event_id: z.string(),
  target_system_id: z.string(),
  event_type: z.string(),
  outcome: EvaluationOutcomeSchema,
  triggered_by: z.string(),
  triggered_at: z.string(),
  rules_snapshot_hash: z.string(),
  critical_count: z.number(),
  warning_count: z.number(),
  informational_count: z.number(),
});

export const ApiAmendmentSchema = z.object({
  amendment_id: z.string(),
  target_system_id: z.string(),
  status: AmendmentStatusSchema,
  created_at: z.string(),
  created_by: z.string(),
  description: z.string().optional(),
});

export const ApiRuleMetadataSchema = z.object({
  rule_code: z.string(),
  description: z.string(),
  severity: RuleSeveritySchema,
  domain: z.string(),
  scope: RuleScopeSchema,
  layer: z.number().optional(),
});

// ---------------------------------------------------------------------------
// Pre-composed paginated schemas (use these in query files)
// ---------------------------------------------------------------------------

export const PaginatedSystemsSchema = PaginatedResponseSchema(ApiSystemSchema);
export const PaginatedEvaluationsSchema = PaginatedResponseSchema(ApiEvaluationEventSchema);
export const PaginatedAmendmentsSchema = PaginatedResponseSchema(ApiAmendmentSchema);
export const PaginatedRulesSchema = PaginatedResponseSchema(ApiRuleMetadataSchema);

export const SingleSystemSchema = SingleResponseSchema(ApiSystemSchema);
export const SingleAmendmentSchema = SingleResponseSchema(ApiAmendmentSchema);

// ---------------------------------------------------------------------------
// Estate health schema (single response — not paginated)
// ---------------------------------------------------------------------------

export const ApiEstateHealthSchema = z.object({
  total_systems: z.number(),
  active_systems: z.number(),
  inactive_systems: z.number(),
  total_evaluations_last_30_days: z.number(),
  systems_with_deny_last_30_days: z.number(),
  systems_with_flag_last_30_days: z.number(),
  total_critical_violations_last_30_days: z.number(),
  total_warning_violations_last_30_days: z.number(),
  systems_with_product_advisory_violations: z.number(),
  systems_with_sovereignty_advisory_violations: z.number(),
});

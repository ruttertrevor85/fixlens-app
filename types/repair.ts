export type RepairCategory =
  | "general"
  | "plumbing"
  | "electrical"
  | "hvac"
  | "drywall"
  | "appliance";
export type RepairUrgency = "minor" | "moderate" | "urgent";
export interface AnalysisPayload {
  summary: string;
  image_findings: string[];
  possible_causes: string[];
  safe_first_steps: string[];
  difficulty: string;
  estimated_cost_range: string;
  safety_note: string;
  recommendation: string;
  review_price_cents: number;
}

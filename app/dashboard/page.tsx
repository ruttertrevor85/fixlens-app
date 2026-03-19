import { createSupabaseAdminClient } from "@/lib/supabase";
import ReviewerPanel from "../../components/ReviewerPanel";

export default async function DashboardPage() {
  let requests: any[] = [];
  let error = "";

  try {
    const supabase = createSupabaseAdminClient();

    const { data, error: dbError } = await supabase
      .from("repair_requests")
      .select(
        "id,email,category,urgency,description,status,ai_summary,created_at",
      )
      .in("status", ["review_requested", "review_in_progress"])
      .order("created_at", { ascending: false })
      .limit(20);

    if (dbError) throw dbError;

    requests = data || [];
  } catch (err) {
    error = err instanceof Error ? err.message : "Unable to load requests.";
  }

  return (
    <div className="card">
      <h1>Reviewer dashboard</h1>
      <p className="small">
        Paid repair requests waiting for review or currently in progress.
      </p>

      {error ? (
        <p className="small" style={{ color: "#b91c1c" }}>
          {error}
        </p>
      ) : null}

      <div style={{ height: 16 }} />

      <ReviewerPanel requests={requests} />
    </div>
  );
}

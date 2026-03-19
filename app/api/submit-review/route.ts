import { createSupabaseAdminClient } from "@/lib/supabase";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const repairRequestId = body.repairRequestId;
    const reviewText = body.reviewText;
    const materials = body.materials;
    const estimatedCost = body.estimatedCost;

    if (!repairRequestId) {
      return Response.json(
        { error: "Missing repairRequestId" },
        { status: 400 },
      );
    }

    if (!reviewText) {
      return Response.json({ error: "Missing reviewText" }, { status: 400 });
    }

    const supabase = createSupabaseAdminClient();

    const reviewInsert = await supabase.from("reviews").insert({
      repair_request_id: repairRequestId,
      review_text: reviewText,
      materials: materials || "",
      estimated_cost: estimatedCost || "",
    });

    if (reviewInsert.error) {
      console.error("Review insert error:", reviewInsert.error);
      return Response.json(
        { error: reviewInsert.error.message },
        { status: 500 },
      );
    }

    const requestUpdate = await supabase
      .from("repair_requests")
      .update({ status: "review_completed" })
      .eq("id", repairRequestId);

    if (requestUpdate.error) {
      console.error("Repair request update error:", requestUpdate.error);
      return Response.json(
        { error: requestUpdate.error.message },
        { status: 500 },
      );
    }

    return Response.json({ success: true });
  } catch (error: any) {
    console.error("SUBMIT_REVIEW_ERROR:", error);
    return Response.json(
      { error: error?.message || "Unable to submit review." },
      { status: 500 },
    );
  }
}

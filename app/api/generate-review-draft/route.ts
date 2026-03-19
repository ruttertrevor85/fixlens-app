import { openai } from "@/lib/openai";
import { createSupabaseAdminClient } from "@/lib/supabase";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const repairRequestId = body.repairRequestId;

    if (!repairRequestId) {
      return Response.json(
        { error: "Missing repairRequestId" },
        { status: 400 },
      );
    }

    const supabase = createSupabaseAdminClient();

    const { data: requestRow, error: requestError } = await supabase
      .from("repair_requests")
      .select("id, category, urgency, description, ai_summary")
      .eq("id", repairRequestId)
      .single();

    if (requestError || !requestRow) {
      return Response.json(
        { error: requestError?.message || "Repair request not found" },
        { status: 500 },
      );
    }

    const prompt = `
You are an experienced handyman writing a professional repair review for a customer.

Use the information below to generate:
1. reviewText
2. materials
3. estimatedCost

Write the response as strict JSON with these keys:
reviewText, materials, estimatedCost

Repair category: ${requestRow.category}
Urgency: ${requestRow.urgency}
Customer description: ${requestRow.description || "No description provided."}
AI summary: ${requestRow.ai_summary || "No AI summary available."}

Guidelines:
- Be practical and professional
- Explain the likely issue
- Suggest a recommended fix path
- Mention safety concerns if relevant
- Keep materials concise
- Estimated cost should be a simple range like "$40-$120"
`;

    const response = await openai.responses.create({
      model: "gpt-4.1-mini",
      input: [
        {
          role: "user",
          content: [{ type: "input_text", text: prompt }],
        },
      ],
      text: {
        format: {
          type: "json_schema",
          name: "review_draft",
          schema: {
            type: "object",
            additionalProperties: false,
            properties: {
              reviewText: { type: "string" },
              materials: { type: "string" },
              estimatedCost: { type: "string" },
            },
            required: ["reviewText", "materials", "estimatedCost"],
          },
        },
      },
    });

    if (!response.output_text) {
      return Response.json(
        { error: "OpenAI returned no output." },
        { status: 500 },
      );
    }

    const parsed = JSON.parse(response.output_text);

    return Response.json({
      reviewText: parsed.reviewText,
      materials: parsed.materials,
      estimatedCost: parsed.estimatedCost,
    });
  } catch (error: any) {
    console.error("GENERATE_REVIEW_DRAFT_ERROR:", error);
    return Response.json(
      { error: error?.message || "Unable to generate review draft." },
      { status: 500 },
    );
  }
}

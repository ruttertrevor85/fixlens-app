"use client";

import { useState } from "react";
import StartReviewButton from "./StartReviewButton";

type RepairRequest = {
  id: string;
  email: string;
  category: string;
  urgency: string;
  description: string;
  status: string;
  ai_summary: string | null;
  created_at?: string;
};

export default function ReviewerPanel({
  requests,
}: {
  requests: RepairRequest[];
}) {
  const [selectedRequestId, setSelectedRequestId] = useState<string | null>(
    null,
  );
  const [reviewText, setReviewText] = useState("");
  const [materials, setMaterials] = useState("");
  const [estimatedCost, setEstimatedCost] = useState("");
  const [isGeneratingDraft, setIsGeneratingDraft] = useState(false);
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);

  const selectedRequest =
    requests.find((request) => request.id === selectedRequestId) || null;

  async function generateReviewDraft(repairRequestId: string) {
    setIsGeneratingDraft(true);

    const res = await fetch("/api/generate-review-draft", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ repairRequestId }),
    });

    const data = await res.json();

    setIsGeneratingDraft(false);

    if (!res.ok) {
      alert(data.error || "Failed to generate repair plan");
      return;
    }

    setReviewText(data.reviewText || "");
    setMaterials(data.materials || "");
    setEstimatedCost(data.estimatedCost || "");
  }

  async function submitReview(repairRequestId: string) {
    setIsSubmittingReview(true);

    try {
      const res = await fetch("/api/submit-review", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          repairRequestId,
          reviewText,
          materials,
          estimatedCost,
        }),
      });

      const text = await res.text();
      let data: any = {};

      try {
        data = text ? JSON.parse(text) : {};
      } catch {
        data = { error: text || "Invalid server response" };
      }

      setIsSubmittingReview(false);

      if (!res.ok) {
        alert(data.error || "Failed to submit review");
        return;
      }

      alert("Review submitted successfully");
      window.location.reload();
    } catch (error: any) {
      setIsSubmittingReview(false);
      alert(error?.message || "Failed to submit review");
    }
  }

  return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
      <div className="card">
        <h2>Review Queue</h2>

        {requests.length === 0 ? (
          <p className="small">No review requests available.</p>
        ) : (
          <div style={{ display: "grid", gap: 12 }}>
            {requests.map((request) => (
              <div
                key={request.id}
                className="card"
                style={{
                  padding: 16,
                  border:
                    selectedRequestId === request.id
                      ? "2px solid #2563eb"
                      : "1px solid #ddd",
                  cursor: "pointer",
                }}
                onClick={() => setSelectedRequestId(request.id)}
              >
                <div style={{ marginBottom: 8 }}>
                  <strong>{request.email}</strong>
                </div>

                <div className="small" style={{ marginBottom: 8 }}>
                  {request.category} · {request.urgency} · {request.status}
                </div>

                <p style={{ marginBottom: 12 }}>{request.description}</p>

                {request.status === "review_requested" ? (
                  <StartReviewButton repairRequestId={request.id} />
                ) : null}
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="card">
        <h2>Review Workspace</h2>

        {!selectedRequest ? (
          <p className="small">Select a request from the queue.</p>
        ) : (
          <>
            <div style={{ marginBottom: 16 }}>
              <div style={{ marginBottom: 8 }}>
                <strong>{selectedRequest.email}</strong>
              </div>

              <div className="small" style={{ marginBottom: 8 }}>
                {selectedRequest.category} · {selectedRequest.urgency} ·{" "}
                {selectedRequest.status}
              </div>

              <p>{selectedRequest.description}</p>
            </div>

            {selectedRequest.ai_summary ? (
              <div style={{ marginBottom: 16 }}>
                <h3>AI Summary</h3>
                <pre
                  className="code"
                  style={{
                    whiteSpace: "pre-wrap",
                    wordBreak: "break-word",
                    maxHeight: "200px",
                    overflow: "auto",
                    background: "#f3f4f6",
                    padding: "12px",
                    borderRadius: "6px",
                    color: "#000000",
                  }}
                >
                  {selectedRequest.ai_summary}
                </pre>
              </div>
            ) : null}

            <div style={{ marginBottom: 16 }}>
              <button
                onClick={() => generateReviewDraft(selectedRequest.id)}
                disabled={isGeneratingDraft}
                style={{
                  padding: "10px 16px",
                  backgroundColor: "#2563eb",
                  color: "white",
                  border: "none",
                  borderRadius: "6px",
                  cursor: "pointer",
                  width: "fit-content",
                }}
              >
                {isGeneratingDraft ? "Generating..." : "Generate Repair Plan"}
              </button>
            </div>

            <div style={{ marginBottom: 16 }}>
              <label style={{ display: "block", marginBottom: 8 }}>
                Expert Review
              </label>
              <textarea
                value={reviewText}
                onChange={(e) => setReviewText(e.target.value)}
                rows={8}
                style={{ width: "100%" }}
              />
            </div>

            <div style={{ marginBottom: 16 }}>
              <label style={{ display: "block", marginBottom: 8 }}>
                Materials
              </label>
              <textarea
                value={materials}
                onChange={(e) => setMaterials(e.target.value)}
                rows={4}
                style={{ width: "100%" }}
              />
            </div>

            <div style={{ marginBottom: 16 }}>
              <label style={{ display: "block", marginBottom: 8 }}>
                Estimated Cost
              </label>
              <input
                type="text"
                value={estimatedCost}
                onChange={(e) => setEstimatedCost(e.target.value)}
                placeholder="$40-$120"
                style={{ width: "100%" }}
              />
            </div>

            <button
              onClick={() => submitReview(selectedRequest.id)}
              disabled={isSubmittingReview}
            >
              {isSubmittingReview ? "Submitting..." : "Submit Review"}
            </button>
          </>
        )}
      </div>
    </div>
  );
}

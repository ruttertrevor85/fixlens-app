"use client";

export default function StartReviewButton({
  repairRequestId,
}: {
  repairRequestId: string;
}) {
  async function startReview() {
    const res = await fetch("/api/start-review", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ repairRequestId }),
    });

    const data = await res.json();

    if (!res.ok) {
      alert(data.error || "Failed to start review");
      return;
    }

    alert("Review started");
  }

  return <button onClick={startReview}>Start Review</button>;
}

"use client";
import { useState } from "react";
import { useAuth } from "@/app/context/authContext";
import { apiUrl } from "../utils/getUtils";

export default function SubscriptionButtons() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);

  const startFreeTrial = async () => {
    if (!user) return;
    setLoading(true);
    await fetch(`${apiUrl}/subscription/free`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId: user.id }),
    });
    setLoading(false);
  };

  const payToss = async () => {
    if (!user) return;
    setLoading(true);
    await fetch(`${apiUrl}/subscription/toss`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        userId: user.id,
        amount: 5000,
        tossPaymentId: "...",
      }),
    });
    setLoading(false);
  };

  return (
    <div>
      <button onClick={startFreeTrial} disabled={loading}>
        무료 7일 체험 시작
      </button>
      <button onClick={payToss} disabled={loading}>
        유료 전환 결제
      </button>
    </div>
  );
}

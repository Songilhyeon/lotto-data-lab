"use client";
import { useState } from "react";
import useAuthGuard from "../hooks/useAuthGuard";
import { apiUrl } from "../utils/getUtils";

export default function SubscriptionButtons() {
  const { isAuthed, user } = useAuthGuard();
  const [loading, setLoading] = useState(false);

  const startFreeTrial = async () => {
    if (!isAuthed) return;
    setLoading(true);
    await fetch(`${apiUrl}/subscription/free`, {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({}), // ✅ userId 제거
    });
    setLoading(false);
  };

  const payToss = async () => {
    if (!user) return;
    setLoading(true);
    await fetch(`${apiUrl}/subscription/toss`, {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        amount: 3900,
        tossPaymentId: "TODO", // 실제 결제 후 paymentKey 등으로 교체
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

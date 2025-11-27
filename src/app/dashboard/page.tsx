"use client";
import React, { useEffect, useState } from "react";

export default function Dashboard() {
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetch("http://localhost:4000/api/auth/protected", {
      credentials: "include",
    })
      .then((res) => {
        if (!res.ok) throw new Error("Unauthorized");
        return res.json();
      })
      .then((data) => setMessage(data.message))
      .catch(() => setMessage("You must login"));
  }, []);

  return (
    <div>
      <main className="p-6">
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <p>{message}</p>
      </main>
    </div>
  );
}


"use client";

import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

function LoginSuccessContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [message, setMessage] = useState("Completing login...");

  useEffect(() => {
    const token = searchParams.get("token");

    if (!token) {
      setMessage("Login failed: token is missing.");
      return;
    }

    // Store the token using project auth conventions.
    localStorage.setItem("token", token);
    localStorage.setItem("estateintel_jwt_token", token);

    setMessage("Login successful! Redirecting...");

    router.replace("/dashboard");
  }, [searchParams, router]);

  return (
    <main style={{ padding: "40px", textAlign: "center" }}>
      <h1>Google Login</h1>
      <p>{message}</p>
    </main>
  );
}

export default function LoginSuccessPage() {
  return (
    <Suspense fallback={<div style={{ padding: "40px", textAlign: "center" }}>Loading login details...</div>}>
      <LoginSuccessContent />
    </Suspense>
  );
}

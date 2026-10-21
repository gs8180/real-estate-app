"use client";

import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Building2, CheckCircle2, AlertCircle, Loader2 } from "lucide-react";

function LoginSuccessContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
  const [message, setMessage] = useState("Completing authentication...");

  useEffect(() => {
    const token = searchParams.get("token");
    const roleParam = searchParams.get("role");

    if (!token) {
      setStatus("error");
      setMessage("Login failed: Authentication token was not received.");
      return;
    }

    try {
      let resolvedRole = roleParam ? roleParam.toUpperCase() : "";
      let email = "";

      // Decode JWT token payload
      const parts = token.split(".");
      if (parts.length >= 2) {
        const normalized = parts[1].replace(/-/g, "+").replace(/_/g, "/");
        const payload = JSON.parse(atob(normalized));

        if (!resolvedRole && payload.role) {
          resolvedRole = String(payload.role).replace(/^ROLE_/, "").toUpperCase();
        }
        if (payload.sub) {
          email = payload.sub;
        }
      }

      if (!resolvedRole) {
        resolvedRole = "BUYER";
      }

      // Store tokens and user role in localStorage
      localStorage.setItem("token", token);
      localStorage.setItem("estateintel_jwt_token", token);
      localStorage.setItem("estateintel_user_role", resolvedRole);
      if (email) {
        localStorage.setItem("userEmail", email);
      }

      setStatus("success");
      setMessage("Authenticated successfully! Loading your dashboard...");

      // Redirect directly to dashboard
      const timer = setTimeout(() => {
        router.replace("/dashboard");
      }, 700);

      return () => clearTimeout(timer);
    } catch (err) {
      console.error("Failed to process authentication:", err);
      setStatus("error");
      setMessage("Failed to parse authentication details. Please try signing in again.");
    }
  }, [searchParams, router]);

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#f3f7fd] p-4">
      <div className="w-full max-w-md rounded-3xl border border-slate-200 bg-white p-8 text-center shadow-lg">
        <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-600 text-white shadow-md shadow-blue-600/30">
          <Building2 size={32} />
        </div>

        <h1 className="text-2xl font-bold tracking-tight text-slate-900">
          Estate<span className="text-blue-600">Intel</span>
        </h1>

        <div className="mt-6 flex flex-col items-center">
          {status === "loading" && (
            <>
              <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
              <p className="mt-4 text-sm font-medium text-slate-700">{message}</p>
            </>
          )}

          {status === "success" && (
            <>
              <CheckCircle2 className="h-8 w-8 text-green-600" />
              <p className="mt-4 text-sm font-medium text-slate-700">{message}</p>
            </>
          )}

          {status === "error" && (
            <>
              <AlertCircle className="h-8 w-8 text-red-600" />
              <p className="mt-4 text-sm font-medium text-red-700">{message}</p>
              <button
                type="button"
                onClick={() => router.replace("/")}
                className="mt-6 rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-blue-700"
              >
                Return to Login
              </button>
            </>
          )}
        </div>
      </div>
    </main>
  );
}

export default function LoginSuccessPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-[#f3f7fd]">
          <p className="text-sm text-slate-500">Loading authentication details...</p>
        </div>
      }
    >
      <LoginSuccessContent />
    </Suspense>
  );
}

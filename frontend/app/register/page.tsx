"use client";

import { Suspense, useState, useEffect } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Building2,
  User,
  Mail,
  LockKeyhole,
  Eye,
  EyeOff,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
} from "lucide-react";

const API_URL =
  process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8080";

function RegisterContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const googleEmail = searchParams.get("email") || "";
  const googleName = searchParams.get("name") || "";
  const isGoogle = searchParams.get("google") === "true" || !!googleEmail;

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [role, setRole] = useState("BUYER");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    if (googleName) {
      setName(googleName);
    }
    if (googleEmail) {
      setEmail(googleEmail);
    }
  }, [googleName, googleEmail]);

  const handleRegister = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");
    setSuccess("");

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    if (password.length < 8) {
      setError("Password must contain at least 8 characters.");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(`${API_URL}/api/auth/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: name.trim(),
          email: email.trim(),
          password,
          role,
        }),
      });

      const data = await response.json().catch(() => null);

      if (!response.ok) {
        throw new Error(
          data?.message || "Registration failed. Please try again."
        );
      }

      if (isGoogle) {
        setSuccess(
          `Account created with role ${role.replaceAll("_", " ")}! You can now log in with Google to enter your dashboard directly.`
        );
      } else {
        setSuccess("Account created successfully. You can now sign in.");
      }

      setTimeout(() => {
        router.push("/");
      }, 2000);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to connect to the server."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-slate-100 px-4 py-8 sm:px-6">
      <div className="mx-auto max-w-lg rounded-3xl bg-white p-7 shadow-sm sm:p-10">
        <header className="mb-8">
          <div className="mb-8 flex items-center gap-3">
            <div className="rounded-xl bg-blue-600 p-3 text-white">
              <Building2 size={27} />
            </div>

            <div>
              <h1 className="text-2xl font-extrabold tracking-tight">
                Estate<span className="text-blue-600">Intel</span>
              </h1>
              <p className="text-xs text-slate-500">
                Real Estate Due Diligence Agent
              </p>
            </div>
          </div>

          <p className="mb-3 text-xs font-bold uppercase tracking-[0.18em] text-blue-600">
            {isGoogle ? "Complete Google Registration" : "Get started"}
          </p>

          <h2 className="text-3xl font-extrabold tracking-tight text-slate-900">
            {isGoogle ? "Choose your role" : "Create your account"}
          </h2>

          <p className="mt-2 text-sm text-slate-500">
            {isGoogle
              ? "Select your workspace role to finalize your Google account setup."
              : "Set up your property intelligence workspace."}
          </p>
        </header>

        {isGoogle && (
          <div className="mb-6 rounded-2xl border border-blue-200 bg-blue-50/70 p-4 text-blue-900">
            <div className="flex items-start gap-3">
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-blue-600 font-extrabold text-white text-sm">
                G
              </span>
              <div>
                <p className="text-sm font-semibold text-blue-950">
                  Google Authentication Verified
                </p>
                <p className="mt-0.5 text-xs text-blue-700">
                  Select your role below. After creating your account, next time you sign in with Google, you will go directly to your dashboard.
                </p>
              </div>
            </div>
          </div>
        )}

        <form onSubmit={handleRegister} className="space-y-5">
          <div>
            <label
              htmlFor="name"
              className="mb-2 block text-sm font-semibold text-slate-700"
            >
              Full name
            </label>

            <div className="flex items-center gap-3 rounded-xl border border-slate-200 px-4 focus-within:border-blue-500">
              <User size={18} className="text-slate-400" />

              <input
                id="name"
                type="text"
                autoComplete="name"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your full name"
                className="w-full py-4 text-sm outline-none"
              />
            </div>
          </div>

          <div>
            <div className="mb-2 flex items-center justify-between">
              <label
                htmlFor="email"
                className="block text-sm font-semibold text-slate-700"
              >
                Email address
              </label>
              {isGoogle && (
                <span className="inline-flex items-center gap-1 text-xs font-semibold text-green-600">
                  <CheckCircle2 size={13} /> Verified by Google
                </span>
              )}
            </div>

            <div
              className={`flex items-center gap-3 rounded-xl border px-4 ${
                isGoogle
                  ? "border-green-200 bg-green-50/30 text-slate-700"
                  : "border-slate-200 focus-within:border-blue-500"
              }`}
            >
              <Mail size={18} className={isGoogle ? "text-green-600" : "text-slate-400"} />

              <input
                id="email"
                type="email"
                autoComplete="email"
                required
                readOnly={isGoogle}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full py-4 text-sm outline-none bg-transparent"
              />
            </div>
          </div>

          <div>
            <label
              htmlFor="role"
              className="mb-2 block text-sm font-semibold text-slate-700"
            >
              Select your workspace role <span className="text-red-500">*</span>
            </label>

            <div className="relative">
              <select
                id="role"
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-white px-4 py-4 text-sm font-medium outline-none focus:border-blue-500"
              >
                <option value="BUYER">Buyer (Search properties, view diligence reports)</option>
                <option value="REAL_ESTATE_AGENT">Real Estate Agent (Manage listings & analytics)</option>
                <option value="LEGAL_REVIEWER">Legal Reviewer (Zoning, permits, title diligence)</option>
                <option value="FINANCIAL_INSTITUTION">Financial Institution (Mortgages & risk notes)</option>
              </select>
            </div>

            <p className="mt-2 text-xs text-slate-500">
              Select the role that matches your responsibilities. Administrator access must be assigned securely by an admin.
            </p>
          </div>

          <div>
            <label
              htmlFor="password"
              className="mb-2 block text-sm font-semibold text-slate-700"
            >
              {isGoogle ? "Set account password" : "Password"}
            </label>

            <div className="flex items-center gap-3 rounded-xl border border-slate-200 px-4 focus-within:border-blue-500">
              <LockKeyhole size={18} className="text-slate-400" />

              <input
                id="password"
                type={showPassword ? "text" : "password"}
                autoComplete="new-password"
                minLength={8}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="At least 8 characters"
                className="w-full py-4 text-sm outline-none"
              />

              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                aria-label={showPassword ? "Hide password" : "Show password"}
                className="text-slate-400 hover:text-slate-700"
              >
                {showPassword ? <EyeOff size={19} /> : <Eye size={19} />}
              </button>
            </div>
          </div>

          <div>
            <label
              htmlFor="confirmPassword"
              className="mb-2 block text-sm font-semibold text-slate-700"
            >
              Confirm password
            </label>

            <div className="flex items-center gap-3 rounded-xl border border-slate-200 px-4 focus-within:border-blue-500">
              <input
                id="confirmPassword"
                type="password"
                autoComplete="new-password"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm your password"
                className="w-full py-4 text-sm outline-none"
              />
            </div>
          </div>

          {error && (
            <p
              role="alert"
              className="rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700"
            >
              {error}
            </p>
          )}

          {success && (
            <p
              role="status"
              className="rounded-xl border border-green-200 bg-green-50 p-3 text-sm text-green-700"
            >
              {success}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="flex w-full items-center justify-center gap-3 rounded-xl bg-blue-600 px-5 py-4 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60 shadow-lg shadow-blue-600/20"
          >
            {loading ? "Creating account..." : isGoogle ? "Complete Registration" : "Create account"}
            {!loading && <ArrowRight size={19} />}
          </button>
        </form>

        <p className="mt-7 text-center text-sm text-slate-500">
          Already have an account?{" "}
          <Link
            href="/"
            className="font-semibold text-blue-600 hover:text-blue-700"
          >
            Sign in
          </Link>
        </p>
      </div>
    </main>
  );
}

export default function RegisterPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-slate-100">
          <p className="text-sm text-slate-500">Loading registration form...</p>
        </div>
      }
    >
      <RegisterContent />
    </Suspense>
  );
}

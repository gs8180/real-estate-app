"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Building2,
  Search,
  ShieldCheck,
  FileText,
  Mail,
  LockKeyhole,
  Eye,
  EyeOff,
  ArrowRight,
} from "lucide-react";

const API_URL =
  process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8080";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleLogin(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await fetch(`${API_URL}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim(), password }),
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(data.message || data.error || "Login failed.");
      }

      const token = data.token ?? data.accessToken;
      if (!token) throw new Error("JWT token was not returned.");

      const encodedPayload = token.split(".")[1];
      if (!encodedPayload) throw new Error("Invalid JWT token.");

      const normalized = encodedPayload
        .replace(/-/g, "+")
        .replace(/_/g, "/");
      const payload = JSON.parse(atob(normalized));

      const role = String(
        data.role ??
          data.user?.role ??
          data.userRole ??
          payload.role ??
          payload.authorities?.[0]?.authority ??
          payload.authorities?.[0] ??
          payload.roles?.[0] ??
          ""
      )
        .replace(/^ROLE_/, "")
        .toUpperCase();

      if (!role) throw new Error("User role was not found in the response.");

      localStorage.setItem("estateintel_jwt_token", token);
      localStorage.setItem("estateintel_user_role", role);

      router.push("/dashboard");
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Unable to connect to backend."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-[#f3f7fd] lg:grid lg:grid-cols-2">
      {/* LEFT BRAND PANEL */}
      <section className="relative hidden min-h-screen overflow-hidden bg-[#082d59] text-white lg:flex lg:flex-col">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1600&q=85')",
          }}
        />

        <div className="absolute inset-0 bg-gradient-to-b from-[#062650]/95 via-[#07396e]/80 to-[#03152d]/80" />

        <div className="relative z-10 flex min-h-screen flex-col px-10 py-9 xl:px-16">
          <div className="flex items-center gap-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl border border-white/20 bg-blue-500/30">
              <Building2 size={35} />
            </div>
            <div>
              <h1 className="text-3xl font-extrabold tracking-tight">
                Estate<span className="text-sky-400">Intel</span>
              </h1>
              <p className="mt-1 text-sm text-blue-100">
                Real Estate Due Diligence Agent
              </p>
            </div>
          </div>

          <div className="mt-16 max-w-xl xl:mt-20">
            <p className="mb-5 text-sm font-bold uppercase tracking-[0.22em] text-sky-300">
              Smarter property decisions
            </p>
            <h2 className="text-5xl font-extrabold leading-tight xl:text-6xl">
              Invest with
              <br />
              greater confidence.
            </h2>
            <p className="mt-6 max-w-lg text-lg leading-8 text-blue-100">
              Analyze property information, assess potential risks, and make
              informed real estate decisions from one intelligent workspace.
            </p>
          </div>

          <div className="mt-10 space-y-6">
            <Feature
              icon={<Search size={26} />}
              title="Property due diligence"
              description="Research and analyze property information"
            />
            <Feature
              icon={<ShieldCheck size={26} />}
              title="Risk-focused insights"
              description="Identify potential risks before investing"
            />
            <Feature
              icon={<FileText size={26} />}
              title="Data-driven decisions"
              description="Keep property findings organized"
            />
          </div>

          <p className="mt-auto pt-10 text-sm text-blue-100">
            Property research · Risk insights · Better decisions
          </p>
        </div>
      </section>

      {/* RIGHT LOGIN PANEL */}
      <section className="flex min-h-screen items-center justify-center px-5 py-10 sm:px-10 lg:px-12">
        <div className="w-full max-w-xl rounded-3xl border border-white bg-white p-6 shadow-[0_20px_70px_rgba(30,64,110,0.10)] sm:p-10 xl:p-12">
          <div className="mb-8 flex items-center justify-center gap-3 lg:hidden">
            <Building2 className="text-blue-600" size={38} />
            <div>
              <h1 className="text-2xl font-extrabold text-[#092b50]">
                Estate<span className="text-blue-600">Intel</span>
              </h1>
              <p className="text-xs text-slate-500">
                Real Estate Due Diligence Agent
              </p>
            </div>
          </div>

          <p className="text-sm font-bold tracking-[0.16em] text-blue-600">
            YOUR PROPERTY INTELLIGENCE WORKSPACE
          </p>
          <h2 className="mt-4 text-4xl font-extrabold tracking-tight text-[#10233f] sm:text-5xl">
            Welcome back
          </h2>
          <p className="mt-4 text-base text-slate-500 sm:text-lg">
            Sign in to continue to your account.
          </p>

          <form onSubmit={handleLogin} className="mt-9 space-y-6">
            <div>
              <label
                htmlFor="email"
                className="mb-2 block text-sm font-semibold text-slate-800"
              >
                Email address
              </label>
              <div className="relative">
                <Mail
                  size={20}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                />
                <input
                  id="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  placeholder="you@example.com"
                  className="w-full rounded-xl border border-slate-200 bg-white py-4 pl-12 pr-4 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="password"
                className="mb-2 block text-sm font-semibold text-slate-800"
              >
                Password
              </label>
              <div className="relative">
                <LockKeyhole
                  size={20}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                />
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  placeholder="Enter your password"
                  className="w-full rounded-xl border border-slate-200 bg-white py-4 pl-12 pr-12 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((value) => !value)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-blue-600"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            {error && (
              <div
                role="alert"
                className="rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700"
              >
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="flex w-full items-center justify-center gap-3 rounded-xl bg-gradient-to-r from-blue-600 to-blue-700 px-4 py-4 font-bold text-white shadow-lg shadow-blue-600/20 transition hover:from-blue-700 hover:to-blue-800 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? "Signing in..." : "Sign in"}
              {!loading && <ArrowRight size={21} />}
            </button>
          </form>

          <div className="my-7 flex items-center gap-4">
            <div className="h-px flex-1 bg-slate-200" />
            <span className="text-sm text-slate-400">or</span>
            <div className="h-px flex-1 bg-slate-200" />
          </div>

          <a
            href={`${API_URL}/oauth2/authorization/google`}
            className="flex w-full items-center justify-center gap-3 rounded-xl border border-slate-200 bg-white px-4 py-4 font-semibold text-slate-700 transition hover:border-blue-300 hover:bg-blue-50"
          >
            <span className="text-2xl font-extrabold text-blue-600">G</span>
            Continue with Google
          </a>

          <p className="mt-8 text-center text-sm text-slate-500">
            Don&apos;t have an account?{" "}
            <Link
              href="/register"
              className="font-bold text-blue-600 hover:text-blue-800"
            >
              Create account
            </Link>
          </p>

          <p className="mt-8 border-t border-slate-100 pt-5 text-center text-xs text-slate-400">
            Secure access to your property intelligence workspace.
          </p>
        </div>
      </section>
    </main>
  );
}

function Feature({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="flex items-center gap-4">
      <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl border border-white/20 bg-white/15">
        {icon}
      </div>
      <div>
        <h3 className="font-semibold">{title}</h3>
        <p className="mt-1 text-sm text-blue-100">{description}</p>
      </div>
    </div>
  );
}
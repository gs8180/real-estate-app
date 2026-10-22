"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Building2,
  Search,
  ShieldCheck,
  FileText,
  CheckCircle2,
  ArrowRight,
  ArrowUpRight,
  Sparkles,
  ShieldAlert,
  BarChart3,
  Database,
  Layers,
  Check,
  Globe,
  FileSpreadsheet,
  Clock,
  Award,
  ChevronRight,
  TrendingUp,
  MapPin,
  LockKeyhole,
  UserCheck,
} from "lucide-react";

const API_URL =
  process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8080";

export default function HomePage() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userRole, setUserRole] = useState<string | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("estateintel_jwt_token");
    const role = localStorage.getItem("estateintel_user_role");
    if (token) {
      setIsLoggedIn(true);
      setUserRole(role);
    }
  }, []);

  return (
    <div className="min-h-screen bg-[#081225] text-slate-100 selection:bg-blue-500 selection:text-white">
      {/* ======================================================== */}
      {/* 1. TOP NAVBAR                                            */}
      {/* ======================================================== */}
      <header className="fixed top-0 left-0 right-0 z-50 border-b border-slate-800/80 bg-[#081225]/85 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 sm:px-8">
          {/* Brand Logo */}
          <Link href="/" className="flex items-center gap-3.5 group">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-tr from-blue-600 to-sky-400 text-white shadow-lg shadow-blue-600/30 transition-transform duration-300 group-hover:scale-105">
              <Building2 size={24} />
            </div>
            <div>
              <span className="text-xl font-extrabold tracking-tight text-white">
                Estate<span className="text-sky-400">Intel</span>
              </span>
              <span className="hidden sm:block text-[10px] font-semibold tracking-wider text-slate-400 uppercase">
                Due Diligence Agent
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-300">
            <a href="#features" className="transition hover:text-sky-400">
              Features
            </a>
            <a href="#modules" className="transition hover:text-sky-400">
              Due Diligence
            </a>
            <a href="#how-it-works" className="transition hover:text-sky-400">
              How It Works
            </a>
            <a href="#roles" className="transition hover:text-sky-400">
              Solutions
            </a>
            <a href="#about" className="transition hover:text-sky-400">
              About
            </a>
          </nav>

          {/* Action Buttons */}
          <div className="flex items-center gap-2 sm:gap-3">
            <Link
              href="/login"
              className="rounded-xl border border-slate-700/80 bg-slate-900/60 px-3.5 py-2 text-xs sm:text-sm font-semibold text-slate-200 transition hover:border-slate-500 hover:bg-slate-800"
            >
              Login
            </Link>

            <Link
              href="/register"
              className="rounded-xl border border-slate-700/80 bg-slate-900/60 px-3.5 py-2 text-xs sm:text-sm font-semibold text-slate-200 transition hover:border-slate-500 hover:bg-slate-800"
            >
              Register
            </Link>

            <Link
              href="/dashboard"
              className="flex items-center gap-1.5 sm:gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-sky-500 px-4 sm:px-5 py-2 text-xs sm:text-sm font-semibold text-white shadow-lg shadow-blue-600/25 transition hover:brightness-110 active:scale-[0.98]"
            >
              <span>Go to Dashboard</span>
              <ArrowRight size={15} />
            </Link>
          </div>
        </div>
      </header>

      {/* ======================================================== */}
      {/* 2. HERO SECTION                                          */}
      {/* ======================================================== */}
      <section className="relative overflow-hidden pt-36 pb-20 lg:pt-44 lg:pb-32">
        {/* Glow Effects Background */}
        <div className="pointer-events-none absolute -top-40 left-1/2 h-[550px] w-[900px] -translate-x-1/2 rounded-full bg-blue-600/20 blur-[130px]" />
        <div className="pointer-events-none absolute top-64 right-10 h-72 w-72 rounded-full bg-sky-500/15 blur-[100px]" />

        <div className="relative mx-auto max-w-7xl px-5 sm:px-8">
          <div className="grid items-center gap-12 lg:grid-cols-12 lg:gap-16">
            {/* Left Hero Content */}
            <div className="lg:col-span-7">
              <div className="inline-flex items-center gap-2 rounded-full border border-sky-500/30 bg-sky-500/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-sky-300">
                <Sparkles size={14} className="text-sky-400" />
                Autonomous Property Intelligence & Risk Analytics
              </div>

              <h1 className="mt-6 text-4xl font-extrabold tracking-tight sm:text-6xl lg:text-6xl lg:leading-[1.12]">
                Uncover Hidden Risks.
                <br />
                <span className="bg-gradient-to-r from-sky-400 via-blue-400 to-indigo-300 bg-clip-text text-transparent">
                  Validate Property Truth.
                </span>
                <br />
                Invest With Confidence.
              </h1>

              <p className="mt-6 text-lg leading-relaxed text-slate-300 sm:text-xl">
                EstateIntel automatically aggregates and analyzes ownership chains, building permits, zoning codes, tax histories, flood zones, and environmental hazards in seconds—giving buyers, agents, and institutions complete clarity.
              </p>

              {/* Action Buttons */}
              <div className="mt-9 flex flex-wrap items-center gap-4">
                <Link
                  href="/register"
                  className="flex items-center gap-3 rounded-2xl bg-gradient-to-r from-blue-600 to-sky-500 px-7 py-4 text-base font-bold text-white shadow-xl shadow-blue-600/30 transition hover:brightness-110 active:scale-[0.98]"
                >
                  Start Due Diligence Free
                  <ArrowRight size={19} />
                </Link>

                <a
                  href={`${API_URL}/oauth2/authorization/google`}
                  className="flex items-center gap-3 rounded-2xl border border-slate-700 bg-slate-900/90 px-6 py-4 text-base font-semibold text-slate-200 transition hover:border-slate-500 hover:bg-slate-800"
                >
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-white font-black text-blue-600 text-xs">
                    G
                  </span>
                  Continue with Google
                </a>
              </div>

              {/* Feature Highlights Pills */}
              <div className="mt-10 grid grid-cols-2 gap-4 border-t border-slate-800/80 pt-8 sm:grid-cols-3">
                <div className="flex items-center gap-2 text-xs font-medium text-slate-400">
                  <CheckCircle2 size={16} className="text-emerald-400 shrink-0" />
                  Instant Automated Diligence
                </div>
                <div className="flex items-center gap-2 text-xs font-medium text-slate-400">
                  <CheckCircle2 size={16} className="text-emerald-400 shrink-0" />
                  Multi-Source Public Records
                </div>
                <div className="flex items-center gap-2 text-xs font-medium text-slate-400">
                  <CheckCircle2 size={16} className="text-emerald-400 shrink-0" />
                  Audit-Ready PDF & Excel
                </div>
              </div>
            </div>

            {/* Right Hero Interactive Live Due Diligence Card */}
            <div className="lg:col-span-5">
              <div className="relative rounded-3xl border border-slate-700/80 bg-gradient-to-b from-slate-900/90 to-slate-950 p-6 shadow-2xl shadow-blue-950/50 backdrop-blur-xl sm:p-8">
                {/* Header of preview card */}
                <div className="flex items-center justify-between border-b border-slate-800 pb-5">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600/20 text-sky-400 border border-blue-500/30">
                      <MapPin size={20} />
                    </div>
                    <div>
                      <div className="text-sm font-bold text-white">742 Evergreen Terrace</div>
                      <div className="text-xs text-slate-400">Beverly Hills, CA 90210</div>
                    </div>
                  </div>
                  <span className="rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-xs font-bold text-emerald-400">
                    Active Diligence
                  </span>
                </div>

                {/* Score & Valuation Row */}
                <div className="mt-5 grid grid-cols-2 gap-4">
                  <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-4">
                    <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                      Diligence Score
                    </span>
                    <div className="mt-1 flex items-baseline gap-2">
                      <span className="text-3xl font-extrabold text-emerald-400">94</span>
                      <span className="text-xs text-slate-400">/ 100</span>
                    </div>
                    <p className="mt-1 text-[11px] text-emerald-300 font-medium">Low Investment Risk</p>
                  </div>

                  <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-4">
                    <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                      Estimated Valuation
                    </span>
                    <div className="mt-1 text-2xl font-extrabold text-white">$1,450,000</div>
                    <p className="mt-1 text-[11px] text-sky-400 font-medium">+6.4% Area Growth</p>
                  </div>
                </div>

                {/* Verification Vectors Checklist */}
                <div className="mt-5 space-y-2.5">
                  <div className="text-xs font-bold uppercase tracking-wider text-slate-400">
                    Verified Intelligence Vectors
                  </div>

                  <div className="flex items-center justify-between rounded-xl bg-slate-800/40 p-3 text-xs border border-slate-800">
                    <span className="flex items-center gap-2.5 text-slate-200">
                      <CheckCircle2 size={15} className="text-emerald-400" />
                      Ownership & Title Chain
                    </span>
                    <span className="font-semibold text-emerald-400">Verified Clear</span>
                  </div>

                  <div className="flex items-center justify-between rounded-xl bg-slate-800/40 p-3 text-xs border border-slate-800">
                    <span className="flex items-center gap-2.5 text-slate-200">
                      <CheckCircle2 size={15} className="text-emerald-400" />
                      Zoning Regulations
                    </span>
                    <span className="font-semibold text-sky-400">R-1 Compliant</span>
                  </div>

                  <div className="flex items-center justify-between rounded-xl bg-slate-800/40 p-3 text-xs border border-slate-800">
                    <span className="flex items-center gap-2.5 text-slate-200">
                      <CheckCircle2 size={15} className="text-emerald-400" />
                      Property Tax & Liens
                    </span>
                    <span className="font-semibold text-emerald-400">Zero Delinquency</span>
                  </div>

                  <div className="flex items-center justify-between rounded-xl bg-slate-800/40 p-3 text-xs border border-slate-800">
                    <span className="flex items-center gap-2.5 text-slate-200">
                      <CheckCircle2 size={15} className="text-emerald-400" />
                      FEMA Flood Zone
                    </span>
                    <span className="font-semibold text-blue-400">Zone X (Minimal)</span>
                  </div>

                  <div className="flex items-center justify-between rounded-xl bg-slate-800/40 p-3 text-xs border border-slate-800">
                    <span className="flex items-center gap-2.5 text-slate-200">
                      <CheckCircle2 size={15} className="text-emerald-400" />
                      Building Permits History
                    </span>
                    <span className="font-semibold text-emerald-400">3 Approved / 0 Violations</span>
                  </div>
                </div>

                {/* Footer preview note */}
                <div className="mt-5 flex items-center justify-between border-t border-slate-800 pt-4 text-xs text-slate-400">
                  <span className="flex items-center gap-1.5 text-slate-300">
                    <Clock size={13} className="text-sky-400" />
                    Automated in 1.4 seconds
                  </span>
                  <Link
                    href="/register"
                    className="flex items-center gap-1 font-semibold text-sky-400 hover:text-sky-300"
                  >
                    Generate Report <ArrowUpRight size={13} />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ======================================================== */}
      {/* 3. METRICS / STATS BANNER                                */}
      {/* ======================================================== */}
      <section className="border-y border-slate-800 bg-[#060e1d]/80 py-12">
        <div className="mx-auto max-w-7xl px-5 sm:px-8">
          <div className="grid grid-cols-2 gap-8 text-center sm:grid-cols-4">
            <div>
              <div className="text-3xl font-extrabold text-sky-400 sm:text-4xl">10x</div>
              <div className="mt-1 text-xs font-medium text-slate-400 uppercase tracking-wider">
                Faster Due Diligence
              </div>
            </div>
            <div>
              <div className="text-3xl font-extrabold text-white sm:text-4xl">6 Key</div>
              <div className="mt-1 text-xs font-medium text-slate-400 uppercase tracking-wider">
                Risk Vectors Scanned
              </div>
            </div>
            <div>
              <div className="text-3xl font-extrabold text-emerald-400 sm:text-4xl">99.8%</div>
              <div className="mt-1 text-xs font-medium text-slate-400 uppercase tracking-wider">
                Record Accuracy
              </div>
            </div>
            <div>
              <div className="text-3xl font-extrabold text-blue-400 sm:text-4xl">5 Roles</div>
              <div className="mt-1 text-xs font-medium text-slate-400 uppercase tracking-wider">
                Role-Based Workspaces
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ======================================================== */}
      {/* 4. DUE DILIGENCE MODULES GRID (#modules)                 */}
      {/* ======================================================== */}
      <section id="modules" className="py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-5 sm:px-8">
          <div className="text-center">
            <span className="text-xs font-bold uppercase tracking-[0.2em] text-sky-400">
              Institutional-Grade Intelligence
            </span>
            <h2 className="mt-3 text-3xl font-extrabold tracking-tight sm:text-5xl text-white">
              End-to-End Real Estate Due Diligence
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-base text-slate-400 sm:text-lg">
              Every crucial property facet aggregated, cross-referenced, and summarized into actionable reports.
            </p>
          </div>

          <div className="mt-16 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            <ModuleCard
              icon={<Search className="text-blue-400" size={24} />}
              title="Property Search & Verification"
              description="Instantly locate properties with geocoded coordinates, legal parcel identifiers, lot boundaries, and architectural specs."
              tag="Property Discovery"
            />

            <ModuleCard
              icon={<Database className="text-emerald-400" size={24} />}
              title="Ownership Records & Title Chain"
              description="Trace complete deed histories, historical grantors, title transfers, and verify legitimate ownership clarity."
              tag="Title Diligence"
            />

            <ModuleCard
              icon={<Layers className="text-sky-400" size={24} />}
              title="Zoning & Land Use Compliance"
              description="Inspect zoning classifications, setbacks, allowable densities, and permitted residential or commercial building uses."
              tag="Zoning Intelligence"
            />

            <ModuleCard
              icon={<Building2 className="text-purple-400" size={24} />}
              title="Building Permits & Code Records"
              description="Uncover all historical alterations, open building permits, completed inspections, and unpermitted structural red flags."
              tag="Permit History"
            />

            <ModuleCard
              icon={<BarChart3 className="text-amber-400" size={24} />}
              title="Property Tax & Lien History"
              description="Evaluate annual assessments, land valuation trends, millage rates, and detect outstanding tax liens or delinquencies."
              tag="Financial Clarity"
            />

            <ModuleCard
              icon={<ShieldAlert className="text-red-400" size={24} />}
              title="Flood & Environmental Risk"
              description="Access official FEMA flood risk maps, FIRM panels, EPA soil registries, and local environmental hazard disclosures."
              tag="Hazard Scoring"
            />

            <ModuleCard
              icon={<TrendingUp className="text-emerald-400" size={24} />}
              title="Comparable Market Analysis (CMA)"
              description="Benchmark local recent sales, calculate price-per-square-foot ratios, and generate algorithmic fair valuation estimates."
              tag="Valuation Benchmark"
            />

            <ModuleCard
              icon={<FileSpreadsheet className="text-blue-400" size={24} />}
              title="Due Diligence Dossiers"
              description="Produce institutional-grade Due Diligence Reports in interactive web format or exportable PDF and Excel spreadsheets."
              tag="Diligence Reports"
            />

            <ModuleCard
              icon={<LockKeyhole className="text-cyan-400" size={24} />}
              title="Role-Based Security & Audit Logs"
              description="Enterprise access tiers for Buyers, Agents, Reviewers, and Lenders with immutable compliance activity logs."
              tag="Governance & Privacy"
            />
          </div>
        </div>
      </section>

      {/* ======================================================== */}
      {/* 5. HOW IT WORKS WORKFLOW (#how-it-works)                 */}
      {/* ======================================================== */}
      <section id="how-it-works" className="border-t border-slate-800 bg-[#060e1d] py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-5 sm:px-8">
          <div className="text-center">
            <span className="text-xs font-bold uppercase tracking-[0.2em] text-sky-400">
              Streamlined Process
            </span>
            <h2 className="mt-3 text-3xl font-extrabold tracking-tight sm:text-5xl text-white">
              How EstateIntel Operates
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-base text-slate-400 sm:text-lg">
              Transforming weeks of fragmented county portal searches into an autonomous 4-step workflow.
            </p>
          </div>

          <div className="mt-16 grid grid-cols-1 gap-8 md:grid-cols-4">
            <WorkflowStep
              step="01"
              title="Search Property"
              description="Enter any property address, city, or parcel ID into the search interface."
            />
            <WorkflowStep
              step="02"
              title="Automated Data Fetch"
              description="EstateIntel connects with county registries, tax databases, FEMA, and zoning authorities."
            />
            <WorkflowStep
              step="03"
              title="Risk Scoring"
              description="Our algorithms cross-examine anomalies, liens, flood exposures, and permit violations."
            />
            <WorkflowStep
              step="04"
              title="Executive Dossier"
              description="Receive an actionable summary score, detailed findings, and exportable PDF/Excel reports."
            />
          </div>
        </div>
      </section>

      {/* ======================================================== */}
      {/* 6. SOLUTIONS BY ROLE (#roles)                            */}
      {/* ======================================================== */}
      <section id="roles" className="py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-5 sm:px-8">
          <div className="text-center">
            <span className="text-xs font-bold uppercase tracking-[0.2em] text-sky-400">
              Tailored Solutions
            </span>
            <h2 className="mt-3 text-3xl font-extrabold tracking-tight sm:text-5xl text-white">
              Built for Every Real Estate Stakeholder
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-base text-slate-400 sm:text-lg">
              Tailored interfaces and permission boundaries ensure privacy and relevance for each workflow.
            </p>
          </div>

          <div className="mt-16 grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
            <RoleCard
              role="Property Buyers"
              subtitle="Invest with zero blind spots"
              features={[
                "Uncover undisclosed tax liens",
                "Verify legitimate title owners",
                "FEMA flood hazard alerts",
                "Exportable diligence summary",
              ]}
              color="from-blue-600 to-sky-500"
            />

            <RoleCard
              role="Real Estate Agents"
              subtitle="Accelerate deal velocity"
              features={[
                "Instant disclosure packages",
                "Comparable market valuation",
                "Verified listing intelligence",
                "Shareable reports for buyers",
              ]}
              color="from-emerald-600 to-teal-500"
            />

            <RoleCard
              role="Legal Reviewers"
              subtitle="Automate title & zoning diligence"
              features={[
                "Historical deed chain inspection",
                "Municipal zoning bylaw verification",
                "Building permit compliance",
                "Regulatory exposure flags",
              ]}
              color="from-amber-600 to-orange-500"
            />

            <RoleCard
              role="Financial Institutions"
              subtitle="Underwrite collateral securely"
              features={[
                "Risk-adjusted collateral assessment",
                "Tax assessment trend analysis",
                "Automated underwriting notes",
                "Portfolio due diligence audit",
              ]}
              color="from-purple-600 to-indigo-500"
            />
          </div>
        </div>
      </section>

      {/* ======================================================== */}
      {/* 7. HIGH-IMPACT CALL TO ACTION BANNER                     */}
      {/* ======================================================== */}
      <section className="py-16 sm:py-24">
        <div className="mx-auto max-w-7xl px-5 sm:px-8">
          <div className="relative overflow-hidden rounded-3xl border border-blue-500/30 bg-gradient-to-r from-blue-900/40 via-indigo-900/30 to-slate-900 p-8 text-center sm:p-14 lg:p-20 shadow-2xl shadow-blue-950/60">
            {/* Background Glow */}
            <div className="pointer-events-none absolute -bottom-20 -left-20 h-64 w-64 rounded-full bg-blue-600/30 blur-[90px]" />
            <div className="pointer-events-none absolute -top-20 -right-20 h-64 w-64 rounded-full bg-sky-400/20 blur-[90px]" />

            <div className="relative z-10 mx-auto max-w-3xl">
              <span className="inline-flex items-center gap-2 rounded-full border border-sky-400/30 bg-sky-400/10 px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-sky-300">
                Ready to Experience Next-Gen Due Diligence?
              </span>

              <h2 className="mt-6 text-3xl font-extrabold tracking-tight sm:text-5xl text-white">
                Eliminate Real Estate Blind Spots Today.
              </h2>

              <p className="mt-5 text-base text-slate-300 sm:text-lg">
                Join property investors, brokers, and legal reviewers using EstateIntel to research properties faster and close transactions with certainty.
              </p>

              <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
                <Link
                  href="/register"
                  className="flex items-center gap-2 rounded-2xl bg-gradient-to-r from-blue-600 to-sky-500 px-8 py-4 text-base font-bold text-white shadow-xl shadow-blue-600/30 transition hover:brightness-110 active:scale-[0.98]"
                >
                  Create Your Free Account
                  <ArrowRight size={18} />
                </Link>

                <Link
                  href="/login"
                  className="rounded-2xl border border-slate-700 bg-slate-900/80 px-8 py-4 text-base font-semibold text-slate-200 transition hover:border-slate-500 hover:bg-slate-800"
                >
                  Sign In to Workspace
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ======================================================== */}
      {/* 8. FOOTER (#about)                                       */}
      {/* ======================================================== */}
      <footer id="about" className="border-t border-slate-800 bg-[#050b17] py-14 text-slate-400 text-sm">
        <div className="mx-auto max-w-7xl px-5 sm:px-8">
          <div className="grid grid-cols-1 gap-10 md:grid-cols-12">
            {/* Brand Info */}
            <div className="md:col-span-5">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600 text-white">
                  <Building2 size={22} />
                </div>
                <span className="text-xl font-bold text-white">
                  Estate<span className="text-sky-400">Intel</span>
                </span>
              </div>
              <p className="mt-4 max-w-sm text-sm text-slate-400 leading-relaxed">
                Autonomous real estate intelligence agent aggregating public county records, zoning codes, permits, tax histories, and flood hazards for smarter investment decisions.
              </p>
              <div className="mt-5 text-xs text-slate-500">
                Institutional-grade security &bull; Role-based governance &bull; Audit trail
              </div>
            </div>

            {/* Quick Links */}
            <div className="md:col-span-3">
              <h4 className="text-sm font-semibold uppercase tracking-wider text-slate-200">
                Platform
              </h4>
              <ul className="mt-4 space-y-2.5 text-sm">
                <li>
                  <a href="#features" className="transition hover:text-sky-400">
                    Property Search
                  </a>
                </li>
                <li>
                  <a href="#modules" className="transition hover:text-sky-400">
                    Due Diligence Modules
                  </a>
                </li>
                <li>
                  <a href="#how-it-works" className="transition hover:text-sky-400">
                    How It Works
                  </a>
                </li>
                <li>
                  <Link href="/dashboard/reports" className="transition hover:text-sky-400">
                    Diligence Reports
                  </Link>
                </li>
              </ul>
            </div>

            {/* Solutions */}
            <div className="md:col-span-4">
              <h4 className="text-sm font-semibold uppercase tracking-wider text-slate-200">
                Access & Account
              </h4>
              <ul className="mt-4 space-y-2.5 text-sm">
                <li>
                  <Link href="/login" className="transition hover:text-sky-400">
                    Sign In
                  </Link>
                </li>
                <li>
                  <Link href="/register" className="transition hover:text-sky-400">
                    Create New Account
                  </Link>
                </li>
                <li>
                  <Link href="/dashboard" className="transition hover:text-sky-400">
                    Workspace Dashboard
                  </Link>
                </li>
                <li>
                  <a href={`${API_URL}/oauth2/authorization/google`} className="transition hover:text-sky-400">
                    Sign In with Google
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className="mt-12 flex flex-col items-center justify-between border-t border-slate-800/80 pt-8 sm:flex-row text-xs text-slate-500">
            <p>&copy; 2026 EstateIntel Real Estate Due Diligence Agent. All rights reserved.</p>
            <p className="mt-2 sm:mt-0">Confidential Property Intelligence System</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

function ModuleCard({
  icon,
  title,
  description,
  tag,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
  tag: string;
}) {
  return (
    <div className="group rounded-3xl border border-slate-800 bg-slate-900/60 p-7 transition-all duration-300 hover:border-slate-700 hover:bg-slate-900/90 hover:shadow-xl hover:shadow-blue-950/30">
      <div className="flex items-center justify-between">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-800/80 border border-slate-700/60 transition group-hover:scale-105">
          {icon}
        </div>
        <span className="rounded-full bg-slate-800/60 px-3 py-1 text-[11px] font-semibold text-slate-400">
          {tag}
        </span>
      </div>

      <h3 className="mt-6 text-lg font-bold text-white transition group-hover:text-sky-400">
        {title}
      </h3>

      <p className="mt-2.5 text-sm leading-relaxed text-slate-400">
        {description}
      </p>
    </div>
  );
}

function WorkflowStep({
  step,
  title,
  description,
}: {
  step: string;
  title: string;
  description: string;
}) {
  return (
    <div className="rounded-3xl border border-slate-800/90 bg-slate-900/50 p-6 relative">
      <span className="text-4xl font-black text-slate-800 block select-none">
        {step}
      </span>
      <h3 className="mt-3 text-lg font-bold text-white">{title}</h3>
      <p className="mt-2 text-xs leading-relaxed text-slate-400">
        {description}
      </p>
    </div>
  );
}

function RoleCard({
  role,
  subtitle,
  features,
  color,
}: {
  role: string;
  subtitle: string;
  features: string[];
  color: string;
}) {
  return (
    <div className="rounded-3xl border border-slate-800 bg-slate-900/60 p-6 flex flex-col justify-between">
      <div>
        <div className={`h-1.5 w-10 rounded-full bg-gradient-to-r ${color}`} />
        <h3 className="mt-4 text-xl font-bold text-white">{role}</h3>
        <p className="mt-1 text-xs text-slate-400">{subtitle}</p>

        <ul className="mt-6 space-y-3">
          {features.map((item, idx) => (
            <li key={idx} className="flex items-start gap-2 text-xs text-slate-300">
              <Check size={14} className="text-emerald-400 shrink-0 mt-0.5" />
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </div>

      <Link
        href="/register"
        className="mt-8 flex items-center justify-center gap-1.5 rounded-xl border border-slate-700 bg-slate-800/60 py-2.5 text-xs font-semibold text-slate-200 transition hover:border-slate-500 hover:bg-slate-700"
      >
        Select {role} <ChevronRight size={14} />
      </Link>
    </div>
  );
}
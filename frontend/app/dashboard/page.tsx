
"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
  Building2,
  Search,
  ShieldCheck,
  FileText,
  ArrowUpRight,
  Plus,
  Bell,
  Clock3,
  LogOut,
  Users,
} from "lucide-react";

import Sidebar from "@/components/dashboard/Sidebar";
import { hasPermission, UserRole } from "@/lib/permissions";

export default function Dashboard() {
  const router = useRouter();
  const [role, setRole] = useState<UserRole | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("estateintel_jwt_token");
    const savedRole = localStorage
      .getItem("estateintel_user_role")
      ?.toUpperCase();

    const roles: UserRole[] = [
      "BUYER",
      "REAL_ESTATE_AGENT",
      "LEGAL_REVIEWER",
      "FINANCIAL_INSTITUTION",
      "ADMINISTRATOR",
    ];

    if (!token || !savedRole || !roles.includes(savedRole as UserRole)) {
      router.replace("/");
      return;
    }

    setRole(savedRole as UserRole);
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem("estateintel_jwt_token");
    localStorage.removeItem("estateintel_user_role");
    localStorage.removeItem("userEmail");
    router.replace("/");
  };

  if (!role) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50">
        <p className="text-sm text-slate-600">
          Loading your dashboard...
        </p>
      </div>
    );
  }

  const workflows = [
    {
      module: "propertySearch",
      href: "/dashboard/property-search",
      title: "Property Search",
      description: "Find and explore properties for analysis.",
      icon: <Search size={20} />,
      color: "blue" as const,
    },
    {
      module: "dueDiligence",
      href: "/dashboard/due-diligence",
      title: "Due Diligence",
      description: "Review property documents and key details.",
      icon: <FileText size={20} />,
      color: "purple" as const,
    },
    {
      module: "riskAssessment",
      href: "/dashboard/risk-assessment",
      title: "Risk Assessment",
      description: "Review potential property risks.",
      icon: <ShieldCheck size={20} />,
      color: "orange" as const,
    },
    {
      module: "comparableProperties",
      href: "/dashboard/comparable-properties",
      title: "Comparable Properties",
      description: "Compare property prices and market trends.",
      icon: <Building2 size={20} />,
      color: "blue" as const,
    },
    {
      module: "reports",
      href: "/dashboard/reports",
      title: "Reports",
      description: "Access property analysis reports.",
      icon: <FileText size={20} />,
      color: "green" as const,
    },
    {
      module: "userManagement",
      href: "/dashboard/user-management",
      title: "User Management",
      description: "View registered users and their roles.",
      icon: <Users size={20} />,
      color: "purple" as const,
    },
    {
      module: "auditLogs",
      href: "/dashboard/audit-logs",
      title: "Audit Logs",
      description: "Review system activity records.",
      icon: <Clock3 size={20} />,
      color: "orange" as const,
    },
  ];

  const visibleWorkflows = workflows.filter((workflow) =>
    hasPermission(role, workflow.module, "view")
  );

  return (
    <div className="min-h-screen bg-slate-50 md:flex">
      <Sidebar />

      <main className="min-w-0 flex-1 px-5 py-8 text-slate-900 sm:px-8">
        <div className="mx-auto max-w-7xl">
          <header className="mb-8 flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="mb-2 text-xs font-medium uppercase tracking-wide text-blue-600">
                EstateIntel Workspace
              </p>

              <h1 className="text-3xl font-bold tracking-tight">
                Dashboard
              </h1>

              <p className="mt-2 text-sm text-slate-500">
                Your property intelligence workspace at a glance.
              </p>

              <p className="mt-3 inline-flex rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700">
                Role: {role.replaceAll("_", " ")}
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              {hasPermission(role, "propertySearch", "create") && (
                <Link
                  href="/dashboard/property-search"
                  className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-600/20 transition hover:bg-blue-700"
                >
                  <Plus size={17} />
                  Find a property
                </Link>
              )}

              <button
                type="button"
                onClick={handleLogout}
                className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-100"
              >
                <LogOut size={17} />
                Logout
              </button>
            </div>
          </header>

          {/* Overview cards */}
          <section className="mb-7 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <OverviewCard
              href="/dashboard/property-search"
              label="Properties"
              title="Explore"
              description="Search property records"
              icon={<Building2 size={19} />}
            />

            <OverviewCard
              href="/dashboard/due-diligence"
              label="Due Diligence"
              title="Review"
              description="Check property details"
              icon={<FileText size={19} />}
            />

            <OverviewCard
              href="/dashboard/risk-assessment"
              label="Risk Assessment"
              title="Analyze"
              description="Identify potential risks"
              icon={<ShieldCheck size={19} />}
            />

            <OverviewCard
              href="/dashboard/notifications"
              label="Notifications"
              title="Updates"
              description="Review recent activity"
              icon={<Bell size={19} />}
            />
          </section>

          {/* Available workflows */}
          <section className="grid grid-cols-1 gap-5 xl:grid-cols-12">
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm xl:col-span-7">
              <div className="mb-6">
                <h2 className="text-lg font-semibold">Get started</h2>
                <p className="mt-1 text-sm text-slate-500">
                  Choose a workflow available for your role.
                </p>
              </div>

              {visibleWorkflows.length > 0 ? (
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  {visibleWorkflows.map((workflow) => (
                    <WorkflowCard
                      key={workflow.module}
                      href={workflow.href}
                      title={workflow.title}
                      description={workflow.description}
                      icon={workflow.icon}
                      color={workflow.color}
                    />
                  ))}
                </div>
              ) : (
                <p className="rounded-xl bg-slate-50 p-5 text-sm text-slate-500">
                  No workflows are configured for this role yet.
                </p>
              )}
            </div>

            {/* Recent activity */}
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm xl:col-span-5">
              <div className="mb-6 flex items-center gap-3">
                <div className="rounded-xl bg-blue-50 p-3 text-blue-600">
                  <Clock3 size={21} />
                </div>

                <div>
                  <h2 className="font-semibold">Recent activity</h2>
                  <p className="text-sm text-slate-500">
                    Your workspace activity
                  </p>
                </div>
              </div>

              <div className="flex min-h-48 flex-col items-center justify-center rounded-xl border border-dashed border-slate-300 px-5 py-8 text-center">
                <Building2 size={30} className="mb-4 text-slate-400" />

                <h3 className="font-semibold">
                  Start your property workflow
                </h3>

                <p className="mt-2 max-w-sm text-sm leading-6 text-slate-500">
                  Search for a property to begin due diligence and risk analysis.
                </p>

                {hasPermission(role, "propertySearch", "view") && (
                  <Link
                    href="/dashboard/property-search"
                    className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-blue-600 hover:text-blue-700"
                  >
                    Search properties
                    <ArrowUpRight size={17} />
                  </Link>
                )}
              </div>
            </div>
          </section>

          <footer className="mt-8 text-center text-xs text-slate-400">
            EstateIntel · Property Intelligence Workspace
          </footer>
        </div>
      </main>
    </div>
  );
}

function OverviewCard({
  href,
  label,
  title,
  description,
  icon,
}: {
  href: string;
  label: string;
  title: string;
  description: string;
  icon: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      className="group block rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-blue-300 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500"
    >
      <div className="mb-4 flex items-center justify-between">
        <span className="text-xs font-medium text-slate-500">
          {label}
        </span>
        <span className="text-blue-600">{icon}</span>
      </div>

      <h2 className="text-xl font-bold">{title}</h2>

      <p className="mt-1 text-sm text-slate-500">{description}</p>

      <div className="mt-4 flex justify-end">
        <ArrowUpRight
          size={17}
          className="text-slate-400 transition group-hover:text-blue-600"
        />
      </div>
    </Link>
  );
}

function WorkflowCard({
  href,
  title,
  description,
  icon,
  color,
}: {
  href: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  color: "blue" | "purple" | "orange" | "green";
}) {
  const colors = {
    blue: "bg-blue-50 text-blue-600",
    purple: "bg-purple-50 text-purple-600",
    orange: "bg-amber-50 text-amber-600",
    green: "bg-emerald-50 text-emerald-600",
  };

  return (
    <Link
      href={href}
      className="group rounded-xl border border-slate-200 p-4 transition hover:border-blue-300 hover:bg-slate-50"
    >
      <div className="mb-4 flex items-center justify-between">
        <span className={`rounded-xl p-2.5 ${colors[color]}`}>
          {icon}
        </span>

        <ArrowUpRight
          size={17}
          className="text-slate-400 transition group-hover:text-blue-600"
        />
      </div>

      <h3 className="text-sm font-semibold">{title}</h3>

      <p className="mt-2 text-xs leading-5 text-slate-500">
        {description}
      </p>
    </Link>
  );
}

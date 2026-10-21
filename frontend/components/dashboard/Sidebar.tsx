"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Building2,
  LayoutDashboard,
  Search,
  ClipboardCheck,
  ShieldAlert,
  Building,
  FileBarChart,
  Users,
  History,
  ChevronRight,
  Shield,
} from "lucide-react";

const menuItems = [
  {
    name: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    name: "Property Search",
    href: "/dashboard/property-search",
    icon: Search,
  },
  {
    name: "Due Diligence",
    href: "/dashboard/due-diligence",
    icon: ClipboardCheck,
  },
  {
    name: "Risk Assessment",
    href: "/dashboard/risk-assessment",
    icon: ShieldAlert,
  },
  {
    name: "Comparable Properties",
    href: "/dashboard/comparable-properties",
    icon: Building,
  },
  {
    name: "Reports",
    href: "/dashboard/reports",
    icon: FileBarChart,
  },
  {
    name: "User Management",
    href: "/dashboard/user-management",
    icon: Users,
    adminOnly: true,
  },
  {
    name: "Audit Logs",
    href: "/dashboard/audit-logs",
    icon: History,
    adminOnly: true,
  },
];

export default function Sidebar() {
  const pathname = usePathname();
  const [role, setRole] = useState<string | null>(null);

  useEffect(() => {
    const savedRole = localStorage.getItem("estateintel_user_role")?.toUpperCase();
    if (savedRole) {
      setRole(savedRole);
    }
  }, []);

  const filteredMenuItems = menuItems.filter((item) => {
    if (item.adminOnly) {
      return role === "ADMINISTRATOR";
    }
    return true;
  });

  return (
    <aside className="fixed inset-y-0 left-0 z-40 flex w-[260px] flex-col border-r border-slate-800 bg-[#101827] text-white">
      {/* Brand */}
      <div className="flex items-center gap-3 px-6 py-6">
        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-600 shadow-lg shadow-blue-950/40">
          <Building2 size={25} />
        </div>

        <div>
          <h1 className="text-xl font-bold tracking-tight">EstateIntel</h1>
          <p className="text-xs text-slate-400">Real Estate Intelligence</p>
        </div>
      </div>

      <div className="mx-5 border-t border-slate-800" />

      {/* Navigation */}
      <nav className="flex-1 space-y-2 overflow-y-auto px-4 py-7">
        <p className="mb-4 px-3 text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500">
          Workspace
        </p>

        {filteredMenuItems.map((item) => {
          const isActive =
            item.href === "/dashboard"
              ? pathname === "/dashboard"
              : pathname === item.href || pathname.startsWith(`${item.href}/`);

          const Icon = item.icon;

          return (
            <Link
              key={item.name}
              href={item.href}
              aria-current={isActive ? "page" : undefined}
              className={`group relative flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium transition-all duration-200 ${
                isActive
                  ? "bg-blue-600/20 text-blue-300"
                  : "text-slate-400 hover:bg-slate-800 hover:text-white"
              }`}
            >
              {isActive && (
                <span className="absolute bottom-2 left-0 top-2 w-1 rounded-r-full bg-blue-500" />
              )}

              <Icon
                size={19}
                strokeWidth={isActive ? 2.3 : 1.8}
                className={
                  isActive
                    ? "text-blue-400"
                    : "text-slate-500 group-hover:text-slate-200"
                }
              />

              <span className="flex-1">{item.name}</span>

              {isActive && <ChevronRight size={16} className="text-blue-400" />}
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="border-t border-slate-800 p-4">
        <div className="rounded-xl bg-slate-800/70 p-4">
          <div className="flex items-center gap-2">
            <Shield size={16} className="text-blue-400" />
            <p className="text-xs font-semibold text-slate-200">
              {role ? role.replaceAll("_", " ") : "Member"}
            </p>
          </div>
          <p className="mt-1 text-[11px] text-slate-400">
            Due Diligence Workspace
          </p>
        </div>
      </div>
    </aside>
  );
}

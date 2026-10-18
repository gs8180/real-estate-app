
"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";

const API =
    process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

type AuditLog = {
    id: number;
    action: string;
    username: string;
    propertyId: number;
    details: string;
    timestamp: string;
};

function formatDate(value?: string) {
    if (!value) return "Not available";

    const date = new Date(value);

    return Number.isNaN(date.getTime())
        ? value
        : date.toLocaleString();
}

export default function AuditLogsPage() {
    const router = useRouter();

    const [logs, setLogs] = useState<AuditLog[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [search, setSearch] = useState("");
    const [actionFilter, setActionFilter] = useState("ALL");

    const loadLogs = useCallback(async () => {
        setLoading(true);
        setError("");

        try {
            const token = localStorage.getItem("estateintel_jwt_token");

            const response = await fetch(`${API}/api/audit`, {
                headers: token
                    ? { Authorization: `Bearer ${token}` }
                    : {},
                credentials: "include",
                cache: "no-store",
            });

            if (!response.ok) {
                const message = await response.text();
                throw new Error(
                    `Failed to load audit logs (${response.status}). ${message || ""
                    }`
                );
            }

            const data: unknown = await response.json();

            let records: unknown[] | null = null;

            if (Array.isArray(data)) {
                records = data;
            } else if (
                data &&
                typeof data === "object" &&
                "content" in data &&
                Array.isArray(data.content)
            ) {
                records = data.content;
            } else if (
                data &&
                typeof data === "object" &&
                "data" in data &&
                Array.isArray(data.data)
            ) {
                records = data.data;
            }

            if (!records) {
                throw new Error("Unexpected audit API response format.");
            }

            setLogs(records as AuditLog[]);
        } catch (err) {
            setLogs([]);
            setError(
                err instanceof Error
                    ? err.message
                    : "Unable to load audit logs."
            );
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        void loadLogs();
    }, [loadLogs]);

    const actions = Array.from(
        new Set(logs.map((log) => log.action || "Unknown"))
    );

    const filteredLogs = logs.filter((log) => {
        const searchableText = [
            log.id,
            log.action,
            log.username,
            log.propertyId,
            log.details,
            log.timestamp,
        ]
            .map((value) => String(value ?? ""))
            .join(" ")
            .toLowerCase();

        const matchesSearch = searchableText.includes(
            search.toLowerCase()
        );

        const matchesAction =
            actionFilter === "ALL" ||
            log.action === actionFilter;

        return matchesSearch && matchesAction;
    });

    function exportCSV() {
        const headers = [
            "ID",
            "Action",
            "Username",
            "Property ID",
            "Details",
            "Timestamp",
        ];

        const rows = filteredLogs.map((log) => [
            log.id,
            log.action,
            log.username,
            log.propertyId,
            log.details,
            log.timestamp,
        ]);

        const escapeCSV = (value: unknown) =>
            `"${String(value ?? "").replace(/"/g, '""')}"`;

        const csv = [headers, ...rows]
            .map((row) => row.map(escapeCSV).join(","))
            .join("\r\n");

        const blob = new Blob(["\uFEFF" + csv], {
            type: "text/csv;charset=utf-8;",
        });

        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");

        link.href = url;
        link.download = "audit-logs.csv";
        document.body.appendChild(link);
        link.click();
        link.remove();

        URL.revokeObjectURL(url);
    }

    return (
        <main className="min-h-screen bg-slate-50 p-4 md:p-8">
            <div className="mx-auto max-w-7xl">
                <button
                    type="button"
                    onClick={() => router.push("/dashboard")}
                    className="mb-6 rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-100"
                >
                    ← Back to Dashboard
                </button>

                <header className="mb-8">
                    <p className="text-sm font-semibold uppercase tracking-wider text-blue-600">
                        System Monitoring
                    </p>

                    <h1 className="mt-2 text-3xl font-bold text-slate-900 md:text-4xl">
                        Audit Logs
                    </h1>

                    <p className="mt-2 text-slate-600">
                        Review recorded system activities and report generation
                        history.
                    </p>
                </header>

                {/* Summary cards */}
                <section className="mb-6 grid gap-4 sm:grid-cols-3">
                    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                        <p className="text-sm text-slate-500">
                            Total Records
                        </p>
                        <p className="mt-2 text-3xl font-bold text-slate-900">
                            {logs.length}
                        </p>
                    </div>

                    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                        <p className="text-sm text-slate-500">
                            Activity Types
                        </p>
                        <p className="mt-2 text-3xl font-bold text-slate-900">
                            {actions.length}
                        </p>
                    </div>

                    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                        <p className="text-sm text-slate-500">
                            Filtered Records
                        </p>
                        <p className="mt-2 text-3xl font-bold text-slate-900">
                            {filteredLogs.length}
                        </p>
                    </div>
                </section>

                {/* Search and actions */}
                <section className="mb-6 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                    <div className="flex flex-col gap-3 md:flex-row">
                        <input
                            type="text"
                            value={search}
                            onChange={(event) => setSearch(event.target.value)}
                            placeholder="Search action, username, property ID..."
                            className="min-w-0 flex-1 rounded-lg border border-slate-300 px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                        />

                        <select
                            value={actionFilter}
                            onChange={(event) =>
                                setActionFilter(event.target.value)
                            }
                            className="rounded-lg border border-slate-300 bg-white px-4 py-3"
                        >
                            <option value="ALL">All Activities</option>
                            {actions.map((action) => (
                                <option key={action} value={action}>
                                    {action}
                                </option>
                            ))}
                        </select>

                        <button
                            type="button"
                            onClick={() => void loadLogs()}
                            disabled={loading}
                            className="rounded-lg border border-slate-300 px-5 py-3 font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-50"
                        >
                            {loading ? "Refreshing..." : "Refresh"}
                        </button>

                        <button
                            type="button"
                            onClick={exportCSV}
                            disabled={filteredLogs.length === 0}
                            className="rounded-lg bg-blue-600 px-5 py-3 font-semibold text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                            Export CSV
                        </button>
                    </div>
                </section>

                {/* Error message */}
                {error && (
                    <section
                        role="alert"
                        className="mb-6 rounded-xl border border-red-200 bg-red-50 p-5"
                    >
                        <h2 className="font-bold text-red-800">
                            Unable to Load Audit Logs
                        </h2>

                        <p className="mt-2 break-words text-sm text-red-700">
                            {error}
                        </p>

                        <button
                            type="button"
                            onClick={() => void loadLogs()}
                            className="mt-4 rounded-lg border border-red-300 bg-white px-4 py-2 font-semibold text-red-700 hover:bg-red-100"
                        >
                            Try Again
                        </button>
                    </section>
                )}

                {/* Audit records table */}
                <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                    <div className="border-b border-slate-200 p-5">
                        <h2 className="text-xl font-bold text-slate-900">
                            Activity History
                        </h2>
                        <p className="mt-1 text-sm text-slate-500">
                            Audit records returned by the backend API.
                        </p>
                    </div>

                    {loading && logs.length === 0 ? (
                        <p className="p-8 text-center text-slate-500">
                            Loading audit records...
                        </p>
                    ) : filteredLogs.length === 0 ? (
                        <div className="p-10 text-center">
                            <p className="font-semibold text-slate-800">
                                No audit records found
                            </p>
                            <p className="mt-2 text-sm text-slate-500">
                                Try changing your search or activity filter.
                            </p>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full min-w-[850px] text-left text-sm">
                                <thead className="bg-slate-50 text-slate-600">
                                    <tr>
                                        <th className="px-5 py-4 font-semibold">ID</th>
                                        <th className="px-5 py-4 font-semibold">Activity</th>
                                        <th className="px-5 py-4 font-semibold">Username</th>
                                        <th className="px-5 py-4 font-semibold">
                                            Property ID
                                        </th>
                                        <th className="px-5 py-4 font-semibold">Details</th>
                                        <th className="px-5 py-4 font-semibold">Timestamp</th>
                                    </tr>
                                </thead>

                                <tbody className="divide-y divide-slate-100">
                                    {filteredLogs.map((log, index) => (
                                        <tr
                                            key={log.id ?? index}
                                            className="align-top hover:bg-slate-50"
                                        >
                                            <td className="px-5 py-4 text-slate-600">
                                                {log.id ?? "—"}
                                            </td>

                                            <td className="px-5 py-4">
                                                <span className="inline-flex rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700">
                                                    {log.action || "Unknown"}
                                                </span>
                                            </td>

                                            <td className="px-5 py-4 text-slate-700">
                                                {log.username || "Unknown"}
                                            </td>

                                            <td className="px-5 py-4 text-slate-700">
                                                {log.propertyId ?? "—"}
                                            </td>

                                            <td className="max-w-xs whitespace-pre-wrap break-words px-5 py-4 text-slate-600">
                                                {log.details || "No additional details"}
                                            </td>

                                            <td className="whitespace-nowrap px-5 py-4 text-slate-600">
                                                {formatDate(log.timestamp)}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </section>

                <p className="mt-4 text-sm text-slate-500">
                    Showing {filteredLogs.length} of {logs.length} records.
                </p>
            </div>
        </main>
    );
}

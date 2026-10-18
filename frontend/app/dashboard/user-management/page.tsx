
"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import {
    Users,
    Search,
    RefreshCw,
    ArrowLeft,
    ShieldCheck,
    UserRound,
} from "lucide-react";

const API =
    process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

type User = {
    id: number | string;
    email?: string;
    role?: string;
};

export default function UserManagementPage() {
    const [users, setUsers] = useState<User[]>([]);
    const [search, setSearch] = useState("");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const loadUsers = useCallback(async () => {
        setLoading(true);
        setError("");

        try {
            const token = localStorage.getItem("estateintel_jwt_token");

            const response = await fetch(`${API}/api/users`, {
                method: "GET",
                cache: "no-store",
                headers: token
                    ? { Authorization: `Bearer ${token}` }
                    : {},
            });

            if (!response.ok) {
                throw new Error(
                    `Unable to load users (${response.status}). Check the backend API and permissions.`
                );
            }

            const data = await response.json();

            const list: User[] = Array.isArray(data)
                ? data
                : Array.isArray(data?.content)
                    ? data.content
                    : Array.isArray(data?.users)
                        ? data.users
                        : [];

            setUsers(list);
        } catch (err) {
            setError(
                err instanceof Error
                    ? err.message
                    : "Something went wrong while loading users."
            );
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        void loadUsers();
    }, [loadUsers]);

    const filteredUsers = users.filter((user) => {
        const query = search.trim().toLowerCase();

        return (
            (user.email || "").toLowerCase().includes(query) ||
            (user.role || "").toLowerCase().includes(query) ||
            String(user.id).includes(query)
        );
    });

    return (
        <main className="min-h-screen bg-slate-50 p-5 text-slate-900 sm:p-8">
            <div className="mx-auto max-w-6xl">
                <Link
                    href="/dashboard"
                    className="inline-flex items-center gap-2 text-sm font-medium text-blue-600 hover:underline"
                >
                    <ArrowLeft size={16} />
                    Back to Dashboard
                </Link>

                <header className="mb-8 mt-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                    <div>
                        <p className="text-xs font-semibold uppercase tracking-wider text-blue-600">
                            EstateIntel Workspace
                        </p>

                        <h1 className="mt-2 text-3xl font-bold tracking-tight">
                            User Management
                        </h1>

                        <p className="mt-2 text-sm text-slate-500">
                            View registered users and their assigned roles.
                        </p>
                    </div>

                    <button
                        type="button"
                        onClick={() => void loadUsers()}
                        disabled={loading}
                        className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold hover:bg-slate-100 disabled:opacity-60"
                    >
                        <RefreshCw size={16} />
                        Refresh
                    </button>
                </header>

                <section className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <StatCard
                        label="Total Registered Users"
                        value={loading ? "—" : users.length}
                        icon={<Users size={21} />}
                    />

                    <StatCard
                        label="Roles in System"
                        value={5}
                        icon={<ShieldCheck size={21} />}
                    />
                </section>

                <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                    <div className="flex flex-col justify-between gap-4 border-b border-slate-200 p-5 sm:flex-row sm:items-center">
                        <div>
                            <h2 className="font-semibold">Registered Users</h2>
                            <p className="mt-1 text-sm text-slate-500">
                                Search users by email, role, or ID.
                            </p>
                        </div>

                        <div className="relative w-full sm:max-w-xs">
                            <Search
                                size={17}
                                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                            />
                            <input
                                type="text"
                                value={search}
                                onChange={(event) => setSearch(event.target.value)}
                                placeholder="Search users..."
                                className="w-full rounded-xl border border-slate-200 py-2.5 pl-10 pr-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                            />
                        </div>
                    </div>

                    {loading ? (
                        <div className="p-10 text-center text-sm text-slate-500">
                            Loading users...
                        </div>
                    ) : error ? (
                        <div className="p-6">
                            <p className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
                                {error}
                            </p>
                            <button
                                type="button"
                                onClick={() => void loadUsers()}
                                className="mt-4 rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700"
                            >
                                Try Again
                            </button>
                        </div>
                    ) : filteredUsers.length === 0 ? (
                        <div className="p-10 text-center">
                            <UserRound
                                size={36}
                                className="mx-auto mb-3 text-slate-300"
                            />
                            <h3 className="font-semibold">
                                {users.length === 0
                                    ? "No users found"
                                    : "No matching users"}
                            </h3>
                            <p className="mt-2 text-sm text-slate-500">
                                {users.length === 0
                                    ? "Registered users will appear here when available."
                                    : "Try another search term."}
                            </p>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full text-left text-sm">
                                <thead className="bg-slate-50 text-slate-500">
                                    <tr>
                                        <th className="px-5 py-4 font-medium">User ID</th>
                                        <th className="px-5 py-4 font-medium">Email</th>
                                        <th className="px-5 py-4 font-medium">Role</th>
                                    </tr>
                                </thead>

                                <tbody className="divide-y divide-slate-100">
                                    {filteredUsers.map((user, index) => (
                                        <tr
                                            key={user.id ?? index}
                                            className="transition hover:bg-slate-50"
                                        >
                                            <td className="px-5 py-4 text-slate-600">
                                                #{user.id}
                                            </td>

                                            <td className="px-5 py-4 font-medium text-slate-900">
                                                {user.email || "Not available"}
                                            </td>

                                            <td className="px-5 py-4">
                                                <span className="inline-flex rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700">
                                                    {(user.role || "Unassigned").replaceAll(
                                                        "_",
                                                        " "
                                                    )}
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}

                    {!loading && !error && users.length > 0 && (
                        <div className="border-t border-slate-200 px-5 py-4 text-xs text-slate-500">
                            Showing {filteredUsers.length} of {users.length} users
                        </div>
                    )}
                </section>

                <footer className="mt-8 text-center text-xs text-slate-400">
                    EstateIntel · User Management
                </footer>
            </div>
        </main>
    );
}

function StatCard({
    label,
    value,
    icon,
}: {
    label: string;
    value: number | string;
    icon: React.ReactNode;
}) {
    return (
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
                <p className="text-sm text-slate-500">{label}</p>
                <span className="rounded-xl bg-blue-50 p-3 text-blue-600">
                    {icon}
                </span>
            </div>

            <p className="mt-4 text-3xl font-bold">{value}</p>
        </div>
    );
}

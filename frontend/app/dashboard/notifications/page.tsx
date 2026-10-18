
"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import {
    Bell,
    CheckCheck,
    Clock,
    RefreshCw,
    FileText,
    ExternalLink,
} from "lucide-react";

const API =
    process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

type NotificationItem = {
    id: number;
    type?: string;
    message?: string;
    username?: string;
    propertyId?: number;
    createdAt?: string;
    readStatus?: boolean;
};

export default function NotificationsPage() {
    const [items, setItems] = useState<NotificationItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [updatingId, setUpdatingId] = useState<number | null>(null);

    const loadNotifications = useCallback(async () => {
        setLoading(true);
        setError("");

        try {
            const token = localStorage.getItem("estateintel_jwt_token");

            const response = await fetch(`${API}/api/notifications`, {
                method: "GET",
                cache: "no-store",
                headers: token
                    ? { Authorization: `Bearer ${token}` }
                    : {},
            });

            if (!response.ok) {
                throw new Error(
                    `Unable to load notifications. Status: ${response.status}`
                );
            }

            const data = await response.json();

            const list: NotificationItem[] = Array.isArray(data)
                ? data
                : Array.isArray(data?.content)
                    ? data.content
                    : Array.isArray(data?.notifications)
                        ? data.notifications
                        : [];

            setItems(list);
        } catch (err) {
            setError(
                err instanceof Error
                    ? err.message
                    : "Failed to load notifications."
            );
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        void loadNotifications();
    }, [loadNotifications]);

    async function markAsRead(item: NotificationItem) {
        if (item.readStatus || updatingId !== null) return;

        setUpdatingId(item.id);
        setError("");

        try {
            const token = localStorage.getItem("estateintel_jwt_token");

            const response = await fetch(
                `${API}/api/notifications/${item.id}/read`,
                {
                    method: "PUT",
                    headers: token
                        ? { Authorization: `Bearer ${token}` }
                        : {},
                }
            );

            if (!response.ok) {
                throw new Error(
                    `Could not mark notification as read. Status: ${response.status}`
                );
            }

            // Update the UI after the backend accepts the request.
            setItems((previous) =>
                previous.map((notification) =>
                    notification.id === item.id
                        ? { ...notification, readStatus: true }
                        : notification
                )
            );
        } catch (err) {
            setError(
                err instanceof Error
                    ? err.message
                    : "Failed to update notification."
            );
        } finally {
            setUpdatingId(null);
        }
    }

    const unreadCount = items.filter(
        (item) => item.readStatus !== true
    ).length;

    const readCount = items.length - unreadCount;

    function formatDate(date?: string) {
        if (!date) return "Date unavailable";

        const parsed = new Date(date);

        if (Number.isNaN(parsed.getTime())) return date;

        return parsed.toLocaleString();
    }

    return (
        <main className="min-h-screen bg-slate-50 p-5 text-slate-900 sm:p-8">
            <div className="mx-auto max-w-6xl">
                <Link
                    href="/dashboard"
                    className="text-sm font-medium text-blue-600 hover:underline"
                >
                    ← Back to Dashboard
                </Link>

                <header className="mb-8 mt-6 flex flex-col justify-between gap-5 sm:flex-row sm:items-center">
                    <div>
                        <div className="mb-3 flex items-center gap-3">
                            <div className="rounded-xl bg-blue-100 p-3 text-blue-700">
                                <Bell size={24} />
                            </div>

                            <span className="text-xs font-semibold uppercase tracking-wider text-blue-600">
                                EstateIntel Workspace
                            </span>
                        </div>

                        <h1 className="text-3xl font-bold tracking-tight">
                            Notifications
                        </h1>

                        <p className="mt-2 text-sm text-slate-500">
                            View report updates and property activity.
                        </p>
                    </div>

                    <button
                        type="button"
                        onClick={() => void loadNotifications()}
                        disabled={loading}
                        className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold hover:bg-slate-100 disabled:opacity-60"
                    >
                        <RefreshCw size={16} />
                        Refresh
                    </button>
                </header>

                {error && (
                    <div className="mb-5 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
                        {error}
                    </div>
                )}

                <section className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
                    <StatCard
                        label="Total Notifications"
                        value={loading ? "—" : items.length}
                        icon={<Bell size={20} />}
                    />

                    <StatCard
                        label="Unread"
                        value={loading ? "—" : unreadCount}
                        icon={<Clock size={20} />}
                    />

                    <StatCard
                        label="Read"
                        value={loading ? "—" : readCount}
                        icon={<CheckCheck size={20} />}
                    />
                </section>

                <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                    <div className="border-b border-slate-200 p-5">
                        <h2 className="font-semibold">Recent Notifications</h2>
                        <p className="mt-1 text-sm text-slate-500">
                            Notifications received from your backend.
                        </p>
                    </div>

                    {loading ? (
                        <div className="p-10 text-center text-sm text-slate-500">
                            Loading notifications...
                        </div>
                    ) : items.length === 0 ? (
                        <div className="p-12 text-center">
                            <Bell className="mx-auto mb-4 text-slate-300" size={36} />
                            <h3 className="font-semibold">No notifications yet</h3>
                            <p className="mt-2 text-sm text-slate-500">
                                New updates will appear here.
                            </p>
                        </div>
                    ) : (
                        <div className="divide-y divide-slate-100">
                            {items.map((item) => {
                                const isUnread = item.readStatus !== true;

                                return (
                                    <article
                                        key={item.id}
                                        className={`p-5 transition hover:bg-slate-50 ${isUnread ? "bg-blue-50/40" : "bg-white"
                                            }`}
                                    >
                                        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                                            <div className="flex min-w-0 gap-4">
                                                <div
                                                    className={`rounded-xl p-3 ${isUnread
                                                            ? "bg-blue-100 text-blue-700"
                                                            : "bg-slate-100 text-slate-500"
                                                        }`}
                                                >
                                                    <FileText size={22} />
                                                </div>

                                                <div className="min-w-0 flex-1">
                                                    <div className="flex flex-wrap items-center gap-2">
                                                        <h3 className="font-semibold">
                                                            {(item.type || "Notification").replaceAll(
                                                                "_",
                                                                " "
                                                            )}
                                                        </h3>

                                                        <span
                                                            className={`rounded-full px-2.5 py-1 text-xs font-medium ${isUnread
                                                                    ? "bg-blue-100 text-blue-700"
                                                                    : "bg-slate-100 text-slate-600"
                                                                }`}
                                                        >
                                                            {isUnread ? "Unread" : "Read"}
                                                        </span>
                                                    </div>

                                                    <p className="mt-2 text-sm leading-6 text-slate-600">
                                                        {item.message || "No message provided."}
                                                    </p>

                                                    <div className="mt-3 flex flex-wrap gap-x-4 gap-y-2 text-xs text-slate-500">
                                                        <span>
                                                            <Clock
                                                                size={13}
                                                                className="mr-1 inline"
                                                            />
                                                            {formatDate(item.createdAt)}
                                                        </span>

                                                        {item.propertyId !== undefined && (
                                                            <span>
                                                                Property ID: {item.propertyId}
                                                            </span>
                                                        )}

                                                        {item.username && (
                                                            <span>By: {item.username}</span>
                                                        )}
                                                    </div>

                                                    {item.propertyId !== undefined && (
                                                        <Link
                                                            href={`/dashboard/due-diligence?propertyId=${item.propertyId}`}
                                                            className="mt-3 inline-flex items-center gap-1 text-sm font-medium text-blue-600 hover:underline"
                                                        >
                                                            View property
                                                            <ExternalLink size={14} />
                                                        </Link>
                                                    )}
                                                </div>
                                            </div>

                                            {isUnread && (
                                                <button
                                                    type="button"
                                                    onClick={() => void markAsRead(item)}
                                                    disabled={updatingId !== null}
                                                    className="shrink-0 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
                                                >
                                                    {updatingId === item.id
                                                        ? "Updating..."
                                                        : "Mark as read"}
                                                </button>
                                            )}
                                        </div>
                                    </article>
                                );
                            })}
                        </div>
                    )}
                </section>

                <footer className="mt-8 text-center text-xs text-slate-400">
                    EstateIntel · Notification Center
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
                <span className="rounded-lg bg-blue-50 p-2 text-blue-600">
                    {icon}
                </span>
            </div>

            <p className="mt-4 text-3xl font-bold">{value}</p>
        </div>
    );
}

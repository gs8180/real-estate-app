
"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";

const API =
    process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

type Property = {
    id: number;
    address?: string;
    city?: string;
    state?: string;
    zipCode?: string;
};

type ZoningRecord = {
    id?: number | string;
    zoningType?: string;
    zoningCode?: string;
    permittedUse?: string;
    [key: string]: unknown;
};

export default function ZoningPage() {
    const router = useRouter();

    const [properties, setProperties] = useState<Property[]>([]);
    const [propertyId, setPropertyId] = useState("");
    const [records, setRecords] = useState<ZoningRecord[]>([]);

    const [zoningType, setZoningType] = useState("");
    const [zoningCode, setZoningCode] = useState("");
    const [permittedUse, setPermittedUse] = useState("");

    const [loadingProperties, setLoadingProperties] = useState(true);
    const [loadingRecords, setLoadingRecords] = useState(false);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const getHeaders = (): Record<string, string> => {
        const token = localStorage.getItem("estateintel_jwt_token");

        return token
            ? { Authorization: `Bearer ${token}` }
            : {};
    };

    const loadProperties = useCallback(async () => {
        setLoadingProperties(true);
        setError("");

        try {
            const response = await fetch(`${API}/api/properties`, {
                headers: getHeaders(),
                credentials: "include",
                cache: "no-store",
            });

            if (!response.ok) {
                throw new Error(`Unable to load properties (${response.status}).`);
            }

            const data = await response.json();

            const list: Property[] = Array.isArray(data)
                ? data
                : Array.isArray(data?.content)
                    ? data.content
                    : [];

            setProperties(list);

            if (list.length > 0) {
                setPropertyId((current) =>
                    current && list.some((p) => String(p.id) === current)
                        ? current
                        : String(list[0].id)
                );
            } else {
                setPropertyId("");
                setRecords([]);
            }
        } catch (err) {
            setError(
                err instanceof Error ? err.message : "Unable to load properties."
            );
        } finally {
            setLoadingProperties(false);
        }
    }, []);

    const loadZoning = useCallback(async (id: string) => {
        if (!id) {
            setRecords([]);
            return;
        }

        setLoadingRecords(true);
        setError("");

        try {
            const response = await fetch(
                `${API}/api/properties/${encodeURIComponent(id)}/zoning`,
                {
                    headers: getHeaders(),
                    credentials: "include",
                    cache: "no-store",
                }
            );

            if (!response.ok) {
                const body = await response.text();
                throw new Error(
                    `Unable to load zoning information (${response.status}). ${body}`
                );
            }

            const data = await response.json();

            if (!Array.isArray(data)) {
                throw new Error("Unexpected zoning API response format.");
            }

            setRecords(data);
        } catch (err) {
            setRecords([]);
            setError(
                err instanceof Error
                    ? err.message
                    : "Unable to load zoning information."
            );
        } finally {
            setLoadingRecords(false);
        }
    }, []);

    useEffect(() => {
        void loadProperties();
    }, [loadProperties]);

    useEffect(() => {
        if (propertyId) {
            void loadZoning(propertyId);
        } else {
            setRecords([]);
        }
    }, [propertyId, loadZoning]);

    const selectedProperty = properties.find(
        (property) => String(property.id) === propertyId
    );

    const address = selectedProperty
        ? [
            selectedProperty.address,
            selectedProperty.city,
            selectedProperty.state,
            selectedProperty.zipCode,
        ]
            .filter(Boolean)
            .join(", ")
        : "";

    async function handleSave(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();

        if (!propertyId) {
            setError("Please select a property.");
            return;
        }

        setSaving(true);
        setError("");
        setSuccess("");

        try {
            const params = new URLSearchParams({
                zoningType: zoningType.trim(),
                zoningCode: zoningCode.trim(),
                permittedUse: permittedUse.trim(),
            });

            const response = await fetch(
                `${API}/api/properties/${encodeURIComponent(propertyId)}/zoning?${params.toString()}`,
                {
                    method: "POST",
                    headers: getHeaders(),
                    credentials: "include",
                }
            );

            if (!response.ok) {
                const body = await response.text();
                throw new Error(
                    `Unable to save zoning information (${response.status}). ${body}`
                );
            }

            setSuccess("Zoning information saved successfully.");
            setZoningType("");
            setZoningCode("");
            setPermittedUse("");

            await loadZoning(propertyId);
        } catch (err) {
            setError(
                err instanceof Error
                    ? err.message
                    : "Unable to save zoning information."
            );
        } finally {
            setSaving(false);
        }
    }

    return (
        <main className="min-h-screen bg-slate-50 p-4 md:p-8">
            <div className="mx-auto max-w-7xl">
                <button
                    type="button"
                    onClick={() => router.push("/dashboard")}
                    className="mb-6 rounded-lg border border-slate-300 bg-white px-4 py-2 font-semibold text-slate-700 hover:bg-slate-100"
                >
                    ← Back to Dashboard
                </button>

                <header className="mb-8">
                    <p className="text-sm font-semibold uppercase tracking-wider text-blue-600">
                        Property Compliance
                    </p>
                    <h1 className="mt-2 text-3xl font-bold text-slate-900 md:text-4xl">
                        Zoning Information
                    </h1>
                    <p className="mt-2 text-slate-600">
                        View and record zoning classifications and permitted property uses.
                    </p>
                </header>

                <section className="mb-6 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                    <label
                        htmlFor="property"
                        className="mb-2 block text-sm font-semibold text-slate-700"
                    >
                        Select Property
                    </label>

                    <select
                        id="property"
                        value={propertyId}
                        onChange={(event) => {
                            setPropertyId(event.target.value);
                            setSuccess("");
                        }}
                        disabled={loadingProperties || properties.length === 0}
                        className="w-full rounded-lg border border-slate-300 bg-white px-4 py-3 outline-none focus:border-blue-500 md:max-w-xl"
                    >
                        {loadingProperties ? (
                            <option value="">Loading properties...</option>
                        ) : properties.length === 0 ? (
                            <option value="">No properties available</option>
                        ) : (
                            properties.map((property) => (
                                <option key={property.id} value={String(property.id)}>
                                    #{property.id} — {property.address || "Address unavailable"}
                                    {property.city ? `, ${property.city}` : ""}
                                </option>
                            ))
                        )}
                    </select>

                    {address && (
                        <p className="mt-3 text-sm text-slate-500">
                            Selected address: {address}
                        </p>
                    )}
                </section>

                {error && (
                    <div
                        role="alert"
                        className="mb-5 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700"
                    >
                        {error}
                    </div>
                )}

                {success && (
                    <div
                        role="status"
                        className="mb-5 rounded-xl border border-green-200 bg-green-50 p-4 text-sm font-medium text-green-800"
                    >
                        {success}
                    </div>
                )}

                <section className="mb-6 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm md:p-6">
                    <h2 className="text-xl font-bold text-slate-900">
                        Add Zoning Information
                    </h2>
                    <p className="mt-1 text-sm text-slate-500">
                        Enter the zoning details for the selected property.
                    </p>

                    <form onSubmit={handleSave} className="mt-5 space-y-5">
                        <div className="grid gap-5 md:grid-cols-2">
                            <div>
                                <label
                                    htmlFor="zoningType"
                                    className="mb-2 block text-sm font-semibold text-slate-700"
                                >
                                    Zoning Type *
                                </label>
                                <input
                                    id="zoningType"
                                    value={zoningType}
                                    onChange={(event) => setZoningType(event.target.value)}
                                    required
                                    maxLength={100}
                                    placeholder="e.g. Residential"
                                    className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none focus:border-blue-500"
                                />
                            </div>

                            <div>
                                <label
                                    htmlFor="zoningCode"
                                    className="mb-2 block text-sm font-semibold text-slate-700"
                                >
                                    Zoning Code *
                                </label>
                                <input
                                    id="zoningCode"
                                    value={zoningCode}
                                    onChange={(event) => setZoningCode(event.target.value)}
                                    required
                                    maxLength={100}
                                    placeholder="e.g. R1"
                                    className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none focus:border-blue-500"
                                />
                            </div>
                        </div>

                        <div>
                            <label
                                htmlFor="permittedUse"
                                className="mb-2 block text-sm font-semibold text-slate-700"
                            >
                                Permitted Use *
                            </label>
                            <textarea
                                id="permittedUse"
                                value={permittedUse}
                                onChange={(event) => setPermittedUse(event.target.value)}
                                required
                                maxLength={2000}
                                rows={3}
                                placeholder="Describe the permitted use for this zoning classification"
                                className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none focus:border-blue-500"
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={saving || !propertyId}
                            className="rounded-lg bg-blue-600 px-6 py-3 font-semibold text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                            {saving ? "Saving..." : "Save Zoning Information"}
                        </button>
                    </form>
                </section>

                <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                    <div className="flex flex-col justify-between gap-3 border-b border-slate-200 p-5 sm:flex-row sm:items-center">
                        <div>
                            <h2 className="text-xl font-bold text-slate-900">
                                Zoning Records
                            </h2>
                            <p className="mt-1 text-sm text-slate-500">
                                Saved zoning information for the selected property.
                            </p>
                        </div>

                        <button
                            type="button"
                            onClick={() => void loadZoning(propertyId)}
                            disabled={!propertyId || loadingRecords}
                            className="rounded-lg border border-slate-300 px-4 py-2 font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-50"
                        >
                            {loadingRecords ? "Refreshing..." : "Refresh"}
                        </button>
                    </div>

                    {loadingProperties || loadingRecords ? (
                        <p className="p-10 text-center text-slate-500">
                            Loading zoning records...
                        </p>
                    ) : records.length === 0 ? (
                        <div className="p-10 text-center">
                            <p className="font-semibold text-slate-800">
                                No zoning records found
                            </p>
                            <p className="mt-2 text-sm text-slate-500">
                                No zoning information was returned for this property.
                                You can add a record using the form above.
                            </p>
                        </div>
                    ) : (
                        <div className="grid gap-4 p-5 md:grid-cols-2">
                            {records.map((record, index) => (
                                <article
                                    key={record.id ?? index}
                                    className="rounded-xl border border-slate-200 p-5"
                                >
                                    <div className="mb-4 flex items-start justify-between gap-3">
                                        <h3 className="text-lg font-bold text-slate-900">
                                            {record.zoningType || "Zoning Classification"}
                                        </h3>
                                        <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700">
                                            {record.zoningCode || "No code"}
                                        </span>
                                    </div>

                                    <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                                        Permitted Use
                                    </p>
                                    <p className="mt-2 whitespace-pre-wrap text-sm leading-6 text-slate-700">
                                        {record.permittedUse || "Not specified"}
                                    </p>

                                    {record.id !== undefined && (
                                        <p className="mt-4 text-xs text-slate-400">
                                            Record ID: {String(record.id)}
                                        </p>
                                    )}
                                </article>
                            ))}
                        </div>
                    )}
                </section>
            </div>
        </main>
    );
}


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

type EnvironmentalRecord = {
    id?: number | string;
    recordType?: string;
    riskLevel?: string;
    description?: string;
    source?: string;
    [key: string]: unknown;
};

export default function EnvironmentalRecordsPage() {
    const router = useRouter();

    const [properties, setProperties] = useState<Property[]>([]);
    const [propertyId, setPropertyId] = useState("");
    const [records, setRecords] = useState<EnvironmentalRecord[]>([]);

    const [recordType, setRecordType] = useState("");
    const [riskLevel, setRiskLevel] = useState("LOW");
    const [description, setDescription] = useState("");
    const [source, setSource] = useState("");

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

    const loadRecords = useCallback(async (id: string) => {
        if (!id) {
            setRecords([]);
            return;
        }

        setLoadingRecords(true);
        setError("");

        try {
            const response = await fetch(
                `${API}/api/properties/${encodeURIComponent(id)}/environmental`,
                {
                    headers: getHeaders(),
                    credentials: "include",
                    cache: "no-store",
                }
            );

            if (!response.ok) {
                const body = await response.text();
                throw new Error(
                    `Unable to load environmental records (${response.status}). ${body}`
                );
            }

            const data = await response.json();

            if (!Array.isArray(data)) {
                throw new Error("Unexpected environmental API response format.");
            }

            setRecords(data);
        } catch (err) {
            setRecords([]);
            setError(
                err instanceof Error
                    ? err.message
                    : "Unable to load environmental records."
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
            void loadRecords(propertyId);
        } else {
            setRecords([]);
        }
    }, [propertyId, loadRecords]);

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
                recordType: recordType.trim(),
                riskLevel,
                description: description.trim(),
                source: source.trim(),
            });

            const response = await fetch(
                `${API}/api/properties/${encodeURIComponent(propertyId)}/environmental?${params.toString()}`,
                {
                    method: "POST",
                    headers: getHeaders(),
                    credentials: "include",
                }
            );

            if (!response.ok) {
                const body = await response.text();
                throw new Error(
                    `Unable to save record (${response.status}). ${body}`
                );
            }

            setSuccess("Environmental record saved successfully.");
            setRecordType("");
            setRiskLevel("LOW");
            setDescription("");
            setSource("");

            await loadRecords(propertyId);
        } catch (err) {
            setError(
                err instanceof Error
                    ? err.message
                    : "Unable to save environmental record."
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
                    <p className="text-sm font-semibold uppercase tracking-wider text-emerald-700">
                        Property Compliance
                    </p>
                    <h1 className="mt-2 text-3xl font-bold text-slate-900 md:text-4xl">
                        Environmental Records
                    </h1>
                    <p className="mt-2 text-slate-600">
                        Manage environmental records associated with a property.
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
                        className="w-full rounded-lg border border-slate-300 bg-white px-4 py-3 outline-none focus:border-emerald-600 md:max-w-xl"
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
                        Add Environmental Record
                    </h2>
                    <p className="mt-1 text-sm text-slate-500">
                        Enter information from a verified report or source.
                    </p>

                    <form onSubmit={handleSave} className="mt-5 space-y-5">
                        <div className="grid gap-5 md:grid-cols-2">
                            <div>
                                <label
                                    htmlFor="recordType"
                                    className="mb-2 block text-sm font-semibold text-slate-700"
                                >
                                    Record Type *
                                </label>
                                <input
                                    id="recordType"
                                    value={recordType}
                                    onChange={(event) => setRecordType(event.target.value)}
                                    required
                                    maxLength={100}
                                    placeholder="e.g. Environmental Site Assessment"
                                    className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none focus:border-emerald-600"
                                />
                            </div>

                            <div>
                                <label
                                    htmlFor="riskLevel"
                                    className="mb-2 block text-sm font-semibold text-slate-700"
                                >
                                    Risk Level *
                                </label>
                                <select
                                    id="riskLevel"
                                    value={riskLevel}
                                    onChange={(event) => setRiskLevel(event.target.value)}
                                    required
                                    className="w-full rounded-lg border border-slate-300 bg-white px-4 py-3 outline-none focus:border-emerald-600"
                                >
                                    <option value="LOW">Low</option>
                                    <option value="MEDIUM">Medium</option>
                                    <option value="HIGH">High</option>
                                    <option value="UNKNOWN">Unknown</option>
                                </select>
                            </div>
                        </div>

                        <div>
                            <label
                                htmlFor="description"
                                className="mb-2 block text-sm font-semibold text-slate-700"
                            >
                                Description *
                            </label>
                            <textarea
                                id="description"
                                value={description}
                                onChange={(event) => setDescription(event.target.value)}
                                required
                                maxLength={3000}
                                rows={4}
                                placeholder="Describe the finding documented in the source report"
                                className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none focus:border-emerald-600"
                            />
                        </div>

                        <div>
                            <label
                                htmlFor="source"
                                className="mb-2 block text-sm font-semibold text-slate-700"
                            >
                                Source *
                            </label>
                            <input
                                id="source"
                                value={source}
                                onChange={(event) => setSource(event.target.value)}
                                required
                                maxLength={500}
                                placeholder="e.g. Report name, agency, or source URL"
                                className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none focus:border-emerald-600"
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={saving || !propertyId}
                            className="rounded-lg bg-emerald-700 px-6 py-3 font-semibold text-white hover:bg-emerald-800 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                            {saving ? "Saving..." : "Save Environmental Record"}
                        </button>
                    </form>
                </section>

                <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                    <div className="flex flex-col justify-between gap-3 border-b border-slate-200 p-5 sm:flex-row sm:items-center">
                        <div>
                            <h2 className="text-xl font-bold text-slate-900">
                                Environmental History
                            </h2>
                            <p className="mt-1 text-sm text-slate-500">
                                Records returned by the backend for the selected property.
                            </p>
                        </div>

                        <button
                            type="button"
                            onClick={() => void loadRecords(propertyId)}
                            disabled={!propertyId || loadingRecords}
                            className="rounded-lg border border-slate-300 px-4 py-2 font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-50"
                        >
                            {loadingRecords ? "Refreshing..." : "Refresh"}
                        </button>
                    </div>

                    {loadingProperties || loadingRecords ? (
                        <p className="p-10 text-center text-slate-500">
                            Loading environmental records...
                        </p>
                    ) : records.length === 0 ? (
                        <div className="p-10 text-center">
                            <p className="font-semibold text-slate-800">
                                No environmental records found
                            </p>
                            <p className="mt-2 text-sm text-slate-500">
                                No records were returned for this property. You can add a
                                record using the form above.
                            </p>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full min-w-[850px] text-left text-sm">
                                <thead className="bg-slate-50 text-slate-600">
                                    <tr>
                                        <th className="px-5 py-4 font-semibold">ID</th>
                                        <th className="px-5 py-4 font-semibold">Record Type</th>
                                        <th className="px-5 py-4 font-semibold">Risk Level</th>
                                        <th className="px-5 py-4 font-semibold">Description</th>
                                        <th className="px-5 py-4 font-semibold">Source</th>
                                    </tr>
                                </thead>

                                <tbody className="divide-y divide-slate-100">
                                    {records.map((record, index) => (
                                        <tr
                                            key={record.id ?? index}
                                            className="align-top hover:bg-slate-50"
                                        >
                                            <td className="px-5 py-4 text-slate-600">
                                                {record.id ?? "—"}
                                            </td>
                                            <td className="px-5 py-4 font-semibold text-slate-900">
                                                {record.recordType || "Not specified"}
                                            </td>
                                            <td className="px-5 py-4">
                                                <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700">
                                                    {record.riskLevel || "Unknown"}
                                                </span>
                                            </td>
                                            <td className="max-w-sm whitespace-pre-wrap break-words px-5 py-4 text-slate-600">
                                                {record.description || "—"}
                                            </td>
                                            <td className="max-w-xs break-words px-5 py-4 text-slate-600">
                                                {record.source || "—"}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </section>
            </div>
        </main>
    );
}

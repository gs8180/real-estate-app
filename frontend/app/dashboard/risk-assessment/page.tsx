
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

const API =
    process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

type Property = {
    id: number;
    address: string;
    city: string;
    state: string;
    zipCode: string;
    propertyType: string;
    price: number;
};

type RiskAssessment = {
    id?: number;
    overallRiskScore?: number;
    riskLevel?: string;
    environmentalRisk?: number;
    floodRisk?: number;
    ownershipRisk?: number;
    permitRisk?: number;
    taxRisk?: number;
    utilityRisk?: number;
    zoningRisk?: number;
    [key: string]: unknown;
};

export default function RiskAssessmentPage() {
    const router = useRouter();

    const [propertyId, setPropertyId] = useState("");
    const [property, setProperty] = useState<Property | null>(null);
    const [assessment, setAssessment] =
        useState<RiskAssessment | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [message, setMessage] = useState("");

    function getHeaders(): HeadersInit {
        const token = localStorage.getItem("estateintel_jwt_token");
        return token ? { Authorization: `Bearer ${token}` } : {};
    }

    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const id = params.get("id");

        if (id && /^\d+$/.test(id)) {
            setPropertyId(id);
            void loadProperty(id);
        }
    }, []);

    async function loadProperty(id: string) {
        const cleanId = id.trim();

        if (!cleanId || !/^\d+$/.test(cleanId)) {
            setError("Please enter a valid Property ID.");
            return;
        }

        setLoading(true);
        setError("");
        setMessage("");
        setProperty(null);
        setAssessment(null);

        try {
            let found: Property | null = null;

            const response = await fetch(
                `${API}/api/properties/${encodeURIComponent(cleanId)}`,
                { headers: getHeaders() }
            );

            if (response.ok) {
                const data = await response.json();
                if (data && String(data.id) === cleanId) {
                    found = data as Property;
                }
            }

            if (!found) {
                const listResponse = await fetch(`${API}/api/properties`, {
                    headers: getHeaders(),
                });

                if (!listResponse.ok) {
                    throw new Error("Unable to load properties from backend.");
                }

                const data = await listResponse.json();
                const list: Property[] = Array.isArray(data)
                    ? data
                    : Array.isArray(data?.content)
                        ? data.content
                        : [];

                found = list.find(
                    (item) => String(item.id) === cleanId
                ) ?? null;
            }

            if (!found) {
                throw new Error("Property not found. Check the Property ID.");
            }

            setProperty(found);

            try {
                await loadAssessment(cleanId);
            } catch (e) {
                setAssessment(null);
                setMessage(
                    e instanceof Error
                        ? `Property loaded. Assessment could not be loaded: ${e.message}`
                        : "Property loaded, but assessment could not be loaded."
                );
            }
        } catch (e) {
            setError(
                e instanceof Error ? e.message : "Unable to load property."
            );
        } finally {
            setLoading(false);
        }
    }

    async function loadAssessment(id: string) {
        const response = await fetch(
            `${API}/api/risk/property/${encodeURIComponent(id)}`,
            { headers: getHeaders() }
        );

        if (!response.ok) {
            if (response.status === 404) {
                setAssessment(null);
                return;
            }

            throw new Error(`HTTP ${response.status}`);
        }

        const data = await response.json();
        setAssessment(data);
    }

    async function calculateRisk() {
        if (!property) {
            setError("Please load a property first.");
            return;
        }

        setLoading(true);
        setError("");
        setMessage("");

        try {
            const response = await fetch(
                `${API}/api/risk/property/${property.id}/calculate`,
                {
                    method: "POST",
                    headers: getHeaders(),
                }
            );

            if (!response.ok) {
                const body = await response.text();
                throw new Error(
                    `Risk calculation failed (HTTP ${response.status}). ${body}`
                );
            }

            // Use the saved assessment from the GET endpoint.
            await loadAssessment(String(property.id));
            setMessage("Risk assessment updated successfully.");
        } catch (e) {
            setError(
                e instanceof Error ? e.message : "Risk calculation failed."
            );
        } finally {
            setLoading(false);
        }
    }

    const riskItems = [
        { label: "Environmental Risk", key: "environmentalRisk" },
        { label: "Flood Risk", key: "floodRisk" },
        { label: "Ownership Risk", key: "ownershipRisk" },
        { label: "Permit Risk", key: "permitRisk" },
        { label: "Tax Risk", key: "taxRisk" },
        { label: "Utility Risk", key: "utilityRisk" },
        { label: "Zoning Risk", key: "zoningRisk" },
    ] as const;

    function displayScore(value: unknown) {
        if (typeof value === "number" && Number.isFinite(value)) {
            return Number.isInteger(value) ? String(value) : value.toFixed(2);
        }
        return "N/A";
    }

    return (
        <main className="min-h-screen bg-slate-50 p-4 md:p-8">
            <div className="mx-auto max-w-6xl">
                <button
                    type="button"
                    onClick={() => router.push("/dashboard")}
                    className="mb-5 rounded-lg border border-slate-300 bg-white px-4 py-2 text-slate-700 hover:bg-slate-100"
                >
                    ← Back to Dashboard
                </button>

                <header className="mb-7">
                    <p className="text-sm font-semibold uppercase tracking-wider text-blue-600">
                        Real Estate Due Diligence
                    </p>
                    <h1 className="mt-2 text-3xl font-bold text-slate-900 md:text-4xl">
                        Risk Assessment
                    </h1>
                    <p className="mt-2 text-slate-600">
                        Review property risks using the assessment data from your backend.
                    </p>
                </header>

                <form
                    onSubmit={(event) => {
                        event.preventDefault();
                        void loadProperty(propertyId);
                    }}
                    className="mb-6 flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:flex-row"
                >
                    <input
                        type="number"
                        min="1"
                        required
                        value={propertyId}
                        onChange={(event) => setPropertyId(event.target.value)}
                        placeholder="Enter Property ID"
                        className="min-w-0 flex-1 rounded-lg border border-slate-300 px-4 py-3 text-slate-900 outline-none focus:border-blue-500"
                    />
                    <button
                        type="submit"
                        disabled={loading}
                        className="rounded-lg bg-blue-600 px-6 py-3 font-semibold text-white hover:bg-blue-700 disabled:opacity-60"
                    >
                        {loading ? "Loading..." : "Load Property"}
                    </button>
                </form>

                {error && (
                    <div
                        role="alert"
                        className="mb-5 rounded-xl border border-red-200 bg-red-50 p-4 text-red-700"
                    >
                        {error}
                    </div>
                )}

                {message && (
                    <div
                        role="status"
                        className="mb-5 rounded-xl border border-blue-200 bg-blue-50 p-4 text-blue-800"
                    >
                        {message}
                    </div>
                )}

                {loading && (
                    <p className="mb-5 text-sm text-slate-500">
                        Processing your request...
                    </p>
                )}

                {property && (
                    <>
                        <section className="mb-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                            <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
                                <div>
                                    <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                                        Selected Property
                                    </p>
                                    <h2 className="mt-2 text-2xl font-bold text-slate-900">
                                        {property.address}
                                    </h2>
                                    <p className="mt-1 text-slate-600">
                                        {property.city}, {property.state} {property.zipCode}
                                    </p>
                                </div>
                                <span className="w-fit rounded-lg bg-slate-100 px-3 py-2 text-sm font-semibold text-slate-700">
                                    ID: {property.id}
                                </span>
                            </div>

                            <div className="mt-5 grid gap-4 sm:grid-cols-3">
                                <div className="rounded-xl bg-slate-50 p-4">
                                    <p className="text-sm text-slate-500">Property Type</p>
                                    <p className="mt-1 font-semibold text-slate-900">
                                        {property.propertyType || "Not provided"}
                                    </p>
                                </div>
                                <div className="rounded-xl bg-slate-50 p-4">
                                    <p className="text-sm text-slate-500">Property Price</p>
                                    <p className="mt-1 font-semibold text-slate-900">
                                        {property.price == null
                                            ? "Not provided"
                                            : Number(property.price).toLocaleString()}
                                    </p>
                                </div>
                                <div className="rounded-xl bg-slate-50 p-4">
                                    <p className="text-sm text-slate-500">Assessment Status</p>
                                    <p className="mt-1 font-semibold text-slate-900">
                                        {assessment ? "Available" : "Not available"}
                                    </p>
                                </div>
                            </div>
                        </section>

                        <section className="mb-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                            <div className="flex flex-col justify-between gap-5 md:flex-row md:items-center">
                                <div>
                                    <p className="text-sm font-medium text-slate-500">
                                        OVERALL RISK SCORE
                                    </p>
                                    <div className="mt-2 flex items-baseline gap-2">
                                        <span className="text-5xl font-bold tracking-tight text-slate-900">
                                            {displayScore(assessment?.overallRiskScore)}
                                        </span>
                                        <span className="text-sm text-slate-500">
                                            Backend score
                                        </span>
                                    </div>
                                    <p className="mt-2 text-sm text-slate-500">
                                        Risk level is shown as returned by the backend.
                                    </p>
                                </div>

                                <div className="rounded-xl border border-slate-200 px-5 py-4">
                                    <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                                        Risk Level
                                    </p>
                                    <p className="mt-2 text-xl font-bold text-slate-900">
                                        {assessment?.riskLevel ?? "Not available"}
                                    </p>
                                </div>
                            </div>

                            <div className="mt-6 flex flex-wrap gap-3">
                                <button
                                    type="button"
                                    disabled={loading}
                                    onClick={() => void calculateRisk()}
                                    className="rounded-lg bg-blue-600 px-5 py-3 font-semibold text-white hover:bg-blue-700 disabled:opacity-60"
                                >
                                    {loading ? "Calculating..." : "Calculate Risk"}
                                </button>

                                <button
                                    type="button"
                                    disabled={loading}
                                    onClick={() => {
                                        if (property) {
                                            setLoading(true);
                                            setError("");
                                            setMessage("");
                                            loadAssessment(String(property.id))
                                                .then(() => setMessage("Assessment refreshed."))
                                                .catch((e) =>
                                                    setError(
                                                        e instanceof Error
                                                            ? e.message
                                                            : "Unable to refresh assessment."
                                                    )
                                                )
                                                .finally(() => setLoading(false));
                                        }
                                    }}
                                    className="rounded-lg border border-slate-300 px-5 py-3 font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-60"
                                >
                                    Refresh Assessment
                                </button>
                            </div>
                        </section>

                        <section className="mb-6">
                            <div className="mb-4">
                                <h2 className="text-xl font-bold text-slate-900">
                                    Risk Breakdown
                                </h2>
                                <p className="mt-1 text-sm text-slate-500">
                                    Individual category scores returned by the backend.
                                </p>
                            </div>

                            {!assessment ? (
                                <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-8 text-center">
                                    <h3 className="font-semibold text-slate-900">
                                        No assessment data available
                                    </h3>
                                    <p className="mt-2 text-sm text-slate-500">
                                        Click Calculate Risk to request a new assessment.
                                    </p>
                                </div>
                            ) : (
                                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                                    {riskItems.map((item) => {
                                        const value = assessment[item.key];
                                        const hasScore =
                                            typeof value === "number" &&
                                            Number.isFinite(value);

                                        return (
                                            <article
                                                key={item.key}
                                                className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
                                            >
                                                <p className="text-sm font-medium text-slate-500">
                                                    {item.label}
                                                </p>
                                                <div className="mt-3 flex items-end justify-between gap-3">
                                                    <p className="text-3xl font-bold text-slate-900">
                                                        {displayScore(value)}
                                                    </p>
                                                    {hasScore && (
                                                        <span className="text-xs text-slate-400">
                                                            Backend score
                                                        </span>
                                                    )}
                                                </div>
                                                {hasScore && (
                                                    <div className="mt-4 h-2 overflow-hidden rounded-full bg-slate-100">
                                                        <div
                                                            className="h-full rounded-full bg-blue-600"
                                                            style={{
                                                                width: `${Math.max(
                                                                    0,
                                                                    Math.min(100, value)
                                                                )}%`,
                                                            }}
                                                        />
                                                    </div>
                                                )}
                                            </article>
                                        );
                                    })}
                                </div>
                            )}
                        </section>

                        <div className="flex flex-wrap gap-3">
                            <button
                                type="button"
                                onClick={() =>
                                    router.push(
                                        `/dashboard/property-details?id=${property.id}`
                                    )
                                }
                                className="rounded-lg border border-slate-300 bg-white px-5 py-3 font-medium text-slate-700 hover:bg-slate-50"
                            >
                                Back to Property Details
                            </button>

                            <button
                                type="button"
                                onClick={() =>
                                    router.push(
                                        `/dashboard/due-diligence?id=${property.id}`
                                    )
                                }
                                className="rounded-lg bg-slate-900 px-5 py-3 font-medium text-white hover:bg-slate-800"
                            >
                                Open Due Diligence
                            </button>
                        </div>
                    </>
                )}
            </div>
        </main>
    );
}

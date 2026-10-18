
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

type Permit = {
    id?: number | string;
    permitNumber?: string;
    permitType?: string;
    type?: string;
    status?: string;
    description?: string;
    details?: string;
    issueDate?: string;
    expirationDate?: string;
    expiryDate?: string;
    propertyId?: number;
    [key: string]: unknown;
};

export default function BuildingPermitsPage() {
    const router = useRouter();

    const [properties, setProperties] = useState<Property[]>([]);
    const [propertyId, setPropertyId] = useState("");
    const [permits, setPermits] = useState<Permit[]>([]);
    const [loadingProperties, setLoadingProperties] = useState(true);
    const [loadingPermits, setLoadingPermits] = useState(false);
    const [error, setError] = useState("");

    const loadProperties = useCallback(async () => {
        setLoadingProperties(true);
        setError("");

        try {
            const token = localStorage.getItem("estateintel_jwt_token");

            const response = await fetch(`${API}/api/properties`, {
                headers: token
                    ? { Authorization: `Bearer ${token}` }
                    : {},
                credentials: "include",
                cache: "no-store",
            });

            if (!response.ok) {
                throw new Error(`Unable to load properties (${response.status}).`);
            }

            const data = await response.json();
            const records: Property[] = Array.isArray(data)
                ? data
                : Array.isArray(data?.content)
                    ? data.content
                    : [];

            setProperties(records);

            if (records.length > 0) {
                setPropertyId((current) =>
                    current && records.some((p) => String(p.id) === current)
                        ? current
                        : String(records[0].id)
                );
            } else {
                setPropertyId("");
                setPermits([]);
            }
        } catch (err) {
            setError(
                err instanceof Error
                    ? err.message
                    : "Unable to load properties."
            );
        } finally {
            setLoadingProperties(false);
        }
    }, []);

    const loadPermits = useCallback(async (id: string) => {
        if (!id) {
            setPermits([]);
            return;
        }

        setLoadingPermits(true);
        setError("");

        try {
            const token = localStorage.getItem("estateintel_jwt_token");

            const response = await fetch(
                `${API}/api/properties/${encodeURIComponent(id)}/permits`,
                {
                    headers: token
                        ? { Authorization: `Bearer ${token}` }
                        : {},
                    credentials: "include",
                    cache: "no-store",
                }
            );

            if (!response.ok) {
                const body = await response.text();
                throw new Error(
                    `Unable to load permits (${response.status}). ${body}`
                );
            }

            const data = await response.json();

            if (!Array.isArray(data)) {
                throw new Error("Unexpected permits API response format.");
            }

            setPermits(data as Permit[]);
        } catch (err) {
            setPermits([]);
            setError(
                err instanceof Error
                    ? err.message
                    : "Unable to load permits."
            );
        } finally {
            setLoadingPermits(false);
        }
    }, []);

    useEffect(() => {
        void loadProperties();
    }, [loadProperties]);

    useEffect(() => {
        if (propertyId) {
            void loadPermits(propertyId);
        }
    }, [propertyId, loadPermits]);

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

    const getPermitType = (permit: Permit) =>
        String(permit.permitType ?? permit.type ?? "Not specified");

    const getPermitStatus = (permit: Permit) =>
        String(permit.status ?? "Not specified");

    const getPermitDetails = (permit: Permit) =>
        String(permit.description ?? permit.details ?? "No details provided");

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
                        Building Permits
                    </h1>
                    <p className="mt-2 text-slate-600">
                        Review permit records associated with a selected property.
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
                        onChange={(event) => setPropertyId(event.target.value)}
                        disabled={loadingProperties || properties.length === 0}
                        className="w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-slate-800 outline-none focus:border-blue-500 md:max-w-xl"
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
                    <section
                        role="alert"
                        className="mb-6 rounded-xl border border-red-200 bg-red-50 p-4 text-red-700"
                    >
                        <p className="font-semibold">Unable to load data</p>
                        <p className="mt-1 break-words text-sm">{error}</p>
                        <button
                            type="button"
                            onClick={() => {
                                if (propertyId) void loadPermits(propertyId);
                                else void loadProperties();
                            }}
                            className="mt-3 rounded-lg border border-red-300 bg-white px-4 py-2 font-semibold"
                        >
                            Try Again
                        </button>
                    </section>
                )}

                <section className="mb-6 grid gap-4 sm:grid-cols-2">
                    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                        <p className="text-sm text-slate-500">Selected Property ID</p>
                        <p className="mt-2 text-3xl font-bold text-slate-900">
                            {propertyId || "—"}
                        </p>
                    </div>

                    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                        <p className="text-sm text-slate-500">Permit Records</p>
                        <p className="mt-2 text-3xl font-bold text-slate-900">
                            {permits.length}
                        </p>
                    </div>
                </section>

                <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                    <div className="border-b border-slate-200 p-5">
                        <h2 className="text-xl font-bold text-slate-900">
                            Permit History
                        </h2>
                        <p className="mt-1 text-sm text-slate-500">
                            Permit information returned by the backend.
                        </p>
                    </div>

                    {loadingProperties || loadingPermits ? (
                        <p className="p-10 text-center text-slate-500">
                            Loading permit records...
                        </p>
                    ) : permits.length === 0 && !error ? (
                        <div className="p-10 text-center">
                            <p className="font-semibold text-slate-800">
                                No building permits found
                            </p>
                            <p className="mt-2 text-sm text-slate-500">
                                No permit records were returned for this property.
                                This does not necessarily mean the property has no permits.
                            </p>
                        </div>
                    ) : permits.length > 0 ? (
                        <div className="overflow-x-auto">
                            <table className="w-full min-w-[800px] text-left text-sm">
                                <thead className="bg-slate-50 text-slate-600">
                                    <tr>
                                        <th className="px-5 py-4 font-semibold">Permit ID</th>
                                        <th className="px-5 py-4 font-semibold">Permit Number</th>
                                        <th className="px-5 py-4 font-semibold">Type</th>
                                        <th className="px-5 py-4 font-semibold">Status</th>
                                        <th className="px-5 py-4 font-semibold">Details</th>
                                        <th className="px-5 py-4 font-semibold">Issue Date</th>
                                        <th className="px-5 py-4 font-semibold">Expiry Date</th>
                                    </tr>
                                </thead>

                                <tbody className="divide-y divide-slate-100">
                                    {permits.map((permit, index) => (
                                        <tr
                                            key={permit.id ?? index}
                                            className="align-top hover:bg-slate-50"
                                        >
                                            <td className="px-5 py-4">
                                                {permit.id ?? "—"}
                                            </td>
                                            <td className="px-5 py-4">
                                                {permit.permitNumber ?? "—"}
                                            </td>
                                            <td className="px-5 py-4">
                                                {getPermitType(permit)}
                                            </td>
                                            <td className="px-5 py-4">
                                                <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700">
                                                    {getPermitStatus(permit)}
                                                </span>
                                            </td>
                                            <td className="max-w-xs whitespace-pre-wrap break-words px-5 py-4">
                                                {getPermitDetails(permit)}
                                            </td>
                                            <td className="whitespace-nowrap px-5 py-4">
                                                {permit.issueDate ?? "—"}
                                            </td>
                                            <td className="whitespace-nowrap px-5 py-4">
                                                {permit.expirationDate ??
                                                    permit.expiryDate ??
                                                    "—"}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    ) : null}
                </section>
            </div>
        </main>
    );
}

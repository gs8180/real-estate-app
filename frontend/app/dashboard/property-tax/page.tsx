
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

type TaxRecord = {
    id?: number | string;
    taxYear: number;
    taxAmount?: number;
    amountPaid?: number;
    paymentStatus?: string;
};

export default function PropertyTaxPage() {
    const router = useRouter();

    const [properties, setProperties] = useState<Property[]>([]);
    const [propertyId, setPropertyId] = useState("");
    const [records, setRecords] = useState<TaxRecord[]>([]);

    const [taxYear, setTaxYear] = useState("2026");
    const [taxAmount, setTaxAmount] = useState("");
    const [amountPaid, setAmountPaid] = useState("");
    const [paymentStatus, setPaymentStatus] = useState("PENDING");

    const [loadingProperties, setLoadingProperties] = useState(true);
    const [loadingRecords, setLoadingRecords] = useState(false);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const getHeaders = (): Record<string, string> => {
        const token = localStorage.getItem("estateintel_jwt_token");
        return token ? { Authorization: `Bearer ${token}` } : {};
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
            setError(err instanceof Error ? err.message : "Unable to load properties.");
        } finally {
            setLoadingProperties(false);
        }
    }, []);

    const loadTaxHistory = useCallback(async (id: string) => {
        if (!id) {
            setRecords([]);
            return;
        }

        setLoadingRecords(true);
        setError("");

        try {
            const response = await fetch(
                `${API}/api/properties/${encodeURIComponent(id)}/tax-history`,
                {
                    headers: getHeaders(),
                    credentials: "include",
                    cache: "no-store",
                }
            );

            if (!response.ok) {
                const body = await response.text();
                throw new Error(`Unable to load tax history (${response.status}). ${body}`);
            }

            const data = await response.json();

            if (!Array.isArray(data)) {
                throw new Error("Unexpected tax history API response format.");
            }

            setRecords(data);
        } catch (err) {
            setRecords([]);
            setError(err instanceof Error ? err.message : "Unable to load tax history.");
        } finally {
            setLoadingRecords(false);
        }
    }, []);

    useEffect(() => {
        setTaxYear(String(new Date().getFullYear()));
        void loadProperties();
    }, [loadProperties]);

    useEffect(() => {
        if (propertyId) {
            void loadTaxHistory(propertyId);
        } else {
            setRecords([]);
        }
    }, [propertyId, loadTaxHistory]);

    const selectedProperty = properties.find(
        (property) => String(property.id) === propertyId
    );

    const address = selectedProperty
        ? [
            selectedProperty.address,
            selectedProperty.city,
            selectedProperty.state,
            selectedProperty.zipCode,
        ].filter(Boolean).join(", ")
        : "";

    const money = (value?: number) =>
        value == null
            ? "—"
            : value.toLocaleString(undefined, {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
            });

    async function handleSave(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();

        if (!propertyId) {
            setError("Please select a property.");
            return;
        }

        const year = Number(taxYear);
        const total = Number(taxAmount);
        const paid = Number(amountPaid);

        if (
            !Number.isInteger(year) ||
            year < 1900 ||
            year > 2200 ||
            !Number.isFinite(total) ||
            total < 0 ||
            !Number.isFinite(paid) ||
            paid < 0
        ) {
            setError("Enter a valid tax year and non-negative tax amounts.");
            return;
        }

        if (paid > total) {
            setError("Amount paid cannot be greater than the tax amount.");
            return;
        }

        setSaving(true);
        setError("");
        setSuccess("");

        try {
            const params = new URLSearchParams({
                taxYear: String(year),
                taxAmount: String(total),
                amountPaid: String(paid),
                paymentStatus,
            });

            const response = await fetch(
                `${API}/api/properties/${encodeURIComponent(propertyId)}/tax-history?${params.toString()}`,
                {
                    method: "POST",
                    headers: getHeaders(),
                    credentials: "include",
                }
            );

            if (!response.ok) {
                const body = await response.text();
                throw new Error(`Unable to save tax record (${response.status}). ${body}`);
            }

            setSuccess("Property tax record saved successfully.");
            setTaxAmount("");
            setAmountPaid("");

            await loadTaxHistory(propertyId);
        } catch (err) {
            setError(err instanceof Error ? err.message : "Unable to save tax record.");
        } finally {
            setSaving(false);
        }
    }

    const totalTax = records.reduce(
        (sum, record) => sum + (Number(record.taxAmount) || 0),
        0
    );

    const totalPaid = records.reduce(
        (sum, record) => sum + (Number(record.amountPaid) || 0),
        0
    );

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
                        Financial Due Diligence
                    </p>
                    <h1 className="mt-2 text-3xl font-bold text-slate-900 md:text-4xl">
                        Property Tax History
                    </h1>
                    <p className="mt-2 text-slate-600">
                        Review and record property tax payments for the selected property.
                    </p>
                </header>

                <section className="mb-6 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                    <label htmlFor="property" className="mb-2 block text-sm font-semibold text-slate-700">
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
                    <div role="alert" className="mb-5 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
                        {error}
                    </div>
                )}

                {success && (
                    <div role="status" className="mb-5 rounded-xl border border-green-200 bg-green-50 p-4 text-sm font-medium text-green-800">
                        {success}
                    </div>
                )}

                <section className="mb-6 grid gap-4 sm:grid-cols-3">
                    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                        <p className="text-sm text-slate-500">Records</p>
                        <p className="mt-2 text-3xl font-bold text-slate-900">{records.length}</p>
                    </div>
                    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                        <p className="text-sm text-slate-500">Total Tax Recorded</p>
                        <p className="mt-2 text-2xl font-bold text-slate-900">{money(totalTax)}</p>
                    </div>
                    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                        <p className="text-sm text-slate-500">Total Amount Paid</p>
                        <p className="mt-2 text-2xl font-bold text-slate-900">{money(totalPaid)}</p>
                    </div>
                </section>

                <section className="mb-6 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm md:p-6">
                    <h2 className="text-xl font-bold text-slate-900">Add Tax Record</h2>
                    <p className="mt-1 text-sm text-slate-500">
                        Enter values from the property tax statement or payment records.
                    </p>

                    <form onSubmit={handleSave} className="mt-5 space-y-5">
                        <div className="grid gap-5 md:grid-cols-2">
                            <div>
                                <label htmlFor="taxYear" className="mb-2 block text-sm font-semibold text-slate-700">
                                    Tax Year *
                                </label>
                                <input
                                    id="taxYear"
                                    type="number"
                                    min="1900"
                                    max="2200"
                                    step="1"
                                    required
                                    value={taxYear}
                                    onChange={(event) => setTaxYear(event.target.value)}
                                    className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none focus:border-blue-500"
                                />
                            </div>

                            <div>
                                <label htmlFor="paymentStatus" className="mb-2 block text-sm font-semibold text-slate-700">
                                    Payment Status *
                                </label>
                                <select
                                    id="paymentStatus"
                                    value={paymentStatus}
                                    onChange={(event) => setPaymentStatus(event.target.value)}
                                    required
                                    className="w-full rounded-lg border border-slate-300 bg-white px-4 py-3 outline-none focus:border-blue-500"
                                >
                                    <option value="PENDING">Pending</option>
                                    <option value="PARTIALLY_PAID">Partially Paid</option>
                                    <option value="PAID">Paid</option>
                                    <option value="OVERDUE">Overdue</option>
                                </select>
                            </div>

                            <div>
                                <label htmlFor="taxAmount" className="mb-2 block text-sm font-semibold text-slate-700">
                                    Tax Amount *
                                </label>
                                <input
                                    id="taxAmount"
                                    type="number"
                                    min="0"
                                    step="0.01"
                                    required
                                    value={taxAmount}
                                    onChange={(event) => setTaxAmount(event.target.value)}
                                    placeholder="Enter assessed tax amount"
                                    className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none focus:border-blue-500"
                                />
                            </div>

                            <div>
                                <label htmlFor="amountPaid" className="mb-2 block text-sm font-semibold text-slate-700">
                                    Amount Paid *
                                </label>
                                <input
                                    id="amountPaid"
                                    type="number"
                                    min="0"
                                    step="0.01"
                                    required
                                    value={amountPaid}
                                    onChange={(event) => setAmountPaid(event.target.value)}
                                    placeholder="Enter amount paid"
                                    className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none focus:border-blue-500"
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={saving || !propertyId}
                            className="rounded-lg bg-blue-600 px-6 py-3 font-semibold text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                            {saving ? "Saving..." : "Save Tax Record"}
                        </button>
                    </form>
                </section>

                <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                    <div className="flex flex-col justify-between gap-3 border-b border-slate-200 p-5 sm:flex-row sm:items-center">
                        <div>
                            <h2 className="text-xl font-bold text-slate-900">Tax History</h2>
                            <p className="mt-1 text-sm text-slate-500">
                                Records returned by the backend for this property.
                            </p>
                        </div>
                        <button
                            type="button"
                            onClick={() => void loadTaxHistory(propertyId)}
                            disabled={!propertyId || loadingRecords}
                            className="rounded-lg border border-slate-300 px-4 py-2 font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-50"
                        >
                            {loadingRecords ? "Refreshing..." : "Refresh"}
                        </button>
                    </div>

                    {loadingProperties || loadingRecords ? (
                        <p className="p-10 text-center text-slate-500">Loading tax history...</p>
                    ) : records.length === 0 ? (
                        <div className="p-10 text-center">
                            <p className="font-semibold text-slate-800">No tax records found</p>
                            <p className="mt-2 text-sm text-slate-500">
                                No tax history was returned for this property. Add a record above
                                using verified tax information.
                            </p>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full min-w-[800px] text-left text-sm">
                                <thead className="bg-slate-50 text-slate-600">
                                    <tr>
                                        <th className="px-5 py-4 font-semibold">ID</th>
                                        <th className="px-5 py-4 font-semibold">Tax Year</th>
                                        <th className="px-5 py-4 font-semibold">Tax Amount</th>
                                        <th className="px-5 py-4 font-semibold">Amount Paid</th>
                                        <th className="px-5 py-4 font-semibold">Balance</th>
                                        <th className="px-5 py-4 font-semibold">Payment Status</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100">
                                    {records.map((record, index) => {
                                        const tax = Number(record.taxAmount) || 0;
                                        const paid = Number(record.amountPaid) || 0;

                                        return (
                                            <tr key={record.id ?? index} className="hover:bg-slate-50">
                                                <td className="px-5 py-4">{record.id ?? "—"}</td>
                                                <td className="px-5 py-4">{record.taxYear}</td>
                                                <td className="px-5 py-4">{money(record.taxAmount)}</td>
                                                <td className="px-5 py-4">{money(record.amountPaid)}</td>
                                                <td className="px-5 py-4">{money(tax - paid)}</td>
                                                <td className="px-5 py-4">
                                                    <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700">
                                                        {record.paymentStatus || "Not specified"}
                                                    </span>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    )}
                </section>
            </div>
        </main>
    );
}

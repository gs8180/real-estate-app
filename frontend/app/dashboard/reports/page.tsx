
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import * as XLSX from "xlsx";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";

const API =
    process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

type DataObject = Record<string, unknown>;

type Property = {
    id?: number;
    propertyId?: number;
    address?: string;
    city?: string;
    state?: string;
    zipCode?: string;
    propertyType?: string;
    price?: number;
    priceDifference?: number;
    priceDifferencePercentage?: number;
};

type ReportData = {
    property?: Property;
    riskAssessment?: DataObject | null;
    comparableProperties?: Property[];
    marketAnalysis?: unknown;
    aiAnalysis?: unknown;
    [key: string]: unknown;
};

const riskItems = [
    { label: "Environmental Risk", key: "environmentalRisk" },
    { label: "Flood Risk", key: "floodRisk" },
    { label: "Ownership Risk", key: "ownershipRisk" },
    { label: "Permit Risk", key: "permitRisk" },
    { label: "Tax Risk", key: "taxRisk" },
    { label: "Utility Risk", key: "utilityRisk" },
    { label: "Zoning Risk", key: "zoningRisk" },
] as const;

function asObject(value: unknown): DataObject {
    return value && typeof value === "object" && !Array.isArray(value)
        ? (value as DataObject)
        : {};
}

function display(value: unknown): string {
    if (value === null || value === undefined || value === "") {
        return "Not available";
    }

    if (typeof value === "object") {
        return JSON.stringify(value, null, 2);
    }

    return String(value);
}

function formatPrice(value: unknown): string {
    if (typeof value !== "number" || !Number.isFinite(value)) {
        return "Not available";
    }

    return value.toLocaleString("en-IN");
}

function propertyAddress(property?: Property): string {
    if (!property) return "Address not available";

    return [
        property.address,
        property.city,
        property.state,
        property.zipCode,
    ]
        .filter(Boolean)
        .join(", ") || "Address not available";
}

function downloadBlob(blob: Blob, filename: string) {
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    link.remove();

    window.setTimeout(() => URL.revokeObjectURL(url), 1000);
}

export default function ReportsPage() {
    const router = useRouter();

    const [propertyId, setPropertyId] = useState("");
    const [report, setReport] = useState<ReportData | null>(null);
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
            void fetchReport(id);
        }
    }, []);

    async function fetchReport(id: string) {
        const cleanId = id.trim();

        if (!cleanId || !/^\d+$/.test(cleanId)) {
            setError("Please enter a valid numeric Property ID.");
            return;
        }

        setLoading(true);
        setError("");
        setMessage("");
        setReport(null);

        try {
            const response = await fetch(
                `${API}/api/reports/property/${encodeURIComponent(cleanId)}`,
                { headers: getHeaders() }
            );

            if (!response.ok) {
                const details = await response.text();

                throw new Error(
                    `Report request failed (HTTP ${response.status}).` +
                    (details ? ` ${details}` : "")
                );
            }

            const data = (await response.json()) as ReportData;

            setReport(data);
            setMessage("Due diligence report loaded successfully.");
        } catch (e) {
            setError(
                e instanceof Error ? e.message : "Unable to load report."
            );
        } finally {
            setLoading(false);
        }
    }

    function downloadExcel() {
        if (!report) return;

        try {
            const workbook = XLSX.utils.book_new();
            const property = report.property;
            const risk = asObject(report.riskAssessment);
            const market = asObject(report.marketAnalysis);
            const ai = asObject(report.aiAnalysis);
            const comparables = Array.isArray(report.comparableProperties)
                ? report.comparableProperties
                : [];

            const propertyRows = [
                ["Field", "Value"],
                ["Property ID", property?.id ?? propertyId],
                ["Address", property?.address ?? ""],
                ["City", property?.city ?? ""],
                ["State", property?.state ?? ""],
                ["ZIP Code", property?.zipCode ?? ""],
                ["Property Type", property?.propertyType ?? ""],
                ["Price", property?.price ?? ""],
            ];

            XLSX.utils.book_append_sheet(
                workbook,
                XLSX.utils.aoa_to_sheet(propertyRows),
                "Property"
            );

            const riskRows: unknown[][] = [
                ["Risk Category", "Value"],
                ["Overall Risk Score", risk.overallRiskScore ?? ""],
                ["Risk Level", risk.riskLevel ?? ""],
            ];

            riskItems.forEach(({ label, key }) => {
                riskRows.push([label, risk[key] ?? ""]);
            });

            Object.entries(risk).forEach(([key, value]) => {
                if (
                    key !== "property" &&
                    key !== "overallRiskScore" &&
                    key !== "riskLevel" &&
                    !riskItems.some((item) => item.key === key)
                ) {
                    riskRows.push([key, display(value)]);
                }
            });

            XLSX.utils.book_append_sheet(
                workbook,
                XLSX.utils.aoa_to_sheet(riskRows),
                "Risk Assessment"
            );

            const comparableRows: unknown[][] = [
                [
                    "Property ID",
                    "Address",
                    "City",
                    "State",
                    "ZIP Code",
                    "Property Type",
                    "Price",
                    "Price Difference",
                    "Price Difference Percentage",
                ],
            ];

            comparables.forEach((item) => {
                comparableRows.push([
                    item.propertyId ?? item.id ?? "",
                    item.address ?? "",
                    item.city ?? "",
                    item.state ?? "",
                    item.zipCode ?? "",
                    item.propertyType ?? "",
                    item.price ?? "",
                    item.priceDifference ?? "",
                    item.priceDifferencePercentage ?? "",
                ]);
            });

            XLSX.utils.book_append_sheet(
                workbook,
                XLSX.utils.aoa_to_sheet(comparableRows),
                "Comparable Properties"
            );

            const analysisRows: unknown[][] = [
                ["Section", "Content"],
                ...Object.entries(market).map(([key, value]) => [
                    `Market: ${key}`,
                    display(value),
                ]),
                ...Object.entries(ai).map(([key, value]) => [
                    `AI: ${key}`,
                    display(value),
                ]),
            ];

            if (analysisRows.length === 1) {
                analysisRows.push(["Analysis", "No data available"]);
            }

            XLSX.utils.book_append_sheet(
                workbook,
                XLSX.utils.aoa_to_sheet(analysisRows),
                "Market and AI Analysis"
            );

            XLSX.writeFile(
                workbook,
                `due-diligence-report-${propertyId}.xlsx`
            );

            setMessage("Excel report downloaded successfully.");
            setError("");
        } catch (e) {
            setError(
                e instanceof Error
                    ? `Excel download failed: ${e.message}`
                    : "Excel download failed."
            );
        }
    }

    function downloadPDF() {
        if (!report) return;

        try {
            const pdf = new jsPDF();
            const pageWidth = pdf.internal.pageSize.getWidth();
            const pageHeight = pdf.internal.pageSize.getHeight();
            const property = report.property;
            const risk = asObject(report.riskAssessment);
            const market = asObject(report.marketAnalysis);
            const ai = asObject(report.aiAnalysis);
            const comparables = Array.isArray(report.comparableProperties)
                ? report.comparableProperties
                : [];

            pdf.setFontSize(20);
            pdf.text("Due Diligence Report", 14, 20);

            pdf.setFontSize(10);
            pdf.text(`Property ID: ${property?.id ?? propertyId}`, 14, 29);
            pdf.text(
                `Generated: ${new Date().toLocaleString()}`,
                14,
                35
            );

            pdf.setFontSize(15);
            pdf.text("Property Details", 14, 46);

            autoTable(pdf, {
                startY: 51,
                head: [["Field", "Value"]],
                body: [
                    ["Address", propertyAddress(property)],
                    ["Property Type", property?.propertyType ?? "Not available"],
                    ["Price", formatPrice(property?.price)],
                ],
                styles: { fontSize: 9, overflow: "linebreak" },
            });

            let y =
                ((pdf as any).lastAutoTable?.finalY ?? 80) + 12;

            pdf.setFontSize(15);
            pdf.text("Risk Assessment", 14, y);

            autoTable(pdf, {
                startY: y + 5,
                head: [["Risk Category", "Value"]],
                body: [
                    ["Overall Risk Score", display(risk.overallRiskScore)],
                    ["Risk Level", display(risk.riskLevel)],
                    ...riskItems.map(({ label, key }) => [
                        label,
                        display(risk[key]),
                    ]),
                ],
                styles: { fontSize: 9, overflow: "linebreak" },
            });

            y = ((pdf as any).lastAutoTable?.finalY ?? y + 40) + 12;

            if (comparables.length > 0) {
                if (y > pageHeight - 45) {
                    pdf.addPage();
                    y = 20;
                }

                pdf.setFontSize(15);
                pdf.text("Comparable Properties", 14, y);

                autoTable(pdf, {
                    startY: y + 5,
                    head: [["ID", "Address", "Type", "Price", "Difference"]],
                    body: comparables.map((item) => [
                        String(item.propertyId ?? item.id ?? ""),
                        propertyAddress(item),
                        item.propertyType ?? "",
                        formatPrice(item.price),
                        formatPrice(item.priceDifference),
                    ]),
                    styles: { fontSize: 7, overflow: "linebreak" },
                });
            }

            function addTextSection(title: string, value: unknown) {
                if (value === null || value === undefined || value === "") {
                    return;
                }

                pdf.addPage();
                pdf.setFontSize(15);
                pdf.text(title, 14, 20);

                pdf.setFontSize(9);

                const rawText =
                    typeof value === "string"
                        ? value
                        : JSON.stringify(value, null, 2);

                const lines = pdf.splitTextToSize(rawText, pageWidth - 28);
                let currentY = 30;

                lines.forEach((line: string) => {
                    if (currentY > pageHeight - 15) {
                        pdf.addPage();
                        currentY = 20;
                    }

                    pdf.text(line, 14, currentY);
                    currentY += 5;
                });
            }

            addTextSection("Market Analysis", market);
            addTextSection("AI Analysis", ai);

            pdf.save(`due-diligence-report-${propertyId}.pdf`);

            setMessage("PDF report downloaded successfully.");
            setError("");
        } catch (e) {
            setError(
                e instanceof Error
                    ? `PDF download failed: ${e.message}`
                    : "PDF download failed."
            );
        }
    }

    const property = report?.property;
    const risk = asObject(report?.riskAssessment);
    const market = asObject(report?.marketAnalysis);
    const ai = asObject(report?.aiAnalysis);
    const comparables = Array.isArray(report?.comparableProperties)
        ? report.comparableProperties
        : [];

    const metricItems = [
        { label: "Target Price", key: "targetPrice", currency: true },
        {
            label: "Average Comparable Price",
            key: "averageComparablePrice",
            currency: true,
        },
        { label: "Price Difference", key: "priceDifference", currency: true },
        {
            label: "Price Difference Percentage",
            key: "priceDifferencePercentage",
            currency: false,
        },
        { label: "Comparable Count", key: "comparableCount", currency: false },
    ] as const;

    const aiItems = [
        { label: "Risk Summary", key: "riskSummary" },
        { label: "Market Summary", key: "marketSummary" },
        { label: "Due Diligence Summary", key: "dueDiligenceSummary" },
    ] as const;

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
                        Due Diligence Reports
                    </h1>
                    <p className="mt-2 text-slate-600">
                        Review property risks, comparable properties and market insights.
                    </p>
                </header>

                <form
                    onSubmit={(event) => {
                        event.preventDefault();
                        void fetchReport(propertyId);
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
                        {loading ? "Generating..." : "Generate Report"}
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
                        className="mb-5 rounded-xl border border-green-200 bg-green-50 p-4 text-green-800"
                    >
                        {message}
                    </div>
                )}

                {loading && (
                    <p className="mb-5 text-slate-500">Loading report...</p>
                )}

                {report && (
                    <>
                        {/* Property details */}
                        <section className="mb-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                            <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                                Selected Property
                            </p>

                            <h2 className="mt-2 text-2xl font-bold text-slate-900">
                                {property?.address ?? "Property details"}
                            </h2>

                            <p className="mt-1 text-slate-600">
                                {[property?.city, property?.state, property?.zipCode]
                                    .filter(Boolean)
                                    .join(", ")}
                            </p>

                            <div className="mt-5 grid gap-4 sm:grid-cols-3">
                                <div className="rounded-xl bg-slate-50 p-4">
                                    <p className="text-sm text-slate-500">Property ID</p>
                                    <p className="mt-1 font-bold">
                                        {property?.id ?? propertyId}
                                    </p>
                                </div>

                                <div className="rounded-xl bg-slate-50 p-4">
                                    <p className="text-sm text-slate-500">Property Type</p>
                                    <p className="mt-1 font-bold">
                                        {property?.propertyType ?? "Not available"}
                                    </p>
                                </div>

                                <div className="rounded-xl bg-slate-50 p-4">
                                    <p className="text-sm text-slate-500">Price</p>
                                    <p className="mt-1 font-bold">
                                        {formatPrice(property?.price)}
                                    </p>
                                </div>
                            </div>
                        </section>

                        {/* Risk assessment */}
                        <section className="mb-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                            <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                                <div>
                                    <h2 className="text-xl font-bold text-slate-900">
                                        Risk Assessment
                                    </h2>
                                    <p className="mt-1 text-sm text-slate-500">
                                        Risk values returned by the backend.
                                    </p>
                                </div>

                                <div className="rounded-xl bg-slate-50 p-4">
                                    <p className="text-sm text-slate-500">Overall Risk Score</p>
                                    <p className="mt-1 text-3xl font-bold text-slate-900">
                                        {display(risk.overallRiskScore)}
                                    </p>
                                    <p className="mt-1 text-sm font-semibold text-slate-700">
                                        Level: {display(risk.riskLevel)}
                                    </p>
                                </div>
                            </div>

                            <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                                {riskItems.map(({ label, key }) => {
                                    const value = risk[key];
                                    const score =
                                        typeof value === "number" && Number.isFinite(value)
                                            ? value
                                            : null;

                                    return (
                                        <article
                                            key={key}
                                            className="rounded-xl border border-slate-200 p-4"
                                        >
                                            <p className="text-sm text-slate-500">{label}</p>
                                            <p className="mt-2 text-2xl font-bold text-slate-900">
                                                {display(value)}
                                            </p>

                                            {score !== null && (
                                                <div className="mt-3 h-2 overflow-hidden rounded-full bg-slate-100">
                                                    <div
                                                        className="h-full rounded-full bg-blue-600"
                                                        style={{
                                                            width: `${Math.max(0, Math.min(100, score))}%`,
                                                        }}
                                                    />
                                                </div>
                                            )}
                                        </article>
                                    );
                                })}
                            </div>
                        </section>

                        {/* Comparable properties */}
                        <section className="mb-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                            <h2 className="mb-4 text-xl font-bold text-slate-900">
                                Comparable Properties
                            </h2>

                            {comparables.length > 0 ? (
                                <div className="grid gap-4 md:grid-cols-2">
                                    {comparables.map((item, index) => (
                                        <article
                                            key={item.propertyId ?? item.id ?? index}
                                            className="rounded-xl border border-slate-200 p-5"
                                        >
                                            <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                                                Comparable Property
                                            </p>

                                            <h3 className="mt-2 text-lg font-bold text-slate-900">
                                                {item.address ?? "Address not available"}
                                            </h3>

                                            <p className="mt-1 text-sm text-slate-600">
                                                {[item.city, item.state, item.zipCode]
                                                    .filter(Boolean)
                                                    .join(", ")}
                                            </p>

                                            <div className="mt-4 grid grid-cols-2 gap-3">
                                                <div className="rounded-lg bg-slate-50 p-3">
                                                    <p className="text-xs text-slate-500">Price</p>
                                                    <p className="mt-1 font-semibold">
                                                        {formatPrice(item.price)}
                                                    </p>
                                                </div>

                                                <div className="rounded-lg bg-slate-50 p-3">
                                                    <p className="text-xs text-slate-500">
                                                        Price Difference
                                                    </p>
                                                    <p className="mt-1 font-semibold">
                                                        {formatPrice(item.priceDifference)}
                                                    </p>
                                                </div>
                                            </div>

                                            <p className="mt-3 text-sm text-slate-500">
                                                Difference percentage:{" "}
                                                {item.priceDifferencePercentage == null
                                                    ? "Not available"
                                                    : `${item.priceDifferencePercentage}%`}
                                            </p>
                                        </article>
                                    ))}
                                </div>
                            ) : (
                                <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50 p-5">
                                    <p className="font-semibold text-slate-800">
                                        No comparable properties available
                                    </p>
                                    <p className="mt-1 text-sm text-slate-600">
                                        Market comparison cannot be completed until comparable
                                        property data is available from the backend.
                                    </p>
                                </div>
                            )}
                        </section>

                        {/* Market analysis */}
                        <section className="mb-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                            <div className="mb-5 flex items-center gap-3">
                                <div className="rounded-xl bg-blue-50 p-3 text-xl">
                                    📊
                                </div>
                                <div>
                                    <h2 className="text-xl font-bold text-slate-900">
                                        Market Analysis
                                    </h2>
                                    <p className="text-sm text-slate-500">
                                        Pricing and comparable market data
                                    </p>
                                </div>
                            </div>

                            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                                {metricItems.map(({ label, key, currency }) => {
                                    const value = market[key];

                                    let formatted = "Not available";

                                    if (value !== null && value !== undefined) {
                                        if (currency && typeof value === "number") {
                                            formatted = value.toLocaleString("en-IN");
                                        } else if (key === "priceDifferencePercentage") {
                                            formatted = `${display(value)}%`;
                                        } else {
                                            formatted = display(value);
                                        }
                                    }

                                    return (
                                        <div
                                            key={key}
                                            className="rounded-xl bg-slate-50 p-4"
                                        >
                                            <p className="text-sm text-slate-500">{label}</p>
                                            <p className="mt-2 break-words text-xl font-bold text-slate-900">
                                                {formatted}
                                            </p>
                                        </div>
                                    );
                                })}
                            </div>

                            {Number(market.comparableCount ?? 0) === 0 && (
                                <p className="mt-4 rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800">
                                    Comparable-property data is unavailable. Market
                                    comparisons may be incomplete.
                                </p>
                            )}
                        </section>

                        {/* AI analysis */}
                        <section className="mb-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                            <div className="mb-5 flex items-center gap-3">
                                <div className="rounded-xl bg-violet-50 p-3 text-xl">
                                    🧠
                                </div>
                                <div>
                                    <h2 className="text-xl font-bold text-slate-900">
                                        AI Analysis
                                    </h2>
                                    <p className="text-sm text-slate-500">
                                        Risk insights and due diligence findings
                                    </p>
                                </div>
                            </div>

                            <div className="space-y-5">
                                {aiItems.map(({ label, key }) => (
                                    <div key={key}>
                                        <p className="mb-1 text-sm font-semibold text-slate-500">
                                            {label}
                                        </p>
                                        <p className="leading-7 text-slate-800">
                                            {display(ai[key])}
                                        </p>
                                    </div>
                                ))}

                                <div className="rounded-xl border border-blue-100 bg-blue-50 p-4">
                                    <p className="mb-1 text-sm font-semibold text-blue-800">
                                        Key Finding
                                    </p>
                                    <p className="leading-6 text-blue-950">
                                        {display(ai.keyFinding)}
                                    </p>
                                </div>
                            </div>
                        </section>

                        {/* Downloads */}
                        <section className="mb-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                            <h2 className="text-xl font-bold text-slate-900">
                                Export Report
                            </h2>
                            <p className="mt-1 text-sm text-slate-500">
                                Download the current backend report for sharing and review.
                            </p>

                            <div className="mt-5 flex flex-wrap gap-3">
                                <button
                                    type="button"
                                    onClick={downloadPDF}
                                    className="rounded-lg bg-blue-600 px-5 py-3 font-semibold text-white hover:bg-blue-700"
                                >
                                    Download PDF
                                </button>

                                <button
                                    type="button"
                                    onClick={downloadExcel}
                                    className="rounded-lg bg-emerald-600 px-5 py-3 font-semibold text-white hover:bg-emerald-700"
                                >
                                    Download Excel
                                </button>

                                <button
                                    type="button"
                                    onClick={() =>
                                        router.push(
                                            `/dashboard/property-details?id=${property?.id ?? propertyId}`
                                        )
                                    }
                                    className="rounded-lg border border-slate-300 px-5 py-3 font-semibold text-slate-700 hover:bg-slate-50"
                                >
                                    Back to Property Details
                                </button>
                            </div>
                        </section>
                    </>
                )}
            </div>
        </main>
    );
}

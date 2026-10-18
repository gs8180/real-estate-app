
"use client";

import { Suspense, useCallback, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";

const API =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

type Property = {
  id: number;
  address?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  propertyType?: string;
  price?: number;
};

type RiskAssessment = {
  overallRiskScore?: number;
  riskLevel?: string;
  [key: string]: unknown;
};

type ComparableProperty = Record<string, unknown>;

type MarketAnalysis = {
  propertyId?: number;
  targetPrice?: number;
  averageComparablePrice?: number;
  priceDifference?: number;
  priceDifferencePercentage?: number;
  comparableCount?: number;
  [key: string]: unknown;
};

type AIAnalysis = Record<string, unknown>;

type Report = {
  property: Property;
  riskAssessment: RiskAssessment;
  comparableProperties: ComparableProperty[];
  marketAnalysis: MarketAnalysis;
  aiAnalysis: AIAnalysis;
};

type RecordSections = {
  ownership: unknown[];
  tax: unknown[];
  permits: unknown[];
  zoning: unknown[];
  environmental: unknown[];
};

const emptyRecords: RecordSections = {
  ownership: [],
  tax: [],
  permits: [],
  zoning: [],
  environmental: [],
};

function formatLabel(value: string): string {
  return value
    .replace(/([A-Z])/g, " $1")
    .replace(/[_-]/g, " ")
    .replace(/^./, (character) => character.toUpperCase());
}

function formatValue(value: unknown): string {
  if (value === null || value === undefined || value === "") {
    return "Not available";
  }

  if (typeof value === "number") {
    return value.toLocaleString();
  }

  if (typeof value === "boolean") {
    return value ? "Yes" : "No";
  }

  if (typeof value === "object") {
    return JSON.stringify(value, null, 2) ?? "Not available";
  }

  return String(value);
}

function DataCard({
  title,
  data,
}: {
  title: string;
  data: Record<string, unknown> | undefined;
}) {
  if (!data || Object.keys(data).length === 0) {
    return (
      <section className="rounded-xl border border-slate-200 bg-white p-5">
        <h2 className="text-lg font-semibold text-slate-900">{title}</h2>
        <p className="mt-3 text-sm text-slate-500">No data available.</p>
      </section>
    );
  }

  return (
    <section className="rounded-xl border border-slate-200 bg-white p-5">
      <h2 className="text-lg font-semibold text-slate-900">{title}</h2>

      <dl className="mt-4 space-y-3">
        {Object.entries(data).map(([key, value]) => (
          <div
            key={key}
            className="grid gap-1 border-b border-slate-100 pb-3 sm:grid-cols-2"
          >
            <dt className="break-words text-sm text-slate-500">
              {formatLabel(key)}
            </dt>

            <dd className="break-words text-sm font-medium text-slate-800">
              {typeof value === "object" && value !== null ? (
                <pre className="whitespace-pre-wrap break-words font-sans">
                  {formatValue(value)}
                </pre>
              ) : (
                formatValue(value)
              )}
            </dd>
          </div>
        ))}
      </dl>
    </section>
  );
}

function RecordsSection({
  title,
  records,
}: {
  title: string;
  records: unknown[];
}) {
  return (
    <section className="mb-6 rounded-xl border border-slate-200 bg-white p-5">
      <h2 className="text-xl font-bold text-slate-900">
        {title} ({records.length})
      </h2>

      {records.length === 0 ? (
        <p className="mt-3 text-sm text-slate-500">
          No records returned by the backend.
        </p>
      ) : (
        <div className="mt-4 space-y-4">
          {records.map((record, index) => (
            <DataCard
              key={index}
              title={`${title} Record ${index + 1}`}
              data={
                record !== null && typeof record === "object"
                  ? (record as Record<string, unknown>)
                  : { value: record }
              }
            />
          ))}
        </div>
      )}
    </section>
  );
}

function DueDiligenceContent() {
  const searchParams = useSearchParams();

  const [propertyId, setPropertyId] = useState("");
  const [report, setReport] = useState<Report | null>(null);
  const [records, setRecords] = useState<RecordSections>(emptyRecords);
  const [loading, setLoading] = useState(false);
  const [downloading, setDownloading] = useState<"pdf" | "excel" | null>(null);
  const [error, setError] = useState("");
  const [downloadError, setDownloadError] = useState("");

  const loadReport = useCallback(async (id: string) => {
    const cleanId = id.trim();

    if (!/^[1-9]\d*$/.test(cleanId)) {
      setError("Please enter a valid numeric Property ID.");
      return;
    }

    setLoading(true);
    setError("");
    setDownloadError("");
    setReport(null);
    setRecords(emptyRecords);

    try {
      const token = localStorage.getItem("estateintel_jwt_token");

      const headers: HeadersInit = token
        ? { Authorization: `Bearer ${token}` }
        : {};

      const response = await fetch(
        `${API}/api/reports/property/${cleanId}`,
        {
          headers,
          cache: "no-store",
        }
      );

      if (!response.ok) {
        const details = await response.text();
        throw new Error(
          `Report request failed (${response.status})${details ? `: ${details}` : ""
          }`
        );
      }

      const data = (await response.json()) as Report;

      if (!data || !data.property) {
        throw new Error("The backend returned an invalid report response.");
      }

      setReport(data);
      setPropertyId(cleanId);
      sessionStorage.setItem("selectedPropertyId", cleanId);

      const endpoints = [
        { key: "ownership", url: `/api/properties/${cleanId}/ownership` },
        { key: "tax", url: `/api/properties/${cleanId}/tax-history` },
        { key: "permits", url: `/api/properties/${cleanId}/permits` },
        { key: "zoning", url: `/api/properties/${cleanId}/zoning` },
        {
          key: "environmental",
          url: `/api/properties/${cleanId}/environmental`,
        },
      ] as const;

      const results = await Promise.all(
        endpoints.map(async (endpoint) => {
          try {
            const recordResponse = await fetch(`${API}${endpoint.url}`, {
              headers,
              cache: "no-store",
            });

            if (!recordResponse.ok) {
              return { key: endpoint.key, values: [] as unknown[] };
            }

            const body: unknown = await recordResponse.json();

            let values: unknown[] = [];

            if (Array.isArray(body)) {
              values = body;
            } else if (body && typeof body === "object") {
              const objectBody = body as Record<string, unknown>;
              values = Array.isArray(objectBody.content)
                ? objectBody.content
                : [body];
            }

            return { key: endpoint.key, values };
          } catch {
            return { key: endpoint.key, values: [] as unknown[] };
          }
        })
      );

      const nextRecords: RecordSections = { ...emptyRecords };

      for (const result of results) {
        nextRecords[result.key] = result.values;
      }

      setRecords(nextRecords);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to generate the due diligence report."
      );
    } finally {
      setLoading(false);
    }
  }, []);

  const downloadReport = async (format: "pdf" | "excel") => {
    if (!report?.property?.id) {
      setDownloadError("Generate the report before downloading.");
      return;
    }

    setDownloading(format);
    setDownloadError("");

    try {
      const token = localStorage.getItem("estateintel_jwt_token");

      const response = await fetch(
        `${API}/api/reports/property/${report.property.id}/${format}`,
        {
          headers: token
            ? { Authorization: `Bearer ${token}` }
            : {},
          cache: "no-store",
        }
      );

      if (!response.ok) {
        const details = await response.text();
        throw new Error(
          `Download failed (${response.status})${details ? `: ${details}` : ""
          }`
        );
      }

      const blob = await response.blob();

      if (blob.size === 0) {
        throw new Error("The server returned an empty file.");
      }

      const objectUrl = URL.createObjectURL(blob);
      const link = document.createElement("a");

      link.href = objectUrl;
      link.download = `due-diligence-${report.property.id}.${format === "excel" ? "xlsx" : "pdf"}`;

      document.body.appendChild(link);
      link.click();
      link.remove();

      URL.revokeObjectURL(objectUrl);
    } catch (err) {
      setDownloadError(
        err instanceof Error
          ? err.message
          : "Unable to download the report."
      );
    } finally {
      setDownloading(null);
    }
  };

  useEffect(() => {
    const id =
      searchParams.get("id") ||
      sessionStorage.getItem("selectedPropertyId");

    if (id) {
      setPropertyId(id);
      void loadReport(id);
    }
  }, [searchParams, loadReport]);

  const property = report?.property;
  const risk = report?.riskAssessment;
  const market = report?.marketAnalysis;

  return (
    <main className="min-h-screen bg-slate-50 p-4 md:p-8">
      <div className="mx-auto max-w-6xl">
        <header className="mb-6">
          <h1 className="text-3xl font-bold text-slate-900">
            Due Diligence Report
          </h1>
          <p className="mt-2 text-slate-600">
            Review property details, risks, market data, and property records.
          </p>
        </header>

        <form
          onSubmit={(event) => {
            event.preventDefault();
            void loadReport(propertyId);
          }}
          className="mb-6 flex flex-col gap-3 rounded-xl border border-slate-200 bg-white p-5 sm:flex-row"
        >
          <input
            type="number"
            min="1"
            required
            value={propertyId}
            onChange={(event) => setPropertyId(event.target.value)}
            placeholder="Enter Property ID"
            className="w-full rounded-lg border border-slate-300 px-4 py-3 text-slate-900"
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
          <div className="mb-5 whitespace-pre-wrap break-words rounded-lg border border-red-200 bg-red-50 p-4 text-red-700">
            {error}
          </div>
        )}

        {report && property && (
          <>
            {/* Export buttons */}
            <section className="mb-6 rounded-xl border border-slate-200 bg-white p-5">
              <h2 className="text-lg font-semibold text-slate-900">
                Export Report
              </h2>

              <p className="mt-2 text-sm text-slate-600">
                Download the backend-generated report for Property ID{" "}
                {property.id}.
              </p>

              <div className="mt-4 flex flex-wrap gap-3">
                <button
                  type="button"
                  disabled={downloading !== null}
                  onClick={() => void downloadReport("pdf")}
                  className="rounded-lg bg-red-600 px-5 py-3 font-semibold text-white hover:bg-red-700 disabled:opacity-60"
                >
                  {downloading === "pdf" ? "Downloading PDF..." : "Download PDF"}
                </button>

                <button
                  type="button"
                  disabled={downloading !== null}
                  onClick={() => void downloadReport("excel")}
                  className="rounded-lg bg-green-700 px-5 py-3 font-semibold text-white hover:bg-green-800 disabled:opacity-60"
                >
                  {downloading === "excel"
                    ? "Downloading Excel..."
                    : "Download Excel"}
                </button>
              </div>

              {downloadError && (
                <p className="mt-3 whitespace-pre-wrap break-words text-sm text-red-600">
                  {downloadError}
                </p>
              )}
            </section>

            {/* Property Details */}
            <section className="mb-6 rounded-xl border border-slate-200 bg-white p-5">
              <h2 className="text-xl font-bold text-slate-900">
                Property Details
              </h2>

              <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {[
                  ["Property ID", property.id],
                  ["Address", property.address],
                  ["City", property.city],
                  ["State", property.state],
                  ["ZIP Code", property.zipCode],
                  ["Property Type", property.propertyType],
                  ["Price", property.price],
                ].map(([label, value]) => (
                  <div
                    key={String(label)}
                    className="rounded-lg bg-slate-50 p-3"
                  >
                    <p className="text-sm text-slate-500">{label}</p>
                    <p className="mt-1 break-words font-medium text-slate-900">
                      {formatValue(value)}
                    </p>
                  </div>
                ))}
              </div>
            </section>

            {/* Risk Assessment */}
            <section className="mb-6 rounded-xl border border-slate-200 bg-white p-5">
              <h2 className="text-xl font-bold text-slate-900">
                Risk Assessment
              </h2>

              <div className="mt-4 grid gap-4 sm:grid-cols-2">
                <div className="rounded-lg bg-slate-50 p-4">
                  <p className="text-sm text-slate-500">Overall Risk Score</p>
                  <p className="mt-1 text-2xl font-bold text-slate-900">
                    {formatValue(risk?.overallRiskScore)}
                  </p>
                </div>

                <div className="rounded-lg bg-slate-50 p-4">
                  <p className="text-sm text-slate-500">Risk Level</p>
                  <p className="mt-1 text-2xl font-bold text-slate-900">
                    {formatValue(risk?.riskLevel)}
                  </p>
                </div>
              </div>

              <div className="mt-4">
                <DataCard title="Risk Assessment Details" data={risk} />
              </div>
            </section>

            {/* Market Analysis */}
            <section className="mb-6 rounded-xl border border-slate-200 bg-white p-5">
              <h2 className="text-xl font-bold text-slate-900">
                Market Analysis
              </h2>

              <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {[
                  ["Target Price", market?.targetPrice ?? property.price],
                  ["Average Comparable Price", market?.averageComparablePrice],
                  ["Price Difference (%)", market?.priceDifferencePercentage],
                  ["Price Difference", market?.priceDifference],
                  ["Comparable Count", market?.comparableCount],
                ].map(([label, value]) => (
                  <div
                    key={String(label)}
                    className="rounded-lg bg-slate-50 p-4"
                  >
                    <p className="text-sm text-slate-500">{label}</p>
                    <p className="mt-1 text-xl font-bold text-slate-900">
                      {formatValue(value)}
                    </p>
                  </div>
                ))}
              </div>

              <div className="mt-4">
                <DataCard title="Market Analysis Details" data={market} />
              </div>
            </section>

            {/* Comparable Properties */}
            <section className="mb-6 rounded-xl border border-slate-200 bg-white p-5">
              <h2 className="text-xl font-bold text-slate-900">
                Comparable Properties (
                {report.comparableProperties?.length ?? 0})
              </h2>

              {!report.comparableProperties?.length ? (
                <p className="mt-3 text-sm text-slate-500">
                  No comparable properties returned by the backend.
                </p>
              ) : (
                <div className="mt-4 grid gap-4 md:grid-cols-2">
                  {report.comparableProperties.map((item, index) => (
                    <DataCard
                      key={String(item.propertyId ?? item.id ?? index)}
                      title={`Comparable Property ${index + 1}`}
                      data={item}
                    />
                  ))}
                </div>
              )}
            </section>

            {/* AI Analysis */}
            <div className="mb-6">
              <DataCard title="AI Analysis" data={report.aiAnalysis} />
            </div>

            {/* Additional Records */}
            <div className="mb-6">
              <h2 className="mb-4 text-2xl font-bold text-slate-900">
                Additional Property Records
              </h2>

              <p className="mb-5 text-sm text-slate-600">
                These sections show records returned by the corresponding
                backend APIs. Empty sections mean no records were returned.
              </p>

              <RecordsSection
                title="Ownership Records"
                records={records.ownership}
              />

              <RecordsSection
                title="Property Tax Records"
                records={records.tax}
              />

              <RecordsSection
                title="Building Permits"
                records={records.permits}
              />

              <RecordsSection
                title="Zoning Records"
                records={records.zoning}
              />

              <RecordsSection
                title="Environmental Records"
                records={records.environmental}
              />
            </div>
          </>
        )}
      </div>
    </main>
  );
}

export default function DueDiligencePage() {
  return (
    <Suspense
      fallback={
        <main className="min-h-screen bg-slate-50 p-6">
          Loading Due Diligence Report...
        </main>
      }
    >
      <DueDiligenceContent />
    </Suspense>
  );
}

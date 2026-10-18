
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

type Property = {
  id: number;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  propertyType: string;
  price: number;
};

type OwnershipRecord = {
  id: number;
  ownerName: string;
  ownershipType: string;
};

const API =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

const EMPTY_RECORD = {
  ownerName: "",
  ownershipType: "Individual",
};

export default function OwnershipRecordsPage() {
  const router = useRouter();

  const [propertyId, setPropertyId] = useState("");
  const [property, setProperty] = useState<Property | null>(null);
  const [record, setRecord] = useState({ ...EMPTY_RECORD });
  const [ownerships, setOwnerships] = useState<OwnershipRecord[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  function getHeaders(): HeadersInit {
    const token =
      typeof window !== "undefined"
        ? localStorage.getItem("estateintel_jwt_token")
        : null;

    return token
      ? { Authorization: `Bearer ${token}` }
      : {};
  }

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const id = params.get("id");

    if (id && /^\d+$/.test(id)) {
      setPropertyId(id);
      void loadProperty(id);
    }
  }, []);

  async function loadOwnershipRecords(id: string) {
    const response = await fetch(
      `${API}/api/properties/${encodeURIComponent(id)}/ownership`,
      { headers: getHeaders() }
    );

    if (!response.ok) {
      throw new Error(
        `Could not load ownership records (HTTP ${response.status}).`
      );
    }

    const data: unknown = await response.json();

    setOwnerships(
      Array.isArray(data) ? (data as OwnershipRecord[]) : []
    );
  }

  async function loadProperty(id: string) {
    const cleanId = id.trim();

    if (!cleanId || !/^\d+$/.test(cleanId)) {
      setError("Please enter a valid numeric Property ID.");
      setProperty(null);
      return;
    }

    setLoading(true);
    setError("");
    setMessage("");
    setProperty(null);
    setOwnerships([]);

    try {
      let found: Property | null = null;

      // Try the existing property-by-ID endpoint first.
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

      // Fallback to the existing property-list endpoint.
      if (!found) {
        const listResponse = await fetch(
          `${API}/api/properties`,
          { headers: getHeaders() }
        );

        if (!listResponse.ok) {
          throw new Error(
            `Could not load properties (HTTP ${listResponse.status}).`
          );
        }

        const listData = await listResponse.json();

        const list: Property[] = Array.isArray(listData)
          ? listData
          : Array.isArray(listData?.content)
            ? listData.content
            : [];

        found =
          list.find((item) => String(item.id) === cleanId) ?? null;
      }

      if (!found) {
        throw new Error("Property not found. Please check the ID.");
      }

      setProperty(found);
      await loadOwnershipRecords(cleanId);
      setMessage("Property and ownership records loaded.");
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to load property information."
      );
    } finally {
      setLoading(false);
    }
  }

  function updateRecord(
    field: keyof typeof EMPTY_RECORD,
    value: string
  ) {
    setRecord((previous) => ({
      ...previous,
      [field]: value,
    }));
    setMessage("");
    setError("");
  }

  async function handleSubmit(
    event: React.FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    if (!property) {
      setError("Please load a property first.");
      return;
    }

    if (!record.ownerName.trim()) {
      setError("Owner name is required.");
      return;
    }

    setLoading(true);
    setError("");
    setMessage("");

    try {
      const params = new URLSearchParams({
        ownerName: record.ownerName.trim(),
        ownershipType: record.ownershipType,
      });

      // Existing POST endpoint only.
      const response = await fetch(
        `${API}/api/properties/${property.id}/ownership?${params.toString()}`,
        {
          method: "POST",
          headers: getHeaders(),
        }
      );

      if (!response.ok) {
        const details = await response.text();

        throw new Error(
          `Ownership save failed (HTTP ${response.status})` +
          (details ? `: ${details}` : "")
        );
      }

      // Refresh the records using the existing GET endpoint.
      await loadOwnershipRecords(String(property.id));

      setRecord({ ...EMPTY_RECORD });
      setMessage("Ownership saved successfully to the backend.");
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to save ownership."
      );
    } finally {
      setLoading(false);
    }
  }

  async function refreshOwnership() {
    if (!property) return;

    setLoading(true);
    setError("");
    setMessage("");

    try {
      await loadOwnershipRecords(String(property.id));
      setMessage("Ownership records refreshed.");
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to refresh ownership records."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-slate-50 p-4 md:p-8">
      <div className="mx-auto max-w-5xl">
        <button
          type="button"
          onClick={() => router.push("/dashboard")}
          className="mb-5 rounded-lg border border-slate-300 bg-white px-4 py-2 text-slate-700 hover:bg-slate-100"
        >
          ← Back to Dashboard
        </button>

        <header className="mb-6">
          <p className="text-sm font-semibold text-blue-600">
            REAL ESTATE DUE DILIGENCE
          </p>

          <h1 className="mt-2 text-3xl font-bold text-slate-900">
            Ownership Records
          </h1>

          <p className="mt-2 text-slate-600">
            Add and view ownership records for a property.
          </p>
        </header>

        {/* Property ID search */}
        <form
          onSubmit={(event) => {
            event.preventDefault();
            void loadProperty(propertyId);
          }}
          className="mb-6 flex flex-col gap-3 rounded-xl border border-slate-200 bg-white p-5 shadow-sm sm:flex-row"
        >
          <input
            type="number"
            min="1"
            required
            value={propertyId}
            onChange={(event) => setPropertyId(event.target.value)}
            placeholder="Enter Property ID"
            className="w-full rounded-lg border border-slate-300 px-4 py-3 text-slate-900 outline-none focus:border-blue-500"
          />

          <button
            type="submit"
            disabled={loading}
            className="rounded-lg bg-blue-600 px-6 py-3 font-medium text-white hover:bg-blue-700 disabled:opacity-60"
          >
            {loading ? "Loading..." : "Load Property"}
          </button>
        </form>

        {error && (
          <div
            role="alert"
            className="mb-5 rounded-lg border border-red-200 bg-red-50 p-4 text-red-700"
          >
            {error}
          </div>
        )}

        {message && (
          <div
            role="status"
            className="mb-5 rounded-lg border border-green-200 bg-green-50 p-4 text-green-700"
          >
            {message}
          </div>
        )}

        {loading && (
          <p className="mb-5 text-slate-600">Please wait...</p>
        )}

        {property && (
          <>
            {/* Selected property */}
            <section className="mb-6 rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
              <p className="text-sm font-medium text-slate-500">
                SELECTED PROPERTY
              </p>

              <h2 className="mt-2 text-xl font-bold text-slate-900">
                {property.address}
              </h2>

              <p className="mt-1 text-slate-600">
                {property.city}, {property.state} {property.zipCode}
              </p>

              <div className="mt-4 grid gap-3 sm:grid-cols-3">
                <div className="rounded-lg bg-slate-50 p-3">
                  <p className="text-sm text-slate-500">Property ID</p>
                  <p className="mt-1 font-semibold text-slate-900">
                    {property.id}
                  </p>
                </div>

                <div className="rounded-lg bg-slate-50 p-3">
                  <p className="text-sm text-slate-500">Property Type</p>
                  <p className="mt-1 font-semibold text-slate-900">
                    {property.propertyType || "Not provided"}
                  </p>
                </div>

                <div className="rounded-lg bg-slate-50 p-3">
                  <p className="text-sm text-slate-500">Price</p>
                  <p className="mt-1 font-semibold text-slate-900">
                    {property.price == null
                      ? "Not provided"
                      : Number(property.price).toLocaleString()}
                  </p>
                </div>
              </div>
            </section>

            {/* Ownership form: fields supported by the backend */}
            <form
              onSubmit={handleSubmit}
              className="mb-6 rounded-xl border border-slate-200 bg-white p-6 shadow-sm"
            >
              <h2 className="mb-5 text-xl font-bold text-slate-900">
                Add Ownership Record
              </h2>

              <div className="grid gap-5 sm:grid-cols-2">
                <label className="block">
                  <span className="mb-2 block text-sm font-medium text-slate-700">
                    Owner Name *
                  </span>

                  <input
                    required
                    value={record.ownerName}
                    onChange={(event) =>
                      updateRecord("ownerName", event.target.value)
                    }
                    placeholder="Enter owner name"
                    className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-slate-900 outline-none focus:border-blue-500"
                  />
                </label>

                <label className="block">
                  <span className="mb-2 block text-sm font-medium text-slate-700">
                    Ownership Type *
                  </span>

                  <select
                    required
                    value={record.ownershipType}
                    onChange={(event) =>
                      updateRecord("ownershipType", event.target.value)
                    }
                    className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-slate-900 outline-none focus:border-blue-500"
                  >
                    <option value="Individual">Individual</option>
                    <option value="Joint">Joint Ownership</option>
                    <option value="Company">Company</option>
                    <option value="Trust">Trust</option>
                    <option value="Other">Other</option>
                  </select>
                </label>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="mt-6 rounded-lg bg-blue-600 px-6 py-3 font-medium text-white hover:bg-blue-700 disabled:opacity-60"
              >
                {loading ? "Saving..." : "Save Ownership"}
              </button>

              <button
                type="button"
                onClick={() =>
                  router.push(
                    `/dashboard/property-details?id=${property.id}`
                  )
                }
                className="ml-3 mt-3 rounded-lg border border-slate-300 px-5 py-3 text-slate-700 hover:bg-slate-100"
              >
                Back to Property Details
              </button>
            </form>

            {/* Ownership records returned by the backend GET endpoint */}
            <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
                <div>
                  <h2 className="text-xl font-bold text-slate-900">
                    Saved Ownership Records
                  </h2>
                  <p className="mt-1 text-sm text-slate-500">
                    Records retrieved from the backend.
                  </p>
                </div>

                <button
                  type="button"
                  disabled={loading}
                  onClick={() => void refreshOwnership()}
                  className="rounded-lg border border-slate-300 px-4 py-2 text-slate-700 hover:bg-slate-100 disabled:opacity-60"
                >
                  Refresh Records
                </button>
              </div>

              {ownerships.length === 0 ? (
                <div className="rounded-lg bg-slate-50 p-5 text-slate-600">
                  No ownership records found for this property.
                  Add an owner using the form above.
                </div>
              ) : (
                <div className="space-y-3">
                  {ownerships.map((item, index) => (
                    <div
                      key={item.id ?? index}
                      className="rounded-lg border border-slate-200 p-4"
                    >
                      <p className="font-semibold text-slate-900">
                        {item.ownerName}
                      </p>

                      <p className="mt-1 text-sm text-slate-600">
                        Ownership Type: {item.ownershipType || "Not specified"}
                      </p>

                      {item.id !== undefined && (
                        <p className="mt-1 text-xs text-slate-500">
                          Record ID: {item.id}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </section>
          </>
        )}
      </div>
    </main>
  );
}

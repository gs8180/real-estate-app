
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

const API = "http://localhost:8080";

export default function PropertyDetailsPage() {
  const router = useRouter();

  const [propertyId, setPropertyId] = useState("");
  const [property, setProperty] = useState<Property | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function getHeaders() {
    const token = localStorage.getItem("estateintel_jwt_token");

    return {
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    };
  }

  async function fetchProperty(id: string) {
    const cleanId = id.trim();

    if (!cleanId || !/^\d+$/.test(cleanId)) {
      setError("Please enter a valid numeric Property ID.");
      setProperty(null);
      return;
    }

    setLoading(true);
    setError("");
    setProperty(null);

    try {
      const headers = await getHeaders();

      // First attempt: fetch the selected property by ID.
      const response = await fetch(
        `${API}/api/properties/${encodeURIComponent(cleanId)}`,
        { headers }
      );

      if (response.ok) {
        const data = await response.json();

        if (data && String(data.id) === cleanId) {
          setProperty(data);
          setPropertyId(String(data.id));
          return;
        }
      }

      // Fallback: fetch the property list and find the selected ID.
      const listResponse = await fetch(`${API}/api/properties`, {
        headers,
      });

      if (!listResponse.ok) {
        throw new Error(
          `Property could not be loaded. Details API: ${response.status}; list API: ${listResponse.status}.`
        );
      }

      const listData = await listResponse.json();

      const list: Property[] = Array.isArray(listData)
        ? listData
        : Array.isArray(listData?.content)
          ? listData.content
          : [];

      const found = list.find(
        (item) => String(item.id) === cleanId
      );

      if (!found) {
        throw new Error(
          "This property was not found in the property list."
        );
      }

      setProperty(found);
      setPropertyId(String(found.id));
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to load property details."
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const idFromUrl = params.get("id");

    if (idFromUrl) {
      setPropertyId(idFromUrl);
      void fetchProperty(idFromUrl);
    }
  }, []);

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    void fetchProperty(propertyId);
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
          <h1 className="text-3xl font-bold text-slate-900">
            Property Details
          </h1>
          <p className="mt-2 text-slate-600">
            Enter a Property ID or select a property from Property Search.
          </p>
        </header>

        <form
          onSubmit={handleSubmit}
          className="flex flex-col gap-3 rounded-xl border border-slate-200 bg-white p-5 shadow-sm sm:flex-row"
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
            {loading ? "Loading..." : "View Details"}
          </button>
        </form>

        {loading && (
          <p className="mt-6 text-slate-600">
            Loading property details...
          </p>
        )}

        {error && (
          <div className="mt-5 rounded-lg border border-red-200 bg-red-50 p-4 text-red-700">
            <h2 className="font-semibold">
              Unable to load property
            </h2>
            <p className="mt-2 break-words">{error}</p>

            <button
              type="button"
              onClick={() =>
                router.push("/dashboard/property-search")
              }
              className="mt-4 rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
            >
              Return to Property Search
            </button>
          </div>
        )}

        {property && !loading && (
          <>
            <section className="mt-6 rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="mb-6">
                <p className="text-sm font-medium uppercase tracking-wide text-slate-500">
                  Property Address
                </p>

                <h2 className="mt-2 text-2xl font-bold text-slate-900">
                  {property.address}
                </h2>

                <p className="mt-1 text-slate-600">
                  {property.city}, {property.state} {property.zipCode}
                </p>
              </div>

              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {[
                  ["Property ID", property.id],
                  ["Property Type", property.propertyType || "Not provided"],
                  [
                    "Price",
                    property.price == null
                      ? "Not provided"
                      : Number(property.price).toLocaleString(),
                  ],
                  ["City", property.city || "Not provided"],
                  ["State", property.state || "Not provided"],
                  ["ZIP Code", property.zipCode || "Not provided"],
                ].map(([label, value]) => (
                  <div
                    key={String(label)}
                    className="rounded-lg bg-slate-50 p-4"
                  >
                    <p className="text-sm text-slate-500">{label}</p>
                    <p className="mt-2 font-semibold text-slate-900">
                      {value}
                    </p>
                  </div>
                ))}
              </div>
            </section>

            <section className="mt-6 rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
              <h2 className="text-xl font-bold text-slate-900">
                Due Diligence
              </h2>

              <p className="mt-2 text-slate-600">
                Open the due diligence checklist for this property.
              </p>

              <button
                type="button"
                onClick={() =>
                  router.push(
                    `/dashboard/due-diligence?id=${property.id}`
                  )
                }
                className="mt-4 rounded-lg bg-blue-600 px-5 py-3 font-medium text-white hover:bg-blue-700"
              >
                Open Due Diligence
              </button>
            </section>
          </>
        )}
      </div>
    </main>
  );
}

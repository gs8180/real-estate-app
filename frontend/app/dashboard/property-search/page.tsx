
"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";

type Property = {
  id: number;
  address?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  propertyType?: string;
  price?: number;
};

type PropertyForm = {
  address: string;
  city: string;
  state: string;
  zipCode: string;
  propertyType: string;
  price: string;
};

const API =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

const EMPTY_FORM: PropertyForm = {
  address: "",
  city: "",
  state: "",
  zipCode: "",
  propertyType: "",
  price: "",
};

function formatPrice(price?: number) {
  if (price == null || !Number.isFinite(Number(price))) {
    return "Price not listed";
  }

  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(Number(price));
}

export default function PropertySearchPage() {
  const router = useRouter();

  const [properties, setProperties] = useState<Property[]>([]);
  const [searchText, setSearchText] = useState("");
  const [typeFilter, setTypeFilter] = useState("ALL");
  const [sortBy, setSortBy] = useState("newest");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form, setForm] = useState<PropertyForm>(EMPTY_FORM);

  const apiRequest = useCallback(
    async (endpoint: string, options: RequestInit = {}) => {
      const token = localStorage.getItem("estateintel_jwt_token");

      const response = await fetch(`${API}${endpoint}`, {
        ...options,
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
          ...options.headers,
        },
        cache: "no-store",
      });

      if (!response.ok) {
        const body = await response.text();
        throw new Error(
          `API error ${response.status}${body ? `: ${body}` : ""}`
        );
      }

      if (response.status === 204) return null;

      const text = await response.text();
      return text ? JSON.parse(text) : null;
    },
    []
  );

  const loadProperties = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const data = await apiRequest("/api/properties");
      setProperties(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Could not load properties from backend."
      );
    } finally {
      setLoading(false);
    }
  }, [apiRequest]);

  useEffect(() => {
    void loadProperties();
  }, [loadProperties]);

  const propertyTypes = useMemo(
    () =>
      Array.from(
        new Set(
          properties
            .map((p) => p.propertyType?.trim())
            .filter((v): v is string => Boolean(v))
        )
      ).sort(),
    [properties]
  );

  const visibleProperties = useMemo(() => {
    const query = searchText.trim().toLowerCase();

    return properties
      .filter((p) => {
        const values = [
          p.address,
          p.city,
          p.state,
          p.zipCode,
          p.propertyType,
          String(p.id),
        ];

        const matchesSearch =
          !query ||
          values.some((v) => v?.toLowerCase().includes(query));

        const matchesType =
          typeFilter === "ALL" || p.propertyType === typeFilter;

        return matchesSearch && matchesType;
      })
      .sort((a, b) => {
        if (sortBy === "price-low") {
          return Number(a.price ?? Infinity) -
            Number(b.price ?? Infinity);
        }

        if (sortBy === "price-high") {
          return Number(b.price ?? -Infinity) -
            Number(a.price ?? -Infinity);
        }

        return b.id - a.id;
      });
  }, [properties, searchText, typeFilter, sortBy]);

  function openAddForm() {
    setEditingId(null);
    setForm({ ...EMPTY_FORM });
    setShowForm(true);
    setError("");
    setNotice("");
  }

  function openEditForm(property: Property) {
    setEditingId(property.id);
    setForm({
      address: property.address ?? "",
      city: property.city ?? "",
      state: property.state ?? "",
      zipCode: property.zipCode ?? "",
      propertyType: property.propertyType ?? "",
      price: property.price == null ? "" : String(property.price),
    });
    setShowForm(true);
    setError("");
    setNotice("");
  }

  async function handleSave(
    event: React.FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();
    setSaving(true);
    setError("");
    setNotice("");

    const payload = {
      address: form.address.trim(),
      city: form.city.trim(),
      state: form.state.trim(),
      zipCode: form.zipCode.trim(),
      propertyType: form.propertyType.trim(),
      price: Number(form.price),
    };

    if (
      !payload.address ||
      !payload.city ||
      !payload.state ||
      !payload.zipCode ||
      !payload.propertyType ||
      !form.price.trim() ||
      !Number.isFinite(payload.price) ||
      payload.price < 0
    ) {
      setError("Please fill all fields with valid values.");
      setSaving(false);
      return;
    }

    try {
      if (editingId !== null) {
        await apiRequest(`/api/properties/${editingId}`, {
          method: "PUT",
          body: JSON.stringify(payload),
        });
        setNotice("Property updated successfully.");
      } else {
        await apiRequest("/api/properties", {
          method: "POST",
          body: JSON.stringify(payload),
        });
        setNotice("Property added successfully.");
      }

      setShowForm(false);
      setEditingId(null);
      setForm({ ...EMPTY_FORM });
      setSearchText("");
      setTypeFilter("ALL");
      await loadProperties();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Unable to save property."
      );
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(property: Property) {
    const confirmed = window.confirm(
      `Delete property "${property.address ?? property.id}"?`
    );

    if (!confirmed) return;

    setError("");
    setNotice("");

    try {
      await apiRequest(`/api/properties/${property.id}`, {
        method: "DELETE",
      });

      setNotice("Property deleted successfully.");
      await loadProperties();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Unable to delete property."
      );
    }
  }

  async function handleSearch(
    event: React.FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    const query = searchText.trim();

    if (!query) {
      await loadProperties();
      return;
    }

    setLoading(true);
    setError("");
    setNotice("");

    try {
      const results = await apiRequest(
        `/api/properties/search?${new URLSearchParams({
          address: query,
        }).toString()}`
      );

      const matches = Array.isArray(results) ? results : [];
      setProperties(matches);

      if (matches.length === 0) {
        setNotice("No matching properties found.");
      }
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Property search failed."
      );
    } finally {
      setLoading(false);
    }
  }

  function resetSearch() {
    setSearchText("");
    setTypeFilter("ALL");
    setSortBy("newest");
    setNotice("");
    void loadProperties();
  }

  function openDetails(property: Property) {
    sessionStorage.setItem("selectedPropertyId", String(property.id));
    router.push(`/dashboard/property-details?id=${property.id}`);
  }

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900">
      <div className="mx-auto max-w-[1500px] px-4 py-6 sm:px-6 lg:px-8">

        {/* Top navigation */}
        <div className="mb-8 flex items-center justify-between">
          <button
            type="button"
            onClick={() => router.push("/dashboard")}
            className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold hover:bg-slate-100"
          >
            ← Dashboard
          </button>

          <div className="flex items-center gap-3">
            <div className="hidden text-right sm:block">
              <p className="text-sm font-bold">Property Workspace</p>
              <p className="text-xs text-slate-500">
                Due diligence management
              </p>
            </div>
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 font-bold text-blue-700">
              RE
            </div>
          </div>
        </div>

        {/* Page heading */}
        <header className="mb-8 flex flex-col justify-between gap-5 md:flex-row md:items-end">
          <div>
            <span className="inline-block rounded-full bg-blue-50 px-3 py-1 text-xs font-bold uppercase tracking-wide text-blue-700">
              Real Estate Intelligence
            </span>

            <h1 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">
              Property Search
            </h1>

            <p className="mt-2 text-slate-600">
              Discover, review, and manage your properties.
            </p>
          </div>

          <button
            type="button"
            onClick={openAddForm}
            className="rounded-xl bg-blue-600 px-5 py-3 font-semibold text-white shadow-lg shadow-blue-600/20 hover:bg-blue-700"
          >
            + Add Property
          </button>
        </header>

        {/* Search and filters */}
        <section className="mb-6 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <form
            onSubmit={handleSearch}
            className="grid gap-3 lg:grid-cols-[minmax(0,1fr)_220px_auto_auto]"
          >
            <input
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              placeholder="Search by address, city, or ZIP code"
              className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none focus:border-blue-500 focus:bg-white"
            />

            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="rounded-xl border border-slate-200 bg-white px-3 py-3 text-sm"
            >
              <option value="ALL">All property types</option>
              {propertyTypes.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>

            <button
              type="submit"
              className="rounded-xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white hover:bg-slate-700"
            >
              Search
            </button>

            <button
              type="button"
              onClick={resetSearch}
              className="rounded-xl border border-slate-200 px-5 py-3 text-sm font-semibold hover:bg-slate-50"
            >
              Reset
            </button>
          </form>
        </section>

        {/* API messages */}
        {error && (
          <div
            role="alert"
            className="mb-5 whitespace-pre-wrap break-words rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-800"
          >
            <strong>Something went wrong</strong>
            <p>{error}</p>
          </div>
        )}

        {notice && (
          <div
            role="status"
            className="mb-5 rounded-xl border border-blue-200 bg-blue-50 p-4 text-sm text-blue-800"
          >
            {notice}
          </div>
        )}

        {/* Add / Edit form */}
        {showForm && (
          <form
            onSubmit={handleSave}
            className="mb-8 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
          >
            <div className="mb-5 flex items-center justify-between">
              <h2 className="text-xl font-bold">
                {editingId !== null ? "Edit Property" : "Add Property"}
              </h2>

              <button
                type="button"
                onClick={() => {
                  setShowForm(false);
                  setEditingId(null);
                }}
                className="rounded-lg px-3 py-2 text-sm text-slate-500 hover:bg-slate-100"
              >
                Close ✕
              </button>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {(
                [
                  ["address", "Address"],
                  ["city", "City"],
                  ["state", "State"],
                  ["zipCode", "ZIP Code"],
                  ["propertyType", "Property Type"],
                  ["price", "Price (INR)"],
                ] as const
              ).map(([key, label]) => (
                <label key={key}>
                  <span className="mb-1.5 block text-sm font-semibold">
                    {label}
                  </span>

                  <input
                    required
                    type={key === "price" ? "number" : "text"}
                    min={key === "price" ? "0" : undefined}
                    step={key === "price" ? "0.01" : undefined}
                    value={form[key]}
                    onChange={(e) =>
                      setForm((previous) => ({
                        ...previous,
                        [key]: e.target.value,
                      }))
                    }
                    className="w-full rounded-xl border border-slate-200 px-3.5 py-3 text-sm outline-none focus:border-blue-500"
                  />
                </label>
              ))}
            </div>

            <div className="mt-5 flex gap-3">
              <button
                type="submit"
                disabled={saving}
                className="rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-60"
              >
                {saving
                  ? "Saving..."
                  : editingId !== null
                    ? "Save Changes"
                    : "Create Property"}
              </button>

              <button
                type="button"
                onClick={() => {
                  setShowForm(false);
                  setEditingId(null);
                }}
                className="rounded-xl border border-slate-200 px-5 py-3 text-sm font-semibold hover:bg-slate-50"
              >
                Cancel
              </button>
            </div>
          </form>
        )}

        {/* Listing heading and sorting */}
        <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
          <div>
            <h2 className="text-xl font-bold">Property Listings</h2>
            <p className="mt-1 text-sm text-slate-500">
              {loading
                ? "Loading properties..."
                : `${visibleProperties.length} properties shown`}
            </p>
          </div>

          <label className="flex items-center gap-2 text-sm text-slate-500">
            Sort by
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-slate-700"
            >
              <option value="newest">Recently added</option>
              <option value="price-low">Price: low to high</option>
              <option value="price-high">Price: high to low</option>
            </select>
          </label>
        </div>

        {/* Loading state */}
        {loading ? (
          <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
            {[1, 2, 3].map((item) => (
              <div
                key={item}
                className="animate-pulse overflow-hidden rounded-2xl border bg-white"
              >
                <div className="h-36 bg-slate-200" />
                <div className="space-y-3 p-5">
                  <div className="h-5 w-2/3 rounded bg-slate-200" />
                  <div className="h-4 w-1/2 rounded bg-slate-100" />
                  <div className="h-10 rounded bg-slate-100" />
                </div>
              </div>
            ))}
          </div>
        ) : visibleProperties.length === 0 ? (
          /* Empty state */
          <div className="rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-16 text-center">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-50 text-3xl text-blue-600">
              ⌂
            </div>
            <h3 className="text-lg font-bold">No properties found</h3>
            <p className="mx-auto mt-2 max-w-md text-sm text-slate-500">
              Try another search or add a property to get started.
            </p>
            <button
              type="button"
              onClick={resetSearch}
              className="mt-5 rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold hover:bg-slate-50"
            >
              Clear filters
            </button>
          </div>
        ) : (
          /* Property cards */
          <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
            {visibleProperties.map((property, index) => (
              <article
                key={property.id}
                className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-1 hover:border-blue-200 hover:shadow-lg"
              >
                <div
                  className={`relative flex h-36 items-end overflow-hidden p-5 ${[
                      "bg-gradient-to-br from-sky-100 via-blue-100 to-indigo-200",
                      "bg-gradient-to-br from-emerald-100 via-teal-100 to-cyan-200",
                      "bg-gradient-to-br from-amber-100 via-orange-100 to-rose-200",
                    ][index % 3]
                    }`}
                >
                  <div className="absolute -right-4 -top-7 h-36 w-36 rounded-full border-[18px] border-white/30" />

                  <span className="relative rounded-full border border-white/70 bg-white/80 px-3 py-1.5 text-xs font-bold text-slate-700">
                    Property #{property.id}
                  </span>

                  <span className="absolute right-4 top-4 rounded-full bg-white/90 px-3 py-1.5 text-xs font-semibold text-slate-700">
                    {property.propertyType || "Property"}
                  </span>
                </div>

                <div className="p-5">
                  <p className="text-xl font-extrabold tracking-tight text-slate-950">
                    {formatPrice(property.price)}
                  </p>

                  <h3
                    className="mt-2 truncate text-base font-bold text-slate-800"
                    title={property.address || "Property address"}
                  >
                    {property.address || "Address not provided"}
                  </h3>

                  <p className="mt-1 min-h-5 text-sm text-slate-500">
                    {[property.city, property.state, property.zipCode]
                      .filter(Boolean)
                      .join(", ") || "Location not provided"}
                  </p>

                  <div className="my-4 flex flex-wrap gap-2 border-y border-slate-100 py-3 text-xs font-medium text-slate-500">
                    <span className="rounded-lg bg-slate-50 px-2.5 py-1.5">
                      ID: {property.id}
                    </span>
                    <span className="rounded-lg bg-slate-50 px-2.5 py-1.5">
                      {property.propertyType || "Type not set"}
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={() => openDetails(property)}
                    className="w-full rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-700"
                  >
                    View Details →
                  </button>

                  <div className="mt-3 flex gap-2">
                    <button
                      type="button"
                      onClick={() => openEditForm(property)}
                      className="flex-1 rounded-xl border border-slate-200 px-3 py-2 text-sm font-semibold hover:border-amber-300 hover:bg-amber-50"
                    >
                      Edit
                    </button>

                    <button
                      type="button"
                      onClick={() => void handleDelete(property)}
                      className="flex-1 rounded-xl border border-slate-200 px-3 py-2 text-sm font-semibold hover:border-red-300 hover:bg-red-50 hover:text-red-700"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}

        <footer className="mt-8 flex flex-wrap items-center justify-between gap-2 border-t border-slate-200 py-5 text-xs text-slate-500">
          <span>
            Property data is loaded from your Spring Boot backend.
          </span>
          <button
            type="button"
            onClick={() => void loadProperties()}
            className="font-semibold text-blue-700 hover:text-blue-800"
          >
            ↻ Refresh listings
          </button>
        </footer>
      </div>
    </main>
  );
}

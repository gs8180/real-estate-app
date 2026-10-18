
"use client";

import { useMemo, useState } from "react";
import {
    Search,
    MapPin,
    BedDouble,
    Bath,
    Maximize2,
    SlidersHorizontal,
    ArrowUpDown,
    Check,
    X,
    Building2,
    IndianRupee,
} from "lucide-react";

type Property = {
    id: number;
    name: string;
    location: string;
    type: string;
    price: number;
    area: number;
    bedrooms: number;
    bathrooms: number;
    age: number;
    status: string;
};

const properties: Property[] = [
    {
        id: 1,
        name: "Green Valley Residency",
        location: "Guntur, Andhra Pradesh",
        type: "Apartment",
        price: 6500000,
        area: 1500,
        bedrooms: 3,
        bathrooms: 2,
        age: 3,
        status: "Verified sample",
    },
    {
        id: 2,
        name: "Sunrise Heights",
        location: "Vijayawada, Andhra Pradesh",
        type: "Apartment",
        price: 5800000,
        area: 1350,
        bedrooms: 3,
        bathrooms: 2,
        age: 5,
        status: "Verified sample",
    },
    {
        id: 3,
        name: "Royal Enclave",
        location: "Guntur, Andhra Pradesh",
        type: "Villa",
        price: 9500000,
        area: 2400,
        bedrooms: 4,
        bathrooms: 3,
        age: 2,
        status: "Verified sample",
    },
    {
        id: 4,
        name: "Lake View Apartments",
        location: "Amaravati, Andhra Pradesh",
        type: "Apartment",
        price: 4200000,
        area: 1100,
        bedrooms: 2,
        bathrooms: 2,
        age: 7,
        status: "Verified sample",
    },
];

const formatPrice = (price: number) =>
    "₹" + price.toLocaleString("en-IN");

const formatCompactPrice = (price: number) =>
    price >= 10000000
        ? `₹${(price / 10000000).toFixed(2)} Cr`
        : `₹${(price / 100000).toFixed(1)} L`;

export default function ComparablePropertiesPage() {
    const [search, setSearch] = useState("");
    const [type, setType] = useState("All");
    const [sort, setSort] = useState("price-low");
    const [selected, setSelected] = useState<number[]>([]);
    const [showComparison, setShowComparison] = useState(false);

    const filteredProperties = useMemo(() => {
        return properties
            .filter((property) => {
                const query = search.toLowerCase();

                const matchesSearch =
                    property.name.toLowerCase().includes(query) ||
                    property.location.toLowerCase().includes(query);

                const matchesType =
                    type === "All" || property.type === type;

                return matchesSearch && matchesType;
            })
            .sort((a, b) => {
                if (sort === "price-low") return a.price - b.price;
                if (sort === "price-high") return b.price - a.price;
                if (sort === "area") return b.area - a.area;
                return a.name.localeCompare(b.name);
            });
    }, [search, type, sort]);

    const selectedProperties = properties.filter((property) =>
        selected.includes(property.id)
    );

    function toggleProperty(id: number) {
        setSelected((previous) =>
            previous.includes(id)
                ? previous.filter((item) => item !== id)
                : previous.length < 3
                    ? [...previous, id]
                    : previous
        );
    }

    return (
        <div className="min-h-screen space-y-7 bg-slate-50 p-5 sm:p-8">

            {/* Header */}
            <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                <div>
                    <p className="mb-2 text-sm font-medium text-blue-600">
                        EstateIntel / Property Analysis
                    </p>
                    <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
                        Comparable Properties
                    </h1>
                    <p className="mt-2 text-sm text-slate-500">
                        Compare property prices, areas and key characteristics.
                    </p>
                </div>

                <button
                    onClick={() => {
                        setSearch("");
                        setType("All");
                        setSort("price-low");
                        setSelected([]);
                        setShowComparison(false);
                    }}
                    className="rounded-xl border border-slate-200 bg-white px-4 py-2.5
            text-sm font-semibold text-slate-700 hover:bg-slate-100"
                >
                    Reset filters
                </button>
            </div>

            {/* Summary */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                <div className="rounded-2xl border border-slate-200 bg-white p-5">
                    <div className="flex items-center justify-between">
                        <p className="text-sm text-slate-500">Properties Found</p>
                        <Building2 className="text-blue-600" size={21} />
                    </div>
                    <p className="mt-3 text-2xl font-bold text-slate-900">
                        {filteredProperties.length}
                    </p>
                    <p className="mt-1 text-xs text-slate-400">
                        Matching your filters
                    </p>
                </div>

                <div className="rounded-2xl border border-slate-200 bg-white p-5">
                    <div className="flex items-center justify-between">
                        <p className="text-sm text-slate-500">Average Price</p>
                        <IndianRupee className="text-emerald-600" size={21} />
                    </div>
                    <p className="mt-3 text-2xl font-bold text-slate-900">
                        {filteredProperties.length
                            ? formatCompactPrice(
                                filteredProperties.reduce(
                                    (sum, property) => sum + property.price,
                                    0
                                ) / filteredProperties.length
                            )
                            : "—"}
                    </p>
                    <p className="mt-1 text-xs text-slate-400">
                        Based on displayed sample data
                    </p>
                </div>

                <div className="rounded-2xl border border-slate-200 bg-white p-5">
                    <div className="flex items-center justify-between">
                        <p className="text-sm text-slate-500">Selected to Compare</p>
                        <SlidersHorizontal className="text-violet-600" size={21} />
                    </div>
                    <p className="mt-3 text-2xl font-bold text-slate-900">
                        {selected.length} / 3
                    </p>
                    <p className="mt-1 text-xs text-slate-400">
                        Select up to three properties
                    </p>
                </div>
            </div>

            {/* Search and Filters */}
            <div className="rounded-2xl border border-slate-200 bg-white p-4 sm:p-5">
                <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                    <div className="relative md:col-span-1">
                        <Search
                            size={19}
                            className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                        />
                        <input
                            value={search}
                            onChange={(event) => setSearch(event.target.value)}
                            placeholder="Search property or location..."
                            className="w-full rounded-xl border border-slate-200 bg-slate-50
                py-3 pl-10 pr-4 text-sm outline-none transition
                focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                        />
                    </div>

                    <select
                        value={type}
                        onChange={(event) => setType(event.target.value)}
                        className="rounded-xl border border-slate-200 bg-white px-3 py-3
              text-sm text-slate-700 outline-none focus:border-blue-500"
                    >
                        <option value="All">All property types</option>
                        <option value="Apartment">Apartment</option>
                        <option value="Villa">Villa</option>
                    </select>

                    <select
                        value={sort}
                        onChange={(event) => setSort(event.target.value)}
                        className="rounded-xl border border-slate-200 bg-white px-3 py-3
              text-sm text-slate-700 outline-none focus:border-blue-500"
                    >
                        <option value="price-low">Price: Low to High</option>
                        <option value="price-high">Price: High to Low</option>
                        <option value="area">Largest Area</option>
                        <option value="name">Property Name</option>
                    </select>
                </div>
            </div>

            {/* Property Cards */}
            <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
                <div>
                    <h2 className="text-lg font-bold text-slate-900">
                        Property Listings
                    </h2>
                    <p className="mt-1 text-sm text-slate-500">
                        Select properties for a side-by-side comparison.
                    </p>
                </div>

                <button
                    disabled={selected.length < 2}
                    onClick={() => setShowComparison(true)}
                    className="rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold
            text-white shadow-sm transition hover:bg-blue-700
            disabled:cursor-not-allowed disabled:bg-slate-300"
                >
                    Compare Selected ({selected.length})
                </button>
            </div>

            {filteredProperties.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-slate-300
          bg-white p-10 text-center">
                    <Search className="mx-auto text-slate-400" size={30} />
                    <h3 className="mt-3 font-semibold text-slate-800">
                        No properties found
                    </h3>
                    <p className="mt-1 text-sm text-slate-500">
                        Try a different search term or property type.
                    </p>
                </div>
            ) : (
                <div className="grid grid-cols-1 gap-5 xl:grid-cols-2">
                    {filteredProperties.map((property) => {
                        const isSelected = selected.includes(property.id);
                        const pricePerSqft = Math.round(
                            property.price / property.area
                        );

                        return (
                            <div
                                key={property.id}
                                className={`overflow-hidden rounded-2xl border bg-white
                  transition ${isSelected
                                        ? "border-blue-500 ring-2 ring-blue-100"
                                        : "border-slate-200 hover:border-slate-300"
                                    }`}
                            >
                                <div className="flex items-center justify-between
                  border-b border-slate-100 bg-slate-50 px-5 py-4">
                                    <span className="rounded-lg bg-blue-50 px-3 py-1.5
                    text-xs font-semibold text-blue-700">
                                        {property.type}
                                    </span>

                                    <label className="flex cursor-pointer items-center gap-2
                    text-sm font-medium text-slate-600">
                                        <input
                                            type="checkbox"
                                            checked={isSelected}
                                            disabled={!isSelected && selected.length >= 3}
                                            onChange={() => toggleProperty(property.id)}
                                            className="h-4 w-4 accent-blue-600"
                                        />
                                        Compare
                                    </label>
                                </div>

                                <div className="p-5">
                                    <div className="flex items-start justify-between gap-3">
                                        <div>
                                            <h3 className="text-lg font-bold text-slate-900">
                                                {property.name}
                                            </h3>
                                            <p className="mt-2 flex items-center gap-1.5
                        text-sm text-slate-500">
                                                <MapPin size={15} />
                                                {property.location}
                                            </p>
                                        </div>

                                        <div className="text-right">
                                            <p className="text-xl font-bold text-blue-700">
                                                {formatCompactPrice(property.price)}
                                            </p>
                                            <p className="mt-1 text-xs text-slate-400">
                                                {formatPrice(property.price)}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="my-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
                                        <div className="rounded-xl bg-slate-50 p-3">
                                            <Maximize2 size={17} className="text-slate-500" />
                                            <p className="mt-2 text-sm font-bold text-slate-800">
                                                {property.area.toLocaleString("en-IN")} sq.ft.
                                            </p>
                                            <p className="mt-1 text-xs text-slate-500">Area</p>
                                        </div>

                                        <div className="rounded-xl bg-slate-50 p-3">
                                            <BedDouble size={17} className="text-slate-500" />
                                            <p className="mt-2 text-sm font-bold text-slate-800">
                                                {property.bedrooms}
                                            </p>
                                            <p className="mt-1 text-xs text-slate-500">Bedrooms</p>
                                        </div>

                                        <div className="rounded-xl bg-slate-50 p-3">
                                            <Bath size={17} className="text-slate-500" />
                                            <p className="mt-2 text-sm font-bold text-slate-800">
                                                {property.bathrooms}
                                            </p>
                                            <p className="mt-1 text-xs text-slate-500">Bathrooms</p>
                                        </div>

                                        <div className="rounded-xl bg-slate-50 p-3">
                                            <Building2 size={17} className="text-slate-500" />
                                            <p className="mt-2 text-sm font-bold text-slate-800">
                                                {property.age} years
                                            </p>
                                            <p className="mt-1 text-xs text-slate-500">Property age</p>
                                        </div>
                                    </div>

                                    <div className="flex items-center justify-between
                    border-t border-slate-100 pt-4">
                                        <div>
                                            <p className="text-xs text-slate-500">
                                                Price per sq. ft.
                                            </p>
                                            <p className="mt-1 font-bold text-slate-900">
                                                {formatPrice(pricePerSqft)}
                                            </p>
                                        </div>

                                        <span className="flex items-center gap-1.5
                      rounded-full bg-amber-50 px-3 py-1.5
                      text-xs font-medium text-amber-700">
                                            <Check size={14} />
                                            Sample data
                                        </span>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}

            {/* Comparison Table */}
            {showComparison && (
                <div className="overflow-hidden rounded-2xl border
          border-slate-200 bg-white">
                    <div className="flex items-center justify-between
            border-b border-slate-200 p-5">
                        <div>
                            <h2 className="text-lg font-bold text-slate-900">
                                Side-by-Side Comparison
                            </h2>
                            <p className="mt-1 text-sm text-slate-500">
                                Compare the selected property details.
                            </p>
                        </div>

                        <button
                            onClick={() => setShowComparison(false)}
                            aria-label="Close comparison"
                            className="rounded-lg p-2 text-slate-500 hover:bg-slate-100"
                        >
                            <X size={20} />
                        </button>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full min-w-[600px] text-left text-sm">
                            <thead className="bg-slate-50">
                                <tr>
                                    <th className="p-4 font-semibold text-slate-600">
                                        Feature
                                    </th>
                                    {selectedProperties.map((property) => (
                                        <th key={property.id} className="p-4 font-semibold
                      text-slate-900">
                                            {property.name}
                                        </th>
                                    ))}
                                </tr>
                            </thead>

                            <tbody>
                                {[
                                    {
                                        label: "Location",
                                        value: (p: Property) => p.location,
                                    },
                                    {
                                        label: "Property Type",
                                        value: (p: Property) => p.type,
                                    },
                                    {
                                        label: "Price",
                                        value: (p: Property) => formatPrice(p.price),
                                    },
                                    {
                                        label: "Area",
                                        value: (p: Property) =>
                                            `${p.area.toLocaleString("en-IN")} sq.ft.`,
                                    },
                                    {
                                        label: "Price per sq. ft.",
                                        value: (p: Property) =>
                                            formatPrice(Math.round(p.price / p.area)),
                                    },
                                    {
                                        label: "Bedrooms",
                                        value: (p: Property) => String(p.bedrooms),
                                    },
                                    {
                                        label: "Bathrooms",
                                        value: (p: Property) => String(p.bathrooms),
                                    },
                                    {
                                        label: "Property Age",
                                        value: (p: Property) => `${p.age} years`,
                                    },
                                ].map((row) => (
                                    <tr key={row.label} className="border-t border-slate-100">
                                        <td className="p-4 font-medium text-slate-600">
                                            {row.label}
                                        </td>
                                        {selectedProperties.map((property) => (
                                            <td key={property.id} className="p-4 text-slate-800">
                                                {row.value(property)}
                                            </td>
                                        ))}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    <div className="border-t border-slate-100 p-4 text-xs text-slate-500">
                        Comparison uses sample values only. Verify property details
                        before making real estate decisions.
                    </div>
                </div>
            )}

        </div>
    );
}

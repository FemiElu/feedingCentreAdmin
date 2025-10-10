"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Input } from "@/components/Input";
import { Select } from "@/components/Select";
import { Button } from "@/components/Button";
import { MembersFilters as MembersFiltersType } from "@/lib/queries/membersQueries";
import { useCenters } from "@/lib/queries/membersQueries";
import { clsx } from "clsx";

export interface MembersFiltersProps {
  onFiltersChange: (filters: MembersFiltersType) => void;
  className?: string;
}

export function MembersFilters({
  onFiltersChange,
  className,
}: MembersFiltersProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { data: centers = [] } = useCenters();

  const [filters, setFilters] = useState<MembersFiltersType>({
    search: searchParams.get("search") || "",
    center_id: searchParams.get("center_id") || "",
    service_unit: searchParams.get("service_unit") || "",
    gender: searchParams.get("gender") || "",
    marital_status: searchParams.get("marital_status") || "",
    sort_by: (searchParams.get("sort_by") as any) || "created_at",
    sort_order: (searchParams.get("sort_order") as any) || "desc",
  });

  const [searchInput, setSearchInput] = useState(filters.search || "");

  // Debounced search effect
  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchInput !== filters.search) {
        setFilters((prev) => ({ ...prev, search: searchInput }));
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [searchInput, filters.search]);

  // Update URL when filters change
  useEffect(() => {
    const params = new URLSearchParams();

    Object.entries(filters).forEach(([key, value]) => {
      if (value && value !== "") {
        params.set(key, value);
      }
    });

    const newUrl = params.toString() ? `?${params.toString()}` : "";
    router.replace(`/members${newUrl}`, { scroll: false });

    onFiltersChange(filters);
  }, [filters, router, onFiltersChange]);

  const handleFilterChange = (key: keyof MembersFiltersType, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const clearFilters = () => {
    setFilters({
      search: "",
      center_id: "",
      service_unit: "",
      gender: "",
      marital_status: "",
      sort_by: "created_at",
      sort_order: "desc",
    });
    setSearchInput("");
  };

  const hasActiveFilters = Object.values(filters).some(
    (value) =>
      value && value !== "" && value !== "created_at" && value !== "desc"
  );

  const serviceUnits = [
    "Ushering",
    "Choir",
    "Media",
    "Children",
    "Security",
    "Hospitality",
  ];

  const genderOptions = [
    { value: "Male", label: "Male" },
    { value: "Female", label: "Female" },
  ];

  const maritalStatusOptions = [
    { value: "Single", label: "Single" },
    { value: "Married", label: "Married" },
    { value: "Divorced", label: "Divorced" },
    { value: "Widowed", label: "Widowed" },
  ];

  const sortOptions = [
    { value: "name", label: "Name" },
    { value: "dob", label: "Date of Birth" },
    { value: "created_at", label: "Date Joined" },
  ];

  const sortOrderOptions = [
    { value: "asc", label: "Ascending" },
    { value: "desc", label: "Descending" },
  ];

  return (
    <div className={clsx("bg-white rounded-lg shadow p-6", className)}>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-medium text-gray-900">Filters</h3>
        {hasActiveFilters && (
          <Button variant="outline" size="sm" onClick={clearFilters}>
            Clear Filters
          </Button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {/* Search */}
        <div className="lg:col-span-2">
          <div className="relative">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Search
            </label>
            <div className="relative">
              <input
                type="text"
                placeholder="Search by name, phone, or email..."
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                className="input pl-10"
              />
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg
                  className="w-4 h-4 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Center */}
        <Select
          label="Center"
          value={filters.center_id || ""}
          onChange={(e) => handleFilterChange("center_id", e.target.value)}
          options={[
            { value: "", label: "All Centers" },
            ...centers.map((center) => ({
              value: center.id,
              label: center.name,
            })),
          ]}
        />

        {/* Service Unit */}
        <Select
          label="Service Unit"
          value={filters.service_unit || ""}
          onChange={(e) => handleFilterChange("service_unit", e.target.value)}
          options={[
            { value: "", label: "All Service Units" },
            ...serviceUnits.map((unit) => ({
              value: unit,
              label: unit,
            })),
          ]}
        />

        {/* Gender */}
        <Select
          label="Gender"
          value={filters.gender || ""}
          onChange={(e) => handleFilterChange("gender", e.target.value)}
          options={[{ value: "", label: "All Genders" }, ...genderOptions]}
        />

        {/* Marital Status */}
        <Select
          label="Marital Status"
          value={filters.marital_status || ""}
          onChange={(e) => handleFilterChange("marital_status", e.target.value)}
          options={[
            { value: "", label: "All Status" },
            ...maritalStatusOptions,
          ]}
        />

        {/* Sort By */}
        <Select
          label="Sort By"
          value={filters.sort_by || "created_at"}
          onChange={(e) => handleFilterChange("sort_by", e.target.value as any)}
          options={sortOptions}
        />

        {/* Sort Order */}
        <Select
          label="Sort Order"
          value={filters.sort_order || "desc"}
          onChange={(e) =>
            handleFilterChange("sort_order", e.target.value as any)
          }
          options={sortOrderOptions}
        />
      </div>

      {/* Active Filters Summary */}
      {hasActiveFilters && (
        <div className="mt-4 pt-4 border-t border-gray-200">
          <div className="flex flex-wrap gap-2">
            <span className="text-sm text-gray-500">Active filters:</span>
            {filters.search && (
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                Search: {filters.search}
                <button
                  onClick={() => {
                    setSearchInput("");
                    handleFilterChange("search", "");
                  }}
                  className="ml-1 text-blue-600 hover:text-blue-800"
                >
                  ×
                </button>
              </span>
            )}
            {filters.center_id && (
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                Center: {centers.find((c) => c.id === filters.center_id)?.name}
                <button
                  onClick={() => handleFilterChange("center_id", "")}
                  className="ml-1 text-green-600 hover:text-green-800"
                >
                  ×
                </button>
              </span>
            )}
            {filters.service_unit && (
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                Service: {filters.service_unit}
                <button
                  onClick={() => handleFilterChange("service_unit", "")}
                  className="ml-1 text-purple-600 hover:text-purple-800"
                >
                  ×
                </button>
              </span>
            )}
            {filters.gender && (
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-pink-100 text-pink-800">
                Gender: {filters.gender}
                <button
                  onClick={() => handleFilterChange("gender", "")}
                  className="ml-1 text-pink-600 hover:text-pink-800"
                >
                  ×
                </button>
              </span>
            )}
            {filters.marital_status && (
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                Status: {filters.marital_status}
                <button
                  onClick={() => handleFilterChange("marital_status", "")}
                  className="ml-1 text-yellow-600 hover:text-yellow-800"
                >
                  ×
                </button>
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

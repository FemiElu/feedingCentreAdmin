"use client";

import React, { useState, useCallback } from "react";
import { AuthGuard } from "@/components/AuthGuard";
import { Layout } from "@/components/Layout";
import { MembersFilters } from "@/components/MembersFilters";
import { MembersTable } from "@/components/MembersTable";
import { Button } from "@/components/Button";
import {
  useMembers,
  MembersFilters as MembersFiltersType,
} from "@/lib/queries/membersQueries";
import { useToast } from "@/components/Toast";

export default function MembersPage() {
  const [page, setPage] = useState(1);
  const [filters, setFilters] = useState<MembersFiltersType>({});
  const { toast } = useToast();

  const pageSize = 10;

  const { data, isLoading, error } = useMembers(page, pageSize, filters);

  const handleFiltersChange = useCallback((newFilters: MembersFiltersType) => {
    setFilters(newFilters);
    setPage(1); // Reset to first page when filters change
  }, []);

  const handlePageChange = useCallback((newPage: number) => {
    setPage(newPage);
  }, []);

  const handleBulkAction = useCallback(
    (action: string, selectedIds: string[]) => {
      switch (action) {
        case "export":
          toast({
            title: "Export Started",
            message: `Exporting ${selectedIds.length} members to CSV...`,
            type: "success",
          });
          // TODO: Implement CSV export
          break;
        case "message":
          toast({
            title: "Message Sent",
            message: `Sending message to ${selectedIds.length} members...`,
            type: "success",
          });
          // TODO: Implement bulk messaging
          break;
        default:
          toast({
            title: "Action Not Implemented",
            message: "This action is not yet implemented.",
            type: "warning",
          });
      }
    },
    [toast]
  );

  if (error) {
    return (
      <AuthGuard>
        <Layout>
          <div className="min-h-screen flex items-center justify-center">
            <div className="text-center">
              <div className="text-red-600 text-lg font-medium mb-2">
                Error loading members
              </div>
              <div className="text-gray-600 mb-4">
                {error instanceof Error
                  ? error.message
                  : "An unexpected error occurred"}
              </div>
              <Button onClick={() => window.location.reload()}>
                Try Again
              </Button>
            </div>
          </div>
        </Layout>
      </AuthGuard>
    );
  }

  return (
    <AuthGuard>
      <Layout>
        <div className="space-y-4 sm:space-y-6">
          {/* Page Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-xl sm:text-2xl font-bold text-gray-900">
                Members
              </h1>
              <p className="text-sm sm:text-base text-gray-600 mt-1">
                Manage and view all church members
              </p>
            </div>
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-3">
              <Button variant="outline" className="w-full sm:w-auto">
                <svg
                  className="w-4 h-4 mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
                <span className="hidden sm:inline">Export All</span>
                <span className="sm:hidden">Export</span>
              </Button>
              <Button variant="primary" className="w-full sm:w-auto">
                <svg
                  className="w-4 h-4 mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"
                  />
                </svg>
                Add Member
              </Button>
            </div>
          </div>

          {/* Filters */}
          <MembersFilters onFiltersChange={handleFiltersChange} />

          {/* Members Table */}
          <MembersTable
            data={
              data || {
                members: [],
                total: 0,
                page: 1,
                pageSize: 10,
                totalPages: 0,
              }
            }
            loading={isLoading}
            onPageChange={handlePageChange}
            onBulkAction={handleBulkAction}
          />

          {/* Stats Summary */}
          {data && (
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
                <div>
                  <div className="text-xl sm:text-2xl font-bold text-gray-900">
                    {data.total.toLocaleString()}
                  </div>
                  <div className="text-xs sm:text-sm text-gray-600">
                    Total Members
                  </div>
                </div>
                <div>
                  <div className="text-xl sm:text-2xl font-bold text-gray-900">
                    {data.members.length}
                  </div>
                  <div className="text-xs sm:text-sm text-gray-600">
                    Showing
                  </div>
                </div>
                <div>
                  <div className="text-xl sm:text-2xl font-bold text-gray-900">
                    {data.totalPages}
                  </div>
                  <div className="text-xs sm:text-sm text-gray-600">Pages</div>
                </div>
              </div>
            </div>
          )}
        </div>
      </Layout>
    </AuthGuard>
  );
}

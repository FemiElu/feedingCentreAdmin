"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Table } from "@/components/Table";
import { Button } from "@/components/Button";
import { Checkbox } from "@/components/Checkbox";
import { Member, MembersResponse } from "@/lib/queries/membersQueries";
import { clsx } from "clsx";

export interface MembersTableProps {
  data: MembersResponse;
  loading?: boolean;
  onPageChange: (page: number) => void;
  onBulkAction: (action: string, selectedIds: string[]) => void;
  className?: string;
}

export function MembersTable({
  data,
  loading = false,
  onPageChange,
  onBulkAction,
  className,
}: MembersTableProps) {
  const router = useRouter();
  const [selectedMembers, setSelectedMembers] = useState<string[]>([]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  const handleRowClick = (member: Member) => {
    router.push(`/members/${member.id}`);
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedMembers(data.members.map((member) => member.id));
    } else {
      setSelectedMembers([]);
    }
  };

  const handleSelectMember = (memberId: string, checked: boolean) => {
    if (checked) {
      setSelectedMembers((prev) => [...prev, memberId]);
    } else {
      setSelectedMembers((prev) => prev.filter((id) => id !== memberId));
    }
  };

  const handleBulkAction = (action: string) => {
    onBulkAction(action, selectedMembers);
    setSelectedMembers([]);
  };

  const columns = [
    {
      key: "select",
      label: (
        <Checkbox
          checked={
            selectedMembers.length === data.members.length &&
            data.members.length > 0
          }
          onChange={handleSelectAll}
          aria-label="Select all members"
        />
      ),
      render: (_: any, member: Member) => (
        <Checkbox
          checked={selectedMembers.includes(member.id)}
          onChange={(checked) => handleSelectMember(member.id, checked)}
          aria-label={`Select ${member.full_name}`}
        />
      ),
    },
    {
      key: "name",
      label: "Name",
      render: (value: string, member: Member) => (
        <div className="flex items-center space-x-3">
          <div className="flex-shrink-0">
            <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
              <span className="text-sm font-medium text-primary-600">
                {member.full_name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")
                  .slice(0, 2)}
              </span>
            </div>
          </div>
          <div>
            <div className="font-medium text-gray-900">{member.full_name}</div>
            <div className="text-sm text-gray-500">{member.email}</div>
          </div>
        </div>
      ),
    },
    {
      key: "phone",
      label: "Phone",
      render: (value: string) => (
        <span className="text-sm text-gray-900">{value}</span>
      ),
    },
    {
      key: "center_name",
      label: "Center",
      render: (value: string) => (
        <span className="text-sm text-gray-900">{value}</span>
      ),
    },
    {
      key: "service_unit",
      label: "Service Unit",
      render: (value: string) => (
        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
          {value}
        </span>
      ),
    },
    {
      key: "dob",
      label: "Date of Birth",
      render: (value: string) => (
        <span className="text-sm text-gray-900">{formatDate(value)}</span>
      ),
    },
    {
      key: "actions",
      label: "Actions",
      render: (_: any, member: Member) => (
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              router.push(`/members/${member.id}`);
            }}
          >
            View
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              router.push(`/members/${member.id}/edit`);
            }}
          >
            Edit
          </Button>
        </div>
      ),
    },
  ];

  const PaginationButton = ({
    page,
    isActive,
    isDisabled,
    children,
  }: {
    page: number;
    isActive: boolean;
    isDisabled: boolean;
    children: React.ReactNode;
  }) => (
    <button
      onClick={() => !isDisabled && onPageChange(page)}
      disabled={isDisabled}
      className={clsx(
        "px-3 py-2 text-sm font-medium rounded-md",
        isActive
          ? "bg-primary-600 text-white"
          : "text-gray-700 bg-white border border-gray-300 hover:bg-gray-50",
        isDisabled && "opacity-50 cursor-not-allowed"
      )}
    >
      {children}
    </button>
  );

  if (loading) {
    return (
      <div className={clsx("bg-white rounded-lg shadow", className)}>
        <div className="p-6">
          <div className="animate-pulse">
            <div className="h-4 bg-gray-200 rounded w-1/4 mb-4"></div>
            <div className="space-y-3">
              {[...Array(10)].map((_, i) => (
                <div key={i} className="h-12 bg-gray-200 rounded"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={clsx("bg-white rounded-lg shadow", className)}>
      {/* Bulk Actions */}
      {selectedMembers.length > 0 && (
        <div className="px-6 py-3 bg-gray-50 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-700">
              {selectedMembers.length} member
              {selectedMembers.length !== 1 ? "s" : ""} selected
            </span>
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleBulkAction("export")}
              >
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
                Export CSV
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleBulkAction("message")}
              >
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
                    d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                  />
                </svg>
                Send Message
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Table */}
      <div className="overflow-x-auto">
        <Table
          columns={columns}
          data={data.members}
          loading={loading}
          emptyMessage="No members found"
          onRowClick={handleRowClick}
          className="min-w-full"
        />
      </div>

      {/* Pagination */}
      {data.totalPages > 1 && (
        <div className="px-6 py-4 border-t border-gray-200">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-700">
              Showing{" "}
              <span className="font-medium">
                {(data.page - 1) * data.pageSize + 1}
              </span>{" "}
              to{" "}
              <span className="font-medium">
                {Math.min(data.page * data.pageSize, data.total)}
              </span>{" "}
              of <span className="font-medium">{data.total}</span> results
            </div>

            <div className="flex items-center space-x-2">
              <PaginationButton
                page={data.page - 1}
                isActive={false}
                isDisabled={data.page === 1}
              >
                Previous
              </PaginationButton>

              {/* Page Numbers */}
              {Array.from({ length: Math.min(5, data.totalPages) }, (_, i) => {
                let pageNum;
                if (data.totalPages <= 5) {
                  pageNum = i + 1;
                } else if (data.page <= 3) {
                  pageNum = i + 1;
                } else if (data.page >= data.totalPages - 2) {
                  pageNum = data.totalPages - 4 + i;
                } else {
                  pageNum = data.page - 2 + i;
                }

                return (
                  <PaginationButton
                    key={pageNum}
                    page={pageNum}
                    isActive={pageNum === data.page}
                    isDisabled={false}
                  >
                    {pageNum}
                  </PaginationButton>
                );
              })}

              <PaginationButton
                page={data.page + 1}
                isActive={false}
                isDisabled={data.page === data.totalPages}
              >
                Next
              </PaginationButton>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

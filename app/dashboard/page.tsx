"use client";

import React from "react";
import { AuthGuard } from "@/components/AuthGuard";
import { Layout } from "@/components/Layout";
import { DashboardCard } from "@/components/DashboardCard";
import { ActivityFeed } from "@/components/ActivityFeed";
import { SmallBarChart } from "@/components/SmallBarChart";
import { Button } from "@/components/Button";
import { Table } from "@/components/Table";
import {
  useDashboardStats,
  useActivityFeed,
  useNewestMembers,
  useBirthdayChart,
} from "@/lib/queries/dashboardQueries";

// Icons for dashboard cards
const MembersIcon = () => (
  <svg
    className="w-6 h-6"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"
    />
  </svg>
);

const NewMembersIcon = () => (
  <svg
    className="w-6 h-6"
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
);

const BirthdayIcon = () => (
  <svg
    className="w-6 h-6"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M21 15.546c-.523 0-1.046.151-1.5.454a2.704 2.704 0 01-3 0 2.704 2.704 0 00-3 0 2.704 2.704 0 01-3 0 2.704 2.704 0 00-3 0 2.704 2.704 0 01-3 0A2.704 2.704 0 003 15.546V12a9 9 0 0118 0v3.546z"
    />
  </svg>
);

const CentersIcon = () => (
  <svg
    className="w-6 h-6"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
    />
  </svg>
);

export default function DashboardPage() {
  const { data: stats, isLoading: statsLoading } = useDashboardStats();
  const { data: activities, isLoading: activitiesLoading } = useActivityFeed();
  const { data: newestMembers, isLoading: membersLoading } = useNewestMembers();
  const { data: birthdayData, isLoading: birthdayLoading } = useBirthdayChart();

  const membersTableColumns = [
    {
      key: "name",
      label: "Name",
      render: (value: string, row: any) => (
        <div>
          <div className="font-medium text-gray-900">{value}</div>
          <div className="text-sm text-gray-500">{row.email}</div>
        </div>
      ),
    },
    {
      key: "phone",
      label: "Phone",
    },
    {
      key: "center_name",
      label: "Center",
    },
    {
      key: "created_at",
      label: "Joined",
      render: (value: string) => new Date(value).toLocaleDateString(),
    },
    {
      key: "actions",
      label: "Actions",
      render: () => (
        <Button variant="outline" size="sm">
          View
        </Button>
      ),
    },
  ];

  return (
    <AuthGuard>
      <Layout>
        <div className="space-y-4 sm:space-y-6">
          {/* Page Header */}
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900">
              Dashboard
            </h1>
            <p className="text-sm sm:text-base text-gray-600 mt-1">
              Welcome to the Feeding Centre Church Admin Dashboard
            </p>
          </div>

          {/* Top Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            <DashboardCard
              title="Total Members"
              value={stats?.totalMembers || 0}
              subtitle="All registered members"
              icon={<MembersIcon />}
              trend={{ value: 12, isPositive: true }}
              loading={statsLoading}
            />
            <DashboardCard
              title="New This Month"
              value={stats?.newThisMonth || 0}
              subtitle="Members joined this month"
              icon={<NewMembersIcon />}
              trend={{ value: 8, isPositive: true }}
              loading={statsLoading}
            />
            <DashboardCard
              title="Upcoming Birthdays"
              value={stats?.upcomingBirthdays || 0}
              subtitle="Next 7 days"
              icon={<BirthdayIcon />}
              loading={statsLoading}
            />
            <DashboardCard
              title="Centers"
              value={stats?.centersCount || 0}
              subtitle="Active feeding centers"
              icon={<CentersIcon />}
              loading={statsLoading}
            />
          </div>

          {/* Quick Actions */}
          <div className="bg-white rounded-lg shadow p-4 sm:p-6">
            <h3 className="text-base sm:text-lg font-medium text-gray-900 mb-3 sm:mb-4">
              Quick Actions
            </h3>
            <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
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
                    d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                  />
                </svg>
                Import CSV
              </Button>
              <Button variant="secondary" className="w-full sm:w-auto">
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
                Send Broadcast
              </Button>
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
                    d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"
                  />
                </svg>
                Add Member
              </Button>
            </div>
          </div>

          {/* Charts and Tables Row */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
            {/* Birthday Chart */}
            <SmallBarChart
              data={birthdayData || []}
              loading={birthdayLoading}
            />

            {/* Recent Activity */}
            <ActivityFeed
              activities={activities || []}
              loading={activitiesLoading}
            />
          </div>

          {/* Newest Members Table */}
          <div className="bg-white rounded-lg shadow">
            <div className="px-4 sm:px-6 py-3 sm:py-4 border-b border-gray-200">
              <h3 className="text-base sm:text-lg font-medium text-gray-900">
                Newest Members
              </h3>
            </div>
            <div className="p-4 sm:p-6">
              <Table
                columns={membersTableColumns}
                data={newestMembers || []}
                loading={membersLoading}
                emptyMessage="No members found"
              />
            </div>
          </div>
        </div>
      </Layout>
    </AuthGuard>
  );
}

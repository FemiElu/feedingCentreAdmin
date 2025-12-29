"use client";

import React, { useState } from "react";
import { AuthGuard } from "@/components/AuthGuard";
import { Layout } from "@/components/Layout";
import { DashboardCard } from "@/components/DashboardCard";
import { ActivityFeed } from "@/components/ActivityFeed";
import { MemberGrowthChart, GenderDistributionChart } from "@/components/DashboardCharts";
import { Button } from "@/components/Button";
import { Table } from "@/components/Table";
import { Select } from "@/components/Select";
import {
  useDashboardStats,
  useActivityFeed,
  useNewestMembers,
  useGrowthChart,
  useGenderStats,
} from "@/lib/queries/dashboardQueries";
import { useCenters } from "@/lib/queries/membersQueries";
import {
  Users,
  UserPlus,
  Cake,
  MapPin,
  TrendingUp,
  Filter,
  Download,
  Share2
} from "lucide-react";

export default function DashboardPage() {
  const [selectedCenter, setSelectedCenter] = useState<string>("");

  const { data: stats, isLoading: statsLoading } = useDashboardStats();
  const { data: activities, isLoading: activitiesLoading } = useActivityFeed();
  const { data: newestMembers, isLoading: membersLoading } = useNewestMembers();
  const { data: growthData, isLoading: growthLoading } = useGrowthChart(selectedCenter);
  const { data: genderData, isLoading: genderLoading } = useGenderStats(selectedCenter);
  const { data: centers = [] } = useCenters();

  const membersTableColumns = [
    {
      key: "name",
      label: "Member",
      render: (value: string, row: any) => (
        <div className="flex items-center">
          <div className="h-8 w-8 rounded-full bg-primary-100 text-primary-700 flex items-center justify-center font-bold text-xs mr-3">
            {value.charAt(0)}
          </div>
          <div>
            <div className="font-medium text-gray-900">{value}</div>
            <div className="text-xs text-gray-500">{row.email}</div>
          </div>
        </div>
      ),
    },
    {
      key: "phone",
      label: "Contact",
      render: (val: string) => <span className="text-sm text-gray-600">{val}</span>
    },
    {
      key: "center_name",
      label: "Center",
      render: (val: string) => (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
          {val}
        </span>
      )
    },
    {
      key: "created_at",
      label: "Joined Date",
      render: (value: string) => (
        <span className="text-sm text-gray-500">
          {new Date(value).toLocaleDateString("en-GB", { day: 'numeric', month: 'short', year: 'numeric' })}
        </span>
      ),
    },
    {
      key: "actions",
      label: "",
      render: () => (
        <button className="text-primary-600 hover:text-primary-900 font-medium text-sm transition-colors">
          View Profile
        </button>
      ),
    },
  ];

  return (
    <AuthGuard>
      <Layout>
        <div className="max-w-7xl mx-auto space-y-8">
          {/* Enhanced Page Header */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 tracking-tight">
                Insights Dashboard
              </h1>
              <p className="text-gray-500 mt-1 flex items-center">
                <TrendingUp className="w-4 h-4 mr-2 text-green-500" />
                Real-time metrics and member analytics
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <div className="min-w-[200px]">
                <Select
                  value={selectedCenter}
                  onChange={(e) => setSelectedCenter(e.target.value)}
                  options={[
                    { value: "", label: "All Centers" },
                    ...centers.map(c => ({ value: c.id, label: c.name }))
                  ]}
                  placeholder="Filter by Center"
                />
              </div>
              <Button variant="outline" size="sm" className="hidden sm:flex">
                <Download className="w-4 h-4 mr-2" /> Export
              </Button>
              <Button variant="primary" size="sm">
                <Share2 className="w-4 h-4 mr-2" /> Share
              </Button>
            </div>
          </div>

          {/* Top Cards with improved styling */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <DashboardCard
              title="Total Congregation"
              value={stats?.totalMembers || 0}
              subtitle="Active members across all regions"
              icon={<Users className="w-5 h-5" />}
              trend={{ value: 12.4, isPositive: true }}
              loading={statsLoading}
              className="border-none shadow-lg shadow-gray-200/50"
            />
            <DashboardCard
              title="New Converts"
              value={stats?.newThisMonth || 0}
              subtitle="Registered this current month"
              icon={<UserPlus className="w-5 h-5" />}
              trend={{ value: 8.2, isPositive: true }}
              loading={statsLoading}
              className="border-none shadow-lg shadow-gray-200/50"
            />
            <DashboardCard
              title="Celebrants"
              value={stats?.upcomingBirthdays || 0}
              subtitle="Birthdays in the next 7 days"
              icon={<Cake className="w-5 h-5" />}
              loading={statsLoading}
              className="border-none shadow-lg shadow-gray-200/50"
            />
            <DashboardCard
              title="Active Centers"
              value={stats?.centersCount || 0}
              subtitle="Established feeding centers"
              icon={<MapPin className="w-5 h-5" />}
              loading={statsLoading}
              className="border-none shadow-lg shadow-gray-200/50"
            />
          </div>

          {/* New Charts Section */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <MemberGrowthChart data={growthData || []} loading={growthLoading} />
            </div>
            <div className="lg:col-span-1">
              <GenderDistributionChart data={genderData || { male: 0, female: 0, other: 0 }} loading={genderLoading} />
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Newest Members Table - Now wider */}
            <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="px-6 py-5 border-b border-gray-100 flex items-center justify-between">
                <h3 className="text-lg font-bold text-gray-900">
                  Recently Onboarded
                </h3>
                <Button variant="outline" size="sm">View All</Button>
              </div>
              <div className="p-0">
                <Table
                  columns={membersTableColumns}
                  data={newestMembers || []}
                  loading={membersLoading}
                  emptyMessage="No recent members found"
                />
              </div>
            </div>

            {/* Recent Activity - Now in its own column */}
            <div className="lg:col-span-1">
              <ActivityFeed
                activities={activities || []}
                loading={activitiesLoading}
              />
            </div>
          </div>
        </div>
      </Layout>
    </AuthGuard>
  );
}

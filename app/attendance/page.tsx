"use client";

import React, { useState } from "react";
import { AuthGuard } from "@/components/AuthGuard";
import { Layout } from "@/components/Layout";
import { Button } from "@/components/Button";
import { Modal } from "@/components/Modal";
import { useAttendance, AttendanceRecord } from "@/lib/queries/attendanceQueries";
import { useCenters } from "@/lib/queries/membersQueries";
import { AddAttendanceForm } from "@/components/AddAttendanceForm";
import { AttendanceTrendChart, AttendanceBreakdownChart } from "@/components/AttendanceCharts";
import { Table } from "@/components/Table";
import { Select } from "@/components/Select";
import { Card } from "@/components/Card";

export default function AttendancePage() {
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [selectedCenter, setSelectedCenter] = useState("");
    const [dateRange, setDateRange] = useState({ start: "", end: "" });

    const { data: records = [], isLoading } = useAttendance({
        center_id: selectedCenter || undefined,
        start_date: dateRange.start || undefined,
        end_date: dateRange.end || undefined,
    });

    const { data: centers = [] } = useCenters();

    const totalAttendance = React.useMemo(() => {
        return records.reduce((acc, curr) =>
            acc + curr.adult_male + curr.adult_female + curr.child_male + curr.child_female
            , 0);
    }, [records]);

    const columns = [
        {
            key: "date",
            label: "Date",
            render: (val: string) => new Date(val).toLocaleDateString(),
        },
        { key: "service_type", label: "Service" },
        { key: "center_name", label: "Center" },
        {
            key: "total",
            label: "Total Attendance",
            render: (_: any, r: AttendanceRecord) => (
                <span className="font-semibold text-gray-900">
                    {r.adult_male + r.adult_female + r.child_male + r.child_female}
                </span>
            )
        },
        {
            key: "breakdown",
            label: "Breakdown (M/F | Adult/Child)",
            render: (_: any, r: AttendanceRecord) => (
                <div className="text-xs text-gray-500">
                    <div>Adults: {r.adult_male}M / {r.adult_female}F</div>
                    <div>Children: {r.child_male}M / {r.child_female}F</div>
                </div>
            )
        },
    ];

    return (
        <AuthGuard>
            <Layout>
                <div className="space-y-6">
                    {/* Header */}
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900">Service Attendance</h1>
                            <p className="text-base text-gray-600 mt-1">
                                Track and analyze attendance across all service centers
                            </p>
                        </div>
                        <Button
                            variant="primary"
                            onClick={() => setIsAddModalOpen(true)}
                            className="w-full sm:w-auto"
                        >
                            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                            </svg>
                            Record Attendance
                        </Button>
                    </div>

                    {/* Filters */}
                    <Card className="p-4">
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Center</label>
                                <select
                                    className="w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm p-2 border"
                                    value={selectedCenter}
                                    onChange={(e) => setSelectedCenter(e.target.value)}
                                >
                                    <option value="">All Centers</option>
                                    {centers.map(c => (
                                        <option key={c.id} value={c.id}>{c.name}</option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
                                <input
                                    type="date"
                                    className="w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm p-2 border"
                                    value={dateRange.start}
                                    onChange={(e) => setDateRange(prev => ({ ...prev, start: e.target.value }))}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">End Date</label>
                                <input
                                    type="date"
                                    className="w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm p-2 border"
                                    value={dateRange.end}
                                    onChange={(e) => setDateRange(prev => ({ ...prev, end: e.target.value }))}
                                />
                            </div>
                            <div className="flex items-end">
                                <Button
                                    variant="outline"
                                    className="w-full"
                                    onClick={() => {
                                        setSelectedCenter("");
                                        setDateRange({ start: "", end: "" });
                                    }}
                                >
                                    Clear Filters
                                </Button>
                            </div>
                        </div>
                    </Card>

                    {/* Stats */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <Card className="p-4 bg-white border border-gray-200">
                            <div className="flex items-center">
                                <div className="p-3 rounded-full bg-primary-100 text-primary-600">
                                    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                                    </svg>
                                </div>
                                <div className="ml-4">
                                    <h2 className="text-sm font-medium text-gray-500">Total Attendance</h2>
                                    <p className="text-2xl font-semibold text-gray-900">{totalAttendance.toLocaleString()}</p>
                                </div>
                            </div>
                        </Card>
                        <Card className="p-4 bg-white border border-gray-200">
                            <div className="flex items-center">
                                <div className="p-3 rounded-full bg-green-100 text-green-600">
                                    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 002 2h2a2 2 0 002-2z" />
                                    </svg>
                                </div>
                                <div className="ml-4">
                                    <h2 className="text-sm font-medium text-gray-500">Service Count</h2>
                                    <p className="text-2xl font-semibold text-gray-900">{records.length}</p>
                                </div>
                            </div>
                        </Card>
                        <Card className="p-4 bg-white border border-gray-200">
                            <div className="flex items-center">
                                <div className="p-3 rounded-full bg-blue-100 text-blue-600">
                                    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                                    </svg>
                                </div>
                                <div className="ml-4">
                                    <h2 className="text-sm font-medium text-gray-500">Avg. Attendance</h2>
                                    <p className="text-2xl font-semibold text-gray-900">
                                        {records.length ? Math.round(totalAttendance / records.length) : 0}
                                    </p>
                                </div>
                            </div>
                        </Card>
                    </div>

                    {/* Charts */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <AttendanceTrendChart data={records} />
                        <AttendanceBreakdownChart data={records} />
                    </div>

                    {/* Table */}
                    <Card className="overflow-hidden">
                        <div className="p-4 border-b border-gray-200">
                            <h3 className="text-lg font-bold text-gray-900">Recent Records</h3>
                        </div>
                        <div className="overflow-x-auto">
                            <Table
                                columns={columns}
                                data={records}
                                loading={isLoading}
                                emptyMessage="No attendance records found."
                            />
                        </div>
                    </Card>

                    {/* Modal */}
                    <Modal
                        isOpen={isAddModalOpen}
                        onClose={() => setIsAddModalOpen(false)}
                        title="Record Service Attendance"
                        size="lg"
                    >
                        <AddAttendanceForm
                            onSuccess={() => setIsAddModalOpen(false)}
                            onCancel={() => setIsAddModalOpen(false)}
                        />
                    </Modal>

                </div>
            </Layout>
        </AuthGuard>
    );
}

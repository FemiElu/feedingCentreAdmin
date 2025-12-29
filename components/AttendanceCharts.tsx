"use client";

import React from "react";
import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    BarChart,
    Bar,
    Legend,
} from "recharts";
import { Card } from "./Card";
import { AttendanceRecord } from "@/lib/queries/attendanceQueries";

interface AttendanceChartsProps {
    data: AttendanceRecord[];
}

export function AttendanceTrendChart({ data }: AttendanceChartsProps) {
    // Process data for the chart: Aggregate by date and service type
    const chartData = React.useMemo(() => {
        const grouped = data.reduce((acc, curr) => {
            const date = curr.date;
            if (!acc[date]) {
                acc[date] = {
                    date,
                    "Sunday Service": 0,
                    "FTN Bible Study": 0,
                    "Prayer Meeting": 0,
                    total: 0
                };
            }
            const count = curr.adult_male + curr.adult_female + curr.child_male + curr.child_female;
            // @ts-ignore
            if (acc[date][curr.service_type] !== undefined) {
                // @ts-ignore
                acc[date][curr.service_type] += count;
            }
            acc[date].total += count;
            return acc;
        }, {} as Record<string, any>);

        return Object.values(grouped).sort((a: any, b: any) => new Date(a.date).getTime() - new Date(b.date).getTime());
    }, [data]);

    return (
        <Card className="p-6">
            <div className="mb-6">
                <h3 className="text-lg font-bold text-gray-900">Attendance Trend</h3>
                <p className="text-sm text-gray-500">Service attendance trends over time</p>
            </div>
            <div className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={chartData}>
                        <defs>
                            <linearGradient id="colorSunday" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.1} />
                                <stop offset="95%" stopColor="#4f46e5" stopOpacity={0} />
                            </linearGradient>
                            <linearGradient id="colorFTN" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#10b981" stopOpacity={0.1} />
                                <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                            </linearGradient>
                            <linearGradient id="colorPrayer" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.1} />
                                <stop offset="95%" stopColor="#f59e0b" stopOpacity={0} />
                            </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                        <XAxis
                            dataKey="date"
                            axisLine={false}
                            tickLine={false}
                            tick={{ fill: "#6b7280", fontSize: 12 }}
                            dy={10}
                        />
                        <YAxis
                            axisLine={false}
                            tickLine={false}
                            tick={{ fill: "#6b7280", fontSize: 12 }}
                        />
                        <Tooltip
                            contentStyle={{
                                backgroundColor: "#fff",
                                borderRadius: "12px",
                                border: "none",
                                boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)",
                            }}
                        />
                        <Legend verticalAlign="top" height={36} />
                        <Area
                            type="monotone"
                            dataKey="Sunday Service"
                            stroke="#4f46e5"
                            fillOpacity={1}
                            fill="url(#colorSunday)"
                            stackId="1"
                        />
                        <Area
                            type="monotone"
                            dataKey="FTN Bible Study"
                            stroke="#10b981"
                            fillOpacity={1}
                            fill="url(#colorFTN)"
                            stackId="1"
                        />
                        <Area
                            type="monotone"
                            dataKey="Prayer Meeting"
                            stroke="#f59e0b"
                            fillOpacity={1}
                            fill="url(#colorPrayer)"
                            stackId="1"
                        />
                    </AreaChart>
                </ResponsiveContainer>
            </div>
        </Card>
    );
}

export function AttendanceBreakdownChart({ data }: AttendanceChartsProps) {
    // Aggregate by demographics
    const breakdown = React.useMemo(() => {
        let adultMale = 0;
        let adultFemale = 0;
        let childMale = 0;
        let childFemale = 0;

        data.forEach(d => {
            adultMale += d.adult_male;
            adultFemale += d.adult_female;
            childMale += d.child_male;
            childFemale += d.child_female;
        });

        return [
            { name: "Adult Male", count: adultMale, fill: "#1e3a8a" },
            { name: "Adult Female", count: adultFemale, fill: "#ec4899" },
            { name: "Child Male", count: childMale, fill: "#60a5fa" },
            { name: "Child Female", count: childFemale, fill: "#f472b6" },
        ];
    }, [data]);

    return (
        <Card className="p-6">
            <div className="mb-6">
                <h3 className="text-lg font-bold text-gray-900">Demographic Breakdown</h3>
                <p className="text-sm text-gray-500">Distribution by Age and Gender</p>
            </div>
            <div className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={breakdown}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                        <XAxis
                            dataKey="name"
                            axisLine={false}
                            tickLine={false}
                            tick={{ fill: "#6b7280", fontSize: 12 }}
                            dy={10}
                        />
                        <YAxis
                            axisLine={false}
                            tickLine={false}
                            tick={{ fill: "#6b7280", fontSize: 12 }}
                        />
                        <Tooltip
                            cursor={{ fill: 'transparent' }}
                            contentStyle={{
                                backgroundColor: "#fff",
                                borderRadius: "12px",
                                border: "none",
                                boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)",
                            }}
                        />
                        <Bar dataKey="count" radius={[4, 4, 0, 0]} />
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </Card>
    );
}

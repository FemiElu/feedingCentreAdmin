"use client";

import React from "react";
import {
    LineChart,
    Line,
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    PieChart,
    Pie,
    Cell,
    BarChart,
    Bar,
    Legend,
} from "recharts";
import { Card } from "./Card";

interface GrowthChartProps {
    data: any[];
    loading?: boolean;
}

export function MemberGrowthChart({ data, loading }: GrowthChartProps) {
    if (loading) {
        return (
            <Card className="h-[400px] flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
            </Card>
        );
    }

    return (
        <Card className="p-6">
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h3 className="text-lg font-bold text-gray-900">Member Growth Trend</h3>
                    <p className="text-sm text-gray-500">Cumulative member count over time</p>
                </div>
            </div>
            <div className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={data}>
                        <defs>
                            <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.1} />
                                <stop offset="95%" stopColor="#4f46e5" stopOpacity={0} />
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
                        <Area
                            type="monotone"
                            dataKey="count"
                            stroke="#4f46e5"
                            strokeWidth={3}
                            fillOpacity={1}
                            fill="url(#colorCount)"
                        />
                    </AreaChart>
                </ResponsiveContainer>
            </div>
        </Card>
    );
}

interface GenderChartProps {
    data: { male: number; female: number };
    loading?: boolean;
}

export function GenderDistributionChart({ data, loading }: GenderChartProps) {
    if (loading) {
        return (
            <Card className="h-[400px] flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
            </Card>
        );
    }

    const chartData = [
        { name: "Male", value: data.male, color: "#4f46e5" },
        { name: "Female", value: data.female, color: "#ec4899" },
    ].filter(d => d.value > 0);

    return (
        <Card className="p-6">
            <div className="mb-6">
                <h3 className="text-lg font-bold text-gray-900">Gender Analysis</h3>
                <p className="text-sm text-gray-500">Distribution across the congregation</p>
            </div>
            <div className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                        <Pie
                            data={chartData}
                            innerRadius={60}
                            outerRadius={80}
                            paddingAngle={5}
                            dataKey="value"
                        >
                            {chartData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                        </Pie>
                        <Tooltip
                            contentStyle={{
                                backgroundColor: "#fff",
                                borderRadius: "12px",
                                border: "none",
                                boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)",
                            }}
                        />
                        <Legend verticalAlign="bottom" height={36} />
                    </PieChart>
                </ResponsiveContainer>
            </div>
        </Card>
    );
}

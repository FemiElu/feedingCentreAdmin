import React from "react";
import { clsx } from "clsx";

export interface DashboardCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon?: React.ReactNode;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  loading?: boolean;
  className?: string;
}

export function DashboardCard({
  title,
  value,
  subtitle,
  icon,
  trend,
  loading = false,
  className,
}: DashboardCardProps) {
  if (loading) {
    return (
      <div className={clsx("bg-white p-6 rounded-lg shadow", className)}>
        <div className="animate-pulse">
          <div className="flex items-center justify-between mb-4">
            <div className="h-4 bg-gray-200 rounded w-24"></div>
            <div className="h-8 w-8 bg-gray-200 rounded"></div>
          </div>
          <div className="h-8 bg-gray-200 rounded w-16 mb-2"></div>
          <div className="h-3 bg-gray-200 rounded w-20"></div>
        </div>
      </div>
    );
  }

  return (
    <div className={clsx("bg-white p-6 rounded-lg shadow", className)}>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide">
          {title}
        </h3>
        {icon && <div className="text-gray-400">{icon}</div>}
      </div>

      <div className="flex items-baseline">
        <p className="text-2xl font-semibold text-gray-900">
          {typeof value === "number" ? value.toLocaleString() : value}
        </p>
        {trend && (
          <div
            className={clsx(
              "ml-2 flex items-baseline text-sm font-semibold",
              trend.isPositive ? "text-green-600" : "text-red-600"
            )}
          >
            <svg
              className={clsx(
                "self-center flex-shrink-0 h-4 w-4",
                trend.isPositive ? "rotate-0" : "rotate-180"
              )}
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M5.293 9.707a1 1 0 010-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 01-1.414 1.414L11 7.414V15a1 1 0 11-2 0V7.414L6.707 9.707a1 1 0 01-1.414 0z"
                clipRule="evenodd"
              />
            </svg>
            <span className="ml-1">{Math.abs(trend.value)}%</span>
          </div>
        )}
      </div>

      {subtitle && <p className="mt-1 text-sm text-gray-500">{subtitle}</p>}
    </div>
  );
}

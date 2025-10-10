import React from "react";
import { clsx } from "clsx";
import { BirthdayData } from "@/lib/queries/dashboardQueries";

export interface SmallBarChartProps {
  data: BirthdayData[];
  loading?: boolean;
  className?: string;
}

export function SmallBarChart({
  data,
  loading = false,
  className,
}: SmallBarChartProps) {
  const maxValue = Math.max(...data.map((d) => d.count));

  if (loading) {
    return (
      <div className={clsx("bg-white rounded-lg shadow", className)}>
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">
            Birthdays by Month
          </h3>
        </div>
        <div className="p-6">
          <div className="animate-pulse">
            <div className="h-32 bg-gray-200 rounded"></div>
            <div className="mt-4 flex justify-between">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="h-3 bg-gray-200 rounded w-8"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={clsx("bg-white rounded-lg shadow", className)}>
      <div className="px-6 py-4 border-b border-gray-200">
        <h3 className="text-lg font-medium text-gray-900">
          Birthdays by Month
        </h3>
      </div>

      <div className="p-6">
        <div className="h-32 flex items-end justify-between space-x-1">
          {data.map((item, index) => {
            const height = maxValue > 0 ? (item.count / maxValue) * 100 : 0;

            return (
              <div
                key={item.month}
                className="flex flex-col items-center flex-1"
              >
                <div className="relative w-full">
                  <div
                    className={clsx(
                      "w-full bg-primary-500 rounded-t transition-all duration-300 hover:bg-primary-600",
                      "flex items-end justify-center text-xs text-white font-medium"
                    )}
                    style={{ height: `${height}%` }}
                    title={`${item.month}: ${item.count} birthdays`}
                  >
                    {item.count > 0 && (
                      <span className="absolute -top-5 text-xs text-gray-600 font-medium">
                        {item.count}
                      </span>
                    )}
                  </div>
                </div>
                <div className="mt-2 text-xs text-gray-500 font-medium">
                  {item.month}
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-4 flex justify-between text-xs text-gray-500">
          <span>0</span>
          <span>{Math.ceil(maxValue / 2)}</span>
          <span>{maxValue}</span>
        </div>
      </div>
    </div>
  );
}

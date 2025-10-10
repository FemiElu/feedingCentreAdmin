import React from "react";
import { clsx } from "clsx";

export interface TableColumn<T = any> {
  key: string;
  label: string;
  render?: (value: any, row: T) => React.ReactNode;
  sortable?: boolean;
  className?: string;
}

export interface TableProps<T = any> {
  columns: TableColumn<T>[];
  data: T[];
  loading?: boolean;
  emptyMessage?: string;
  className?: string;
  onRowClick?: (row: T) => void;
}

export function Table<T extends Record<string, any>>({
  columns,
  data,
  loading = false,
  emptyMessage = "No data available",
  className,
  onRowClick,
}: TableProps<T>) {
  if (loading) {
    return (
      <div className="w-full">
        <div className="animate-pulse">
          <div className="h-10 bg-gray-200 rounded mb-2"></div>
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-12 bg-gray-100 rounded mb-1"></div>
          ))}
        </div>
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div className="w-full text-center py-8 text-gray-500">
        {emptyMessage}
      </div>
    );
  }

  return (
    <div className={clsx("w-full overflow-x-auto", className)}>
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            {columns.map((column) => (
              <th
                key={column.key}
                className={clsx(
                  "px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider",
                  column.className
                )}
              >
                {column.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {data.map((row, index) => (
            <tr
              key={index}
              className={clsx(
                "hover:bg-gray-50 transition-colors",
                onRowClick && "cursor-pointer"
              )}
              onClick={() => onRowClick?.(row)}
            >
              {columns.map((column) => (
                <td
                  key={column.key}
                  className={clsx(
                    "px-6 py-4 whitespace-nowrap text-sm text-gray-900",
                    column.className
                  )}
                >
                  {column.render
                    ? column.render(row[column.key], row)
                    : row[column.key]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

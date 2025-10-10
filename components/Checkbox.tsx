import React from "react";
import { clsx } from "clsx";

export interface CheckboxProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  disabled?: boolean;
  label?: string;
  className?: string;
  "aria-label"?: string;
}

export function Checkbox({
  checked,
  onChange,
  disabled = false,
  label,
  className,
  "aria-label": ariaLabel,
}: CheckboxProps) {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.checked);
  };

  const checkboxElement = (
    <input
      type="checkbox"
      checked={checked}
      onChange={handleChange}
      disabled={disabled}
      className={clsx(
        "h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded",
        disabled && "opacity-50 cursor-not-allowed"
      )}
      aria-label={ariaLabel}
    />
  );

  if (label) {
    return (
      <label className={clsx("flex items-center space-x-2", className)}>
        {checkboxElement}
        <span className="text-sm text-gray-700">{label}</span>
      </label>
    );
  }

  return <div className={className}>{checkboxElement}</div>;
}

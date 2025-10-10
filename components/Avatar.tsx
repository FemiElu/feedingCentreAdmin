import React from "react";
import { clsx } from "clsx";

export interface AvatarProps {
  src?: string;
  alt?: string;
  name?: string;
  size?: "sm" | "md" | "lg" | "xl";
  className?: string;
}

export function Avatar({
  src,
  alt,
  name,
  size = "md",
  className,
}: AvatarProps) {
  const sizeClasses = {
    sm: "h-8 w-8 text-xs",
    md: "h-10 w-10 text-sm",
    lg: "h-12 w-12 text-base",
    xl: "h-16 w-16 text-lg",
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div
      className={clsx(
        "inline-flex items-center justify-center rounded-full bg-primary-600 text-white font-medium",
        sizeClasses[size],
        className
      )}
    >
      {src ? (
        <img
          src={src}
          alt={alt || name || "Avatar"}
          className="h-full w-full rounded-full object-cover"
        />
      ) : (
        <span className="font-medium">{name ? getInitials(name) : "?"}</span>
      )}
    </div>
  );
}

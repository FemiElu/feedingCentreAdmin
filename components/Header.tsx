"use client";

import React from "react";
import Link from "next/link";
import { useAuth } from "@/hooks/useAuth";
import { Avatar } from "./Avatar";
import { Button } from "./Button";

interface HeaderProps {
  onMenuClick: () => void;
}

export function Header({ onMenuClick }: HeaderProps) {
  const { user, signOut } = useAuth();

  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            {/* Mobile menu button */}
            <button
              onClick={onMenuClick}
              className="lg:hidden p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary-500"
              aria-label="Open sidebar"
            >
              <svg
                className="h-6 w-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </button>

            <Link
              href="/"
              className="text-lg sm:text-xl font-bold text-primary-600 ml-2 lg:ml-0"
            >
              <span className="hidden sm:inline">
                Feeding Centre Church Database
              </span>
              <span className="sm:hidden">FCC Database</span>
            </Link>
          </div>

          <div className="flex items-center space-x-2 sm:space-x-4">
            {user && (
              <>
                <div className="flex items-center space-x-2 sm:space-x-3">
                  <Avatar
                    name={user.user_metadata?.name || user.email}
                    size="sm"
                  />
                  <div className="hidden sm:block">
                    <p className="text-sm font-medium text-gray-900">
                      {user.user_metadata?.name || "Admin"}
                    </p>
                    <p className="text-xs text-gray-500">{user.email}</p>
                  </div>
                </div>
                <Button variant="outline" size="sm" onClick={() => signOut()}>
                  <span className="hidden sm:inline">Sign Out</span>
                  <span className="sm:hidden">Out</span>
                </Button>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}

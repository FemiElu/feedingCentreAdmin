import React from "react";

export function Footer() {
  return (
    <footer className="bg-white border-t border-gray-200">
      <div className="px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex justify-between items-center">
          <p className="text-sm text-gray-500">
            © 2024 Church Admin. All rights reserved.
          </p>
          <div className="flex space-x-4 text-sm text-gray-500">
            <a href="#" className="hover:text-gray-700">
              Privacy Policy
            </a>
            <a href="#" className="hover:text-gray-700">
              Terms of Service
            </a>
            <a href="#" className="hover:text-gray-700">
              Support
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}

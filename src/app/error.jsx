"use client";

import { useEffect } from "react";
import Link from "next/link";

export default function Error({ error, reset }) {
  useEffect(() => {
    console.error("App error:", error);
  }, [error]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <p className="text-8xl mb-6">⚠️</p>
        <h1 className="text-3xl font-bold text-gray-800 mb-3">
          Something went wrong
        </h1>
        <p className="text-gray-500 mb-8">
          {error?.message || "An unexpected error occurred."}
        </p>
        <div className="flex gap-3 justify-center">
          <button
            onClick={reset}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition"
          >
            Try Again
          </button>
          <Link
            href="/"
            className="border border-gray-300 text-gray-600 px-6 py-3 rounded-lg hover:bg-gray-50 transition"
          >
            Go Home
          </Link>
        </div>
      </div>
    </div>
  );
}
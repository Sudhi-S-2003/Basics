"use client";

import Image from "next/image";
import { useState } from "react";

export default function Home() {
  const [url, setUrl] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function checkUrl() {
    if (!url) {
      setError("Please enter a URL");
      return;
    }

    setLoading(true);
    setError("");
    setResult(null);

    try {
      const res = await fetch("/api/validate/social-media", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url, verifyRemote: true }),
      });

      const data = await res.json();
      setResult(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="font-sans min-h-screen flex flex-col items-center justify-center p-6 bg-gray-50 dark:bg-gray-900">
      <div className="max-w-xl w-full bg-white dark:bg-gray-800 shadow-md rounded-lg p-8 flex flex-col gap-6">
        {/* Logo */}
        <div className="flex justify-center">
          <Image
            className="dark:invert"
            src="/next.svg"
            alt="Next.js logo"
            width={180}
            height={38}
            priority
          />
        </div>

        {/* Input */}
        <input
          type="url"
          placeholder="Enter YouTube, Instagram, or LinkedIn URL"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          className="w-full p-3 rounded border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        {/* Button */}
        <button
          onClick={checkUrl}
          disabled={loading}
          className={`w-full px-4 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed`}
        >
          {loading ? "Validating..." : "Validate URL"}
        </button>

        {/* Error */}
        {error && (
          <div className="text-red-600 dark:text-red-400 text-sm font-medium">
            {error}
          </div>
        )}

        {/* Result */}
        {result && (
          <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded w-full overflow-x-auto text-xs">
            <pre>{JSON.stringify(result, null, 2)}</pre>
          </div>
        )}
      </div>

      <footer className="mt-8 text-gray-500 dark:text-gray-400 text-sm">
        Social Media URL Validator
      </footer>
    </div>
  );
}

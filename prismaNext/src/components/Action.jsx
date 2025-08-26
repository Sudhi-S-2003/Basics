"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner"; // import toast

export default function Action() {
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState("");
  const router = useRouter();

  const handleClick = async () => {
    if (!name) {
      toast.error("Name is required");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/v1", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name }),
      });

      const data = await res.json();

      if (!res.ok) {
        toast.error(data?.error?.message || data?.message || "Something went wrong");
        return;
      }

      toast.success("Test added successfully 🎉");
      router.refresh(); // refresh page
    } catch (err) {
      console.error(err);
      toast.error("Request failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-4">
      <input
        type="text"
        placeholder="Enter test name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="border px-2 py-1 rounded"
        disabled={loading}
      />
      <button
        onClick={handleClick}
        disabled={loading}
        className="bg-blue-600 text-white px-4 py-2 rounded disabled:opacity-50"
      >
        {loading ? "Loading..." : "Add Test"}
      </button>
    </div>
  );
}

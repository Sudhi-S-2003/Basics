import { useState } from "react";

const numberFormatter = new Intl.NumberFormat("en-US", {
  style: "unit",
  unit: "kilobyte",
  unitDisplay: "short",
  maximumFractionDigits: 2,
});

function FileUpload() {
  const [files, setFiles] = useState<File[] | null>(null);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState("");

  const handleUpload = async () => {
    if (!files || files.length === 0) {
      setMessage("Please select at least one file!");
      return;
    }

    setUploading(true);
    setMessage("");

    // 🧩 Prepare FormData for multiple files
    const formData = new FormData();
    files.forEach((file) => {
      formData.append("files", file);
    });

    try {
      // 🌐 Send request to your backend upload endpoint
      const response = await fetch("http://localhost:4000/upload", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) throw new Error("Upload failed");

      const result = await response.json();
      setMessage(`✅ Uploaded successfully: ${result.message || ""}`);
    } catch (err: any) {
      setMessage(`❌ Error: ${err.message}`);
    } finally {
      setUploading(false);
    }
  };

  const data =
    files?.map((file) => ({
      name: file.name,
      size: numberFormatter.format(file.size / 1024),
      type: file.type || "Unknown",
    })) ?? [];

  return (
    <div className="p-4 space-y-4">
      <h1 className="text-2xl font-bold">File Upload</h1>

      <input
        type="file"
        multiple
        className="bg-amber-200 border-2 rounded-2xl px-3 py-1"
        onChange={(e) =>
          setFiles(e.target.files ? Array.from(e.target.files) : null)
        }
      />

      {files && files.length > 0 && (
        <button
          onClick={handleUpload}
          disabled={uploading}
          className="bg-blue-500 text-white px-4 py-2 rounded disabled:opacity-50"
        >
          {uploading ? "Uploading..." : "Upload Files"}
        </button>
      )}

      {message && <p className="text-sm">{message}</p>}

      <pre className="mt-4 bg-gray-100 p-2 rounded text-sm overflow-auto">
        {JSON.stringify(data, null, 2)}
      </pre>
    </div>
  );
}

export default FileUpload;

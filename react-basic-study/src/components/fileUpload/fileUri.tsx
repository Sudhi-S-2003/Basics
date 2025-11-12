import React from "react";

interface FileUriProps {
  name: string;
  uri: string;
}

const FileUri: React.FC<FileUriProps> = ({ name, uri }) => {
  const handleDownload = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();

    try {
      const response = await fetch(uri);
      if (!response.ok) throw new Error("Network response was not ok");

      const blob = await response.blob();
      const blobUrl = window.URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = blobUrl;
      link.download = name;
      document.body.appendChild(link);
      link.click();

      document.body.removeChild(link);
      window.URL.revokeObjectURL(blobUrl);
    } catch (error) {
      console.error("Download error:", error);
    }
  };

  return (
    <div className="p-4 border rounded-md shadow-sm bg-white">
      <h1 className="text-lg font-semibold mb-2">File URI</h1>

      <div className="flex items-center gap-4">
        <a
          href={uri}
          target="_blank"
          rel="noreferrer"
          className="text-blue-600 underline hover:text-blue-800"
        >
          View File
        </a>

        <button
          onClick={handleDownload}
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
        >
          Download File
        </button>
      </div>
    </div>
  );
};

export default FileUri;

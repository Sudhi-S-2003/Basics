import React, { useState } from "react";
import axios from "axios";
import FileCSVReader from "./utils/FileCSVReader";

function CSVUploader() {
  const [fileData, setFileData] = useState(null);

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    try {
      const data = await FileCSVReader(file);
      setFileData(data);
    } catch (err) {
      alert(err.message);
    }
  };

  const uploadCSV = async () => {
    if (!fileData) return alert("No file selected");
    try {
      console.log({ fileData });
      // Example: send to your backend
      // const res = await axios.post("http://localhost:5000/api/upload/csv", fileData);
      // alert("Uploaded: " + res.data.message);
    } catch (err) {
      alert("Upload failed");
    }
  };

  return (
    <div>
      <h2>Upload CSV</h2>
      <input type="file" accept=".csv,text/csv" onChange={handleFileChange} />
      <button onClick={uploadCSV}>Upload</button>

      {fileData && (
        <div style={{ marginTop: "1rem" }}>
          <h3>Preview:</h3>
          <pre>{JSON.stringify(fileData, null, 2)}</pre>
        </div>
      )}
    </div>
  );
}

export default CSVUploader;

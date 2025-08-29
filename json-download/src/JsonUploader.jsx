import React, { useState } from "react";
import axios from "axios";
import FileJsonReader from "./utils/FileJsonReader";

function JsonUploader() {
  const [fileData, setFileData] = useState(null);

  // const handleFileChange = (e) => {
  //   const file = e.target.files[0];
  //   if (file && file.type === "application/json") {
  //     const reader = new FileReader();
  //     reader.onload = (event) => {
  //       try {
  //         const json = JSON.parse(event.target.result);
  //         setFileData(json);
  //       } catch (err) {
  //         alert("Invalid JSON file");
  //       }
  //     };
  //     reader.readAsText(file);
  //   }
  // };
const handleFileChange = async (e) => {
    const file = e.target.files[0];
    try {
      const json = await FileJsonReader(file);
      setFileData(json);
    } catch (err) {
      alert(err.message);
    }
  };
  const uploadJson = async () => {
    if (!fileData) return alert("No file selected");
    try {
      console.log({fileData})
      // const res = await axios.post("http://localhost:5000/api/save", fileData);
      // alert("Uploaded: " + res.data.message);
    } catch (err) {
      alert("Upload failed");
    }
  };

  return (
    <div>
      <h2>Upload JSON</h2>
      <input type="file" accept="application/json" onChange={handleFileChange} />
      <button onClick={uploadJson}>Upload</button>
    </div>
  );
}

export default JsonUploader;

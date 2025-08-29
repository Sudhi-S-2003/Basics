// utils/FileJsonReader.js

const FileJsonReader = (file) => {
  return new Promise((resolve, reject) => {
    if (!file) {
      return reject(new Error("No file provided"));
    }

    if (file.type !== "application/json") {
      return reject(new Error("Only JSON files are allowed"));
    }

    const reader = new FileReader();

    reader.onload = (event) => {
      try {
        const json = JSON.parse(event.target.result);
        resolve(json);
      } catch (err) {
        reject(new Error("Invalid JSON content"));
      }
    };

    reader.onerror = () => {
      reject(new Error("Error reading file"));
    };

    reader.readAsText(file);
  });
};

export default FileJsonReader;

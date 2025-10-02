// utils/FileCSVReader.js

const FileCSVReader = (file) => {
  return new Promise((resolve, reject) => {
    if (!file) {
      return reject(new Error("No file provided"));
    }

    if (file.type !== "text/csv") {
      return reject(new Error("Only CSV files are allowed"));
    }

    const reader = new FileReader();

    reader.onload = (event) => {
      try {
        const text = event.target.result;

        // Simple CSV to JSON conversion
        const lines = text.split("\n").filter(line => line.trim() !== "");
        const headers = lines[0].split(",").map(h => h.trim());
        const data = lines.slice(1).map(line => {
          const values = line.split(",").map(v => v.trim());
          return headers.reduce((obj, header, index) => {
            obj[header] = values[index];
            return obj;
          }, {});
        });

        resolve(data);
      } catch  {
        reject(new Error("Invalid CSV content"));
      }
    };

    reader.onerror = () => {
      reject(new Error("Error reading file"));
    };

    reader.readAsText(file);
  });
};

export default FileCSVReader;

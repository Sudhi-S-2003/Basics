const downloadCSV = () => {
  const data = { name: "Sudhi", age: 25 }; // any JSON object

  // Convert JSON to CSV
  const headers = Object.keys(data).join(","); // "name,age"
  const values = Object.values(data).join(","); // "Sudhi,25"
  const csvContent = `${headers}\n${values}`;

  // Create Blob and download
  const blob = new Blob([csvContent], { type: "text/csv" });
  const url = URL.createObjectURL(blob);

  const link = document.createElement("a");
  link.href = url;
  link.download = "data.csv";
  link.click();
  URL.revokeObjectURL(url);
};

export default downloadCSV;

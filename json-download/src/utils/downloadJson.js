const downloadJson = () => {
  const data = { name: "Sudhi", age: 25 }; // any JSON
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);

  const link = document.createElement("a");
  link.href = url;
  link.download = "data.json";
  link.click();
  URL.revokeObjectURL(url);
};
export default downloadJson
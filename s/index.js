const xlsx = require("xlsx");
const fs = require("fs");

// Read Excel file
const workbook = xlsx.readFile("file.xlsx");

// Get first sheet
const sheetName = workbook.SheetNames[0];
const sheet = workbook.Sheets[sheetName];

// Convert sheet to JSON
const jsonData = xlsx.utils.sheet_to_json(sheet);

// Save as JSON file
fs.writeFileSync("output.json", JSON.stringify(jsonData, null, 2));

console.log("✅ Excel converted to JSON!");

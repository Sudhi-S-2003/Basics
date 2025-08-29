const multer = require("multer");
const fs = require("fs");
const express = require("express");
const { parse } = require("json2csv");
const csvtojson = require("csvtojson");
const route = express.Router();

// Multer setup (temporary upload)
const upload = multer({ dest: "uploads/" });

// Upload JSON or CSV
route.post("/api/upload", upload.single("file"), async (req, res) => {
  const filePath = req.file.path;
  const fileType = req.file.mimetype;

  try {
    let json;

    if (fileType === "application/json") {
      // Parse JSON
      const data = fs.readFileSync(filePath, "utf8");
      json = JSON.parse(data);
    } else if (
      fileType === "text/csv" ||
      fileType === "application/vnd.ms-excel"
    ) {
      // Parse CSV
      json = await csvtojson().fromFile(filePath);
    } else {
      throw new Error("Unsupported file type");
    }

    // Save as JSON permanently
    fs.writeFileSync("uploads/lastUploaded.json", JSON.stringify(json, null, 2));

    // Delete temp file
    fs.unlinkSync(filePath);

    res.json({ message: "File uploaded and converted to JSON", data: json });
  } catch (err) {
    if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
    res.status(500).json({ error: err.message || "Invalid file" });
  }
});

// Download last uploaded JSON
route.get("/api/download/json", (req, res) => {
  const filePath = "uploads/lastUploaded.json";

  if (!fs.existsSync(filePath)) {
    return res.status(404).json({ error: "No file found" });
  }

  res.download(filePath, "data.json", (err) => {
    if (err) res.status(500).json({ error: "Error downloading file" });
  });
});

// Download last uploaded JSON as CSV
route.get("/api/download/csv", (req, res) => {
  const filePath = "uploads/lastUploaded.json";

  if (!fs.existsSync(filePath)) {
    return res.status(404).json({ error: "No JSON file found" });
  }

  try {
    const data = JSON.parse(fs.readFileSync(filePath, "utf8"));
    const csv = parse(data);

    res.setHeader("Content-Disposition", "attachment; filename=data.csv");
    res.setHeader("Content-Type", "text/csv");
    res.send(csv);
  } catch (err) {
    res.status(500).json({ error: "Error converting JSON to CSV" });
  }
});

// Sample JSON download
route.get("/api/data/download/json", (req, res) => {
  const data = [
    { name: "Sudhi", age: 25 },
    { name: "Alex", age: 30 }
  ];

  res.setHeader("Content-Disposition", "attachment; filename=data.json");
  res.setHeader("Content-Type", "application/json");
  res.send(JSON.stringify(data, null, 2));
});

// Sample CSV download
route.get("/api/data/download/csv", (req, res) => {
  const data = [
    { name: "Sudhi", age: 25 },
    { name: "Alex", age: 30 }
  ];

  try {
    const csv = parse(data);
    res.setHeader("Content-Disposition", "attachment; filename=data.csv");
    res.setHeader("Content-Type", "text/csv");
    res.send(csv);
  } catch (err) {
    res.status(500).json({ error: "Error creating CSV" });
  }
});

module.exports = route;

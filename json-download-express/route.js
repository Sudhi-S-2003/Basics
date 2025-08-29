const multer = require("multer");
const fs = require("fs");

const upload = multer({ dest: "uploads/" });
const express=require("express")
const route=express.Router()

route.post("/api/upload", upload.single("jsonFile"), (req, res) => {
  const filePath = req.file.path;

  try {
    // Read uploaded file content
    const data = fs.readFileSync(filePath, "utf8");
    const json = JSON.parse(data);

    // Optionally, save the file permanently
    fs.writeFileSync("uploads/lastUploaded.json", JSON.stringify(json, null, 2));

    res.json({ message: "File uploaded", data: json });
  } catch (err) {
    res.status(500).json({ error: "Invalid JSON file" });
  }
});

route.get("/api/download", (req, res) => {
  const filePath = "uploads/lastUploaded.json";

  if (!fs.existsSync(filePath)) {
    return res.status(404).json({ error: "No file found" });
  }

  res.download(filePath, "data.json", (err) => {
    if (err) {
      res.status(500).json({ error: "Error downloading file" });
    }
  });
});
route.get("/api/data/download", (req, res) => {
  const data = [
    { name: "Sudhi", age: 25 },
    { name: "Alex", age: 30 }
  ]; // replace with your dynamic data

  // Set headers to trigger download
  res.setHeader("Content-Disposition", "attachment; filename=data.json");
  res.setHeader("Content-Type", "application/json");

  // Send JSON as file
  res.send(JSON.stringify(data, null, 2));
});

module.exports=route
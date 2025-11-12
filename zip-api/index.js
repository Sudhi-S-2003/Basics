const express = require("express");
const PDFDocument = require("pdfkit");
const JSZip = require("jszip");
const axios = require("axios");
const cors = require("cors");
const bodyParser = require("body-parser");

const app = express();
app.use(cors());
app.use(bodyParser.json({ limit: "50mb" }));

// Sanitize filenames
function sanitizeFilename(name) {
  return name.replace(/[^a-zA-Z0-9._-]/g, "_");
}

// ✅ Generate a valid PDF buffer
async function generatePDFBuffer(data) {
  return new Promise((resolve, reject) => {
    try {
      const doc = new PDFDocument({
        size: "A4",
        info: {
          Title: "Report",
          Author: "Server Generator",
          Subject: "Auto Generated Report",
          CreationDate: new Date(),
        },
      });

      const chunks = [];
      doc.on("data", (chunk) => chunks.push(chunk));
      doc.on("end", () => resolve(Buffer.concat(chunks)));
      doc.on("error", reject);

      doc.fontSize(20).text("Report Summary", { align: "center" });
      doc.moveDown(1);
      doc.fontSize(12).text("Generated automatically by server.", { align: "left" });
      doc.moveDown(1);
      doc.text("Data:", { underline: true });
      doc.moveDown(0.5);
      doc.font("Helvetica").text(JSON.stringify(data, null, 2), { align: "left" });

      doc.end();
    } catch (err) {
      reject(err);
    }
  });
}

// Download file from URL
async function downloadFile(url) {
  const response = await axios.get(url, { responseType: "arraybuffer" });
  return Buffer.from(response.data);
}

// ✅ /download-zip endpoint
app.post("/download-zip", async (req, res) => {
  try {
    const { awsFiles = [], pdfData = [] } = req.body;

    if (!awsFiles.length && !pdfData.length) {
      return res.status(400).send("No files to include in ZIP");
    }

    const zip = new JSZip();
    const imageFolder = zip.folder("images");
    const reportFolder = zip.folder("reports");

    // Add AWS files
    for (const file of awsFiles) {
      try {
        const buf = await downloadFile(file.uri);
        await imageFolder.file(sanitizeFilename(file.name), buf);
      } catch (err) {
        console.warn("Skipping file:", file.uri, err.message);
      }
    }

    // Add generated PDFs
    for (const pdf of pdfData) {
      const buf = await generatePDFBuffer(pdf.data);
       await reportFolder.file(sanitizeFilename(pdf.name), buf);
    }

    // Generate ZIP
    const zipBuffer = await zip.generateAsync({
      type: "nodebuffer",
      compression: "DEFLATE",
      compressionOptions: { level: 9 },
    });

    res.setHeader("Content-Type", "application/zip");
    res.setHeader("Content-Disposition", 'attachment; filename="download.zip"');
    res.send(zipBuffer);
  } catch (err) {
    console.error("❌ ZIP creation failed:", err);
    if (!res.headersSent) res.status(500).send("Failed to create ZIP");
  }
});

app.listen(3000, () => console.log("✅ Server running at http://localhost:3000"));

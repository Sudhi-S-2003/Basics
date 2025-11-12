const JSZip = require("jszip");
const axios = require("axios"); // to fetch files from URLs
const { uploadToS3 } = require("./lib");

// Simple example: just send hello.txt in a zip
const simpleZipPdf = async (req, res) => {
  const zip = new JSZip();
  zip.file("hello.txt", "Hello World\n");

  const content = await zip.generateAsync({ type: "nodebuffer" });

  res.set({
    "Content-Type": "application/zip",
    "Content-Disposition": 'attachment; filename="example.zip"',
  });

  res.send(content);
};

// Fetch URIs and zip them
const uriZipPdf = async (req, res) => {
  try {
    const zip = new JSZip();
    let { uri, uris } = req.query;

    // Normalize uris into an array
    let uriList = [];
    if (uris) {
      uriList = uris.split(",");
    } else if (uri) {
      uriList = [uri];
    } else {
      return res.status(400).send("No URI(s) provided.");
    }

    // Create folder inside zip
    const folder = zip.folder("Request_file");

    // Fetch and add each file
    for (const [index, fileUri] of uriList.entries()) {
      const fileName = fileUri.split("/").pop() || `file${index + 1}`;
      const response = await axios.get(fileUri, { responseType: "arraybuffer" });
      folder.file(fileName, response.data);
    }

    // Generate the ZIP file
    const content = await zip.generateAsync({ type: "nodebuffer" });

    // Set headers for download
    res.set({
      "Content-Type": "application/zip",
      "Content-Disposition": 'attachment; filename="files.zip"',
    });

    res.send(content);
  } catch (err) {
    console.error(err);
    res.status(500).send("Failed to generate ZIP file.");
  }
};

// ✅ Main route: zip remote files, upload to S3, and return link
const uriZipS3Pdf = async (req, res) => {
  try {
    const zip = new JSZip();
    let { uri, uris } = req.query;

    // Normalize input into array
    let uriList = [];
    if (uris) uriList = uris.split(",");
    else if (uri) uriList = [uri];
    else return res.status(400).send("No URI(s) provided.");

    // Folder inside ZIP
    const folder = zip.folder("Request_file");

    // Fetch and add files
    for (const [index, fileUri] of uriList.entries()) {
      const fileName = fileUri.split("/").pop() || `file${index + 1}`;
      const response = await axios.get(fileUri, { responseType: "arraybuffer" });
      folder.file(fileName, response.data);
    }

    // Generate ZIP buffer
    const zipBuffer = await zip.generateAsync({ type: "nodebuffer" });

    // Build a pseudo "file" object compatible with uploadToS3()
    const file = {
      buffer: zipBuffer,
      originalname: "files.zip",
      mimetype: "application/zip",
    };

    // Upload to S3 under "zips/" folder
    const uploadedUrl = await uploadToS3(file, "test-zips");

    // Return success response with S3 file URL
    res.json({
      message: "ZIP uploaded to S3 successfully",
      fileUrl: uploadedUrl,
    });
  } catch (err) {
    console.error("Error creating/uploading ZIP:", err);
    res.status(500).send("Failed to generate and upload ZIP file.");
  }
};

module.exports = {
  simpleZipPdf,
  uriZipPdf,
  uriZipS3Pdf
};

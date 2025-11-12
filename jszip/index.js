const express = require("express");
const { simpleZipPdf, uriZipPdf, uriZipS3Pdf } = require("./controller");

const app = express();

app.get("/", simpleZipPdf)
app.get("/uri", uriZipPdf)
app.get("/s3", uriZipS3Pdf)

app.listen(3000, () => {
    console.log("Server running on port 3000");
});

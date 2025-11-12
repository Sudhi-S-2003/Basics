const { S3Client } = require('@aws-sdk/client-s3');
const { PutObjectCommand,} = require('@aws-sdk/client-s3')
require('dotenv').config();

const bucketName = process.env.AWS_S3_BUCKET_NAME
const region = process.env.AWS_S3_REGION

const s3client = new S3Client({
  region: region,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  }
});

module.exports = s3client;

async function uploadToS3(file, section = '') {

  const sectionFolderName = section ? `${section}/` : '';
  const fileKey = `${sectionFolderName}${Date.now()}-${file.originalname}`;
  //create params
  const params = {
    Bucket: bucketName,
    Key: fileKey,
    Body: file.buffer,
    ContentType: file.mimetype
  }

  const command = await new PutObjectCommand(params)
  await s3client.send(command) //Send to S3

  //Return the url of uploaded s3 file
  return `https://${bucketName}.s3.${region}.amazonaws.com/${encodeURIComponent(params.Key)}`;
}

module.exports={
    uploadToS3
}
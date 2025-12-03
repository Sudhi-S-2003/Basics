
// ============================================
// server/src/services/upload.service.js
// ============================================
import fs from 'fs/promises';
import path from 'path';
import sharp from 'sharp';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

const uploadType = process.env.UPLOAD_TYPE || 'local';
const s3Client = uploadType === 's3'
  ? new S3Client({
      region: process.env.AWS_REGION,
      credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
      },
    })
  : null;

export const uploadFile = async (file) => {
  const { filename, originalname, mimetype, size, path: filePath } = file;
  
  // Validate file size
  const maxSize = parseInt(process.env.MAX_FILE_SIZE) || 10 * 1024 * 1024;
  if (size > maxSize) {
    await fs.unlink(filePath);
    throw new Error('File too large');
  }

  const fileExtension = path.extname(originalname);
  const uniqueFilename = `${Date.now()}-${Math.random().toString(36).substring(7)}${fileExtension}`;
  
  let fileUrl;
  let thumbnailUrl = null;

  if (uploadType === 's3') {
    // Upload to S3
    const fileBuffer = await fs.readFile(filePath);
    const key = `uploads/${uniqueFilename}`;

    await s3Client.send(
      new PutObjectCommand({
        Bucket: process.env.S3_BUCKET_NAME,
        Key: key,
        Body: fileBuffer,
        ContentType: mimetype,
      })
    );

    fileUrl = `https://${process.env.S3_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${key}`;

    // Generate thumbnail for images
    if (mimetype.startsWith('image/')) {
      const thumbnailBuffer = await sharp(fileBuffer)
        .resize(200, 200, { fit: 'cover' })
        .toBuffer();

      const thumbnailKey = `uploads/thumbnails/${uniqueFilename}`;
      await s3Client.send(
        new PutObjectCommand({
          Bucket: process.env.S3_BUCKET_NAME,
          Key: thumbnailKey,
          Body: thumbnailBuffer,
          ContentType: mimetype,
        })
      );

      thumbnailUrl = `https://${process.env.S3_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${thumbnailKey}`;
    }

    // Clean up temp file
    await fs.unlink(filePath);
  } else {
    // Local storage
    const uploadDir = 'uploads';
    const thumbnailDir = 'uploads/thumbnails';
    
    await fs.mkdir(uploadDir, { recursive: true });
    await fs.mkdir(thumbnailDir, { recursive: true });

    const newPath = path.join(uploadDir, uniqueFilename);
    await fs.rename(filePath, newPath);

    fileUrl = `${process.env.CLIENT_URL || 'http://localhost:5000'}/uploads/${uniqueFilename}`;

    // Generate thumbnail for images
    if (mimetype.startsWith('image/')) {
      const thumbnailPath = path.join(thumbnailDir, uniqueFilename);
      await sharp(newPath)
        .resize(200, 200, { fit: 'cover' })
        .toFile(thumbnailPath);

      thumbnailUrl = `${process.env.CLIENT_URL || 'http://localhost:5000'}/uploads/thumbnails/${uniqueFilename}`;
    }
  }

  return {
    filename: uniqueFilename,
    originalName: originalname,
    mimeType: mimetype,
    size,
    url: fileUrl,
    thumbnailUrl,
  };
};

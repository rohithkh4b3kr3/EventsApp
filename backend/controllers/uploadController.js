import { PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { s3Client } from "../config/s3.js";
import crypto from "crypto";

export const generateUploadUrl = async (req, res) => {
  try {
    const { fileName, fileType } = req.body;

    if (!fileName || !fileType) {
      return res.status(400).json({ msg: "fileName and fileType are required", success: false });
    }

    // Validate MIME types
    const allowedTypes = ["image/jpeg", "image/png", "image/webp"];
    if (!allowedTypes.includes(fileType)) {
      return res.status(400).json({ msg: "Invalid file type. Only JPEG, PNG, and WebP are allowed.", success: false });
    }

    const uniqueSuffix = `${Date.now()}-${crypto.randomUUID()}`;
    // Replace spaces and special characters from fileName for safety
    const safeFileName = fileName.replace(/[^a-zA-Z0-9.\-_]/g, '');
    const key = `uploads/${uniqueSuffix}-${safeFileName}`;

    const command = new PutObjectCommand({
      Bucket: process.env.S3_BUCKET_NAME,
      Key: key,
      ContentType: fileType,
    });

    // Signed URL expires in 120 seconds
    const uploadUrl = await getSignedUrl(s3Client, command, { expiresIn: 120 });
    const fileUrl = `https://${process.env.S3_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${key}`;

    res.status(200).json({
      success: true,
      uploadUrl,
      fileUrl,
    });
  } catch (error) {
    console.error("Error generating signed URL:", error);
    res.status(500).json({ msg: "Failed to generate upload URL", success: false });
  }
};

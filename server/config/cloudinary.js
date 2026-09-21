import { v2 as cloudinary } from "cloudinary";

if (!process.env.CLDN_NAME || !process.env.CLDN_API_KEY || !process.env.CLDN_SECRET_KEY) {
  throw new Error("❌ Cloudinary environment variables missing");
}

cloudinary.config({
  cloud_name: process.env.CLDN_NAME,
  api_key: process.env.CLDN_API_KEY,
  api_secret: process.env.CLDN_SECRET_KEY,
  secure: true,
});

console.log("✅ Cloudinary configured successfully");

export default cloudinary;

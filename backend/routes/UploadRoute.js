import express from "express";
import { generateUploadUrl } from "../controllers/uploadController.js";
import isAuthenticated from "../config/auth.js";

const router = express.Router();

router.post("/generate-upload-url", isAuthenticated, generateUploadUrl);

export default router;

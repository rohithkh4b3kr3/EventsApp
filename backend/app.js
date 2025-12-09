import express from "express";
import dotenv from "dotenv";
import cookiesParser from "cookie-parser";
import UserRoute from "./routes/UserRoute.js";
import PostRoute from "./routes/PostRoute.js";
import dbConnection from "./config/db.js";
import cors from "cors";
import path from "path";
import fs from "fs";

dotenv.config();
const app = express();
const port = process.env.PORT || 3000;

const allowedOrigins = [process.env.FRONTEND_URL || "http://localhost:5173"];

app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
  })
);

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookiesParser());

const uploadsDir = path.join(process.cwd(), "uploads");
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}
app.use("/uploads", express.static(uploadsDir));

dbConnection();

app.get("/", (req, res) => {
  res.send("Hello World");
});

app.use("/api/user", UserRoute);
app.use("/api/post", PostRoute);

app.listen(port, () => {
  console.log(`App is running on port ${port}`);
  console.log("Loaded MONGO_URI from ENV:", process.env.MONGO_URI);
});

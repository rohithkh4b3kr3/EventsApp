import express from "express";
import dotenv from "dotenv";
import cookiesParser from "cookie-parser";
import UserRoute from "./routes/UserRoute.js";
import PostRoute from "./routes/PostRoute.js";
import dbConnection from "./config/db.js";
import cors from "cors";
dbConnection();

dotenv.config();
const app = express();
const port = process.env.PORT || 3000;
app.use(cors());


app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookiesParser());

app.get("/", (req, res) => {
  res.send("Hello World");
});

app.use("/api/user", UserRoute);
app.use("/api/post", PostRoute);

// https://localhost:3000/api/user/register

app.listen(port, () => {
  console.log(`App is running on port ${port}`);
});

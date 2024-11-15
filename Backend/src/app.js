import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
// import dotenv from "dotenv";
// dotenv.config();

const app = express();

// Configuration
app.use(
  cors({
    origin: process.env.CORS_ORIGIN,
    credential: true,
  })
);
app.use(express.json({ limit: "16kb" }));
// Data From URLEncoded
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
// Static Public Assets
app.use(express.static("public"));

app.use(cookieParser());

app.listen(process.env.PORT || 4000, () => {
  console.log(`⚙️  Server is running on port ${process.env.PORT || 4000}`);
});

// Routes Import

//routes declaration

// http://localhost:8000/api/v1/users/register

// Testing Purpose
// app.get("/", (req, res) => {
//   res.send("Hello, World!");
// });

// Testing Purpose

// app.get("/test", (req, res) => {
//   res.send("Test route is working!");
// });
export default app;

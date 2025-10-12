import express from "express";
import path from "path";
import "dotenv/config";   // for .env
import cors from "cors";
import mongoose from "mongoose";

import chatsRoute from "./routes/chats.js";

const app = express();
const PORT = process.env.PORT || 3000;

// __dirname in ES modules
const __dirname = path.resolve();

// Middleware
app.use(express.json());
app.use(cors());

// Serve React frontend
app.use(express.static(path.join(__dirname, "../frontend/build")));

// Connect to MongoDB
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_CONNECTION);
    console.log("Connected to database successfully.");
  } catch (err) {
    console.log("Failed to connect to database.", err);
  }
};

// API routes
app.use("/api", chatsRoute);

// Test backend route
app.get("/api/test", (req, res) => {
  res.json({ message: "Backend is running!" });
});



// Start server
app.listen(PORT, () => {
  console.log(`Server running at port: ${PORT}`);
  connectDB();
});

import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import 'dotenv/config';
import cors from "cors";
import mongoose from "mongoose";
import chatRoutes from "./routes/chat.js";

const app = express();
const PORT = process.env.PORT || 8080;

app.use(express.json());
app.use(cors());

app.use("/api", chatRoutes);

// ✅ Serve frontend build files
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// adjust path based on your folder structure
app.use(express.static(path.join(__dirname, "../FRONTEND/dist"))); 

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "../FRONTEND/dist/index.html"));
});

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("Connected with Database!");
  } catch (err) {
    console.log("Failed to connect with database", err);
  }
};

app.listen(PORT, () => {
  console.log(`Server running at port ${PORT}`);
  connectDB();
});

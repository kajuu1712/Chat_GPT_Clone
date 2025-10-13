import express from "express";  //npm i express
 
import 'dotenv/config';    //for .env file,  npm i dotenv
import cors from 'cors';
import mongoose from "mongoose";   //npm i mongoose

import chatsRoute from "./routes/chats.js";

import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;


app.use(express.json());    //to parse data
app.use(cors());

// Serve frontend
app.use(express.static(path.join(__dirname, "../FRONTEND/dist"))); 

const connectDB = async() => {
    try {
        await mongoose.connect(process.env.MONGODB_CONNECTION);
        console.log("Connected to database successfully.");
    }catch(err) {
        console.log("Failed to connect to database.", err);
    }
}

app.use("/api", chatsRoute);

app.get("/:path(.*)", (req, res) => {
  res.sendFile(path.join(__dirname, "../FRONTEND/dist/index.html")); 
});

app.listen(PORT, () => {
    console.log(`Server running at port : ${PORT}`);
    connectDB();    //calling fn to connect to the DB.
})
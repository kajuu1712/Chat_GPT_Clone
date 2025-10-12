import express from "express";  //npm i express
 //npm i openai
import 'dotenv/config';    //for .env file,  npm i dotenv
import cors from 'cors';
import mongoose from "mongoose";   //npm i mongoose

import chatsRoute from "./routes/chats.js";

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());    //to parse data
app.use(cors());

const connectDB = async() => {
    try {
        await mongoose.connect(process.env.MONGODB_CONNECTION);
        console.log("Connected to database successfully.");
    }catch(err) {
        console.log("Failed to connect to database.", err);
    }
}

app.use("/api", chatsRoute);

app.get('/', (req, res) => {
  res.send('Backend is running!');
});

app.listen(PORT, () => {
    console.log(`Server running at port : ${PORT}`);
    connectDB();    //calling fn to connect to the DB.
})
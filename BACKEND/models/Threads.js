import mongoose from "mongoose";

// A individual message schema 
const MessageSchema = new mongoose.Schema({
    role : {
        type : String,
        enum : ["user", "assistant"],
        required : true, 
    },
    content : {
        type : String,
        required : true,        
    },
    timestamp : {
        type : Date,
        default : Date.now,
    }
});

// An individual chat schema
const ThreadSchema = new mongoose.Schema({
    threadId : {
        type : String,
        required : true,
        unique : true,
    },
    title : {
        type : String,
        default : "New Chat",
    },
    messages : [MessageSchema],
    createdAt : {
        type : Date,
        default : Date.now,
    },
    updatedAt : {   
        type : Date,
        default  : Date.now(),  //most reacent chat on the top of history list
    }
});


//create a "Thread" model in DB based on ThreadSchema
export default mongoose.model("Thread", ThreadSchema);
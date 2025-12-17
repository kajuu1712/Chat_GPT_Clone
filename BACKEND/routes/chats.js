import express from "express";
import Thread from "../models/Threads.js";

import getOpenaiApiResponces from "../utils/openai.js";

const router = express.Router();


router.get("/thread", async(req, res) => {
    try {
        const threadsList = await Thread.find({}).sort({updatedAt : -1});  //most recent thread on the top
        res.status(200).json(threadsList);
    }catch(err) {
        console.log(err);
        res.status(500).json({error : "Failed to fetch threads."});
    }
});

router.get("/thread/:threadId", async(req, res) => {
    const {threadId} = req.params;
    try{
        const findThread = await Thread.findOne({threadId});
        if(!findThread) {
            return res.status(500).json({error: "Can't find the thread!"});
        }
        res.status(200).json(findThread);
    }catch(err) {
        console.log(err);
        res.status(500).json({error : "Failed to fetch the thread."});
    }
});

router.delete("/thread/:threadId", async(req, res) => {
    const {threadId} = req.params;
    try{
        const findThread = await Thread.findOneAndDelete({threadId});
        if(!findThread) {
            return res.status(500).json({error: "Can't find the thread!"});
        }
        res.status(200).json({success: "Thread deleted successfully."});
    }catch(err) {
        console.log(err);
        res.status(500).json({error : "Failed to fetch and delete the thread."});
    }
});

router.post("/chat", async(req, res) => {
    const {threadId, userPrompt} = req.body;
    // console.log(userPrompt);
    try {
        if(!threadId || !userPrompt) {
        res.status(500).json({error: "Missing required fields."});
        }

        let thread = await Thread.findOne({threadId});
        if(!thread) {
            //create new chat
            thread = new Thread({
                threadId,
                title : userPrompt,
                messages : [{
                    role : "user",
                    content : userPrompt
                }],
            });
        }else {
            //push to existing chat, threadId found
            thread.messages.push({role : "user", content : userPrompt});
        }

        // response from openai api

        const assistantReply = await getOpenaiApiResponces(userPrompt);
        // console.log("assistantReply =", assistantReply);
        thread.messages.push({role : "assistant", content : assistantReply});
        thread.updatedAt = new Date();
        
        await thread.save();
        res.json({reply: assistantReply});
    }catch(err) {
        console.log(err);
        res.status(500).json({error : "Something went wrong!"});
    }
    
});

export default router;
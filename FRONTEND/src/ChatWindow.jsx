
import { useContext, useEffect, useState } from "react";
import Chat from "./Chat"
import './ChatWindow.css'

import { MyContext } from "./MyContext";

import {DotLoader} from "react-spinners";

export default function ChatWindow() {
    const { prompt, setPrompt, reply, setReply, currThreadId, setPrevChats, setNewChat} = useContext(MyContext);
    const [loading, setLoading] = useState(false);
    const [isOpen, setIsOpen] = useState(false);


    const getReply = async () => {
        setNewChat(false);
        setLoading(true);   //start loader
        const options = {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                userPrompt: prompt,
                threadId: currThreadId
            })
        }
        try {
            const response = await fetch("http://localhost:3000/api/chat", options);
            const res = await response.json();
            setReply(res.reply);  //gpt reply
        } catch (err) {
            console.log(err);
        }
        setLoading(false);   //stop loader
    }

    useEffect(() => {
        if (prompt && reply) {
            setPrevChats(prevChats => (
                [...prevChats,
                {
                    role: "user",
                    content: prompt
                },
                {
                    role: "assistant",
                    content: reply
                }]
            ))
        }
        setPrompt("");
    }, [reply]);

    // DropDown on Profile Click
    const handleProfileClick = () => {
        setIsOpen(!isOpen);   //toggle on click
    }

    
    return (
        <>
            <div className="chatWindow">
                <div className="navbar">
                    <span>ChatGpt Clone </span>
                    <div className="userIconDiv">
                        <span className="userIcon" onClick={handleProfileClick}><i className="fa-solid fa-user"></i></span>
                    </div>
                    {
                        isOpen && 
                        <div className="dropDown"> 
                            <div className="dropDownItem"><i class="fa-solid fa-cloud-arrow-up"></i>Upgrade</div>
                            <div className="dropDownItem"><i class="fa-solid fa-gears"></i>Settings</div>
                        </div>
                    }
                </div>

                <Chat />
                <DotLoader color="#fff" loading={loading}/>
                <div className="chatInput">
                    <div className="inputBox">
                        <input
                            placeholder="Ask anything"
                            value={prompt}
                            onChange={(e) => setPrompt(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' ? getReply() : ""}
                        />
                        <div id="submit" onClick={getReply}><i className="fa-solid fa-paper-plane"></i></div>
                    </div>
                    <p className="info">
                        ChatGPT can make mistakes. Check important info. See Cookie Preferences.
                    </p>
                </div>
            </div>
        </>
    );
}
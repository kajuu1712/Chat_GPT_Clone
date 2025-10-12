import './Chat.css'
import { useContext, useState, useEffect } from "react";
import { MyContext } from "./MyContext";

//proper formatting for gpt reply
import ReactMarkdown from "react-markdown";
import rehypeHighlight from "rehype-highlight";
//for dark theme code
import "highlight.js/styles/github-dark.css";

export default function Chat() {
    const {newChat, prevChats, reply} = useContext(MyContext);
    const [latestReply, setLatestReply] = useState(null);
    const [selectedWord, setSelectedWord] = useState("");
    const [meaning, setMeaning] = useState("");
    
    //latestReply --> typing effect
    useEffect(() => {
        if (reply === null) {
            setLatestReply(null);
            return;
        }
        
        if (!prevChats.length)
            return;

        const content = reply.split(" ");  //print word by word
        let idx = 0;
        const interval = setInterval(() => {
            setLatestReply(content.slice(0, idx + 1).join(" "));
            idx++;
            if (idx >= content.length)
                clearInterval(interval);
        }, 40);   //delay of 40 seconds
        return () => clearInterval(interval);
    }, [prevChats, reply]);
   

    //Word selected
    const handleSelection = () => {
    const selection = window.getSelection().toString().trim();
    if (selection && selection.split(" ").length === 1) {
        wordMeaning(selection); 
        setSelectedWord(selection);
    }
  };

    // Word meaning functionality
    const wordMeaning = async(word) => {
        const response = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${word}`);
        const data = await response.json();
        if(!data) {
            setMeaning("No meaning found.");
        } 
        const definition = data[0].meanings[0].definitions[0].definition;
        setMeaning(definition);
    };

    const closeMeaningTab = () => {
        setMeaning("");
    }

    return (
        <>
            {newChat && <h3>Start a new chat!</h3>}
            <div className="chats">
                {
                    
                    (meaning && !newChat) &&
                    <span className="meaningBox">
                        <p>{selectedWord}: {meaning}</p>
                        <i className="fa-regular fa-circle-xmark" onClick={closeMeaningTab}></i>
                    </span>
                }
                {
                    prevChats?.slice(0, -1).map((chat, idx) => 
                        <div className={chat.role === "user"? "userDiv" : "gptDiv"} key={idx} onMouseUp={handleSelection}>
                            {
                                chat.role === "user" ?
                                <p className="userMessage">{chat.content}</p> :
                                <ReactMarkdown rehypePlugins={[rehypeHighlight]} >{chat.content}</ReactMarkdown>
                            }
                        </div>
                    )
                }

                {/* Typing effect for latest reply */}
                {
                    prevChats.length > 0 && (
                        <>
                            {
                                latestReply === null ? (
                                    <div className="gptDiv" key={"non-typing"} onMouseUp={handleSelection}>
                                        <ReactMarkdown rehypePlugins={[rehypeHighlight]} >{prevChats[prevChats.length - 1].content}</ReactMarkdown>
                                    </div>

                                ) :
                                    <div className="gptDiv" key={"typing"} onMouseUp={handleSelection}>
                                        <ReactMarkdown rehypePlugins={[rehypeHighlight]} >{latestReply}</ReactMarkdown>
                                    </div>

                            }
                        </>
                    )
                }
            </div>
        </>
    );
}